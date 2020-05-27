import { debounced } from '../utils/debounce';
import { isNodeOverlapped } from '../utils/node';

export interface IRenderer {
  readonly clear: () => void;
  readonly deselectNode: (node: HTMLElement) => void;
  readonly destroy: () => void;
  readonly render: (visibleNodes: Set<HTMLElement>) => void;
  readonly selectNode: (node: HTMLElement) => void;
}

export class HighlightRenderer implements IRenderer {
  private highlightByNode: WeakMap<HTMLElement, HTMLElement>;
  private readonly view: HTMLElement;

  private static createView(): HTMLElement {
    const view = document.createElement('kk-plugin-overlay');
    window.document.body.appendChild(view);
    return view;
  }

  private static createHighlightForDomRect(rect: DOMRect): HTMLElement {
    const highlight = document.createElement('kk-plugin-element');
    highlight.style.top = `${rect.top}px`;
    highlight.style.left = `${rect.left}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    return highlight;
  }

  constructor() {
    this.highlightByNode = new WeakMap<HTMLElement, HTMLElement>();
    this.view = HighlightRenderer.createView();
  }

  public destroy = (): void => {
    this.clear();
    this.view?.parentElement?.removeChild(this.view);
  };

  public render = (nodes: Set<HTMLElement>): void => {
    this.clear();
    this.doRender(nodes);
  };

  public clear = (): void => {
    this.view.innerHTML = '';
    this.highlightByNode = new WeakMap<HTMLElement, HTMLElement>();
  };

  public selectNode = (node: HTMLElement): void => {
    const highlight = this.highlightByNode.get(node);
    if (highlight) {
      highlight.classList.add('selected');
    }
  };

  public deselectNode = (node: HTMLElement): void => {
    const highlight = this.highlightByNode.get(node);
    if (highlight) {
      highlight.classList.remove('selected');
    }
  };

  @debounced(100)
  private doRender(nodes: Set<HTMLElement>): void {
    if (nodes.size === 0) return;

    const fragment = document.createDocumentFragment();

    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      const overlapped = isNodeOverlapped(node, rect);

      if (!overlapped) {
        const highlight = HighlightRenderer.createHighlightForDomRect(rect);
        this.highlightByNode.set(node, highlight);
        fragment.appendChild(highlight);
      }
    }

    this.view.appendChild(fragment);
  }
}
