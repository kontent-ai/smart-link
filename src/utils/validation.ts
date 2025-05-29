import {
  IAddActionMessageData,
  IAddButtonInitialMessageData,
  IContentComponentClickedMessageData,
  IContentItemClickedMessageData,
  IElementClickedMessageData,
} from '../lib/IFrameCommunicatorTypes';
import { logError } from '../lib/Logger';
import { DeepPartial } from './typeUtils';

function logErrors(errors: string[]): void {
  errors.forEach((error) => {
    logError(error);
  });
}

export function validateContentItemClickEditMessageData(
  data: Partial<IContentItemClickedMessageData>
): data is IContentItemClickedMessageData {
  const errors: string[] = [
    !data.projectId ? 'Project ID is required to handle element click.' : undefined,
    !data.languageCodename ? 'Language codename is required to handle element click.' : undefined,
    !data.itemId ? 'Item ID is required to handle element click.' : undefined,
  ].filter((e) => e !== undefined);

  logErrors(errors);

  return errors.length === 0;
}

export function validateElementClickMessageData(
  data: Partial<IElementClickedMessageData>
): data is IElementClickedMessageData {
  if (!data.elementCodename) {
    logError('Element codename is required to handle element click.');
    return false;
  }

  return validateContentItemClickEditMessageData(data);
}

export function validateContentComponentClickMessageData(
  data: Partial<IContentComponentClickedMessageData>
): data is IContentComponentClickedMessageData {
  if (!data.contentComponentId) {
    logError('Content component ID is required to handle element click.');
    return false;
  }

  return validateContentItemClickEditMessageData(data);
}

export function validateAddInitialMessageData(
  data: DeepPartial<IAddButtonInitialMessageData>
): data is IAddButtonInitialMessageData {
  const errors: string[] = [
    !data.projectId ? 'Project ID is required to handle add button click.' : undefined,
    !data.languageCodename ? 'Language codename is required to handle add button click.' : undefined,
    !data.itemId ? 'Item ID is required to handle add button click.' : undefined,
    !data.elementCodename ? 'Element codename is required to handle add button click.' : undefined,
    !data.insertPosition ? 'Insert position (placement, targetId) is required to handle add button click.' : undefined,
  ].filter((e) => e !== undefined);

  logErrors(errors);

  return errors.length === 0;
}

export function validateAddActionMessageData(data: DeepPartial<IAddActionMessageData>): data is IAddActionMessageData {
  if (!data.action) {
    logError('Action is required to handle add button click.');
    return false;
  }

  return validateAddInitialMessageData(data);
}
