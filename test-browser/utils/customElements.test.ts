import {
  getAugmentableDescendants,
  shouldElementHaveAddButton,
  shouldElementHaveHighlight,
} from '../../src/utils/customElements';
import { createHtmlFixture } from '../test-helpers/createHtmlFixture';
import { ConfigurationManager } from '../../src/lib/ConfigurationManager';
import { DataAttribute, MetadataAttribute } from '../../src/utils/dataAttributes/attributes';
import { describe, it, expect } from 'vitest';
import { getHighlightTypeForElement, HighlightType } from '../../src/utils/dataAttributes/elementHighlight';

describe('customElements.ts', () => {
  describe('getAugmentableDescendants', () => {
    const fixture = createHtmlFixture();

    it('should return elements with highlights and add buttons when inside WS', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="container">
          <div
            id="elementA"
            data-kontent-element-codename="element-codename"
            data-kontent-disable-features="random-value"
          />
          <div
            id="elementB"
            data-kontent-component-id="component-id"
            data-kontent-disable-features="highlight"
          />
          <div
            id="elementC"
            data-kontent-item-id="item-id"
          />
          <div
            id="elementD"
            data-kontent-element-codename="element-codename"
            data-kontent-disable-features="highlight"
          />
          <div
            id="elementE"
            data-kontent-add-button
            data-kontent-add-button-insert-position="after"
            data-kontent-add-button-render-position="bottom"
          >
            <div
              id="elementF"
              data-kontent-element-codename="element-codename"
            />
            <div
              id="elementG"
              data-kontent-item-id="item-id"
              data-kontent-disable-features="highlight"
            />
            <div
              id="elementH"
              data-kontent-component-id="component-id"
            />
          </div>
        </div>
      `);
      // </editor-fold>

      const container = fixture.querySelector('#container') as HTMLElement;

      const elementA = fixture.querySelector('#elementA') as HTMLElement;
      const elementC = fixture.querySelector('#elementC') as HTMLElement;
      const elementE = fixture.querySelector('#elementE') as HTMLElement;
      const elementF = fixture.querySelector('#elementF') as HTMLElement;
      const elementH = fixture.querySelector('#elementH') as HTMLElement;

      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: true });
      const result = getAugmentableDescendants(container);
      expect(result.length).toBe(5);
      expect(result).toContain(elementA);
      expect(result).toContain(elementC);
      expect(result).toContain(elementE);
      expect(result).toContain(elementF);
      expect(result).toContain(elementH);
      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: false });
    });

    it('should return elements with highlights and add buttons when outside WS', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div id="container">
          <div
            id="elementA"
            data-kontent-element-codename="element-codename"
            data-kontent-disable-features="random-value"
          />
          <div
            id="elementB"
            data-kontent-component-id="component-id"
            data-kontent-disable-features="highlight"
          />
          <div
            id="elementC"
            data-kontent-item-id="item-id"
          />
          <div
            id="elementD"
            data-kontent-element-codename="element-codename"
            data-kontent-disable-features="highlight"
          />
          <div
            id="elementE"
            data-kontent-add-button
            data-kontent-add-button-insert-position="after"
            data-kontent-add-button-render-position="bottom"
          >
            <div
              id="elementF"
              data-kontent-element-codename="element-codename"
            />
            <div
              id="elementG"
              data-kontent-item-id="item-id"
              data-kontent-disable-features="highlight"
            />
            <div
              id="elementH"
              data-kontent-component-id="component-id"
            />
          </div>
        </div>
      `);
      // </editor-fold>

      const container = fixture.querySelector('#container') as HTMLElement;

      const elementA = fixture.querySelector('#elementA') as HTMLElement;
      const elementF = fixture.querySelector('#elementF') as HTMLElement;

      const result = getAugmentableDescendants(container);
      expect(result.length).toBe(2);
      expect(result).toContain(elementA);
      expect(result).toContain(elementF);
    });
  });

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

      node.setAttribute('data-kontent-element-codename', 'element-codename');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.Element);

      node.setAttribute('data-kontent-component-id', 'content-component-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.Element);

      node.setAttribute('data-kontent-item-id', 'item-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.Element);
    });

    it('should return ContentComponent if node has component id attribute and no element codename attribute', () => {
      const node = document.createElement('div');

      node.setAttribute('data-kontent-component-id', 'content-component-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.ContentComponent);

      node.setAttribute('data-kontent-item-id', 'item-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.ContentComponent);
    });

    it('should return ContentItem if node has item id attribute and no element codename/component id attributes', () => {
      const node = document.createElement('div');

      node.setAttribute('data-kontent-item-id', 'item-id');
      expect(getHighlightTypeForElement(node)).toEqual(HighlightType.ContentItem);
    });
  });

  describe('shouldElementHaveAddButton', () => {
    it('should return false outside Web Spotlight even when element has required attributes', () => {
      const element = document.createElement('div');
      element.setAttribute(MetadataAttribute.AddButton, 'true');
      expect(shouldElementHaveAddButton(element)).toBe(false);
    });

    it('should return true when inside Web Spotlight and element has required attributes', () => {
      const element = document.createElement('div');
      element.setAttribute('data-kontent-add-button', 'true');

      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: true });
      expect(shouldElementHaveAddButton(element)).toBe(true);
      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: false });
    });
  });

  describe('shouldElementHaveHighlight', () => {
    it('should return true when element has element codename attribute', () => {
      const element = document.createElement('div');
      element.setAttribute('data-kontent-element-codename', 'codename');
      expect(shouldElementHaveHighlight(element)).toBe(true);
    });

    it('should return true when inside Web Spotlight and element has component id attribute', () => {
      const element = document.createElement('div');
      element.setAttribute('data-kontent-component-id', 'id');

      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: true });
      expect(shouldElementHaveHighlight(element)).toBe(true);
      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: false });
    });

    it('should return true when inside Web Spotlight and element has item id attribute', () => {
      const element = document.createElement('div');
      element.setAttribute('data-kontent-item-id', 'id');

      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: true });
      expect(shouldElementHaveHighlight(element)).toBe(true);
      ConfigurationManager.getInstance().update({ forceWebSpotlightMode: false });
    });

    it('should return false when element has required attribute and highlight feature is disabled', () => {
      const element = document.createElement('div');
      element.setAttribute('data-kontent-element-codename', 'codename');
      element.setAttribute('data-kontent-disable-features', 'unsupported-value,highlight');
      expect(shouldElementHaveHighlight(element)).toBe(false);
    });

    it('should return true when element has required attribute and highlight feature is not disabled', () => {
      const element = document.createElement('div');
      element.setAttribute('data-kontent-element-codename', 'codename');
      element.setAttribute('data-kontent-disable-features', 'unsupported-value');
      expect(shouldElementHaveHighlight(element)).toBe(true);
    });

    it('should return true only for elements with element codename attribute when outside Web Spotlight', () => {
      const element = document.createElement('div');
      element.setAttribute(DataAttribute.ElementCodename, 'codename');
      expect(shouldElementHaveHighlight(element)).toBe(true);

      const component = document.createElement('div');
      component.setAttribute(DataAttribute.ComponentId, 'id');
      expect(shouldElementHaveHighlight(component)).toBe(false);

      const item = document.createElement('div');
      item.setAttribute(DataAttribute.ItemId, 'id');
      expect(shouldElementHaveHighlight(item)).toBe(false);
    });
  });
});
