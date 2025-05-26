import { groupElementsByRenderingRoot } from '../utils/domElement';
import { KSLContainerElement } from '../web-components/KSLContainerElement';
import { KSLHighlightElement } from '../web-components/KSLHighlightElement';
import { KSLAddButtonElement } from '../web-components/KSLAddButtonElement';
import { shouldElementHaveHighlight, shouldElementHaveAddButton } from '../utils/customElements';
import { KSLConfiguration } from './ConfigurationManager';

export interface IRenderer {
  readonly destroy: () => void;
  readonly clear: () => void;
  readonly render: (visibleElements: Set<HTMLElement>, observedElements: Set<HTMLElement>) => void;
}

export class SmartLinkRenderer implements IRenderer {
  private readonly defaultContainer: KSLContainerElement;
  private containerByRenderingRoot: Map<HTMLElement, KSLContainerElement>;
  private highlightByElement: Map<HTMLElement, KSLHighlightElement>;
  private addButtonByElement: Map<HTMLElement, KSLAddButtonElement>;

  constructor(private readonly configuration: KSLConfiguration) {
    this.containerByRenderingRoot = new Map<HTMLElement, KSLContainerElement>();
    this.highlightByElement = new Map<HTMLElement, KSLHighlightElement>();
    this.addButtonByElement = new Map<HTMLElement, KSLAddButtonElement>();
    this.defaultContainer = SmartLinkRenderer.createAndMountDefaultContainer();
  }

  private static createAndMountDefaultContainer(): KSLContainerElement {
    const container = document.createElement(KSLContainerElement.is);
    window.document.body.appendChild(container);
    return container;
  }

  public render = (visibleElements: Set<HTMLElement>, observedElements: Set<HTMLElement>): void => {
    if (observedElements.size === 0) {
      this.clear();
    } else {
      const newAddButtonByElement = new Map<HTMLElement, KSLAddButtonElement>();
      const newHighlightByElement = new Map<HTMLElement, KSLHighlightElement>();

      // Group elements by their rendering roots to avoid unnecessary re-calculations (e.g. reposition container only once
      // instead of repositioning it for every child, calculating bounding client rects, etc.).
      const elementsByRenderingRoot = groupElementsByRenderingRoot(visibleElements);

      for (const [root, elements] of elementsByRenderingRoot.entries()) {
        const container = this.createContainerIfNotExist(root);
        container.adjustPosition();

        for (const element of elements) {
          // This check is needed to prevent highlight rendering for the "flat" elements (height or/and width === 0),
          // because those elements are basically invisible and cannot be clicked.
          const isFlat = element.offsetHeight === 0 || element.offsetHeight === 0;

          if (!isFlat && shouldElementHaveHighlight(element, this.configuration)) {
            const highlight = this.highlightByElement.get(element) ?? container.createHighlightForElement(element);
            highlight.adjustPosition();

            // We are creating a new highlight by element map to be able to compare it with an old one to find out
            // which elements have been removed before renders and remove their highlights from the DOM.
            newHighlightByElement.set(element, highlight);
            this.highlightByElement.delete(element);
          }

          if (shouldElementHaveAddButton(element, this.configuration)) {
            const button = this.addButtonByElement.get(element) ?? container.createAddButtonForElement(element);
            button.adjustPosition();

            // We are creating a new add button by element map to be able to compare it with an old one to find out
            // which elements have been removed before renders and remove their add buttons from the DOM.
            newAddButtonByElement.set(element, button);
            this.addButtonByElement.delete(element);
          }
        }
      }

      // All highlights that are left in the old highlightByElement map are the remnants of the old render.
      // We check if they are still observed and relevant for the renderer and if not they can be removed.
      for (const [element, highlight] of this.highlightByElement.entries()) {
        if (!observedElements.has(element)) {
          highlight.remove();
          this.highlightByElement.delete(element);
        } else {
          newHighlightByElement.set(element, highlight);
        }
      }

      // All add buttons that are left in the old addButtonByElement map are the remnants of the old render.
      // We check if they are still observed and relevant for the renderer and if not they can be removed.
      for (const [element, addButton] of this.addButtonByElement.entries()) {
        if (!observedElements.has(element)) {
          addButton.remove();
          this.addButtonByElement.delete(element);
        } else {
          newAddButtonByElement.set(element, addButton);
        }
      }

      // All containers that have no children can be removed because they are not used by any highlight, or a add button.
      for (const [parent, container] of this.containerByRenderingRoot.entries()) {
        if (container.children.length === 0) {
          container.remove();
          this.containerByRenderingRoot.delete(parent);
        }
      }

      this.highlightByElement = newHighlightByElement;
      this.addButtonByElement = newAddButtonByElement;
    }
  };

  public destroy = (): void => {
    this.clear();
    this.defaultContainer.remove();
  };

  public clear = (): void => {
    for (const [element, addButton] of this.addButtonByElement.entries()) {
      addButton.remove();
      this.addButtonByElement.delete(element);
    }

    for (const [element, highlight] of this.highlightByElement.entries()) {
      highlight.remove();
      this.highlightByElement.delete(element);
    }

    for (const [root, container] of this.containerByRenderingRoot.entries()) {
      container.remove();
      this.containerByRenderingRoot.delete(root);
    }

    this.highlightByElement = new Map<HTMLElement, KSLHighlightElement>();
    this.containerByRenderingRoot = new Map<HTMLElement, KSLContainerElement>();
    this.addButtonByElement = new Map<HTMLElement, KSLAddButtonElement>();
    this.defaultContainer.innerHTML = '';
  };

  private createContainerIfNotExist = (root: HTMLElement | null): KSLContainerElement => {
    // if root is not specified or root is body
    if (!root || root === document.body) {
      return this.defaultContainer;
    }

    let container = this.containerByRenderingRoot.get(root);
    if (container) {
      return container;
    }

    container = document.createElement(KSLContainerElement.is);
    root.appendChild(container);
    this.containerByRenderingRoot.set(root, container);
    return container;
  };
}
