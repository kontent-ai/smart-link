import { DataAttribute, MetadataAttribute } from './dataAttributes';

export enum HighlightType {
  None = '',
  Element = 'element',
  ContentComponent = 'content-component',
  ContentItem = 'content-item',
}

const ElementSelector = `*[${DataAttribute.ElementCodename}]`;
const ContentComponentSelector = `*[${DataAttribute.ComponentId}]:not([${DataAttribute.ElementCodename}])`;
const ContentItemSelector = `*[${DataAttribute.ItemId}]:not([${DataAttribute.ComponentId}]):not([${DataAttribute.ElementCodename}])`;

const ElementsWithPlusButtonSelector = `*[${MetadataAttribute.PlusButton}]`;
const ElementsWithHighlightsSelector = `${ElementSelector}, ${ContentComponentSelector}, ${ContentItemSelector}`;

const AugmentableElementsSelector = `${ElementsWithPlusButtonSelector}, ${ElementsWithHighlightsSelector}`;

/**
 * Find all descendant HTML elements that could be augmented (have highlights or plus buttons near them).
 *
 * @param {HTMLElement | Document} node
 * @returns {NodeListOf<HTMLElement>}
 */
export function getAugmentableDescendants(node: HTMLElement | Document): NodeListOf<HTMLElement> {
  return node.querySelectorAll(AugmentableElementsSelector);
}

/**
 * Checks if HTML element could be augmented (have highlights or plus buttons near them).
 *
 * @param {HTMLElement | null} element
 * @returns {boolean}
 */
export function isElementAugmentable(element: HTMLElement | null): boolean {
  return shouldElementHaveHighlight(element) || shouldElementHavePlusButton(element);
}

/**
 * Check if node should have highlights based on its data-attributes.
 *
 * @param {HTMLElement | null} element
 * @returns {boolean}
 */
export function shouldElementHaveHighlight(element: HTMLElement | null): boolean {
  const highlightType = getHighlightTypeForElement(element);
  return highlightType !== HighlightType.None;
}

/**
 * Check if node should have a plus button based on its data-attributes.
 *
 * @param {HTMLElement | null} element
 * @returns {boolean}
 */
export function shouldElementHavePlusButton(element: HTMLElement | null): boolean {
  return Boolean(element && element.hasAttribute(MetadataAttribute.PlusButton));
}

/**
 * Get HighlightType based on the HTML element data-attributes.
 *
 * @param {HTMLElement | null} element
 * @returns {HighlightType}
 */
export function getHighlightTypeForElement(element: HTMLElement | null): HighlightType {
  if (!element) {
    return HighlightType.None;
  }

  // treat node as element if it has element codename attribute
  if (element.hasAttribute(DataAttribute.ElementCodename)) {
    return HighlightType.Element;
  }
  // else treat node as content component if it has component id attribute
  else if (element.hasAttribute(DataAttribute.ComponentId)) {
    return HighlightType.ContentComponent;
  }
  // else treat node as content item if it has item id attribute
  else if (element.hasAttribute(DataAttribute.ItemId)) {
    return HighlightType.ContentItem;
  }

  return HighlightType.None;
}

export function createTemplateForCustomElement(html: string): HTMLTemplateElement {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}
