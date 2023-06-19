import { DeepPartial } from './dataAttributes';
import { Logger } from '../lib/Logger';
import {
  IAddButtonActionMessageData,
  IAddButtonInitialMessageData,
  IEditButtonContentComponentClickedMessageData,
  IEditButtonContentItemClickedMessageData,
  IEditButtonElementClickedMessageData,
} from '../models/clientMessages';

function logErrors(errors: string[]): void {
  errors.forEach((error: string) => {
    Logger.error(error);
  });
}

export function validateContentItemClickEditMessageData(
  data: Partial<IEditButtonContentItemClickedMessageData>
): data is IEditButtonContentItemClickedMessageData {
  const errors: string[] = [];

  if (!data.projectId) {
    errors.push('Project ID is required to handle element click.');
  }

  if (!data.languageCodename) {
    errors.push('Language codename is required to handle element click.');
  }

  if (!data.itemId) {
    errors.push('Item ID is required to handle element click.');
  }

  logErrors(errors);

  return errors.length === 0;
}

export function validateElementClickMessageData(
  data: Partial<IEditButtonElementClickedMessageData>
): data is IEditButtonElementClickedMessageData {
  if (!data.elementCodename) {
    Logger.error('Element codename is required to handle element click.');
    return false;
  }

  return validateContentItemClickEditMessageData(data);
}

export function validateContentComponentClickMessageData(
  data: Partial<IEditButtonContentComponentClickedMessageData>
): data is IEditButtonContentComponentClickedMessageData {
  if (!data.contentComponentId) {
    Logger.error('Content component ID is required to handle element click.');
    return false;
  }

  return validateContentItemClickEditMessageData(data);
}

export function validateAddInitialMessageData(
  data: DeepPartial<IAddButtonInitialMessageData>
): data is IAddButtonInitialMessageData {
  const errors: string[] = [];

  if (!data.projectId) {
    errors.push('Project ID is required to handle add button click.');
  }

  if (!data.languageCodename) {
    errors.push('Language codename is required to handle add button click.');
  }

  if (!data.itemId) {
    errors.push('Item ID is required to handle add button click.');
  }

  if (!data.elementCodename) {
    errors.push('Element codename is required to handle add button click.');
  }

  if (!data.insertPosition) {
    errors.push('Insert position (placement, targetId) is required to handle add button click.');
  }

  logErrors(errors);

  return errors.length === 0;
}

export function validateAddActionMessageData(
  data: DeepPartial<IAddButtonActionMessageData>
): data is IAddButtonActionMessageData {
  if (!data.action) {
    Logger.error('Action is required to handle add button click.');
    return false;
  }

  return validateAddInitialMessageData(data);
}
