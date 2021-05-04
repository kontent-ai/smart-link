import { createHtmlFixture } from '../test-helpers/createHtmlFixture';
import { parseEditButtonDataAttributes, parseAddButtonDataAttributes } from '../../src/utils/dataAttributes';
import { InsertPositionPlacement } from '../../src/lib/IFrameCommunicatorTypes';

describe('dataAttributes.ts', () => {
  const fixture = createHtmlFixture();

  describe('parseEditButtonDataAttributes', () => {
    it('should parse data attributes for edit element button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div 
          data-kontent-project-id="8ec75bbd-c1b9-4d10-8ac8-a7f985109301" 
          data-kontent-language-codename="en-us"
        >
           <div 
              data-kontent-item-id="c37b9222-e3a0-46ff-9cda-45948c6ca876" 
              data-kontent-component-id="46d79723-adc9-4957-9bfb-9d015c11d8f1" 
              data-kontent-element-codename="sections"
           />
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename]') as HTMLElement;
      const expected = {
        projectId: '8ec75bbd-c1b9-4d10-8ac8-a7f985109301',
        languageCodename: 'en-us',
        itemId: 'c37b9222-e3a0-46ff-9cda-45948c6ca876',
        contentComponentId: '46d79723-adc9-4957-9bfb-9d015c11d8f1',
        elementCodename: 'sections',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes for edit component button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div 
          data-kontent-project-id="a5a45323-4a00-4258-be3d-5d16b529969a" 
          data-kontent-language-codename="cs"
        >
           <div data-kontent-item-id="ad81ad4f-f574-4460-ba67-1a14164ad987">
              <div data-kontent-component-id="bfae94f4-638c-4ab2-957a-6f4636475ab9" />
           </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-component-id]') as HTMLElement;
      const expected = {
        projectId: 'a5a45323-4a00-4258-be3d-5d16b529969a',
        languageCodename: 'cs',
        itemId: 'ad81ad4f-f574-4460-ba67-1a14164ad987',
        contentComponentId: 'bfae94f4-638c-4ab2-957a-6f4636475ab9',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes for edit item button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="285dd2ad-3a16-428f-820a-84e3eb4de3b3">
           <div data-kontent-language-codename="nl">
              <div data-kontent-item-id="4a5e4e01-d8b4-4d06-a0ff-42ac7e1b4f11"/>
           </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-item-id]') as HTMLElement;
      const expected = {
        projectId: '285dd2ad-3a16-428f-820a-84e3eb4de3b3',
        languageCodename: 'nl',
        itemId: '4a5e4e01-d8b4-4d06-a0ff-42ac7e1b4f11',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should ignore optional attributes out of their scope', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="4e870857-9059-4f2a-9079-618200fedff2">
            <div data-kontent-language-codename="hr">
                <div data-kontent-item-id="e35acd87-9911-4b0b-be74-521ae9a85421">
                    <div data-kontent-component-id="3024f2d5-effc-49b1-b4d1-0d732e49d7fc">
                        <div data-kontent-element-codename="sections">
                            <div data-kontent-item-id="345fb42f-e243-4de0-83cd-a109799d0973">
                                <div data-kontent-element-codename="comments"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename="comments"]') as HTMLElement;
      const expected = {
        projectId: '4e870857-9059-4f2a-9079-618200fedff2',
        languageCodename: 'hr',
        itemId: '345fb42f-e243-4de0-83cd-a109799d0973',
        elementCodename: 'comments',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should work when all attributes are set on the same node', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div data-kontent-project-id="4e870857-9059-4f2a-9079-618200fedff2">
            <div data-kontent-language-codename="hr">
                <div data-kontent-item-id="e35acd87-9911-4b0b-be74-521ae9a85421">
                    <div data-kontent-component-id="3024f2d5-effc-49b1-b4d1-0d732e49d7fc">
                        <div data-kontent-element-codename="sections">
                            <div data-kontent-item-id="345fb42f-e243-4de0-83cd-a109799d0973">
                                <div data-kontent-element-codename="comments">
                                    <div
                                      data-kontent-project-id="c1321744-70e6-45d7-99e3-212bda160b23"
                                      data-kontent-language-codename="en-us"
                                      data-kontent-item-id="765a23d8-ac25-4f1d-9f39-7267d3d59690"
                                      data-kontent-component-id="10a56a56-d045-4e15-be72-333d4effa21a"
                                      data-kontent-element-codename="content"
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

      const target = fixture.querySelector('[data-kontent-element-codename="content"]') as HTMLElement;
      const expected = {
        projectId: 'c1321744-70e6-45d7-99e3-212bda160b23',
        languageCodename: 'en-us',
        itemId: '765a23d8-ac25-4f1d-9f39-7267d3d59690',
        contentComponentId: '10a56a56-d045-4e15-be72-333d4effa21a',
        elementCodename: 'content',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });

    it('should work when `projectId` and `languageCodename` are omitted', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
      <div data-kontent-item-id="e35acd87-9911-4b0b-be74-521ae9a85421">
        <div data-kontent-component-id="3024f2d5-effc-49b1-b4d1-0d732e49d7fc">
            <div data-kontent-element-codename="sections" />
        </div>
      </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-element-codename]') as HTMLElement;
      const expected = {
        projectId: undefined,
        languageCodename: undefined,
        itemId: 'e35acd87-9911-4b0b-be74-521ae9a85421',
        contentComponentId: '3024f2d5-effc-49b1-b4d1-0d732e49d7fc',
        elementCodename: 'sections',
      };

      expect(parseEditButtonDataAttributes(target)).toEqual(expected);
    });
  });

  describe('parseAddButtonDataAttributes', () => {
    it('should parse data attributes for fixed add button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div 
            data-kontent-project-id="8ec75bbd-c1b9-4d10-8ac8-a7f985109301" 
            data-kontent-language-codename="en-us"
        >
          <div
              data-kontent-item-id="99c3bcd8-f5ac-4c64-b57e-b0beb414863a"
              data-kontent-element-codename="rte"
              data-kontent-add-button
              data-kontent-add-button-insert-position="end"
          >
            <div data-kontent-component-id="3ee4baf4-63ac-4a86-ad2d-8b84726e798f">
              <div data-kontent-element-codename="cfcca1a7-04e3-4120-9c22-009a8f636fc9"></div>
            </div>
            <div data-kontent-component-id="ec5f1217-256e-426d-882f-22b92c538f5f">
              <div data-kontent-element-codename="dfbcb6be-a20b-4405-afc5-8a11fa893551"></div>
            </div>
          </div>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-add-button]') as HTMLElement;
      const expected = {
        projectId: '8ec75bbd-c1b9-4d10-8ac8-a7f985109301',
        languageCodename: 'en-us',
        itemId: '99c3bcd8-f5ac-4c64-b57e-b0beb414863a',
        elementCodename: 'rte',
        insertPosition: {
          placement: InsertPositionPlacement.End,
        },
      };

      expect(parseAddButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes for relative add button', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div 
            data-kontent-project-id="8ec75bbd-c1b9-4d10-8ac8-a7f985109301" 
            data-kontent-language-codename="en-us"
        >
          <div
              data-kontent-item-id="99c3bcd8-f5ac-4c64-b57e-b0beb414863a"
              data-kontent-element-codename="rte"
          >
            <div data-kontent-component-id="3ee4baf4-63ac-4a86-ad2d-8b84726e798f">
              <div data-kontent-element-codename="cfcca1a7-04e3-4120-9c22-009a8f636fc9"></div>
            </div>
            <div 
              data-kontent-component-id="b2d36acb-90af-4ce7-813a-bbcae4c2e496" 
              data-kontent-add-button
              data-kontent-add-button-insert-position="after"
            >
              <div data-kontent-element-codename="content"></div>
            </div>
          </div>
        </div>   
      `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-add-button]') as HTMLElement;
      const expected = {
        projectId: '8ec75bbd-c1b9-4d10-8ac8-a7f985109301',
        languageCodename: 'en-us',
        itemId: '99c3bcd8-f5ac-4c64-b57e-b0beb414863a',
        elementCodename: 'rte',
        insertPosition: {
          placement: InsertPositionPlacement.After,
          targetId: 'b2d36acb-90af-4ce7-813a-bbcae4c2e496',
        },
      };

      expect(parseAddButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse data attributes when all attributes are on the same node (only fixed)', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
      <div>
        <div
            data-kontent-project-id="6db25ade-c2d6-43d2-ad9f-91e6cf614065"
            data-kontent-language-codename="cs"
            data-kontent-item-id="af1cea9a-aeed-429f-ac86-a0c78a939197"
            data-kontent-component-id="dcc91efe-7205-4ebf-b470-e934dbc31c38"
            data-kontent-element-codename="sections"
            data-kontent-add-button
            data-kontent-add-button-insert-position="end"
        >
          <div data-kontent-component-id="9e7f9366-84a2-4ccf-b93a-95c08cf7fa23">
            <div data-kontent-element-codename="content"></div>
          </div>
          <div data-kontent-component-id="0b327cfd-fbef-4e71-b0de-b68003832b8c">
            <div data-kontent-element-codename="content"></div>
          </div>
        </div>
      </div>
    `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-add-button]') as HTMLElement;
      const expected = {
        projectId: '6db25ade-c2d6-43d2-ad9f-91e6cf614065',
        languageCodename: 'cs',
        itemId: 'af1cea9a-aeed-429f-ac86-a0c78a939197',
        contentComponentId: 'dcc91efe-7205-4ebf-b470-e934dbc31c38',
        elementCodename: 'sections',
        insertPosition: {
          placement: InsertPositionPlacement.End,
        },
      };

      expect(parseAddButtonDataAttributes(target)).toEqual(expected);
    });

    it('should parse nested data attributes', () => {
      // <editor-fold desc="fixture.setHtml([HTML]);" defaultstate="collapsed">
      fixture.setHtml(`
        <div 
            data-kontent-project-id="8ec75bbd-c1b9-4d10-8ac8-a7f985109301" 
            data-kontent-language-codename="en-us"
        >
          <div
              data-kontent-item-id="8989bb18-1aee-4574-81a9-cc76234192d9"
              data-kontent-component-id="1be9cd6e-ab95-419a-a4c6-023e540fcf58"
              data-kontent-element-codename="content"
              data-kontent-add-button
              data-kontent-add-button-insert-position="end"
          >
            <div data-kontent-item-id="eb137c14-820a-48b6-9b91-19425aa76490">
              <div data-kontent-component-id="0a197ac8-0c09-41be-bcaa-87ce9cbaf6d6">
                <div data-kontent-element-codename="comments">
                  <div 
                    data-kontent-item-id="ab758fd9-4f84-4f94-962f-26752b459fe8"
                    data-kontent-add-button
                    data-kontent-add-button-insert-position="before"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
      // </editor-fold>

      const target = fixture.querySelector('[data-kontent-add-button-insert-position="before"]') as HTMLElement;
      const expected = {
        projectId: '8ec75bbd-c1b9-4d10-8ac8-a7f985109301',
        languageCodename: 'en-us',
        itemId: 'eb137c14-820a-48b6-9b91-19425aa76490',
        contentComponentId: '0a197ac8-0c09-41be-bcaa-87ce9cbaf6d6',
        elementCodename: 'comments',
        insertPosition: {
          placement: InsertPositionPlacement.Before,
          targetId: 'ab758fd9-4f84-4f94-962f-26752b459fe8',
        },
      };

      expect(parseAddButtonDataAttributes(target)).toEqual(expected);
    });
  });
});
