import { buildComponentElementLink, buildElementLink, buildKontentLink } from '../../src';
import { IElementClickedMessageData } from '../../src/lib/IFrameCommunicatorTypes';

describe('link.ts', () => {
  describe('buildElementLink', () => {
    it('should produce smart link to element', () => {
      const link = buildElementLink(
        'ef221e15-36d1-437b-9e89-3283656bc70b',
        'default',
        'a5d955ae-a488-4ba7-af43-453c8bfe1c17',
        'title'
      );

      expect(link).toEqual(
        'https://app.kontent.ai/goto/edit-item/project/ef221e15-36d1-437b-9e89-3283656bc70b/variant-codename/default/item/a5d955ae-a488-4ba7-af43-453c8bfe1c17/element/title'
      );
    });
  });

  describe('buildComponentElementLink', () => {
    it('should produce smart link to coponent element', () => {
      const link = buildComponentElementLink(
        '4d6e4002-0588-4bf7-bd1c-c3f6bdd45411',
        'default',
        '054c17b7-0fd5-40ed-a6c7-c554929944a5',
        'cbf82565-e33b-450a-b569-1e667d581b9a',
        'name'
      );
      expect(link).toEqual(
        'https://app.kontent.ai/goto/edit-item/project/4d6e4002-0588-4bf7-bd1c-c3f6bdd45411/variant-codename/default/item/054c17b7-0fd5-40ed-a6c7-c554929944a5/component/cbf82565-e33b-450a-b569-1e667d581b9a/element/name'
      );
    });
  });

  describe('buildKontentLink', () => {
    let testData: IElementClickedMessageData;

    beforeEach(() => {
      testData = {
        projectId: '700f98f2-d078-4c67-8d43-2fefccf24a21',
        languageCodename: 'en',
        itemId: '117a5941-8c12-4636-a4f1-b016bc568b06',
        elementCodename: 'section_title',
      };
    });

    it('should produce smart link to component element when content component id is specified', () => {
      const testDataWithComponent = {
        ...testData,
        contentComponentId: 'd7a0890b-9032-4cc5-a66e-2a2b66f7a477',
      };
      const link = buildKontentLink(testDataWithComponent);
      expect(link).toEqual(
        'https://app.kontent.ai/goto/edit-item/project/700f98f2-d078-4c67-8d43-2fefccf24a21/variant-codename/en/item/117a5941-8c12-4636-a4f1-b016bc568b06/component/d7a0890b-9032-4cc5-a66e-2a2b66f7a477/element/section_title'
      );
    });

    it('should produce smart link to element when content component id is not specified', () => {
      const link = buildKontentLink(testData);
      expect(link).toEqual(
        'https://app.kontent.ai/goto/edit-item/project/700f98f2-d078-4c67-8d43-2fefccf24a21/variant-codename/en/item/117a5941-8c12-4636-a4f1-b016bc568b06/element/section_title'
      );
    });
  });
});
