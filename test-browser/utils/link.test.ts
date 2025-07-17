import { describe, it, expect } from 'vitest';
import { buildKontentElementLink, buildKontentItemLink } from '../../src/utils/link';

describe('link.ts', () => {
  describe('buildKontentElementLink', () => {
    it('should produce smart link to element', () => {
      const link = buildKontentElementLink({
        environmentId: 'ef221e15-36d1-437b-9e89-3283656bc70b',
        languageCodename: 'default',
        itemId: 'a5d955ae-a488-4ba7-af43-453c8bfe1c17',
        elementCodename: 'title',
      });

      expect(link).toEqual(
        'https://app.kontent.ai/goto/edit-item/project/ef221e15-36d1-437b-9e89-3283656bc70b/variant-codename/default/item/a5d955ae-a488-4ba7-af43-453c8bfe1c17/element/title'
      );
    });

    it('should produce smart link to component element', () => {
      const link = buildKontentElementLink({
        environmentId: '4d6e4002-0588-4bf7-bd1c-c3f6bdd45411',
        languageCodename: 'default',
        itemId: '054c17b7-0fd5-40ed-a6c7-c554929944a5',
        contentComponentId: 'cbf82565-e33b-450a-b569-1e667d581b9a',
        componentElementCodename: 'name',
      });
      expect(link).toEqual(
        'https://app.kontent.ai/goto/edit-item/project/4d6e4002-0588-4bf7-bd1c-c3f6bdd45411/variant-codename/default/item/054c17b7-0fd5-40ed-a6c7-c554929944a5/component/cbf82565-e33b-450a-b569-1e667d581b9a/element/name'
      );
    });
  });

  describe('buildItemLink', () => {
    it('should produce smart link to content item', () => {
      const link = buildKontentItemLink({
        environmentId: '700f98f2-d078-4c67-8d43-2fefccf24a21',
        languageCodename: 'en',
        itemId: '117a5941-8c12-4636-a4f1-b016bc568b06',
      });

      expect(link).toEqual(
        'https://app.kontent.ai/goto/edit-item/project/700f98f2-d078-4c67-8d43-2fefccf24a21/variant-codename/en/item/117a5941-8c12-4636-a4f1-b016bc568b06'
      );
    });
  });
});
