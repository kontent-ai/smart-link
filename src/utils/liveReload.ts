import {
  type ElementModels,
  type Elements,
  ElementType,
  type IContentItem,
  type IContentItemElements,
} from "@kontent-ai/delivery-sdk";
import type { IUpdateMessageData } from "../lib/IFrameCommunicatorTypes";
import type {
  CustomElementUpdateData,
  DatetimeElementUpdateData,
  ElementUpdateData,
  LinkedItemsElementUpdateData,
  RichTextElementUpdateData,
} from "../models/ElementUpdateData";
import {
  applyOnOptionallyAsync,
  chainOptionallyAsync,
  createOptionallyAsync,
  evaluateOptionallyAsync,
  mergeOptionalAsyncs,
  type OptionallyAsync,
} from "./liveReload/optionallyAsync";

/**
 * Applies an update to a content item synchronously.
 * This function takes a content item and an update message, and returns a new content item with the updates applied.
 * The update is applied recursively to all linked items within the content item.
 */
export const applyUpdateOnItem = <Elements extends IContentItemElements>(
  item: IContentItem<Elements>,
  update: IUpdateMessageData,
): IContentItem<Elements> =>
  evaluateOptionallyAsync(applyUpdateOnItemOptionallyAsync(item, update), null);

/**
 * Applies an update to a content item asynchronously and loads newly added linked items.
 * This function takes a content item, an update message, and a function to fetch linked items,
 * and returns a promise that resolves to a new content item with the updates applied.
 * The update is applied recursively to all linked items within the content item.
 */
export const applyUpdateOnItemAndLoadLinkedItems = async <Elements extends IContentItemElements>(
  item: IContentItem<Elements>,
  update: IUpdateMessageData,
  fetchItems: (itemCodenames: ReadonlyArray<string>) => Promise<ReadonlyArray<IContentItem>>,
): Promise<IContentItem<Elements>> =>
  Promise.resolve(
    evaluateOptionallyAsync(applyUpdateOnItemOptionallyAsync(item, update), fetchItems),
  );

const applyUpdateOnItemOptionallyAsync = <Elements extends IContentItemElements>(
  item: IContentItem<Elements>,
  update: InternalUpdateMessage,
  updatedItem: IContentItem<Elements> | null = null,
  processedItemsPath: ReadonlyArray<string> = [],
): OptionallyAsync<IContentItem<Elements>> => {
  const shouldApplyOnThisItem =
    item.system.codename === update.item.codename &&
    item.system.language === update.variant.codename;

  const newUpdatedItem = !updatedItem && shouldApplyOnThisItem ? { ...item } : updatedItem; // We will mutate its elements to new values before returning. This is necesary to preserve cyclic dependencies between items without infinite recursion.

  const updatedElements = mergeOptionalAsyncs(
    Object.entries(item.elements).map(([elementCodename, element]) => {
      const matchingUpdate = update.elements.find((u) => u.element.codename === elementCodename);

      if (shouldApplyOnThisItem && matchingUpdate) {
        return applyOnOptionallyAsync(
          applyUpdateOnElement(element, matchingUpdate),
          (newElement) => [elementCodename, newElement] as const,
        );
      }

      if (element.type === ElementType.ModularContent || element.type === ElementType.RichText) {
        const typedItemElement = element as Elements.LinkedItemsElement | Elements.RichTextElement;

        return applyOnOptionallyAsync(
          mergeOptionalAsyncs(
            typedItemElement.linkedItems.map((i) => {
              if (updatedItem?.system.codename === i.system.codename) {
                // we closed the cycle and on the updated item and need to connect to the new item
                return createOptionallyAsync(() => updatedItem);
              }
              return closesCycleWithoutUpdate(
                processedItemsPath,
                i.system.codename,
                updatedItem?.system.codename ?? null,
              )
                ? createOptionallyAsync(() => i) // we found a cycle that doesn't need any update so we just ignore it
                : applyUpdateOnItemOptionallyAsync(i, update, newUpdatedItem, [
                    ...processedItemsPath,
                    i.system.codename,
                  ]);
            }),
          ),
          (linkedItems) => {
            return linkedItems.some(
              (newItem, index) => newItem !== typedItemElement.linkedItems[index],
            )
              ? ([elementCodename, { ...typedItemElement, linkedItems }] as const)
              : ([elementCodename, typedItemElement] as const);
          },
        );
      }

      return createOptionallyAsync(() => [elementCodename, element] as const);
    }),
  );

  return applyOnOptionallyAsync(updatedElements, (newElements) => {
    if (newUpdatedItem?.system.codename === item.system.codename) {
      newUpdatedItem.elements = Object.fromEntries(newElements) as Elements;
      return newUpdatedItem;
    }

    return newElements.some(([codename, newEl]) => item.elements[codename] !== newEl)
      ? { ...item, elements: Object.fromEntries(newElements) as Elements }
      : item;
  });
};

const closesCycleWithoutUpdate = (
  path: ReadonlyArray<string>,
  nextItem: string,
  updatedItem: string | null,
) => {
  const cycleStartIndex = path.indexOf(nextItem);

  return cycleStartIndex !== -1 && (!updatedItem || cycleStartIndex > path.indexOf(updatedItem));
};

const applyUpdateOnElement = (
  element: ElementModels.IElement<unknown>,
  update: InternalUpdateElementMessage,
): OptionallyAsync<ElementModels.IElement<unknown>> => {
  switch (update.type) {
    case ElementType.Text:
    case ElementType.Number:
    case ElementType.UrlSlug:
      return createOptionallyAsync(() =>
        applySimpleElement(
          element as Elements.TextElement | Elements.NumberElement | Elements.UrlSlugElement,
          update,
        ),
      );
    case ElementType.ModularContent:
      return applyLinkedItemsElement(element as Elements.LinkedItemsElement, update);
    case ElementType.RichText:
      return applyRichTextElement(element as Elements.RichTextElement, update);
    case ElementType.MultipleChoice:
      return createOptionallyAsync(() =>
        applyArrayElement(
          element as Elements.MultipleChoiceElement,
          update,
          (o1, o2) => o1?.codename === o2?.codename,
        ),
      );
    case ElementType.DateTime:
      return createOptionallyAsync(() =>
        applyDateTimeElement(element as Elements.DateTimeElement, update),
      );
    case ElementType.Asset:
      return createOptionallyAsync(() =>
        applyArrayElement(
          element as Elements.AssetsElement,
          update,
          (a1, a2) => a1?.url === a2?.url,
        ),
      );
    case ElementType.Taxonomy:
      return createOptionallyAsync(() =>
        applyArrayElement(
          element as Elements.TaxonomyElement,
          update,
          (t1, t2) => t1?.codename === t2?.codename,
        ),
      );
    case ElementType.Custom:
      return createOptionallyAsync(() =>
        applyCustomElement(element as Elements.CustomElement, update),
      );
    default:
      return createOptionallyAsync(() => element);
  }
};

type ElementUpdate<El extends Readonly<{ value: unknown }>> = Readonly<{
  data: Readonly<{ value: El["value"] }>;
}>;

const applyCustomElement = (
  element: Elements.CustomElement<unknown>,
  update: CustomElementUpdateData,
): Elements.CustomElement<unknown> =>
  typeof element.value === "string" && element.value !== update.data.value
    ? { ...element, value: update.data.value }
    : element;

const applyDateTimeElement = (
  element: Elements.DateTimeElement,
  update: DatetimeElementUpdateData,
): Elements.DateTimeElement =>
  element.value === update.data.value && element.displayTimeZone === update.data.displayTimeZone
    ? element
    : { ...element, value: update.data.value, displayTimeZone: update.data.displayTimeZone };

const applySimpleElement = <Element extends Readonly<{ value: unknown }>>(
  element: Element,
  update: ElementUpdate<Element>,
): Element =>
  element.value === update.data.value ? element : { ...element, value: update.data.value };

const applyArrayElement = <
  ArrayElement,
  Element extends Readonly<{ value: ReadonlyArray<ArrayElement> }>,
>(
  element: Element,
  update: ElementUpdate<Element>,
  areSame: (el1: ArrayElement | undefined, el2: ArrayElement | undefined) => boolean,
): Element =>
  element.value.length === update.data.value.length &&
  element.value.every((el, i) => areSame(el, update.data.value[i]))
    ? element
    : { ...element, value: update.data.value };

const applyLinkedItemsElement = (
  element: Elements.LinkedItemsElement,
  update: LinkedItemsElementUpdateData,
): OptionallyAsync<Elements.LinkedItemsElement> => {
  if (areLinkedItemsSame(element.value, update.data.value)) {
    return createOptionallyAsync(() => element);
  }

  return applyOnOptionallyAsync(
    updateLinkedItems(update.data.value, element.linkedItems),
    (linkedItems) => ({
      ...element,
      value: update.data.value,
      linkedItems,
    }),
  );
};

const applyRichTextElement = (
  element: Elements.RichTextElement,
  update: RichTextElementUpdateData,
): OptionallyAsync<Elements.RichTextElement> => {
  if (areRichTextElementsSame(element, update.data)) {
    return createOptionallyAsync(() => element);
  }

  const withItems = applyOnOptionallyAsync(
    updateLinkedItems(
      update.data.linkedItemCodenames,
      update.data.linkedItems
        .filter((i) => !element.linkedItems.find((u) => u.system.codename === i.system.codename))
        .concat(element.linkedItems),
    ),
    (linkedItems) => ({
      ...element,
      value: update.data.value,
      linkedItemCodenames: update.data.linkedItemCodenames,
      links: update.data.links,
      images: update.data.images,
      linkedItems,
    }),
  );

  return chainOptionallyAsync(withItems, (el) =>
    applyOnOptionallyAsync(
      updateComponents(update.data.linkedItems, el.linkedItems),
      (linkedItems) => ({
        ...el,
        linkedItems,
      }),
    ),
  );
};

const areItemsSame = (item1: IContentItem, item2: IContentItem): boolean =>
  item1.system.codename === item2.system.codename &&
  item1.system.language === item2.system.language &&
  Object.entries(item1.elements).every(([codename, el1]) =>
    areElementsSame(el1, item2.elements[codename]),
  );

const areElementsSame = (
  el1: ElementModels.IElement<unknown>,
  el2: ElementModels.IElement<unknown>,
): boolean => {
  switch (el1.type) {
    case ElementType.Text:
    case ElementType.Number:
    case ElementType.UrlSlug:
      return el1.value === el2.value;
    case ElementType.MultipleChoice: {
      const typedElement1 = el1 as Elements.MultipleChoiceElement;
      const typedElement2 = el2 as Elements.MultipleChoiceElement;
      return (
        typedElement1.value.length === typedElement2.value.length &&
        typedElement1.value.every(
          (option, i) => option.codename === typedElement2.value[i]?.codename,
        )
      );
    }
    case ElementType.DateTime: {
      const typedElement1 = el1 as Elements.DateTimeElement;
      const typedElement2 = el2 as Elements.DateTimeElement;
      return (
        typedElement1.value === typedElement2.value &&
        typedElement1.displayTimeZone === typedElement2.displayTimeZone
      );
    }
    case ElementType.RichText: {
      const typedElement1 = el1 as Elements.RichTextElement;
      const typedElement2 = el2 as Elements.RichTextElement;
      return areRichTextElementsSame(typedElement1, typedElement2);
    }
    case ElementType.Taxonomy: {
      const typedElement1 = el1 as Elements.TaxonomyElement;
      const typedElement2 = el2 as Elements.TaxonomyElement;
      return (
        typedElement1.value.length === typedElement2.value.length &&
        typedElement1.value.every((term, i) => term.codename === typedElement2.value[i].codename)
      );
    }
    case ElementType.Asset: {
      const typedElement1 = el1 as Elements.AssetsElement;
      const typedElement2 = el2 as Elements.AssetsElement;
      return (
        typedElement1.value.length === typedElement2.value.length &&
        typedElement1.value.every((asset, i) => asset.url === typedElement2.value[i].url)
      );
    }
    case ElementType.ModularContent: {
      const typedElement1 = el1 as Elements.LinkedItemsElement;
      const typedElement2 = el2 as Elements.LinkedItemsElement;
      return (
        typedElement1.value.length === typedElement2.value.length &&
        typedElement1.value.every((item, i) => item === typedElement2.value[i])
      );
    }
    case ElementType.Custom:
      return el1.value === el2.value;
    case ElementType.Unknown:
      throw new Error();
  }
};

const areRichTextElementsSame = (
  el1: Omit<Elements.RichTextElement, "name" | "type">,
  el2: Omit<Elements.RichTextElement, "name" | "type">,
): boolean =>
  el1.value === el2.value &&
  el1.links.length === el2.links.length &&
  el1.links.every((link, i) => link.codename === el2.links[i].codename) &&
  el1.images.length === el2.images.length &&
  el1.images.every((image, i) => image.url === el2.images[i].url) &&
  el1.linkedItemCodenames.length === el2.linkedItemCodenames.length &&
  el1.linkedItemCodenames.every((codename, i) => codename === el2.linkedItemCodenames[i]) &&
  el1.linkedItems.length === el2.linkedItems.length &&
  el1.linkedItems.every((item, i) => areItemsSame(item, el2.linkedItems[i]));

const updateComponents = (
  newItems: ReadonlyArray<IContentItem>,
  oldItems: ReadonlyArray<IContentItem>,
) =>
  mergeOptionalAsyncs(
    oldItems.map((item) => {
      const newItem = newItems.find((i) => i.system.codename === item.system.codename);

      return newItem
        ? applyUpdateOnItemOptionallyAsync(item, convertItemToUpdate(newItem))
        : createOptionallyAsync(() => item);
    }),
  );

const updateLinkedItems = (
  newValue: ReadonlyArray<string>,
  loadedItems: ReadonlyArray<IContentItem>,
) => {
  const itemsByCodename = new Map(loadedItems.map((i) => [i.system.codename, i]));
  const newLinkedItems = newValue.map((codename) => itemsByCodename.get(codename) ?? codename);
  const itemsToFetch = newLinkedItems.filter(isString);

  return applyOnOptionallyAsync(
    createOptionallyAsync(async (fetchItems) =>
      fetchItems && itemsToFetch.length ? await fetchItems(itemsToFetch) : [],
    ),
    (fetchedItemsArray) => {
      const fetchedItems = new Map(fetchedItemsArray.map((i) => [i.system.codename, i] as const));

      return newLinkedItems
        .map((codename) => (isString(codename) ? (fetchedItems.get(codename) ?? null) : codename))
        .filter(notNull);
    },
  );
};

const areLinkedItemsSame = (items1: ReadonlyArray<string>, items2: ReadonlyArray<string>) =>
  items1.length === items2.length && items1.every((codename, index) => codename === items2[index]);

const notNull = <T>(value: T | null): value is T => value !== null;
const isString = (value: unknown): value is string => typeof value === "string";

// Simplified IUpdateMessageData to make it possible converting IContentItem into it
type InternalUpdateMessage = Readonly<{
  variant: Readonly<{ codename: string }>;
  item: Readonly<{ codename: string }>;
  elements: ReadonlyArray<InternalUpdateElementMessage>;
}>;

type InternalUpdateElementMessage = Readonly<{ element: Readonly<{ codename: string }> }> &
  ElementUpdateData;

const convertItemToUpdate = (item: IContentItem): InternalUpdateMessage => ({
  variant: { codename: item.system.language },
  item: { codename: item.system.codename },
  elements: Object.entries(item.elements).map(([elCodename, el]) => {
    switch (el.type) {
      case ElementType.Number:
      case ElementType.UrlSlug:
      case ElementType.MultipleChoice:
      case ElementType.Custom:
      case ElementType.Asset:
      case ElementType.Text: {
        return {
          element: { codename: elCodename },
          type: el.type,
          data: el,
        };
      }
      case ElementType.DateTime: {
        return {
          element: { codename: elCodename },
          type: el.type,
          data: el as Elements.DateTimeElement,
        };
      }
      case ElementType.RichText: {
        return {
          element: { codename: elCodename },
          type: el.type,
          data: el as Elements.RichTextElement,
        };
      }
      case ElementType.Taxonomy: {
        return {
          element: { codename: elCodename },
          type: el.type,
          data: el as Elements.TaxonomyElement,
        };
      }
      case ElementType.ModularContent: {
        return {
          element: { codename: elCodename },
          type: el.type,
          data: el as Elements.LinkedItemsElement,
        };
      }
      case ElementType.Unknown:
        throw new Error(`Cannot update element of type ${el.type}.`);
      default:
        throw new Error(`Unknown element type`);
    }
  }),
});
