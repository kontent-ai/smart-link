import { isInsideWebSpotlightPreviewIFrame, KSLConfiguration } from './configuration';
import { DataAttribute, DisableableFeature, MetadataAttribute } from './dataAttributes/attributes';
import { getHighlightTypeForElement, HighlightType } from './dataAttributes/elementHighlight';

const DisabledHighlightFeatureSelector = `[${MetadataAttribute.DisableFeatures}*="${DisableableFeature.Highlight}"]`;
const ElementSelector = `*[${DataAttribute.ElementCodename}]:not(${DisabledHighlightFeatureSelector})`;
const ContentComponentSelector = `*[${DataAttribute.ComponentId}]:not([${DataAttribute.ElementCodename}]):not(${DisabledHighlightFeatureSelector})`;
const ContentItemSelector = `*[${DataAttribute.ItemId}]:not([${DataAttribute.ComponentId}]):not([${DataAttribute.ElementCodename}]):not(${DisabledHighlightFeatureSelector})`;

const ElementsWithAddButtonSelector = `*[${MetadataAttribute.AddButton}]`;
const AllAugmentableElementsSelector = `${ElementSelector}, ${ContentComponentSelector}, ${ContentItemSelector}, ${ElementsWithAddButtonSelector}`;
const AugmentableElementsSelector = `${ElementSelector}, ${ContentItemSelector}`;

/**
 * Find all descendant HTML elements that could be augmented (have highlights or add buttons near them).
 *
 * @param {HTMLElement | Document} node
 * @returns {NodeListOf<HTMLElement>}
 */
export function getAugmentableDescendants(
  node: HTMLElement | Document,
  configuration: KSLConfiguration
): NodeListOf<HTMLElement> {
  const isInsideWebSpotlight = isInsideWebSpotlightPreviewIFrame(configuration);

  return configuration.debug || isInsideWebSpotlight
    ? node.querySelectorAll(AllAugmentableElementsSelector)
    : node.querySelectorAll(AugmentableElementsSelector);
}

/**
 * Checks if HTML element could be augmented (have highlights or add buttons near them).
 */
export function isElementAugmentable(element: HTMLElement | null, configuration: KSLConfiguration): boolean {
  return shouldElementHaveHighlight(element, configuration) || shouldElementHaveAddButton(element, configuration);
}

/**
 * Check if node should have highlights based on its data-attributes.
 */
export function shouldElementHaveHighlight(element: HTMLElement | null, configuration: KSLConfiguration): boolean {
  const highlightType = getHighlightTypeForElement(element);

  switch (highlightType) {
    case HighlightType.None:
      return false;
    case HighlightType.Element:
    case HighlightType.ContentItem:
      return true;
    case HighlightType.ContentComponent:
    default: {
      return configuration.debug || isInsideWebSpotlightPreviewIFrame(configuration);
    }
  }
}

/**
 * Check if node should have a add button based on its data-attributes.
 */
export function shouldElementHaveAddButton(element: HTMLElement | null, configuration: KSLConfiguration): boolean {
  return (
    ((isInsideWebSpotlightPreviewIFrame(configuration) || configuration.debug) &&
      element &&
      element.hasAttribute(MetadataAttribute.AddButton)) ??
    false
  );
}
