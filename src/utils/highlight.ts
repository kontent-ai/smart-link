import { DataAttribute } from './dataAttributes';

export enum HighlightType {
  None = '',
  Element = 'element',
  ContentComponent = 'content-component',
  ContentItem = 'content-item',
}

const ElementSelector = `*[${DataAttribute.ElementCodename}]`;
const ContentComponentSelector = `*[${DataAttribute.ComponentId}]:not([${DataAttribute.ElementCodename}])`;
const ContentItemSelector = `*[${DataAttribute.ItemId}]:not([${DataAttribute.ComponentId}]):not([${DataAttribute.ElementCodename}])`;
const NodesWithHighlights = `${ElementSelector}, ${ContentComponentSelector}, ${ContentItemSelector}`;

/**
 * Find all descendant nodes that should have highlights.
 *
 * @param {HTMLElement | Document} node
 * @returns {NodeListOf<HTMLElement>}
 */
export function getDescendantsWithHighlights(node: HTMLElement | Document): NodeListOf<HTMLElement> {
  return node.querySelectorAll(NodesWithHighlights);
}

/**
 * Check if node should have highlights based on its data-attributes.
 *
 * @param {HTMLElement | null} node
 * @returns {boolean}
 */
export function shouldNodeHaveHighlight(node: HTMLElement | null): boolean {
  const highlightType = getHighlightTypeForNode(node);
  return highlightType !== HighlightType.None;
}

/**
 * Get HighlightType based on the node data-attributes.
 *
 * @param {HTMLElement | null} node
 * @returns {HighlightType}
 */
export function getHighlightTypeForNode(node: HTMLElement | null): HighlightType {
  if (!node) {
    return HighlightType.None;
  }

  // treat node as element if it has element codename attribute
  if (node.hasAttribute(DataAttribute.ElementCodename)) {
    return HighlightType.Element;
  }
  // else treat node as content component if it has component id attribute
  else if (node.hasAttribute(DataAttribute.ComponentId)) {
    return HighlightType.ContentComponent;
  }
  // else treat node as content item if it has item id attribute
  else if (node.hasAttribute(DataAttribute.ItemId)) {
    return HighlightType.ContentItem;
  }

  return HighlightType.None;
}
