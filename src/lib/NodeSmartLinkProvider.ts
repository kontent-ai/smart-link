import { DataAttribute } from '../utils/dataAttributes';
import { EventManager } from './EventManager';
import { HighlightRenderer, IRenderer } from './HighlightRenderer';
import { getDescendantsWithHighlights, shouldNodeHaveHighlight } from '../utils/highlight';
import { webComponentTags } from '../web-components/components';
import { KSLHighlightElementEvent } from '../web-components/KSLHighlightElement';
import { IElementClickedMessageData, IElementClickedMessageMetadata } from './IFrameCommunicatorTypes';

export enum NodeSmartLinkProviderEventType {
  ElementDummy = 'kontent-smart-link:element:dummy',
  ElementClicked = 'kontent-smart-link:element:clicked',
}

export type NodeSmartLinkProviderMessagesMap = {
  readonly [NodeSmartLinkProviderEventType.ElementDummy]: (
    data: Partial<any>,
    metadata: IElementClickedMessageMetadata
  ) => void;
  readonly [NodeSmartLinkProviderEventType.ElementClicked]: (
    data: Partial<IElementClickedMessageData>,
    metadata: IElementClickedMessageMetadata
  ) => void;
};

export class NodeSmartLinkProvider {
  public enabled = false;

  private readonly events: EventManager<NodeSmartLinkProviderMessagesMap>;
  private readonly mutationObserver: MutationObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly renderer: IRenderer;

  private renderingTimeoutId = 0;

  private observedElements = new Set<HTMLElement>();
  private visibleElements = new Set<HTMLElement>();

  constructor() {
    this.mutationObserver = new MutationObserver(this.onDomMutation);
    this.intersectionObserver = new IntersectionObserver(this.onElementVisibilityChange);

    this.events = new EventManager<NodeSmartLinkProviderMessagesMap>();
    this.renderer = new HighlightRenderer();
  }

  private static shouldIgnoreNode(node: HTMLElement): boolean {
    return webComponentTags.includes(node.tagName.toLowerCase());
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
      this.renderer.render(this.visibleElements, this.observedElements);
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
    this.renderingTimeoutId = window.setTimeout(this.startRenderingInterval, 1000);
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

    window.addEventListener('ksl:highlight:edit', this.onEditElement, { capture: true });
  };

  private unlistenToGlobalEvents = (): void => {
    window.removeEventListener('scroll', this.highlightVisibleElements, { capture: true });
    window.removeEventListener('resize', this.highlightVisibleElements);

    window.removeEventListener('animationend', this.highlightVisibleElements, { capture: true });
    window.removeEventListener('transitionend', this.highlightVisibleElements, { capture: true });

    window.removeEventListener('ksl:highlight:edit', this.onEditElement, { capture: true });
  };

  private observeDomMutations = (): void => {
    if (this.enabled) return;

    this.mutationObserver.observe(window.document.body, {
      childList: true,
      subtree: true,
    });

    getDescendantsWithHighlights(document).forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        this.observeElementVisibility(element);
      }
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
  };

  private unobserveElementVisibility = (element: HTMLElement): void => {
    if (!this.observedElements.has(element)) return;

    this.intersectionObserver.unobserve(element);
    this.observedElements.delete(element);
    this.visibleElements.delete(element);
  };

  private onDomMutation = (mutations: MutationRecord[]): void => {
    const relevantMutations = mutations.filter((mutation: MutationRecord) => {
      const isTypeRelevant = mutation.type === 'childList';
      const isTargetRelevant =
        mutation.target instanceof HTMLElement && !NodeSmartLinkProvider.shouldIgnoreNode(mutation.target);

      if (!isTypeRelevant || !isTargetRelevant) {
        return false;
      }

      const hasRelevantAddedNodes = Array.from(mutation.addedNodes).some(
        (node) => node instanceof HTMLElement && !NodeSmartLinkProvider.shouldIgnoreNode(node)
      );
      const hasRelevantRemovedNodes = Array.from(mutation.removedNodes).some(
        (node) => node instanceof HTMLElement && !NodeSmartLinkProvider.shouldIgnoreNode(node)
      );

      return hasRelevantAddedNodes || hasRelevantRemovedNodes;
    });

    for (const mutation of relevantMutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (shouldNodeHaveHighlight(node)) {
          this.observeElementVisibility(node);
        }

        for (const element of getDescendantsWithHighlights(node)) {
          if (!(element instanceof HTMLElement)) continue;

          this.observeElementVisibility(element);
        }
      }

      for (const node of mutation.removedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (shouldNodeHaveHighlight(node)) {
          this.unobserveElementVisibility(node);
        }

        for (const element of getDescendantsWithHighlights(node)) {
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
      if (entry.isIntersecting) {
        this.visibleElements.add(target);
      } else {
        this.visibleElements.delete(target);
      }
    }

    if (filteredEntries.length > 0) {
      this.highlightVisibleElements();
    }
  };

  private onEditElement = (event: KSLHighlightElementEvent): void => {
    const attributes = event.detail.dataAttributes;

    if (attributes.has(DataAttribute.ElementCodename)) {
      const data: Partial<IElementClickedMessageData> = {
        projectId: attributes.get(DataAttribute.ProjectId),
        languageCodename: attributes.get(DataAttribute.LanguageCodename),
        itemId: attributes.get(DataAttribute.ItemId),
        contentComponentId: attributes.get(DataAttribute.ComponentId),
        elementCodename: attributes.get(DataAttribute.ElementCodename),
      };

      const element = event.detail.targetNode;
      const metadata: IElementClickedMessageMetadata = {
        elementRect: element.getBoundingClientRect(),
      };

      this.events.emit(NodeSmartLinkProviderEventType.ElementClicked, data, metadata);
    } else {
      console.warn(
        'Warning: Some required attributes are not found or the edit button for this type of element is not yet supported.'
      );
    }
  };
}
