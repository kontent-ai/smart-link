import {
  IAddButtonInitialMessageData,
  IContentComponentClickedMessageData,
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  InsertPosition,
  InsertPositionPlacement,
} from '../../lib/IFrameCommunicatorTypes';
import { DataAttribute } from './attributes';
import { DeepPartial } from '../typeUtils';
import { getHighlightTypeForElement, HighlightType } from './elementHighlight';
import { getElementAncestors } from '../domElement';
import { Logger } from '../../lib/Logger';

export type EditButtonClickedData =
  | IContentItemClickedMessageData
  | IContentComponentClickedMessageData
  | IElementClickedMessageData;

type ParserTokenKey =
  | 'projectId'
  | 'languageCodename'
  | 'itemId'
  | 'contentComponentId'
  | 'elementCodename'
  | 'placement'
  | 'targetId';

type IDataAttributesParserToken = Readonly<{
  key: ParserTokenKey;
  dataAttributes: DataAttribute[]; //  Attributes that should be checked for the current token (logical OR - any of these attributes can satisfy the token)
  optional?: boolean;
}>;

/**
 * Represents a pattern of tokens to parse data attributes.
 * Tokens have precedence in the hierarchy - tokens appearing later in the array
 * can appear in upper elements than earlier ones.
 *
 * EXAMPLE: projectId can be specified in higher element than itemId
 */
type DataAttributesParserPattern = ReadonlyArray<IDataAttributesParserToken>;

/**
 * Parses data attributes from an HTML element to extract edit button information.
 * The function determines the type of element being edited (element, component, or item)
 * and extracts relevant data attributes based on that type.
 */
export function parseEditButtonDataAttributes(target: HTMLElement): DeepPartial<EditButtonClickedData> {
  const type = getHighlightTypeForElement(target);
  const pattern = getEditButtonDataAttributesPattern(type);
  const parsed = parseDataAttributes(pattern, target);

  return {
    projectId: parsed.get('projectId'),
    languageCodename: parsed.get('languageCodename'),
    itemId: parsed.get('itemId'),
    ...(parsed.has('contentComponentId') && { contentComponentId: parsed.get('contentComponentId') }),
    ...(parsed.has('elementCodename') && { elementCodename: parsed.get('elementCodename') }),
  };
}

/**
 * Parses data attributes from an HTML element to extract add button information.
 * The function determines the insert position type (fixed or relative) and extracts
 * relevant data attributes based on that type.
 */
export function parseAddButtonDataAttributes(target: HTMLElement): DeepPartial<IAddButtonInitialMessageData> {
  const position = target.getAttribute(DataAttribute.AddButtonInsertPosition);
  const pattern = getAddButtonDataAttributesPattern(position);
  const parsed = parseDataAttributes(pattern, target);

  return {
    projectId: parsed.get('projectId'),
    languageCodename: parsed.get('languageCodename'),
    itemId: parsed.get('itemId'),
    ...(parsed.get('contentComponentId') && { contentComponentId: parsed.get('contentComponentId') }),
    elementCodename: parsed.get('elementCodename'),
    insertPosition: getAddButtonInsertPosition(parsed),
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

function getAddButtonDataAttributesPattern(position: string | null): DataAttributesParserPattern {
  switch (position) {
    case InsertPositionPlacement.End:
    case InsertPositionPlacement.Start:
      return fixedAddButtonParserPattern;
    case InsertPositionPlacement.After:
    case InsertPositionPlacement.Before:
    default:
      return relativeAddButtonParserPattern;
  }
}

function getAddButtonInsertPosition(parsed: ReadonlyMap<ParserTokenKey, string>): Partial<InsertPosition> {
  const placement = (parsed.get('placement') as InsertPositionPlacement) ?? InsertPositionPlacement.After;
  const targetId = parsed.get('targetId');

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
 * Parses data attributes from an HTML element and its ancestors according to a specified pattern.
 * The function traverses up the DOM tree starting from the given element, looking for data attributes
 * that match the pattern. It respects token precedence and optionality rules defined in the pattern.
 */
function parseDataAttributes(
  pattern: DataAttributesParserPattern,
  startFrom: HTMLElement
): ReadonlyMap<ParserTokenKey, string> {
  const elements = [startFrom, ...getElementAncestors(startFrom)];

  Logger.debugGroup('Parse data-attributes starting with ', startFrom);
  Logger.debug('Elements that will be parsed: ', elements);
  Logger.debug('Parsing pattern: ', pattern);

  const parsed = elements.reduce((acc, element) => {
    Logger.debugGroup('Checking data-attributes on ', element);
    for (const [index, token] of pattern.entries()) {
      Logger.debugGroupCollapsed(`Looking for '${token.key}' [${token.dataAttributes}]`);
      if (acc.has(token.key) || (token.optional && pattern.slice(index + 1).some((t) => acc.has(t.key)))) {
        Logger.debug(
          'This data-attribute has already been parsed in some of the previous elements or is optional and a higher-precedence token was parsed.',
          acc.has(token.key)
        );
        Logger.debugGroupEnd();
        continue;
      }

      const [dataAttribute, value] = findDataAttribute(element, token.dataAttributes);
      Logger.debug('Value: ', value);

      if (!value) {
        if (token.optional) {
          continue;
        }
        Logger.debug(`Required data-attribute '${dataAttribute}' is missing.`);
        Logger.debugGroupEnd();
        break; // Required data-attribute is missing. As other tokens have higher precedence, we can stop parsing.
      }

      acc.set(token.key, value);
      Logger.debug('Attribute successfully parsed!');
      Logger.debugGroupEnd();
    }
    Logger.debug('Values parsed so far: ', acc);
    Logger.debugGroupEnd();
    return acc;
  }, new Map<ParserTokenKey, string>());

  Logger.debugGroupEnd();
  Logger.debug('[Result]: ', parsed);

  return parsed;
}

const baseParserPattern: DataAttributesParserPattern = [
  { key: 'languageCodename', dataAttributes: [DataAttribute.LanguageCodename] },
  { key: 'projectId', dataAttributes: [DataAttribute.ProjectId] },
] as const;

// EDIT BUTTON PARSING PATTERNS
const itemEditButtonParserPattern: DataAttributesParserPattern = [
  { key: 'itemId', dataAttributes: [DataAttribute.ItemId] },
  ...baseParserPattern,
] as const;

const componentEditButtonParserPattern: DataAttributesParserPattern = [
  { key: 'contentComponentId', dataAttributes: [DataAttribute.ComponentId] },
  ...itemEditButtonParserPattern,
] as const;

const elementEditButtonParserPattern: DataAttributesParserPattern = [
  { key: 'elementCodename', dataAttributes: [DataAttribute.ElementCodename] },
  { key: 'contentComponentId', dataAttributes: [DataAttribute.ComponentId], optional: true },
  ...itemEditButtonParserPattern,
] as const;

// ADD BUTTON PARSING PATTERNS
const baseAddButtonParserPattern: DataAttributesParserPattern = [
  { key: 'elementCodename', dataAttributes: [DataAttribute.ElementCodename] },
  { key: 'contentComponentId', dataAttributes: [DataAttribute.ComponentId], optional: true },
  { key: 'itemId', dataAttributes: [DataAttribute.ItemId] },
  ...baseParserPattern,
] as const;

const relativeAddButtonParserPattern: DataAttributesParserPattern = [
  { key: 'placement', dataAttributes: [DataAttribute.AddButtonInsertPosition], optional: true },
  { key: 'targetId', dataAttributes: [DataAttribute.ComponentId, DataAttribute.ItemId] },
  ...baseAddButtonParserPattern,
] as const;

const fixedAddButtonParserPattern: DataAttributesParserPattern = [
  { key: 'placement', dataAttributes: [DataAttribute.AddButtonInsertPosition], optional: true },
  ...baseAddButtonParserPattern,
] as const;

/**
 * Searches for the first matching data attribute in an HTML element from a provided list.
 */
function findDataAttribute(
  element: HTMLElement,
  dataAttributes: DataAttribute[]
): [DataAttribute, string] | [null, null] {
  const result = dataAttributes.reduce<[DataAttribute, string] | null>((acc, attribute) => {
    if (acc !== null) {
      return acc;
    }

    const value = element.getAttribute(attribute);
    return value ? [attribute, value] : acc;
  }, null);

  return result ?? [null, null];
}
