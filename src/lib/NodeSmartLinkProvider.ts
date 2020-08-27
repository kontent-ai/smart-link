import { DataAttribute, dataToDatasetAttributeName, getDataAttributesFromEventPath } from '../utils/dataAttributes';
import { EventManager } from './EventManager';
import { HighlighterContainerTag, HighlighterElementTag, HighlightRenderer, IRenderer } from './HighlightRenderer';
import { IElementClickedMessageData } from './IFrameCommunicator';

export const MinimumVisiblePartForHighlight = 0.5;

export enum NodeSmartLinkProviderEventType {
  ElementClicked = 'kontent-smart-link:element:clicked',
}

export type NodeSmartLinkProviderMessagesMap = {
  readonly [NodeSmartLinkProviderEventType.ElementClicked]: (data: Partial<IElementClickedMessageData>) => void;
};

export class NodeSmartLinkProvider {
  public enabled = false;

  private readonly events: EventManager<NodeSmartLinkProviderMessagesMap>;
  private readonly mutationObserver: MutationObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly renderer: IRenderer;

  private renderingTimeoutId: ReturnType<typeof setTimeout> = 0;

  private observedElements = new Set<HTMLElement>();
  private visibleElements = new Set<HTMLElement>();

  constructor() {
    this.mutationObserver = new MutationObserver(this.onDomMutation);
    this.intersectionObserver = new IntersectionObserver(this.onElementVisibilityChange, {
      threshold: [MinimumVisiblePartForHighlight],
    });

    this.events = new EventManager<NodeSmartLinkProviderMessagesMap>();
    this.renderer = new HighlightRenderer();
  }

  public destroy = (): void => {
    this.disable();
    this.renderer.destroy();
  };

  public addEventListener = <E extends keyof NodeSmartLinkProviderMessagesMap>(
    type: E,
    listener: NodeSmartLinkProviderMessagesMap[E]
  ): void => {
    this.events.on(type, listener);
  };

  public removeEventListener = <E extends keyof NodeSmartLinkProviderMessagesMap>(
    type: E,
    listener: NodeSmartLinkProviderMessagesMap[E]
  ): void => {
    this.events.off(type, listener);
  };

  public enable = (): void => {
    if (this.enabled) return;

    this.startRenderingInterval();

    this.listenToGlobalEvents();
    this.observeDomMutations();
    this.enabled = true;
  };

  public disable = (): void => {
    if (!this.enabled) return;

    this.stopRenderingInterval();

    this.unlistenToGlobalEvents();
    this.disconnectObservers();
    this.renderer.clear();
    this.enabled = false;
  };

  private highlightVisibleElements = (): void => {
    requestAnimationFrame(() => {
      this.renderer.render(this.visibleElements);
    });
  };

  /**
   * Start an interval rendering (1s) that will re-render highlights for all visible elements using `setTimeout`.
   * It helps to adjust highlights position even in situations that are currently not supported by
   * the SDK (e.g. element position change w/o animations, some infinite animations and other possible unhandled cases)
   * for better user experience.
   */
  private startRenderingInterval = (): void => {
    this.highlightVisibleElements();
    this.renderingTimeoutId = setTimeout(this.startRenderingInterval, 1000);
  };

  private stopRenderingInterval = (): void => {
    if (this.renderingTimeoutId) {
      clearTimeout(this.renderingTimeoutId);
      this.renderingTimeoutId = 0;
    }
  };

  private listenToGlobalEvents = (): void => {
    window.addEventListener('scroll', this.highlightVisibleElements, { capture: true });
    window.addEventListener('resize', this.highlightVisibleElements, { passive: true });

    window.addEventListener('animationend', this.highlightVisibleElements, { passive: true, capture: true });
    window.addEventListener('transitionend', this.highlightVisibleElements, { passive: true, capture: true });

    window.addEventListener('click', this.onElementClick, { capture: true });
  };

  private unlistenToGlobalEvents = (): void => {
    window.removeEventListener('scroll', this.highlightVisibleElements, { capture: true });
    window.removeEventListener('resize', this.highlightVisibleElements);

    window.removeEventListener('animationend', this.highlightVisibleElements, { capture: true });
    window.removeEventListener('transitionend', this.highlightVisibleElements, { capture: true });

    window.removeEventListener('click', this.onElementClick, { capture: true });
  };

  private observeDomMutations = (): void => {
    if (this.enabled) return;

    document.querySelectorAll(`*[${DataAttribute.ElementCodename}]`).forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        this.observeElementVisibility(element);
      }
    });

    this.mutationObserver.observe(window.document.body, {
      childList: true,
      subtree: true,
    });
  };

  private disconnectObservers = (): void => {
    this.mutationObserver.disconnect();
    this.intersectionObserver.disconnect();

    this.observedElements.forEach((element: HTMLElement) => {
      this.unobserveElementVisibility(element);
    });

    this.observedElements = new Set<HTMLElement>();
    this.visibleElements = new Set<HTMLElement>();
  };

  private observeElementVisibility = (element: HTMLElement): void => {
    if (this.observedElements.has(element)) return;

    this.intersectionObserver.observe(element);
    this.observedElements.add(element);

    element.addEventListener('mousemove', this.onElementMouseEnter);
    element.addEventListener('mouseleave', this.onElementMouseLeave);
  };

  private unobserveElementVisibility = (element: HTMLElement): void => {
    if (!this.observedElements.has(element)) return;

    this.intersectionObserver.unobserve(element);
    this.observedElements.delete(element);
    this.visibleElements.delete(element);

    element.removeEventListener('mousemove', this.onElementMouseEnter);
    element.removeEventListener('mouseleave', this.onElementMouseLeave);
  };

  private onDomMutation = (mutations: MutationRecord[]): void => {
    const attrName = dataToDatasetAttributeName(DataAttribute.ElementCodename);

    const relevantMutations = mutations.filter(
      (mutation) =>
        mutation.target instanceof Element &&
        mutation.type === 'childList' &&
        ![HighlighterElementTag, HighlighterContainerTag].includes(mutation.target.tagName) &&
        Array.from(mutation.addedNodes).some((node) => (node as HTMLElement).tagName !== HighlighterElementTag) &&
        Array.from(mutation.removedNodes).some((node) => (node as HTMLElement).tagName !== HighlighterElementTag)
    );

    for (const mutation of relevantMutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.dataset[attrName]) {
          this.observeElementVisibility(node);
        }

        for (const element of node.querySelectorAll(`*[${DataAttribute.ElementCodename}]`)) {
          if (!(element instanceof HTMLElement)) continue;

          this.observeElementVisibility(element);
        }
      }

      for (const node of mutation.removedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.dataset[attrName]) {
          this.unobserveElementVisibility(node);
        }

        for (const element of node.querySelectorAll(`*[${DataAttribute.ElementCodename}]`)) {
          if (!(element instanceof HTMLElement)) continue;

          this.unobserveElementVisibility(element);
        }
      }
    }

    if (relevantMutations.length > 0) {
      this.highlightVisibleElements();
    }
  };

  private onElementVisibilityChange = (entries: IntersectionObserverEntry[]): void => {
    const filteredEntries = entries.filter((entry: IntersectionObserverEntry) => entry.target instanceof HTMLElement);

    for (const entry of filteredEntries) {
      const target = entry.target as HTMLElement;
      if (entry.isIntersecting && entry.intersectionRatio >= MinimumVisiblePartForHighlight) {
        this.visibleElements.add(target);
      } else {
        this.visibleElements.delete(target);
      }
    }

    if (filteredEntries.length > 0) {
      this.highlightVisibleElements();
    }
  };

  private onElementClick = (event: MouseEvent): void => {
    const attributes = getDataAttributesFromEventPath(event);

    if (attributes.has(DataAttribute.ElementCodename)) {
      event.preventDefault();

      this.events.emit(NodeSmartLinkProviderEventType.ElementClicked, {
        projectId: attributes.get(DataAttribute.ProjectId),
        languageCodename: attributes.get(DataAttribute.LanguageCodename),
        itemId: attributes.get(DataAttribute.ItemId),
        contentComponentId: attributes.get(DataAttribute.ComponentId),
        elementCodename: attributes.get(DataAttribute.ElementCodename),
      });
    }
  };

  private onElementMouseEnter = (event: MouseEvent): void => {
    const node = event.currentTarget as HTMLElement;
    this.renderer.selectNode(node);
  };

  private onElementMouseLeave = (event: MouseEvent): void => {
    const node = event.currentTarget as HTMLElement;
    this.renderer.deselectNode(node);
  };
}
