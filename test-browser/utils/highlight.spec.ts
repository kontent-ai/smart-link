import { getHighlightTypeForNode, HighlightType } from '../../src/utils/highlight';
import { DataAttribute } from '../../src/utils/dataAttributes';

describe('highlight.ts', () => {
  describe('getHighlightTypeForNode', () => {
    it('should return None if node is not specified', () => {
      const highlightType = getHighlightTypeForNode(null);
      expect(highlightType).toEqual(HighlightType.None);
    });

    it('should return None if node has no relevant attributes', () => {
      const node = document.createElement('div');
      const highlightType = getHighlightTypeForNode(node);
      expect(highlightType).toEqual(HighlightType.None);
    });

    it('should return Element if node has element codename attribute', () => {
      const node = document.createElement('div');

      node.setAttribute(DataAttribute.ElementCodename, 'element-codename');
      expect(getHighlightTypeForNode(node)).toEqual(HighlightType.Element);

      node.setAttribute(DataAttribute.ComponentId, 'content-component-id');
      expect(getHighlightTypeForNode(node)).toEqual(HighlightType.Element);

      node.setAttribute(DataAttribute.ItemId, 'item-id');
      expect(getHighlightTypeForNode(node)).toEqual(HighlightType.Element);
    });

    it('should return ContentComponent if node has component id attribute and no element codename attribute', () => {
      const node = document.createElement('div');

      node.setAttribute(DataAttribute.ComponentId, 'content-component-id');
      expect(getHighlightTypeForNode(node)).toEqual(HighlightType.ContentComponent);

      node.setAttribute(DataAttribute.ItemId, 'item-id');
      expect(getHighlightTypeForNode(node)).toEqual(HighlightType.ContentComponent);
    });

    it('should return ContentItem if node has item id attribute and no element codename/component id attributes', () => {
      const node = document.createElement('div');

      node.setAttribute(DataAttribute.ItemId, 'item-id');
      expect(getHighlightTypeForNode(node)).toEqual(HighlightType.ContentItem);
    });
  });
});
