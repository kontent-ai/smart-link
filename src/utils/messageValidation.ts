import { logGroupCollapsed, logGroupEnd, logInfo } from '../lib/Logger';
import {
  IAddButtonInitialMessageData,
  IContentComponentClickedMessageData,
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  InsertPosition,
  InsertPositionPlacement,
} from '../lib/IFrameCommunicatorTypes';
import { KSLConfiguration } from './configuration';
import { ParseResult, ParserTokenKey } from './dataAttributes/parser';
import { NonEmptyArray } from './typeUtils';

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; missing: Readonly<NonEmptyArray<ParserTokenKey>> };

const validateConfigurationDataAttributes = (
  data: ParseResult,
  configurationDataAttributes: KSLConfiguration['defaultDataAttributes']
): ValidationResult<{ languageCodename: string; projectId: string }> => {
  const languageCodename = data.parsed.languageCodename ?? configurationDataAttributes.languageCodename;
  const projectId = data.parsed.environmentId ?? configurationDataAttributes.environmentId;

  if (!languageCodename || !projectId) {
    const missing: ParserTokenKey[] = [
      ...(!languageCodename ? (['languageCodename'] as const) : []),
      ...(!projectId ? (['environmentId'] as const) : []),
    ];

    return { success: false, missing: missing as NonEmptyArray<ParserTokenKey> };
  }

  return { success: true, data: { languageCodename, projectId } };
};

function validateContentItemClickEditMessageData(
  data: ParseResult,
  configurationDataAttributes: KSLConfiguration['defaultDataAttributes']
): ValidationResult<IContentItemClickedMessageData> {
  const configData = validateConfigurationDataAttributes(data, configurationDataAttributes);
  if (!data.parsed.itemId || !configData.success) {
    return {
      success: false,
      missing: [
        ...(!data.parsed.itemId ? (['itemId'] as const) : []),
        ...(configData.success ? [] : configData.missing),
      ] as NonEmptyArray<ParserTokenKey>,
    };
  }

  return {
    success: true,
    data: {
      languageCodename: configData.data.languageCodename,
      projectId: configData.data.projectId,
      itemId: data.parsed.itemId,
    },
  };
}

function validateElementClickMessageData(
  data: ParseResult,
  configurationDataAttributes: KSLConfiguration['defaultDataAttributes']
): ValidationResult<IElementClickedMessageData> {
  const parseItem = validateContentItemClickEditMessageData(data, configurationDataAttributes);
  if (!data.parsed.elementCodename || !parseItem.success) {
    return { success: false, missing: ['elementCodename', ...(parseItem.success ? [] : parseItem.missing)] };
  }

  return {
    success: true,
    data: {
      ...parseItem.data,
      elementCodename: data.parsed.elementCodename,
      contentComponentId: data.parsed.contentComponentId ?? undefined,
    },
  };
}

function validateContentComponentClickMessageData(
  data: ParseResult,
  configurationDataAttributes: KSLConfiguration['defaultDataAttributes']
): ValidationResult<IContentComponentClickedMessageData> {
  const parseItem = validateContentItemClickEditMessageData(data, configurationDataAttributes);
  if (!data.parsed.contentComponentId || !parseItem.success) {
    return { success: false, missing: ['contentComponentId', ...(parseItem.success ? [] : parseItem.missing)] };
  }

  return {
    success: true,
    data: {
      ...parseItem.data,
      contentComponentId: data.parsed.contentComponentId,
    },
  };
}

export type EditButtonMessageDataResult =
  | {
      type: 'element';
      data: IElementClickedMessageData;
    }
  | {
      type: 'contentComponent';
      data: IContentComponentClickedMessageData;
    }
  | {
      type: 'contentItem';
      data: IContentItemClickedMessageData;
    }
  | {
      type: 'error';
      missing: ReadonlyArray<ParserTokenKey>;
      debug?: ParseResult['debugData'];
    };

export const validateEditButtonMessageData = (
  data: ParseResult,
  configuration: KSLConfiguration
): EditButtonMessageDataResult => {
  const getValidationResult = () => {
    if ('elementCodename' in data.parsed) {
      return {
        type: 'element',
        validationResult: validateElementClickMessageData(data, configuration.defaultDataAttributes),
      } as const;
    }

    if ('contentComponentId' in data.parsed) {
      return {
        type: 'contentComponent',
        validationResult: validateContentComponentClickMessageData(data, configuration.defaultDataAttributes),
      } as const;
    }

    return {
      type: 'contentItem',
      validationResult: validateContentItemClickEditMessageData(data, configuration.defaultDataAttributes),
    } as const;
  };

  const { type, validationResult } = getValidationResult();

  if (!validationResult.success) {
    printDebugData(data.debugData, '[KSL]: Parsing edit button data attributes failed');
    return {
      type: 'error',
      missing: validationResult.missing,
    };
  }

  if (configuration.debug) {
    printDebugData(data.debugData, '[KSL]: Parsed edit button data attributes');
  }

  if (type === 'element') {
    return {
      type: 'element',
      data: validationResult.data,
    };
  }

  if (type === 'contentComponent') {
    return {
      type: 'contentComponent',
      data: validationResult.data,
    };
  }

  return {
    type: 'contentItem',
    data: validationResult.data,
  };
};

const validatePlacement = (data: ParseResult): ValidationResult<Partial<InsertPosition>> => {
  const insertPosition = getPlacement(data.parsed.placement);

  if (
    (insertPosition === InsertPositionPlacement.After || insertPosition === InsertPositionPlacement.Before) &&
    !data.parsed.targetId
  ) {
    return { success: false, missing: ['targetId'] };
  }

  return { success: true, data: { placement: insertPosition, targetId: data.parsed.targetId ?? undefined } };
};

const getPlacement = (placement: string | null | undefined) => {
  switch (placement) {
    case 'after':
      return InsertPositionPlacement.After;
    case 'before':
      return InsertPositionPlacement.Before;
    case 'start':
      return InsertPositionPlacement.Start;
    case 'end':
    default:
      return InsertPositionPlacement.End;
  }
};

export function validateAddInitialMessageData(
  data: ParseResult,
  configuration: KSLConfiguration
): ValidationResult<IAddButtonInitialMessageData> {
  const configData = validateConfigurationDataAttributes(data, configuration.defaultDataAttributes);
  const placement = validatePlacement(data);

  if (!data.parsed.itemId || !data.parsed.elementCodename || !placement.success || !configData.success) {
    printDebugData(data.debugData, '[KSL]: Parsing add button data attributes failed');
    return {
      success: false,
      missing: [
        ...(!data.parsed.itemId ? (['itemId'] as const) : []),
        ...(!data.parsed.elementCodename ? (['elementCodename'] as const) : []),
        ...(placement.success ? [] : placement.missing),
        ...(configData.success ? [] : configData.missing),
      ] as NonEmptyArray<ParserTokenKey>,
    };
  }

  if (configuration.debug) {
    printDebugData(data.debugData, '[KSL]: Parsed add button data attributes');
  }

  return {
    success: true,
    data: {
      projectId: configData.data.projectId,
      languageCodename: configData.data.languageCodename,
      itemId: data.parsed.itemId,
      contentComponentId: data.parsed.contentComponentId ?? undefined,
      insertPosition: placement.data as InsertPosition,
      elementCodename: data.parsed.elementCodename,
    },
  };
}

const printDebugData = (debugData: ParseResult['debugData'], message: string) => {
  logGroupCollapsed(message);
  debugData.forEach((item) => {
    logGroupCollapsed(item.element);
    if (item.parsedAttributes.length > 0) {
      logInfo('Resolved attributes:');
      item.parsedAttributes.forEach((attr) => {
        logInfo(`${attr.token}: ${attr.dataAttribute}: ${attr.value}`);
      });
    }
    if (item.skippedAttributes.length > 0) {
      logInfo('Parsed Kontent.ai attributes:');
      item.skippedAttributes.forEach((attr) => {
        logInfo(`${attr.dataAttribute}: ${attr.value}`);
      });
    }
    logGroupEnd();
  });
  logGroupEnd();
};
