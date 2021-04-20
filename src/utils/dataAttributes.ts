import { getElementAncestors } from './node';
import {
  IContentComponentClickedMessageData,
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  InsertPosition,
  IPlusRequestMessageData,
  PlusRequestInsertPosition,
} from '../lib/IFrameCommunicatorTypes';
import { getHighlightTypeForElement, HighlightType } from './customElements';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Data-attributes are used to get some Kontent related data from DOM.
 * Data from data-attributes is used to generate smart links or iframe messages to Kontent.
 * However, this data can also be used in rendering (e.g. HTML elements with element codename attribute
 * have highlights).
 */
export enum DataAttribute {
  PlusButtonInsertPosition = 'data-kontent-plus-button-insert-position',
  ElementCodename = 'data-kontent-element-codename',
  ComponentId = 'data-kontent-component-id',
  ItemId = 'data-kontent-item-id',
  LanguageCodename = 'data-kontent-language-codename',
  ProjectId = 'data-kontent-project-id',
}

/**
 * Metadata-attributes are used to get some metadata about some of the SDK features.
 * Metadata is used for SDK inner logic (such as rendering, event handling, etc.).
 */
export enum MetadataAttribute {
  PlusButton = 'data-kontent-plus-button',
  PlusButtonRenderPosition = 'data-kontent-plus-button-render-position',
}

interface IDataAttributesParserToken {
  readonly key: string; // will be used to store parsed values (key -> value)
  readonly dataAttributes: DataAttribute[]; // attributes that should be checked for the current token
  readonly optional?: boolean; // could this token be ignored
}

type DataAttributesParserPattern = Array<IDataAttributesParserToken>;

const baseParserPattern: DataAttributesParserPattern = [
  { key: DataAttribute.LanguageCodename, dataAttributes: [DataAttribute.LanguageCodename] },
  { key: DataAttribute.ProjectId, dataAttributes: [DataAttribute.ProjectId] },
];

const itemEditButtonParserPattern: DataAttributesParserPattern = [
  { key: DataAttribute.ItemId, dataAttributes: [DataAttribute.ItemId] },
  ...baseParserPattern,
];

const componentEditButtonParserPattern: DataAttributesParserPattern = [
  { key: DataAttribute.ComponentId, dataAttributes: [DataAttribute.ComponentId] },
  ...itemEditButtonParserPattern,
];

const elementEditButtonParserPattern: DataAttributesParserPattern = [
  { key: DataAttribute.ElementCodename, dataAttributes: [DataAttribute.ElementCodename] },
  { key: DataAttribute.ComponentId, dataAttributes: [DataAttribute.ComponentId], optional: true },
  ...itemEditButtonParserPattern,
];

export type EditButtonClickedData =
  | IContentItemClickedMessageData
  | IContentComponentClickedMessageData
  | IElementClickedMessageData;

export function parseEditButtonDataAttributes(target: HTMLElement): DeepPartial<EditButtonClickedData> {
  const type = getHighlightTypeForElement(target);
  const pattern = getEditButtonDataAttributesPattern(type);
  const parsed = parseDataAttributes(pattern, target);

  return {
    projectId: parsed.get(DataAttribute.ProjectId),
    languageCodename: parsed.get(DataAttribute.LanguageCodename),
    itemId: parsed.get(DataAttribute.ItemId),
    ...(parsed.has(DataAttribute.ComponentId) && { contentComponentId: parsed.get(DataAttribute.ComponentId) }),
    ...(parsed.has(DataAttribute.ElementCodename) && { elementCodename: parsed.get(DataAttribute.ElementCodename) }),
  };
}

function getEditButtonDataAttributesPattern(type: HighlightType): DataAttributesParserPattern {
  switch (type) {
    case HighlightType.Element:
      return elementEditButtonParserPattern;
    case HighlightType.ContentComponent:
      return componentEditButtonParserPattern;
    case HighlightType.ContentItem:
      return itemEditButtonParserPattern;
    default:
      return baseParserPattern;
  }
}

const basePlusButtonParserPattern: DataAttributesParserPattern = [
  { key: 'elementCodename', dataAttributes: [DataAttribute.ElementCodename] },
  { key: 'componentId', dataAttributes: [DataAttribute.ComponentId], optional: true },
  { key: 'itemId', dataAttributes: [DataAttribute.ItemId] },
  { key: 'languageCodename', dataAttributes: [DataAttribute.LanguageCodename] },
  { key: 'projectId', dataAttributes: [DataAttribute.ProjectId] },
];

const relativePlusButtonParserPattern: DataAttributesParserPattern = [
  { key: 'placement', dataAttributes: [DataAttribute.PlusButtonInsertPosition], optional: true },
  { key: 'targetId', dataAttributes: [DataAttribute.ComponentId, DataAttribute.ItemId] },
  ...basePlusButtonParserPattern,
];

const fixedPlusButtonParserPattern: DataAttributesParserPattern = [
  { key: 'placement', dataAttributes: [DataAttribute.PlusButtonInsertPosition], optional: true },
  ...basePlusButtonParserPattern,
];

export function parsePlusButtonDataAttributes(target: HTMLElement): DeepPartial<IPlusRequestMessageData> {
  const position = target.getAttribute(DataAttribute.PlusButtonInsertPosition);
  const pattern = getPlusButtonDataAttributesPattern(position);
  const parsed = parseDataAttributes(pattern, target);

  return {
    projectId: parsed.get('projectId'),
    languageCodename: parsed.get('languageCodename'),
    itemId: parsed.get('itemId'),
    ...(parsed.get('componentId') && { componentId: parsed.get('componentId') }),
    elementCodename: parsed.get('elementCodename'),
    insertPosition: getPlusButtonInsertPosition(parsed),
  };
}

function getPlusButtonDataAttributesPattern(position: string | null): DataAttributesParserPattern {
  switch (position) {
    case InsertPosition.End:
    case InsertPosition.Start:
      return fixedPlusButtonParserPattern;
    case InsertPosition.After:
    case InsertPosition.Before:
    default:
      return relativePlusButtonParserPattern;
  }
}

function getPlusButtonInsertPosition(parsed: ReadonlyMap<string, string>): Partial<PlusRequestInsertPosition> {
  const placement = (parsed.get('placement') as InsertPosition) ?? InsertPosition.After;
  const targetId = parsed.get('targetId');

  switch (placement) {
    case InsertPosition.End:
    case InsertPosition.Start:
      return { placement };
    case InsertPosition.Before:
    case InsertPosition.After:
      return { placement, targetId };
    default:
      return { targetId, placement: InsertPosition.After };
  }
}

/**
 * Parse data-attributes starting from target to its ancestors using the parsing pattern.
 *
 * @param {DataAttributesParserPattern} pattern
 * @param {HTMLElement} startFrom
 * @returns {ReadonlyMap<string, string>}
 */
function parseDataAttributes(
  pattern: DataAttributesParserPattern,
  startFrom: HTMLElement
): ReadonlyMap<string, string> {
  const parsed = new Map();

  console.group('Parse data-attributes for ', startFrom);

  const elements = [startFrom, ...getElementAncestors(startFrom)];

  console.log('Elements:', elements);
  console.log('Pattern: ', pattern);

  for (const element of elements) {
    const takenDataAttributes = new Set();

    console.group('Checking ', element);

    for (const token of pattern) {
      const { key, dataAttributes, optional } = token;

      console.groupCollapsed(`Looking for '${key}' [${dataAttributes}]`);
      const [dataAttribute, value] = findDataAttribute(element, dataAttributes);

      console.log('Value: ', value);
      console.log('Already parsed: ', parsed.has(key));
      console.log('Data-attribute taken by previous token: ', takenDataAttributes.has(dataAttribute));

      if (!value && !parsed.has(key) && !optional) {
        console.log('[Result]: Required data-attribute is missing.');
        console.groupEnd();
        // Required data-attribute is missing. There is no point in continuing parsing data-attributes
        // on current element, we should move to the next ancestor.
        break;
      }

      if (parsed.has(key)) {
        console.log('[Result]: This data-attribute has already been parsed in some of the previous steps.');
        console.groupEnd();
        // This key has already been parsed in some of the previous steps.
        continue;
      }

      if (!value) {
        console.log('[Result]: This data attribute has no value.');
        console.groupEnd();
        // Attribute has no value.
        continue;
      }

      if (takenDataAttributes.has(dataAttribute)) {
        console.log('[Result]: A previous token has already used this data-attribute.');
        console.groupEnd();
        // A previous token has already used this data-attribute.
        continue;
      }

      const currentTokenIndex = pattern.indexOf(token);
      const tokensWithHigherPriority = pattern.slice(currentTokenIndex, pattern.length);
      const areSomeTokensWithHigherPriorityParsed = tokensWithHigherPriority.some((token) => parsed.has(token.key));

      // If some higher token has already been parsed, it can mean two things:
      // a) Current data-attribute is optional and is not related to the current scope. In that case, it can be ignored.
      // b) Parsed data is related to some lower scope (or invalid) and should be cleared.
      if (areSomeTokensWithHigherPriorityParsed) {
        if (optional) {
          console.log('[Result]: Attribute is not related to the current scope.');
          console.groupEnd();
          continue;
        }

        for (const token of tokensWithHigherPriority) {
          parsed.delete(token.key);
        }
      }

      parsed.set(token.key, value);
      takenDataAttributes.add(dataAttribute);

      console.log('[Result]: Attribute successfully parsed!');
      console.groupEnd();
    }

    console.log('Parsed so far: ', parsed);
    console.groupEnd();
  }

  console.groupEnd();
  console.log('[Result]: ', parsed);

  return parsed;
}

function findDataAttribute(
  element: HTMLElement,
  dataAttributes: DataAttribute[]
): [DataAttribute, string] | [null, null] {
  for (const attribute of dataAttributes) {
    const value = element.getAttribute(attribute);
    if (value) {
      return [attribute, value];
    }
  }

  return [null, null];
}
