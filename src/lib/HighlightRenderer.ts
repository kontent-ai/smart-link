import { isNodeOverlapped } from '../utils/node';

export const HighlighterViewTag = 'KONTENT-SMART-LINK-OVERLAY';
export const HighlighterElementTag = 'KONTENT-SMART-LINK-ELEMENT';

export interface IRenderer {
  readonly clear: () => void;
  readonly deselectNode: (node: HTMLElement) => void;
  readonly destroy: () => void;
  readonly render: (visibleNodes: Set<HTMLElement>) => void;
  readonly selectNode: (node: HTMLElement) => void;
}

export class HighlightRenderer implements IRenderer {
  private highlightByNode: Map<HTMLElement, HTMLElement>;
  private readonly view: HTMLElement;

  private static createView(): HTMLElement {
    const view = document.createElement(HighlighterViewTag);
    window.document.body.appendChild(view);
    return view;
  }

  constructor() {
    this.highlightByNode = new Map<HTMLElement, HTMLElement>();
    this.view = HighlightRenderer.createView();
  }

  public destroy = (): void => {
    this.clear();
    this.view?.parentElement?.removeChild(this.view);
  };

  public selectNode = (node: HTMLElement): void => {
    const highlight = this.highlightByNode.get(node);
    if (highlight) {
      node.style.cursor = 'pointer';
      highlight.classList.add('selected');
    }
  };

  public deselectNode = (node: HTMLElement): void => {
    const highlight = this.highlightByNode.get(node);
    if (highlight) {
      node.style.removeProperty('cursor');
      highlight.classList.remove('selected');
    }
  };

  public render = (nodes: Set<HTMLElement>): void => {
    if (nodes.size === 0) {
      this.clear();
    } else {
      const newHighlightByNode = new Map<HTMLElement, HTMLElement>();

      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        const overlapped = isNodeOverlapped(node, rect);
        const flat = rect.height === 0 || rect.width === 0;

        if (!overlapped && !flat) {
          const highlight = this.highlightByNode.get(node) ?? this.createHighlightForNode();

          highlight.style.top = `${rect.top + window.pageYOffset}px`;
          highlight.style.left = `${rect.left + window.pageXOffset}px`;
          highlight.style.width = `${rect.width}px`;
          highlight.style.height = `${rect.height}px`;

          newHighlightByNode.set(node, highlight);
          this.highlightByNode.delete(node);
        }
      }

      for (const [node, highlight] of this.highlightByNode.entries()) {
        highlight.remove();
        this.highlightByNode.delete(node);
      }

      this.highlightByNode = newHighlightByNode;
    }
  };

  public clear = (): void => {
    this.view.innerHTML = '';
    this.highlightByNode = new Map<HTMLElement, HTMLElement>();
  };

  private createHighlightForNode = (): HTMLElement => {
    const highlight = document.createElement(HighlighterElementTag);
    this.view.appendChild(highlight);
    return highlight;
  };
}
