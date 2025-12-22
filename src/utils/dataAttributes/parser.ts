import {
  type IContentComponentClickedMessageData,
  type IContentItemClickedMessageData,
  type IElementClickedMessageData,
  InsertPositionPlacement,
} from "../../lib/IFrameCommunicatorTypes";
import { logDebug } from "../../lib/Logger";
import { throwError } from "../errors";
import { DataAttribute } from "./attributes";
import { getHighlightTypeForElement, HighlightType } from "./elementHighlight";

export type EditButtonClickedData =
  | IContentItemClickedMessageData
  | IContentComponentClickedMessageData
  | IElementClickedMessageData;

export type ParserTokenKey =
  | "environmentId"
  | "languageCodename"
  | "itemId"
  | "contentComponentId"
  | "elementCodename"
  | "placement"
  | "targetId";

type IDataAttributesParserToken = Readonly<{
  key: ParserTokenKey;
  dataAttributes: DataAttribute[]; //  Attributes that should be parsed for the current token (looking just for one of these attributes)
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
export function parseEditButtonDataAttributes(target: HTMLElement): ParseResult {
  const type = getHighlightTypeForElement(target);
  const pattern = getEditButtonDataAttributesPattern(type);

  logDebug("Parsing edit button data attributes for element: ", target);
  logDebug("Parsing values from data attributes using this pattern: ", pattern);

  return parseDataAttributes(pattern, target);
}

/**
 * Parses data attributes from an HTML element to extract add button information.
 * The function determines the insert position type (fixed or relative) and extracts
 * relevant data attributes based on that type.
 */
export function parseAddButtonDataAttributes(target: HTMLElement): ParseResult {
  const position = target.getAttribute(DataAttribute.AddButtonInsertPosition);
  const pattern = getAddButtonDataAttributesPattern(position);

  logDebug("Parsing add button data attributes for element: ", target);
  logDebug("Parsing values from data attributes following this pattern: ", pattern);

  return parseDataAttributes(pattern, target);
}

function getEditButtonDataAttributesPattern(type: HighlightType): DataAttributesParserPattern {
  switch (type) {
    case HighlightType.Element:
      return elementEditButtonParserPattern;
    case HighlightType.ContentComponent:
      return componentEditButtonParserPattern;
    case HighlightType.ContentItem:
      return itemEditButtonParserPattern;
    case HighlightType.None:
      return baseParserPattern;
  }
}

function getAddButtonDataAttributesPattern(position: string | null): DataAttributesParserPattern {
  switch (position) {
    case InsertPositionPlacement.After:
    case InsertPositionPlacement.Before:
      return relativeAddButtonParserPattern;
    default:
      return fixedAddButtonParserPattern;
  }
}

type ParseTokenResultInternal = {
  value: string;
  dataAttribute: DataAttribute;
};

export type ParseTokenResult = Partial<Record<ParserTokenKey, string | null>>;

export type ParseResult = {
  parsed: ParseTokenResult;
  debugData: ReadonlyArray<{
    element: HTMLElement;
    parsedAttributes: ReadonlyArray<{
      token: ParserTokenKey;
      dataAttribute: DataAttribute;
      value: string;
    }>;
    skippedAttributes: ReadonlyArray<{ dataAttribute: DataAttribute; value: string | null }>;
  }>;
};

/**
 * Creates result from found data attributes on an element.
 * This function follow rules:
 * - If token is found, it is added to the result
 * - If token is not found or the data attribute is already taken, but is optional, it is skipped
 * - If token is not found, and is required, the function stops searching as higher precedence tokens cannot be found
 */
function applyPatternToParsedValues(
  pattern: DataAttributesParserPattern,
  parsedValues: ReadonlyArray<ParseTokenResultInternal>,
): ReadonlyArray<{ token: ParserTokenKey; value: string; dataAttribute: DataAttribute }> {
  const takenDataAttributes = new Set<DataAttribute>();
  const result: Array<{ token: ParserTokenKey; value: string; dataAttribute: DataAttribute }> = [];

  for (const p of pattern) {
    const data = parsedValues.find(
      (a) =>
        p.dataAttributes.includes(a.dataAttribute) && !takenDataAttributes.has(a.dataAttribute),
    );

    if (!data && p.optional) {
      continue;
    }

    if (!data) {
      break;
    }

    takenDataAttributes.add(data.dataAttribute);
    result.push({ token: p.key, value: data.value, dataAttribute: data.dataAttribute });
  }

  return result;
}

export const parseDataAttributes = (
  pattern: DataAttributesParserPattern,
  element: HTMLElement | null,
): ParseResult => {
  if (!element || pattern.length === 0) {
    return { parsed: {}, debugData: [] };
  }

  const parsedValues = Object.values(DataAttribute)
    .map((a) => {
      const value = element.getAttribute(a);
      return value ? { dataAttribute: a, value } : null;
    })
    .filter((a) => a !== null);

  const result = applyPatternToParsedValues(pattern, parsedValues);

  const lastFoundTokenIndex = pattern.findIndex((p) => p.key === result.at(-1)?.token);
  const newPattern = pattern.slice(lastFoundTokenIndex + 1);

  const parentResult = parseDataAttributes(newPattern, element.parentElement);

  return {
    parsed: {
      ...Object.fromEntries(result.map((r) => [r.token, r.value])),
      ...parentResult.parsed,
    },
    debugData: [
      ...parentResult.debugData,
      ...(parsedValues.length > 0
        ? [
            {
              element,
              parsedAttributes: parsedValues
                .filter(
                  (a) => result.find((r) => r.dataAttribute === a.dataAttribute) !== undefined,
                )
                .map((a) => ({
                  token:
                    result.find((r) => r.dataAttribute === a.dataAttribute)?.token ??
                    throwError("[Parser]: Token not found"),
                  dataAttribute: a.dataAttribute,
                  value: a.value,
                })),
              skippedAttributes: parsedValues
                .filter(
                  (a) => result.find((r) => r.dataAttribute === a.dataAttribute) === undefined,
                )
                .map((a) => ({
                  dataAttribute: a.dataAttribute,
                  value: a.value,
                })),
            },
          ]
        : []),
    ],
  };
};

const baseParserPattern: DataAttributesParserPattern = [
  { key: "languageCodename", dataAttributes: [DataAttribute.LanguageCodename] },
  { key: "environmentId", dataAttributes: [DataAttribute.EnvironmentId] },
] as const;

// EDIT BUTTON PARSING PATTERNS
const itemEditButtonParserPattern: DataAttributesParserPattern = [
  { key: "itemId", dataAttributes: [DataAttribute.ItemId] },
  ...baseParserPattern,
] as const;

const componentEditButtonParserPattern: DataAttributesParserPattern = [
  { key: "contentComponentId", dataAttributes: [DataAttribute.ComponentId] },
  ...itemEditButtonParserPattern,
] as const;

const elementEditButtonParserPattern: DataAttributesParserPattern = [
  { key: "elementCodename", dataAttributes: [DataAttribute.ElementCodename] },
  { key: "contentComponentId", dataAttributes: [DataAttribute.ComponentId], optional: true },
  ...itemEditButtonParserPattern,
] as const;

// ADD BUTTON PARSING PATTERNS
const baseAddButtonParserPattern: DataAttributesParserPattern = [
  { key: "elementCodename", dataAttributes: [DataAttribute.ElementCodename] },
  { key: "contentComponentId", dataAttributes: [DataAttribute.ComponentId], optional: true },
  { key: "itemId", dataAttributes: [DataAttribute.ItemId] },
  ...baseParserPattern,
] as const;

const relativeAddButtonParserPattern: DataAttributesParserPattern = [
  { key: "placement", dataAttributes: [DataAttribute.AddButtonInsertPosition] },
  { key: "targetId", dataAttributes: [DataAttribute.ComponentId, DataAttribute.ItemId] },
  ...baseAddButtonParserPattern,
] as const;

const fixedAddButtonParserPattern: DataAttributesParserPattern = [
  { key: "placement", dataAttributes: [DataAttribute.AddButtonInsertPosition], optional: true },
  ...baseAddButtonParserPattern,
] as const;
