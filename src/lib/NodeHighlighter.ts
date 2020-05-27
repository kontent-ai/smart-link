import { DataAttribute, dataToDatasetAttributeName, getDataAttributesFromEventPath } from '../utils/dataAttributes';
import { EventManager } from './EventManager';
import { HighlightRenderer, IRenderer } from './HighlightRenderer';
import { IElementClickMessageData } from './IFrameCommunicator';

export const IntersectionThreshold = 0.95;

export enum NodeHighlighterEventType {
  ElementClicked = 'kk:element:click',
}

export type NodeHighlighterMessagesMap = {
  readonly [NodeHighlighterEventType.ElementClicked]: (data: Partial<IElementClickMessageData>) => void;
};

export class NodeHighlighter {
  private readonly events: EventManager<NodeHighlighterMessagesMap>;
  private readonly mutationObserver: MutationObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly renderer: IRenderer;

  public enabled = false;

  private observedElements = new WeakSet<HTMLElement>();
  private visibleElements = new Set<HTMLElement>();

  constructor() {
    this.mutationObserver = new MutationObserver(this.onDomMutation);
    this.intersectionObserver = new IntersectionObserver(this.onElementVisibilityChange, {
      threshold: [IntersectionThreshold],
    });

    this.events = new EventManager<NodeHighlighterMessagesMap>();
    this.renderer = new HighlightRenderer();
  }

  public destroy = (): void => {
    this.disable();
    this.renderer.destroy();
  };

  public addEventListener = <E extends keyof NodeHighlighterMessagesMap>(
    type: E,
    listener: NodeHighlighterMessagesMap[E]
  ): void => {
    this.events.on(type, listener);
  };

  public removeEventListener = <E extends keyof NodeHighlighterMessagesMap>(
    type: E,
    listener: NodeHighlighterMessagesMap[E]
  ): void => {
    this.events.off(type, listener);
  };

  public enable = (): void => {
    if (this.enabled) return;

    this.listenToGlobalEvents();
    this.observeDomMutations();
    this.enabled = true;
  };

  public disable = (): void => {
    if (!this.enabled) return;

    this.unlistenToGlobalEvents();
    this.disconnectObservers();
    this.renderer.clear();
    this.enabled = false;
  };

  private highlightVisibleElements = (): void => {
    this.renderer.render(this.visibleElements);
  };

  private listenToGlobalEvents = (): void => {
    window.addEventListener('scroll', this.highlightVisibleElements, { passive: true, capture: true });
    window.addEventListener('resize', this.highlightVisibleElements, { passive: true });
    window.addEventListener('click', this.onElementClick, { capture: true });
  };

  private unlistenToGlobalEvents = (): void => {
    window.removeEventListener('scroll', this.highlightVisibleElements, { capture: true });
    window.removeEventListener('resize', this.highlightVisibleElements);
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
    this.observedElements = new WeakSet<HTMLElement>();
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
    let shouldRerender = false;

    for (const mutation of mutations) {
      if (!(mutation.target instanceof Element)) continue;
      if (['KK-PLUGIN-ELEMENT', 'KK-PLUGIN-OVERLAY'].includes(mutation.target.tagName)) continue;
      if (mutation.type !== 'childList') continue;

      shouldRerender = true;

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

    if (shouldRerender) {
      this.highlightVisibleElements();
    }
  };

  private onElementVisibilityChange = (entries: IntersectionObserverEntry[]): void => {
    let shouldRerender = false;

    for (const entry of entries) {
      if (!(entry.target instanceof HTMLElement)) continue;

      if (entry.isIntersecting && entry.intersectionRatio >= IntersectionThreshold) {
        this.visibleElements.add(entry.target);
        shouldRerender = true;
      } else {
        this.visibleElements.delete(entry.target);
      }
    }

    if (shouldRerender) {
      this.highlightVisibleElements();
    }
  };

  private onElementClick = (event: MouseEvent): void => {
    const attributes = getDataAttributesFromEventPath(event);

    if (attributes.has(DataAttribute.ElementCodename)) {
      event.preventDefault();

      this.events.emit(NodeHighlighterEventType.ElementClicked, {
        projectId: attributes.get(DataAttribute.ProjectId),
        languageCodename: attributes.get(DataAttribute.LanguageCodename),
        itemId: attributes.get(DataAttribute.ItemId),
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
