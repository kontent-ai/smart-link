import { ConfigurationManager } from '../lib/ConfigurationManager';
import { DataAttribute, DisableableFeature, MetadataAttribute } from './dataAttributes/attributes';
import { getHighlightTypeForElement, HighlightType } from './dataAttributes/elementHighlight';

const DisabledHighlightFeatureSelector = `[${MetadataAttribute.DisableFeatures}*="${DisableableFeature.Highlight}"]`;
const ElementSelector = `*[${DataAttribute.ElementCodename}]:not(${DisabledHighlightFeatureSelector})`;
const ContentComponentSelector = `*[${DataAttribute.ComponentId}]:not([${DataAttribute.ElementCodename}]):not(${DisabledHighlightFeatureSelector})`;
const ContentItemSelector = `*[${DataAttribute.ItemId}]:not([${DataAttribute.ComponentId}]):not([${DataAttribute.ElementCodename}]):not(${DisabledHighlightFeatureSelector})`;

const ElementsWithAddButtonSelector = `*[${MetadataAttribute.AddButton}]`;
const AllAugmentableElementsSelector = `${ElementSelector}, ${ContentComponentSelector}, ${ContentItemSelector}, ${ElementsWithAddButtonSelector}`;

/**
 * Find all descendant HTML elements that could be augmented (have highlights or add buttons near them).
 *
 * @param {HTMLElement | Document} node
 * @returns {NodeListOf<HTMLElement>}
 */
export function getAugmentableDescendants(node: HTMLElement | Document): NodeListOf<HTMLElement> {
  const configurationManager = ConfigurationManager.getInstance();
  const isInsideWebSpotlight = configurationManager.isInsideWebSpotlightPreviewIFrame;

  if (isInsideWebSpotlight) {
    return node.querySelectorAll(AllAugmentableElementsSelector);
  }

  return node.querySelectorAll(ElementSelector);
}

/**
 * Checks if HTML element could be augmented (have highlights or add buttons near them).
 *
 * @param {HTMLElement | null} element
 * @returns {boolean}
 */
export function isElementAugmentable(element: HTMLElement | null): boolean {
  return shouldElementHaveHighlight(element) || shouldElementHaveAddButton(element);
}

/**
 * Check if node should have highlights based on its data-attributes.
 *
 * @param {HTMLElement | null} element
 * @returns {boolean}
 */
export function shouldElementHaveHighlight(element: HTMLElement | null): boolean {
  const highlightType = getHighlightTypeForElement(element);

  switch (highlightType) {
    case HighlightType.None:
      return false;
    case HighlightType.Element:
      return true;
    case HighlightType.ContentItem:
    case HighlightType.ContentComponent:
    default: {
      const configurationManager = ConfigurationManager.getInstance();
      return configurationManager.isInsideWebSpotlightPreviewIFrame;
    }
  }
}

/**
 * Check if node should have a add button based on its data-attributes.
 *
 * @param {HTMLElement | null} element
 * @returns {boolean}
 */
export function shouldElementHaveAddButton(element: HTMLElement | null): boolean {
  const configurationManager = ConfigurationManager.getInstance();
  const isInsideWebSpotlight = configurationManager.isInsideWebSpotlightPreviewIFrame;
  // add button should only be visible inside Web Spotlight
  return Boolean(isInsideWebSpotlight && element && element.hasAttribute(MetadataAttribute.AddButton));
}
