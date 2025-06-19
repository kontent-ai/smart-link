import { groupElementsByRenderingRoot } from '../utils/domElement';
import { KSLContainerElement } from '../web-components/KSLContainerElement';
import { KSLHighlightElement } from '../web-components/KSLHighlightElement';
import { KSLAddButtonElement } from '../web-components/KSLAddButtonElement';
import { shouldElementHaveHighlight, shouldElementHaveAddButton } from '../utils/customElements';
import { KSLConfiguration } from '../utils/configuration';

export class SmartLinkRenderer {
  private readonly defaultContainer: KSLContainerElement;
  private containerByRenderingRoot: Map<HTMLElement, KSLContainerElement>;
  private highlightByElement: Map<HTMLElement, KSLHighlightElement>;
  private addButtonByElement: Map<HTMLElement, KSLAddButtonElement>;

  constructor(private readonly configuration: KSLConfiguration) {
    this.containerByRenderingRoot = new Map<HTMLElement, KSLContainerElement>();
    this.highlightByElement = new Map<HTMLElement, KSLHighlightElement>();
    this.addButtonByElement = new Map<HTMLElement, KSLAddButtonElement>();
    this.defaultContainer = createAndMountDefaultContainer();
  }

  public render = (visibleElements: Set<HTMLElement>, observedElements: Set<HTMLElement>): void => {
    if (observedElements.size === 0) {
      this.clear();
      return;
    }

    const { newAddButtonByElement, newHighlightByElement } = this.processVisibleElements(
      visibleElements,
      this.addButtonByElement,
      this.highlightByElement
    );

    // Remove highlights that are not observed anymore as they might be removed from the DOM.
    for (const [element, highlight] of newHighlightByElement) {
      if (!observedElements.has(element)) {
        highlight.remove();
        newHighlightByElement.delete(element);
      }
    }

    // Remove add buttons that are not observed anymore as they might be removed from the DOM.
    for (const [element, addButton] of newAddButtonByElement) {
      if (!observedElements.has(element)) {
        addButton.remove();
        newAddButtonByElement.delete(element);
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
  };

  public destroy = (): void => {
    this.clear();
    this.defaultContainer.remove();
  };

  public clear = (): void => {
    for (const [, addButton] of this.addButtonByElement.entries()) {
      addButton.remove();
    }

    for (const [, highlight] of this.highlightByElement.entries()) {
      highlight.remove();
    }

    for (const [, container] of this.containerByRenderingRoot.entries()) {
      container.remove();
    }

    this.highlightByElement = new Map<HTMLElement, KSLHighlightElement>();
    this.containerByRenderingRoot = new Map<HTMLElement, KSLContainerElement>();
    this.addButtonByElement = new Map<HTMLElement, KSLAddButtonElement>();
    this.defaultContainer.innerHTML = '';
  };

  private processVisibleElements = (
    visibleElements: Set<HTMLElement>,
    addButtonByElement: Map<HTMLElement, KSLAddButtonElement>,
    highlightByElement: Map<HTMLElement, KSLHighlightElement>
  ): {
    newAddButtonByElement: Map<HTMLElement, KSLAddButtonElement>;
    newHighlightByElement: Map<HTMLElement, KSLHighlightElement>;
  } => {
    // Group elements by their rendering roots to avoid unnecessary re-calculations (e.g. reposition container only once
    // instead of repositioning it for every child, calculating bounding client rects, etc.).
    const elementsByRenderingRoot = groupElementsByRenderingRoot(visibleElements);

    return Array.from(elementsByRenderingRoot.entries()).reduce(
      (acc, [root, elements]) => {
        const container = this.createContainerIfNotExist(root);
        container.adjustPosition();

        for (const element of elements) {
          // This check is needed to prevent highlight rendering for the "flat" elements (height or/and width === 0),
          // because those elements are basically invisible and cannot be clicked.
          const isFlat = element.offsetHeight === 0 || element.offsetWidth === 0;

          if (!isFlat && shouldElementHaveHighlight(element, this.configuration)) {
            const highlight = acc.newHighlightByElement.get(element) ?? container.createHighlightForElement(element);
            highlight.adjustPosition();

            acc.newHighlightByElement.set(element, highlight);
          }

          if (shouldElementHaveAddButton(element, this.configuration)) {
            const addButton = acc.newAddButtonByElement.get(element) ?? container.createAddButtonForElement(element);
            addButton.adjustPosition();

            acc.newAddButtonByElement.set(element, addButton);
          }
        }

        return acc;
      },
      {
        newAddButtonByElement: new Map<HTMLElement, KSLAddButtonElement>(addButtonByElement),
        newHighlightByElement: new Map<HTMLElement, KSLHighlightElement>(highlightByElement),
      }
    );
  };

  private createContainerIfNotExist = (root: HTMLElement | null): KSLContainerElement => {
    // if root is not specified or root is body
    if (!root || root === document.body) {
      return this.defaultContainer;
    }

    const container = this.containerByRenderingRoot.get(root);
    if (container) {
      return container;
    }

    const newContainer = document.createElement(KSLContainerElement.is);
    root.appendChild(newContainer);
    this.containerByRenderingRoot.set(root, newContainer);
    return newContainer;
  };
}

const createAndMountDefaultContainer = (): KSLContainerElement => {
  const container = document.createElement(KSLContainerElement.is);
  window.document.body.appendChild(container);
  return container;
};
