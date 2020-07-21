import { getRelativeParent, isNodeOverlapped } from '../utils/node';

export const HighlighterContainerTag = 'KONTENT-SMART-LINK-OVERLAY';
export const HighlighterElementTag = 'KONTENT-SMART-LINK-ELEMENT';

export interface IRenderer {
  readonly clear: () => void;
  readonly deselectNode: (node: HTMLElement) => void;
  readonly destroy: () => void;
  readonly render: (visibleNodes: Set<HTMLElement>) => void;
  readonly selectNode: (node: HTMLElement) => void;
}

export class HighlightRenderer implements IRenderer {
  private readonly defaultContainer: HTMLElement;
  private containerByParent: Map<HTMLElement, HTMLElement>;
  private highlightByNode: Map<HTMLElement, HTMLElement>;

  private static createDefaultContainer(): HTMLElement {
    const container = document.createElement(HighlighterContainerTag);
    window.document.body.appendChild(container);
    return container;
  }

  constructor() {
    this.containerByParent = new Map<HTMLElement, HTMLElement>();
    this.highlightByNode = new Map<HTMLElement, HTMLElement>();
    this.defaultContainer = HighlightRenderer.createDefaultContainer();
  }

  public destroy = (): void => {
    this.clear();
    this.defaultContainer.remove();
  };

  public selectNode = (node: HTMLElement): void => {
    const highlight = this.highlightByNode.get(node);
    if (highlight) {
      node.classList.add('kontent-smart-link__node--selected');
      highlight.classList.add('selected');
    }
  };

  public deselectNode = (node: HTMLElement): void => {
    const highlight = this.highlightByNode.get(node);
    if (highlight) {
      node.classList.remove('kontent-smart-link__node--selected');
      highlight.classList.remove('selected');
    }
  };

  public render = (nodes: Set<HTMLElement>): void => {
    if (nodes.size === 0) {
      this.clear();
    } else {
      const newHighlightByNode = new Map<HTMLElement, HTMLElement>();

      for (const node of nodes) {
        const nodeRect = node.getBoundingClientRect();
        const isOverlapped = isNodeOverlapped(node, nodeRect);

        // This check is needed to prevent highlight rendering for the "flat" elements (height or/and width === 0),
        // because those elements are basically invisible and cannot be clicked.
        const isFlat = nodeRect.height === 0 || nodeRect.width === 0;

        if (!isOverlapped && !isFlat) {
          const parent = getRelativeParent(node);
          const highlight = this.highlightByNode.get(node) ?? this.createHighlight(parent);

          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            highlight.style.top = `${nodeRect.top - parentRect.top}px`;
            highlight.style.left = `${nodeRect.left - parentRect.left}px`;
          } else {
            highlight.style.top = `${nodeRect.top + window.pageYOffset}px`;
            highlight.style.left = `${nodeRect.left + window.pageXOffset}px`;
          }

          highlight.style.width = `${nodeRect.width}px`;
          highlight.style.height = `${nodeRect.height}px`;

          newHighlightByNode.set(node, highlight);
          this.highlightByNode.delete(node);
        }
      }

      for (const [node, highlight] of this.highlightByNode.entries()) {
        highlight.remove();
        this.highlightByNode.delete(node);
      }

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

    this.highlightByNode = new Map<HTMLElement, HTMLElement>();
    this.containerByParent = new Map<HTMLElement, HTMLElement>();
    this.defaultContainer.innerHTML = '';
  };

  private createHighlight = (parent: HTMLElement | null): HTMLElement => {
    const highlight = document.createElement(HighlighterElementTag);
    const container = this.createContainerIfNotExist(parent);
    container.appendChild(highlight);
    return highlight;
  };

  private createContainerIfNotExist = (parent: HTMLElement | null): HTMLElement => {
    if (!parent) {
      return this.defaultContainer;
    }

    if (this.containerByParent.has(parent)) {
      return this.containerByParent.get(parent) as HTMLElement;
    }

    const container = document.createElement(HighlighterContainerTag);
    parent.appendChild(container);
    this.containerByParent.set(parent, container);
    return container;
  };
}
