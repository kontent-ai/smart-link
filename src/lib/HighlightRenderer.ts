import { getParentForHighlight, getTotalScrollOffset } from '../utils/node';
import { KSLContainerElement } from '../web-components/KSLContainerElement';
import { KSLHighlightElement } from '../web-components/KSLHighlightElement';

export const RendererContainerTag = KSLContainerElement.is;
export const RendererElementTag = KSLHighlightElement.is;

export interface IRenderer {
  readonly clear: () => void;
  readonly destroy: () => void;
  readonly render: (visibleNodes: Set<HTMLElement>, observedNodes: Set<HTMLElement>) => void;
}

export class HighlightRenderer implements IRenderer {
  private readonly defaultContainer: KSLContainerElement;
  private containerByParent: Map<HTMLElement, KSLContainerElement>;
  private highlightByNode: Map<HTMLElement, KSLHighlightElement>;

  constructor() {
    this.containerByParent = new Map<HTMLElement, KSLContainerElement>();
    this.highlightByNode = new Map<HTMLElement, KSLHighlightElement>();
    this.defaultContainer = HighlightRenderer.createAndMountDefaultContainer();
  }

  private static createAndMountDefaultContainer(): KSLContainerElement {
    const container = document.createElement(RendererContainerTag);
    window.document.body.appendChild(container);
    return container;
  }

  public destroy = (): void => {
    this.clear();
    this.defaultContainer.remove();
  };

  public render = (visibleNodes: Set<HTMLElement>, observedNodes: Set<HTMLElement>): void => {
    if (observedNodes.size === 0) {
      this.clear();
    } else {
      const newHighlightByNode = new Map<HTMLElement, KSLHighlightElement>();

      for (const node of visibleNodes) {
        // Get size of the node and its position relative to viewport.
        const nodeRect = node.getBoundingClientRect();

        // This check is needed to prevent highlight rendering for the "flat" elements (height or/and width === 0),
        // because those elements are basically invisible and cannot be clicked.
        const isFlat = nodeRect.height === 0 || nodeRect.width === 0;

        if (!isFlat) {
          const [parentElement, parentMetadata] = getParentForHighlight(node);
          const highlight = this.highlightByNode.get(node) ?? this.createHighlight(node, parentElement);

          if (parentElement && parentMetadata) {
            const parentRect = parentElement.getBoundingClientRect();
            const container = this.containerByParent.get(parentElement);

            if (container && !parentMetadata.isPositioned) {
              // When parent element is not positioned it means that highlight
              // will be positioned relative to some other element. That is why we need
              // to keep in mind all of the scroll offsets on the way to this relative element.
              const [scrollOffsetTop, scrollOffsetLeft] = getTotalScrollOffset(parentElement);

              container.style.height = `${parentElement.clientHeight}px`;
              container.style.width = `${parentElement.clientWidth}px`;
              container.style.top = `${parentElement.offsetTop - scrollOffsetTop}px`;
              container.style.left = `${parentElement.offsetLeft - scrollOffsetLeft}px`;

              if (parentMetadata.isContentClipped) {
                // When parent element is not positioned and its content is clipped
                // we need to hide overflow of the container as well to prevent
                // highlights from appearing for overflown content.
                container.setAttribute('clipped', 'true');
              }
            }

            // If the parent element is positioned and its content is clipped (hidden, scroll, auto, clipped),
            // the parent element is an offset parent for the highlight and its scroll position can affect the position
            // of the highlight, so we need to reckon with that.
            const isPositionedAndClipped = parentMetadata.isPositioned && parentMetadata.isContentClipped;
            const scrollOffsetTop = isPositionedAndClipped ? parentElement.scrollTop : 0;
            const scrollOffsetLeft = isPositionedAndClipped ? parentElement.scrollLeft : 0;

            highlight.style.top = `${nodeRect.top - parentRect.top + scrollOffsetTop}px`;
            highlight.style.left = `${nodeRect.left - parentRect.left + scrollOffsetLeft}px`;
          } else {
            // No parent element means that there is no positioned or clipped ancestor and that highlight will be
            // placed into the body and page offset (page scroll) should be used.
            highlight.style.top = `${nodeRect.top + window.pageYOffset}px`;
            highlight.style.left = `${nodeRect.left + window.pageXOffset}px`;
          }

          highlight.style.width = `${nodeRect.width}px`;
          highlight.style.height = `${nodeRect.height}px`;

          // We are creating a new highlight by node map to be able to compare it with an old one to find out
          // which nodes have been removed before renders and remove their highlights from the DOM.
          newHighlightByNode.set(node, highlight);
          this.highlightByNode.delete(node);
        }
      }

      // All highlights that are left in the old highlightByNode map are the remnants of the old render.
      // We check if they are still observed and relevant for renderer and if not they can be removed.
      for (const [node, highlight] of this.highlightByNode.entries()) {
        if (!observedNodes.has(node)) {
          highlight.remove();
          this.highlightByNode.delete(node);
        } else {
          newHighlightByNode.set(node, highlight);
        }
      }

      // All highlight containers that have no children can be removed because they are not used by any highlight.
      for (const [parent, container] of this.containerByParent.entries()) {
        if (container.children.length === 0) {
          container.remove();
          this.containerByParent.delete(parent);
        }
      }

      this.highlightByNode = newHighlightByNode;
    }
  };

  public clear = (): void => {
    for (const [node, highlight] of this.highlightByNode.entries()) {
      highlight.remove();
      this.highlightByNode.delete(node);
    }

    for (const [parent, container] of this.containerByParent.entries()) {
      container.remove();
      this.containerByParent.delete(parent);
    }

    this.highlightByNode = new Map<HTMLElement, KSLHighlightElement>();
    this.containerByParent = new Map<HTMLElement, KSLContainerElement>();
    this.defaultContainer.innerHTML = '';
  };

  private createHighlight = (node: HTMLElement, parent: HTMLElement | null): KSLHighlightElement => {
    const container = this.createContainerIfNotExist(parent);
    const highlight = document.createElement(RendererElementTag);
    highlight.attachTo(node);
    container.appendChild(highlight);
    return highlight;
  };

  private createContainerIfNotExist = (parent: HTMLElement | null): KSLContainerElement => {
    // if parent is not specified or highlight will be placed inside body
    if (!parent || parent === document.body) {
      return this.defaultContainer;
    }

    let container = this.containerByParent.get(parent);
    if (container) {
      return container;
    }

    container = document.createElement(RendererContainerTag);
    parent.appendChild(container);
    this.containerByParent.set(parent, container);
    return container;
  };
}
