import {
  DataAttribute,
  getDataAttributesFromEventPath,
  getHighlightedElementFromEventPath,
} from '../../src/utils/dataAttributes';
import { createHtmlFixture } from '../test-helpers/createHtmlFixture';
import { createTestEventManager } from '../test-helpers/createTestEventManager';

describe('dataAttributes.ts', () => {
  const windowTestEventManager = createTestEventManager(window);
  const fixture = createHtmlFixture();

  describe('getDataAttributesFromEventPath', () => {
    function testClickEventParsedAttributes(clickTarget: HTMLElement, expected: Map<string, string>, done: DoneFn) {
      windowTestEventManager.addEventListenerForCurrentTest(
        'click',
        (event) => {
          const parsed = getDataAttributesFromEventPath(event);
          expect(parsed).toEqual(expected);
          done();
        },
        true
      );

      clickTarget.click();
    }

    it('should parse data attribute from event path', (done) => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a" data-kontent-language-codename="a">
           <div data-kontent-item-id="a" data-kontent-component-id="a" data-kontent-element-codename="a"></div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename="a"]') as HTMLElement;
      const expected = new Map([
        [DataAttribute.ElementCodename, 'a'],
        [DataAttribute.ComponentId, 'a'],
        [DataAttribute.ItemId, 'a'],
        [DataAttribute.LanguageCodename, 'a'],
        [DataAttribute.ProjectId, 'a'],
      ]);

      testClickEventParsedAttributes(target, expected, done);
    });

    it('should ignore optional attribute out of its scope', (done) => {
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
      const expected = new Map([
        [DataAttribute.ElementCodename, 'b'],
        [DataAttribute.ItemId, 'b'],
        [DataAttribute.LanguageCodename, 'a'],
        [DataAttribute.ProjectId, 'a'],
      ]);

      testClickEventParsedAttributes(target, expected, done);
    });

    it('should ignore lower-scope attributes while parsing', (done) => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a" data-kontent-language-codename="a">
           <div data-kontent-item-id="a" data-kontent-element-codename="a">
                <div data-kontent-item-id="b">
                    <div data-kontent-language-codename="b">
                        <div data-kontent-project-id="b"></div>
                    </div>
                </div>
           </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-project-id="b"]') as HTMLElement;
      const expected = new Map([
        [DataAttribute.ElementCodename, 'a'],
        [DataAttribute.ItemId, 'a'],
        [DataAttribute.LanguageCodename, 'a'],
        [DataAttribute.ProjectId, 'a'],
      ]);

      testClickEventParsedAttributes(target, expected, done);
    });

    it('should work when all attributes are on the same node', (done) => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a" data-kontent-language-codename="a">
           <div data-kontent-project-id="b" data-kontent-language-codename="b" data-kontent-item-id="b" data-kontent-element-codename="b"></div>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename="b"]') as HTMLElement;
      const expected = new Map([
        [DataAttribute.ElementCodename, 'b'],
        [DataAttribute.ItemId, 'b'],
        [DataAttribute.LanguageCodename, 'b'],
        [DataAttribute.ProjectId, 'b'],
      ]);

      testClickEventParsedAttributes(target, expected, done);
    });
  });

  describe('getHighlightedElementFromEventPath', () => {
    function testClickEventHighlightedElement(clickTarget: HTMLElement, expected: HTMLElement | null, done: DoneFn) {
      windowTestEventManager.addEventListenerForCurrentTest(
        'click',
        (event) => {
          const element = getHighlightedElementFromEventPath(event);
          expect(element).toEqual(expected);
          done();
        },
        true
      );

      clickTarget.click();
    }

    it('should return the first node with data-kontent-element-codename attribute when it is present in the event path', (done) => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a" data-kontent-language-codename="a" data-kontent-element-codename="a">
           <div data-kontent-project-id="b" data-kontent-language-codename="b" data-kontent-item-id="b" data-kontent-element-codename="b">
                <div id="click-target"></div>
           </div>
        </div>
      `);
      // </editor-fold>

      const clickTarget = fixture.querySelector('#click-target') as HTMLElement;
      const expected = fixture.querySelector('*[data-kontent-element-codename="b"]') as HTMLElement;

      testClickEventHighlightedElement(clickTarget, expected, done);
    });

    it('should return null when there is no node with data-kontent-element-codename attribute in the event path', (done) => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="a" data-kontent-language-codename="a">
           <div data-kontent-project-id="b" data-kontent-language-codename="b" data-kontent-item-id="b">
                <div id="click-target"></div>
           </div>
        </div>
      `);
      // </editor-fold>

      const clickTarget = fixture.querySelector('#click-target') as HTMLElement;

      testClickEventHighlightedElement(clickTarget, null, done);
    });
  });
});
