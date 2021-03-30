import { DataAttribute, MetadataAttribute } from '../../src/utils/dataAttributes';
import {
  getHighlightTypeForElement,
  HighlightType,
  shouldElementHaveHighlight,
  shouldElementHavePlusButton,
} from '../../src/utils/customElements';

describe('customElements.ts', () => {
  describe('getHighlightTypeForNode', () => {
    it('should return None if node is not specified', () => {
      const highlightType = getHighlightTypeForElement(null);
      expect(highlightType).toEqual(HighlightType.None);
    });

    it('should return None if node has no relevant attributes', () => {
      const node = document.createElement('div');
      const highlightType = getHighlightTypeForElement(node);
      expect(highlightType).toEqual(HighlightType.None);
    });

    it('should return Element if node has element codename attribute', () => {
      const node = document.createElement('div');

      node.setAttribute(DataAttribute.ElementCodename, 'element-codename');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.Element);

      node.setAttribute(DataAttribute.ComponentId, 'content-component-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.Element);

      node.setAttribute(DataAttribute.ItemId, 'item-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.Element);
    });

    it('should return ContentComponent if node has component id attribute and no element codename attribute', () => {
      const node = document.createElement('div');

      node.setAttribute(DataAttribute.ComponentId, 'content-component-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.ContentComponent);

      node.setAttribute(DataAttribute.ItemId, 'item-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.ContentComponent);
    });

    it('should return ContentItem if node has item id attribute and no element codename/component id attributes', () => {
      const node = document.createElement('div');

      node.setAttribute(DataAttribute.ItemId, 'item-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.ContentItem);
    });
  });

  describe('shouldElementHavePlusButton', () => {
    it('should return true when element exists and have required attributes', () => {
      const element = document.createElement('div');
      element.setAttribute(MetadataAttribute.PlusButton, 'true');
      expect(shouldElementHavePlusButton(element)).toBe(true);
    });
  });

  describe('shouldElementHaveHighlight', () => {
    it('should return true when element has element codename attribute', () => {
      const element = document.createElement('div');
      element.setAttribute(DataAttribute.ElementCodename, 'codename');
      expect(shouldElementHaveHighlight(element)).toBe(true);
    });

    it('should return true when element has component id attribute', () => {
      const element = document.createElement('div');
      element.setAttribute(DataAttribute.ComponentId, 'id');
      expect(shouldElementHaveHighlight(element)).toBe(true);
    });

    it('should return true when element has item id attribute', () => {
      const element = document.createElement('div');
      element.setAttribute(DataAttribute.ItemId, 'id');
      expect(shouldElementHaveHighlight(element)).toBe(true);
    });
  });
});
