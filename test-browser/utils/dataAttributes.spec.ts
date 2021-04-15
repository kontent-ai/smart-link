import { createHtmlFixture } from '../test-helpers/createHtmlFixture';
import { parseEditButtonDataAttributes, parsePlusButtonDataAttributes } from '../../src/utils/dataAttributes';
import { InsertPosition } from '../../src/lib/IFrameCommunicatorTypes';

describe('dataAttributes.ts', () => {
  const fixture = createHtmlFixture();

  describe('parseEditButtonDataAttributes', () => {
    it('should parse data attributes for edit element button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a" data-kontent-language-codename="a">
           <div data-kontent-item-id="a" data-kontent-component-id="a" data-kontent-element-codename="a"></div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename="a"]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'a',
        contentComponentId: 'a',
        elementCodename: 'a',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes for edit component button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a" data-kontent-language-codename="a">
           <div data-kontent-item-id="a">
              <div data-kontent-component-id="a"></div>
           </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-component-id="a"]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'a',
        contentComponentId: 'a',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes for edit item button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a">
           <div data-kontent-language-codename="a">
              <div data-kontent-item-id="a"></div>
           </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-item-id="a"]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'a',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should ignore optional attributes out of their scope', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a">
            <div data-kontent-language-codename="a">
                <div data-kontent-item-id="a">
                    <div data-kontent-component-id="a">
                        <div data-kontent-element-codename="a">
                            <div data-kontent-item-id="b">
                                <div data-kontent-element-codename="b"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename="b"]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'b',
        elementCodename: 'b',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should work when all attributes are set on the same node', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a">
            <div data-kontent-language-codename="a">
                <div data-kontent-item-id="a">
                    <div data-kontent-component-id="a">
                        <div data-kontent-element-codename="a">
                            <div data-kontent-item-id="b">
                                <div data-kontent-element-codename="b">
                                    <div
                                      data-kontent-project-id="c"
                                      data-kontent-language-codename="c"
                                      data-kontent-item-id="c"
                                      data-kontent-component-id="c"
                                      data-kontent-element-codename="c"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename="c"]') as HTMLElement;
      const expected = {
        projectId: 'c',
        languageCodename: 'c',
        itemId: 'c',
        contentComponentId: 'c',
        elementCodename: 'c',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should work when `projectId` and `languageCodename` are omitted', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
      <div data-kontent-item-id="a">
          <div data-kontent-component-id="a">
              <div data-kontent-element-codename="a" />
          </div>
      </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename="a"]') as HTMLElement;
      const expected = {
        projectId: undefined,
        languageCodename: undefined,
        itemId: 'a',
        contentComponentId: 'a',
        elementCodename: 'a',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });
  });

  describe('parsePlusButtonDataAttributes', () => {
    it('should parse data attributes for fixed plus button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
      <div data-kontent-project-id="a" data-kontent-language-codename="a">
        <div
            data-kontent-item-id="parent"
            data-kontent-element-codename="rte"
            data-kontent-plus-button
            data-kontent-plus-button-insert-position="end"
        >
          <div data-kontent-component-id="a">
            <div data-kontent-element-codename="a"></div>
          </div>
          <div data-kontent-component-id="a">
            <div data-kontent-element-codename="a"></div>
          </div>
        </div>
      </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-plus-button]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'parent',
        elementCodename: 'rte',
        insertPosition: {
          placement: InsertPosition.End,
        },
      };

      expect(parsePlusButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes for relative plus button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
      <div data-kontent-project-id="a" data-kontent-language-codename="a">
        <div
            data-kontent-item-id="parent"
            data-kontent-element-codename="rte"
        >
          <div data-kontent-component-id="a">
            <div data-kontent-element-codename="a"></div>
          </div>
          <div 
            data-kontent-component-id="target" 
            data-kontent-plus-button
            data-kontent-plus-button-insert-position="after"
          >
            <div data-kontent-element-codename="a"></div>
          </div>
        </div>
      </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-plus-button]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'parent',
        elementCodename: 'rte',
        insertPosition: {
          placement: InsertPosition.After,
          targetId: 'target',
        },
      };

      expect(parsePlusButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes when all attributes are on the same node (only fixed)', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
      <div>
        <div
            data-kontent-project-id="a"
            data-kontent-language-codename="a"
            data-kontent-item-id="a"
            data-kontent-component-id="parent"
            data-kontent-element-codename="rte"
            data-kontent-plus-button
            data-kontent-plus-button-insert-position="end"
        >
          <div data-kontent-component-id="a">
            <div data-kontent-element-codename="a"></div>
          </div>
          <div data-kontent-component-id="a">
            <div data-kontent-element-codename="a"></div>
          </div>
        </div>
      </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-plus-button]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'a',
        componentId: 'parent',
        elementCodename: 'rte',
        insertPosition: {
          placement: InsertPosition.End,
        },
      };

      expect(parsePlusButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse nested data attributes', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
      <div data-kontent-project-id="a" data-kontent-language-codename="a">
        <div
            data-kontent-item-id="a"
            data-kontent-component-id="parent"
            data-kontent-element-codename="rte"
            data-kontent-plus-button
            data-kontent-plus-button-insert-position="end"
        >
          <div data-kontent-item-id="b">
            <div data-kontent-component-id="b">
              <div data-kontent-element-codename="inner-rte">
                <div 
                  data-kontent-item-id="c"
                  data-kontent-plus-button
                  data-kontent-plus-button-insert-position="before"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-plus-button-insert-position="before"]') as HTMLElement;
      const expected = {
        projectId: 'a',
        languageCodename: 'a',
        itemId: 'b',
        componentId: 'b',
        elementCodename: 'inner-rte',
        insertPosition: {
          placement: InsertPosition.Before,
          targetId: 'c',
        },
      };

      expect(parsePlusButtonDataAttributes(target)).toEqual(expected);
    });
  });
});
