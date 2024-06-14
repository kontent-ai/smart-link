import { Elements, ElementType, IContentItem, IContentItemElements } from '@kontent-ai/delivery-sdk';
import { IUpdateMessageData } from '../../src/lib/IFrameCommunicatorTypes';
import { applyUpdateOnItem, applyUpdateOnItemAndLoadLinkedItems } from '../../src/utils/liveReload';

const system: IContentItem['system'] = {
  id: '70105014-c767-45b6-9393-31bef0952bce',
  name: 'item',
  codename: 'item',
  type: 'itemType',
  language: 'itemLanguage',
  workflow: 'itemWf',
  collection: 'itemColl',
  lastModified: 'lastModified',
  workflowStep: 'itemWfStep',
  sitemapLocations: [],
};

[true, false].forEach((isAsync) => {
  describe(isAsync ? 'applyUpdateOnItemAndLoadLinkedItems' : 'applyUpdateOnItem', () => {
    const callTestFnc = async <Elements extends IContentItemElements>(
      item: IContentItem<Elements>,
      update: IUpdateMessageData,
      resolveCodename?: (codename: string) => string
    ): Promise<IContentItem<Elements>> =>
      isAsync
        ? await applyUpdateOnItemAndLoadLinkedItems(item, update, () => Promise.resolve([]), resolveCodename)
        : applyUpdateOnItem(item, update, resolveCodename);

    it('applies update to all elements', async () => {
      const item: IContentItem = {
        system,
        elements: {
          number: {
            type: ElementType.Number,
            name: 'number',
            value: 42,
          },
          text: {
            type: ElementType.Text,
            name: 'text',
            value: 'original value',
          },
          slug: {
            type: ElementType.UrlSlug,
            name: 'slug',
            value: 'original slug',
          },
          date: {
            type: ElementType.DateTime,
            name: 'dateTime',
            value: new Date(1316, 4, 14).toISOString(),
            displayTimeZone: 'Europe/Prague',
          } as Elements.DateTimeElement,
          custom: {
            type: ElementType.Custom,
            name: 'custom',
            value: 'original custom value',
          },
        },
      };
      const update: IUpdateMessageData = {
        item: { id: system.id, codename: system.codename },
        variant: { id: '0bd842f8-e6dd-4c0a-b677-5d850152f452', codename: system.language },
        projectId: '036f5efc-208a-4967-9ec8-b7e25fd0c18b',
        elements: [
          {
            type: ElementType.Number,
            element: {
              id: '9e5b76c1-8759-48be-a80c-10fdf3074bd9',
              codename: 'number',
            },
            data: {
              value: 69,
            },
          },
          {
            type: ElementType.Text,
            element: {
              id: '',
              codename: 'text',
            },
            data: {
              value: 'new value',
            },
          },
          {
            type: ElementType.UrlSlug,
            element: {
              id: '',
              codename: 'slug',
            },
            data: {
              value: 'new slug',
            },
          },
          {
            type: ElementType.DateTime,
            element: {
              id: '',
              codename: 'date',
            },
            data: {
              value: new Date(1378, 10, 29).toISOString(),
              displayTimeZone: 'Europe/Oslo',
            },
          },
          {
            type: ElementType.Custom,
            element: { id: '', codename: 'custom' },
            data: { value: 'new custom value' },
          },
        ],
      };

      const result = await callTestFnc(item, update);

      expect(result).toEqual({
        ...item,
        elements: {
          ...item.elements,
          number: { ...item.elements['number'], value: 69 },
          text: { ...item.elements['text'], value: 'new value' },
          slug: { ...item.elements['slug'], value: 'new slug' },
          date: {
            ...item.elements['date'],
            value: new Date(1378, 10, 29).toISOString(),
            displayTimeZone: 'Europe/Oslo',
          } as Elements.DateTimeElement,
          custom: { ...item.elements['custom'], value: 'new custom value' },
        },
      });
    });

    it('Returns the same item (the same object) when the update is not related to it', async () => {
      const item: IContentItem<{ num: Elements.NumberElement }> = {
        system,
        elements: {
          num: {
            type: ElementType.Number,
            name: 'number element',
            value: 42,
          },
        },
      };

      const update: IUpdateMessageData = {
        item: { id: 'dbd3001b-7fad-4ef4-90a5-e12159e19dc8', codename: 'some_other_item' },
        variant: { id: 'edbb01d8-8cf1-44c2-9b8d-0811f287f7ac', codename: item.system.language },
        projectId: '21817139-6c9c-484f-95fa-52e4fe08c2a4',
        elements: [
          {
            type: ElementType.Number,
            element: { id: '4779792a-593b-4e85-b181-bb21b4e72652', codename: 'num' },
            data: { value: 69 },
          },
        ],
      };

      const result: IContentItem<{ num: Elements.NumberElement }> = await callTestFnc(item, update);

      expect(result).toBe(item);
    });

    it('Applies the update to loaded linked items', async () => {
      const innerItem: IContentItem = {
        system,
        elements: {
          num: {
            type: ElementType.Number,
            name: 'number element',
            value: 42,
          },
        },
      };
      const item: IContentItem = {
        system: { ...system, id: 'c0ee19ca-8285-43ec-ab40-5bc529d81439', codename: 'parent_item' },
        elements: {
          linked: {
            type: ElementType.ModularContent,
            name: 'linked items element',
            value: [system.codename],
            linkedItems: [innerItem],
          } as Elements.LinkedItemsElement,
          rich: {
            type: ElementType.RichText,
            name: 'rich text element',
            value: `<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="${system.codename}"></object>`,
            links: [],
            images: [],
            linkedItemCodenames: [system.codename],
            linkedItems: [innerItem],
          } as Elements.RichTextElement,
        },
      };
      const update: IUpdateMessageData = {
        item: { id: system.id, codename: system.codename },
        variant: { id: 'b38fa222-697f-433c-ae4d-39ac1d6c26d1', codename: system.language },
        projectId: '65814f5e-f346-4adb-836f-10229729ab92',
        elements: [
          {
            type: ElementType.Number,
            element: { id: '7f5ef676-4dbe-4346-b2d2-6cf401f56662', codename: 'num' },
            data: { value: 69 },
          },
        ],
      };
      const updatedInnerItem: IContentItem = {
        ...innerItem,
        elements: {
          num: { ...innerItem.elements.num, value: 69 },
        },
      };

      const result = await callTestFnc(item, update);

      expect(result).toEqual({
        ...item,
        elements: {
          linked: { ...item.elements.linked, linkedItems: [updatedInnerItem] } as Elements.LinkedItemsElement,
          rich: { ...item.elements.rich, linkedItems: [updatedInnerItem] } as Elements.RichTextElement,
        },
      });
    });

    it('Uses provided codename resolver to transform element codenames before applying them on the item', async () => {
      const item: IContentItem = {
        system,
        elements: {
          testElementResolved: {
            type: ElementType.Number,
            name: 'number element',
            value: 42,
          },
        },
      };
      const update: IUpdateMessageData = {
        item: { id: item.system.id, codename: item.system.codename },
        variant: { id: '87767c98-3d1d-490f-bd19-e0157157d087', codename: item.system.language },
        projectId: '5f53475c-de51-4cef-b373-463d56919cec',
        elements: [
          {
            type: ElementType.Number,
            element: { id: '467dc8c1-4fcb-4adc-a5fc-049d17ee1386', codename: 'test_element' },
            data: { value: 69 },
          },
        ],
      };

      const result = await callTestFnc(item, update, (c) => (c === 'test_element' ? 'testElementResolved' : 'nothing'));

      expect(result).toEqual({
        ...item,
        elements: { ...item.elements, testElementResolved: { ...item.elements.testElementResolved, value: 69 } },
      });
    });

    it('Uses camelCase resolver when no resolver is provided', async () => {
      const item: IContentItem = {
        system,
        elements: {
          testElement: {
            type: ElementType.Number,
            name: 'number element',
            value: 42,
          },
        },
      };
      const update: IUpdateMessageData = {
        item: { id: item.system.id, codename: item.system.codename },
        variant: { id: '87767c98-3d1d-490f-bd19-e0157157d087', codename: item.system.language },
        projectId: '5f53475c-de51-4cef-b373-463d56919cec',
        elements: [
          {
            type: ElementType.Number,
            element: { id: '467dc8c1-4fcb-4adc-a5fc-049d17ee1386', codename: 'test_element' },
            data: { value: 69 },
          },
        ],
      };

      const result = await callTestFnc(item, update);

      expect(result).toEqual({
        ...item,
        elements: { ...item.elements, testElement: { ...item.elements.testElement, value: 69 } },
      });
    });

    it('Applies the update recursively on components', async () => {
      type ElementsType = {
        component: Elements.RichTextElement;
      };

      const item: IContentItem<ElementsType> = {
        system,
        elements: {
          component: {
            type: ElementType.RichText,
            name: 'withComponent',
            value:
              '<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="e52e6e70-2d67-4b1a-84d3-c8c69dc64055"></object>',
            links: [],
            images: [],
            linkedItemCodenames: ['e52e6e70-2d67-4b1a-84d3-c8c69dc64055'],
            linkedItems: [
              {
                system: { ...system, codename: 'e52e6e70-2d67-4b1a-84d3-c8c69dc64055' },
                elements: {
                  num: {
                    type: ElementType.Number,
                    name: 'number element',
                    value: 42,
                  },
                  inner: {
                    type: ElementType.RichText,
                    name: 'inner rich text element',
                    value: '',
                    links: [],
                    images: [],
                    linkedItemCodenames: [],
                    linkedItems: [
                      {
                        system: { ...system, codename: '7570d883-51ab-40fc-8409-fed5574eb7dc' },
                        elements: {
                          num2: {
                            type: ElementType.Number,
                            name: 'number element',
                            value: 69,
                          },
                        },
                      },
                    ],
                  } as Elements.RichTextElement,
                },
              },
            ],
          },
        },
      };
      const update: IUpdateMessageData = {
        item: { id: item.system.id, codename: item.system.codename },
        variant: { id: '87767c98-3d1d-490f-bd19-e0157157d087', codename: item.system.language },
        projectId: '5f53475c-de51-4cef-b373-463d56919cec',
        elements: [
          {
            type: ElementType.RichText,
            element: { id: '467dc8c1-4fcb-4adc-a5fc-049d17ee1386', codename: 'component' },
            data: {
              value: `<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="e52e6e70-2d67-4b1a-84d3-c8c69dc64055"></object>`,
              links: [],
              images: [],
              linkedItemCodenames: ['e52e6e70-2d67-4b1a-84d3-c8c69dc64055'],
              linkedItems: [
                {
                  system: { ...system, codename: 'e52e6e70-2d67-4b1a-84d3-c8c69dc64055' },
                  elements: {
                    num: {
                      type: ElementType.Number,
                      name: 'number element',
                      value: 142,
                    },
                    inner: {
                      type: ElementType.RichText,
                      name: 'inner rich text element',
                      value: '',
                      links: [],
                      images: [],
                      linkedItemCodenames: [],
                      linkedItems: [
                        {
                          system: { ...system, codename: '7570d883-51ab-40fc-8409-fed5574eb7dc' },
                          elements: {
                            num2: {
                              type: ElementType.Number,
                              name: 'number element',
                              value: 69,
                            },
                          },
                        },
                      ],
                    } as Elements.RichTextElement,
                  },
                },
              ],
            },
          },
        ],
      };

      const result = await callTestFnc(item, update);

      expect(result).toEqual({
        ...item,
        elements: {
          component: {
            ...item.elements.component,
            linkedItems: [
              {
                ...item.elements.component.linkedItems[0],
                elements: {
                  ...item.elements.component.linkedItems[0].elements,
                  num: { ...item.elements.component.linkedItems[0].elements.num, value: 142 },
                },
              },
            ],
          },
        },
      });
      // The unchanged inner component should be the same object
      expect(result.elements.component.linkedItems[0].elements.inner).toBe(
        item.elements.component.linkedItems[0].elements.inner
      );
    });

    it('Does not cycle infinitely on circular references where the cycle contains the updated item', async () => {
      type ElementsType = {
        el: Elements.LinkedItemsElement;
        el2?: Elements.TextElement;
      };

      const item: IContentItem<ElementsType> = {
        system,
        elements: {
          el: {
            type: ElementType.ModularContent,
            name: 'linked items element',
            value: ['item2'],
            linkedItems: [],
          } as Elements.LinkedItemsElement,
          el2: {
            type: ElementType.Text,
            name: 'text element',
            value: 'original value',
          },
        },
      };

      const item2: IContentItem<ElementsType> = {
        system: { ...system, id: 'd5b7e5c2-5c4d-4e3f-8d2b-7f5f2e3e6f5b', codename: 'item2' },
        elements: {
          el: {
            type: ElementType.ModularContent,
            name: 'linked items element',
            value: [system.codename],
            linkedItems: [item],
          } as Elements.LinkedItemsElement,
        },
      };

      item.elements.el.linkedItems = [item2];

      const update: IUpdateMessageData = {
        item: { id: item.system.id, codename: item.system.codename },
        variant: { id: '87767c98-3d1d-490f-bd19-e0157157d087', codename: item.system.language },
        projectId: '5f53475c-de51-4cef-b373-463d56919cec',
        elements: [
          {
            type: ElementType.Text,
            element: { id: '467dc8c1-4fcb-4adc-a5fc-049d17ee1386', codename: 'el2' },
            data: { value: 'new value' },
          },
        ],
      };

      const result = await callTestFnc(item, update);

      expect(result.elements.el.linkedItems[0].system.codename).toBe(item2.system.codename);
      expect(result.elements.el2).toEqual({ ...item.elements.el2, value: 'new value' } as Elements.TextElement);
    });
    it('Does not cycle infinitely on circular references where the cycle does not contain the updated item', async () => {
      type ElementsType = {
        el: Elements.LinkedItemsElement;
      };

      const item: IContentItem<ElementsType> = {
        system,
        elements: {
          el: {
            type: ElementType.ModularContent,
            name: 'linked items element',
            value: ['item2'],
            linkedItems: [],
          } as Elements.LinkedItemsElement,
        },
      };

      const item2: IContentItem<ElementsType> = {
        system: { ...system, id: 'd5b7e5c2-5c4d-4e3f-8d2b-7f5f2e3e6f5b', codename: 'item2' },
        elements: {
          el: {
            type: ElementType.ModularContent,
            name: 'linked items element',
            value: [system.codename],
            linkedItems: [item],
          } as Elements.LinkedItemsElement,
        },
      };

      item.elements.el.linkedItems = [item2];

      const update: IUpdateMessageData = {
        item: { id: 'f5b69805-f059-4038-883a-ad2d31bc92f5', codename: 'non-existing-item' },
        variant: { id: '87767c98-3d1d-490f-bd19-e0157157d087', codename: 'some-language' },
        projectId: '5f53475c-de51-4cef-b373-463d56919cec',
        elements: [
          {
            type: ElementType.Text,
            element: { id: '467dc8c1-4fcb-4adc-a5fc-049d17ee1386', codename: 'el' },
            data: { value: 'new value' },
          },
        ],
      };

      const result = await callTestFnc(item, update);

      expect(result).toBe(item);
    });
  });
});

describe('applyUpdateOnItemAndLoadLinkedItems', () => {
  it('Uses the provided argument to load newly added linked items in linkedItem and richText elements', async () => {
    const addedItemLinkedItems: IContentItem = {
      system: { ...system, id: 'ae0aedca-08ce-43bf-96aa-c07a4180633a', codename: 'linked_item' },
      elements: {
        num: {
          type: ElementType.Number,
          name: 'number element',
          value: 42,
        },
      },
    };
    const addedItemRichText: IContentItem = {
      system: { ...system, id: '97811c7f-58d1-45ed-8460-593fc8ce5d06', codename: 'rich_item' },
      elements: {
        num: {
          type: ElementType.Text,
          name: 'text element',
          value: 'some value',
        },
      },
    };
    const item: IContentItem = {
      system,
      elements: {
        linked: {
          type: ElementType.ModularContent,
          name: 'linked items element',
          value: [],
          linkedItems: [],
        } as Elements.LinkedItemsElement,
        rich: {
          type: ElementType.RichText,
          name: 'rich text element',
          value: '',
          images: [],
          links: [],
          linkedItems: [],
          linkedItemCodenames: [],
        } as Elements.RichTextElement,
      },
    };
    const update: IUpdateMessageData = {
      item: { id: item.system.id, codename: item.system.codename },
      projectId: 'b281f613-2628-4700-88d0-2dc84d2cdfd1',
      variant: { id: 'b6c2f05d-5491-4387-9d4c-c9b70e660114', codename: item.system.language },
      elements: [
        {
          type: ElementType.ModularContent,
          element: { id: '2e8a2e80-75fe-4ba8-a2ff-d7aa48c0a6d4', codename: 'linked' },
          data: { value: [addedItemLinkedItems.system.codename], linkedItems: [] },
        },
        {
          type: ElementType.RichText,
          element: { id: 'cdf1ced3-b5ee-471d-a498-815b7debe4a4', codename: 'rich' },
          data: {
            value: `<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="${addedItemRichText.system.codename}"></object>`,
            links: [],
            images: [],
            linkedItemCodenames: [addedItemRichText.system.codename],
            linkedItems: [],
          },
        },
      ],
    };

    const newItemsByCodename = new Map([
      [addedItemRichText.system.codename, addedItemRichText],
      [addedItemLinkedItems.system.codename, addedItemLinkedItems],
    ]);
    const result = await applyUpdateOnItemAndLoadLinkedItems(item, update, (cs) =>
      delay(1).then(() =>
        Promise.all(
          cs.flatMap((c) => {
            const addedItem = newItemsByCodename.get(c);
            return addedItem ? [Promise.resolve(addedItem)] : [];
          })
        )
      )
    );

    expect(result.elements.linked).toEqual({
      ...item.elements.linked,
      value: [addedItemLinkedItems.system.codename],
      linkedItems: [addedItemLinkedItems],
    } as Elements.LinkedItemsElement);

    expect(result.elements.rich).toEqual({
      ...item.elements.rich,
      value: `<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="${addedItemRichText.system.codename}"></object>`,
      linkedItemCodenames: [addedItemRichText.system.codename],
      linkedItems: [addedItemRichText],
    } as Elements.RichTextElement);
  });
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
