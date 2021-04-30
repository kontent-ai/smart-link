import { getElementAncestors } from './node';
import {
  IContentComponentClickedMessageData,
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  InsertPositionPlacement,
  IPlusInitialMessageData,
  InsertPosition,
} from '../lib/IFrameCommunicatorTypes';
import { getHighlightTypeForElement, HighlightType } from './customElements';
import { Logger } from '../lib/Logger';

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

enum ParserTokenKey {
  ProjectId = 'projectId',
  LanguageCodename = 'languageCodename',
  ItemId = 'itemId',
  ComponentId = 'contentComponentId',
  ElementCodename = 'elementCodename',
  Placement = 'placement',
  TargetId = 'targetId',
}

interface IDataAttributesParserToken {
  readonly key: ParserTokenKey; // will be used to store parsed values (key -> value)
  readonly dataAttributes: DataAttribute[]; // attributes that should be checked for the current token
  readonly optional?: boolean; // could this token be ignored
}

type DataAttributesParserPattern = Array<IDataAttributesParserToken>;

const baseParserPattern: DataAttributesParserPattern = [
  { key: ParserTokenKey.LanguageCodename, dataAttributes: [DataAttribute.LanguageCodename] },
  { key: ParserTokenKey.ProjectId, dataAttributes: [DataAttribute.ProjectId] },
];

const itemEditButtonParserPattern: DataAttributesParserPattern = [
  { key: ParserTokenKey.ItemId, dataAttributes: [DataAttribute.ItemId] },
  ...baseParserPattern,
];

const componentEditButtonParserPattern: DataAttributesParserPattern = [
  { key: ParserTokenKey.ComponentId, dataAttributes: [DataAttribute.ComponentId] },
  ...itemEditButtonParserPattern,
];

const elementEditButtonParserPattern: DataAttributesParserPattern = [
  { key: ParserTokenKey.ElementCodename, dataAttributes: [DataAttribute.ElementCodename] },
  { key: ParserTokenKey.ComponentId, dataAttributes: [DataAttribute.ComponentId], optional: true },
  ...itemEditButtonParserPattern,
];

const basePlusButtonParserPattern: DataAttributesParserPattern = [
  { key: ParserTokenKey.ElementCodename, dataAttributes: [DataAttribute.ElementCodename] },
  { key: ParserTokenKey.ComponentId, dataAttributes: [DataAttribute.ComponentId], optional: true },
  { key: ParserTokenKey.ItemId, dataAttributes: [DataAttribute.ItemId] },
  ...baseParserPattern,
];

const relativePlusButtonParserPattern: DataAttributesParserPattern = [
  { key: ParserTokenKey.Placement, dataAttributes: [DataAttribute.PlusButtonInsertPosition], optional: true },
  { key: ParserTokenKey.TargetId, dataAttributes: [DataAttribute.ComponentId, DataAttribute.ItemId] },
  ...basePlusButtonParserPattern,
];

const fixedPlusButtonParserPattern: DataAttributesParserPattern = [
  { key: ParserTokenKey.Placement, dataAttributes: [DataAttribute.PlusButtonInsertPosition], optional: true },
  ...basePlusButtonParserPattern,
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
    projectId: parsed.get(ParserTokenKey.ProjectId),
    languageCodename: parsed.get(ParserTokenKey.LanguageCodename),
    itemId: parsed.get(ParserTokenKey.ItemId),
    ...(parsed.has(ParserTokenKey.ComponentId) && { contentComponentId: parsed.get(ParserTokenKey.ComponentId) }),
    ...(parsed.has(ParserTokenKey.ElementCodename) && { elementCodename: parsed.get(ParserTokenKey.ElementCodename) }),
  };
}

export function parsePlusButtonDataAttributes(target: HTMLElement): DeepPartial<IPlusInitialMessageData> {
  const position = target.getAttribute(DataAttribute.PlusButtonInsertPosition);
  const pattern = getPlusButtonDataAttributesPattern(position);
  const parsed = parseDataAttributes(pattern, target);

  return {
    projectId: parsed.get(ParserTokenKey.ProjectId),
    languageCodename: parsed.get(ParserTokenKey.LanguageCodename),
    itemId: parsed.get(ParserTokenKey.ItemId),
    ...(parsed.get(ParserTokenKey.ComponentId) && { contentComponentId: parsed.get(ParserTokenKey.ComponentId) }),
    elementCodename: parsed.get(ParserTokenKey.ElementCodename),
    insertPosition: getPlusButtonInsertPosition(parsed),
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

function getPlusButtonDataAttributesPattern(position: string | null): DataAttributesParserPattern {
  switch (position) {
    case InsertPositionPlacement.End:
    case InsertPositionPlacement.Start:
      return fixedPlusButtonParserPattern;
    case InsertPositionPlacement.After:
    case InsertPositionPlacement.Before:
    default:
      return relativePlusButtonParserPattern;
  }
}

function getPlusButtonInsertPosition(parsed: ReadonlyMap<ParserTokenKey, string>): Partial<InsertPosition> {
  const placement = (parsed.get(ParserTokenKey.Placement) as InsertPositionPlacement) ?? InsertPositionPlacement.After;
  const targetId = parsed.get(ParserTokenKey.TargetId);

  switch (placement) {
    case InsertPositionPlacement.End:
    case InsertPositionPlacement.Start:
      return { placement };
    case InsertPositionPlacement.Before:
    case InsertPositionPlacement.After:
      return { placement, targetId };
    default:
      return { targetId, placement: InsertPositionPlacement.After };
  }
}

/**
 * Parse data-attributes starting from target to its ancestors using the parsing pattern.
 *
 * @param {DataAttributesParserPattern} pattern
 * @param {HTMLElement} startFrom
 * @returns {ReadonlyMap<ParserTokenKey, string>}
 */
function parseDataAttributes(
  pattern: DataAttributesParserPattern,
  startFrom: HTMLElement
): ReadonlyMap<ParserTokenKey, string> {
  const parsed = new Map();

  Logger.debugGroup('Parse data-attributes starting with ', startFrom);

  const elements = [startFrom, ...getElementAncestors(startFrom)];

  Logger.debug('Elements that will be parsed: ', elements);
  Logger.debug('Parsing pattern: ', pattern);

  for (const element of elements) {
    const takenDataAttributes = new Set();

    Logger.debugGroup('Checking data-attributes on ', element);

    for (const token of pattern) {
      const { key, dataAttributes, optional } = token;

      Logger.debugGroupCollapsed(`Looking for '${key}' [${dataAttributes}]`);
      const [dataAttribute, value] = findDataAttribute(element, dataAttributes);

      Logger.debug('Value: ', value);
      Logger.debug('Already parsed: ', parsed.has(key));
      Logger.debug('Already taken by previous token: ', takenDataAttributes.has(dataAttribute));

      if (!value && !parsed.has(key) && !optional) {
        Logger.debug('[Result]: Required data-attribute is missing.');
        Logger.debugGroupEnd();
        // Required data-attribute is missing. There is no point in continuing parsing data-attributes
        // on current element, we should move to the next ancestor.
        break;
      }

      if (parsed.has(key)) {
        Logger.debug('[Result]: This data-attribute has already been parsed in some of the previous steps.');
        Logger.debugGroupEnd();
        continue;
      }

      if (!value) {
        Logger.debug('[Result]: This data attribute has no value.');
        Logger.debugGroupEnd();
        continue;
      }

      if (takenDataAttributes.has(dataAttribute)) {
        Logger.debug('[Result]: A previous token has already used this data-attribute.');
        Logger.debugGroupEnd();
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
          Logger.debug('[Result]: Attribute is not related to the current scope.');
          Logger.debugGroupEnd();
          continue;
        }

        for (const token of tokensWithHigherPriority) {
          parsed.delete(token.key);
        }
      }

      parsed.set(token.key, value);
      takenDataAttributes.add(dataAttribute);

      Logger.debug('[Result]: Attribute successfully parsed!');
      Logger.debugGroupEnd();
    }

    Logger.debug('Values parsed so far: ', parsed);
    Logger.debugGroupEnd();
  }

  Logger.debugGroupEnd();
  Logger.debug('[Result]: ', parsed);

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
