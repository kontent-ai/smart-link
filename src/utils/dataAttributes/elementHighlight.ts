import { DataAttribute, DisableableFeature, MetadataAttribute } from './attributes';

export enum HighlightType {
  None = '',
  Element = 'element',
  ContentComponent = 'content-component',
  ContentItem = 'content-item',
}

/**
 * Get HighlightType based on the HTML element data-attributes.
 *
 * @param {HTMLElement | null} element
 * @returns {HighlightType}
 */
export function getHighlightTypeForElement(element: HTMLElement | null): HighlightType {
  if (!element || isFeatureDisabledForElement(element, DisableableFeature.Highlight)) {
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

function isFeatureDisabledForElement(element: HTMLElement, feature: DisableableFeature): boolean {
  const attribute = element.getAttribute(MetadataAttribute.DisableFeatures);
  return attribute?.toLowerCase().includes(feature) ?? false;
}
