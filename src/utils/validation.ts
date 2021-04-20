import {
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  IPlusActionMessageData,
  IPlusRequestMessageData,
  PlusButtonPermission,
  PlusButtonPermissionOption,
} from '../lib/IFrameCommunicatorTypes';
import { DeepPartial } from './dataAttributes';
import { Logger } from '../lib/Logger';

function logErrors(errors: string[]): void {
  errors.forEach((error: string) => {
    Logger.error(error);
  });
}

export function validateContentItemClickEditMessageData(
  data: Partial<IContentItemClickedMessageData>
): data is IContentItemClickedMessageData {
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
  data: Partial<IElementClickedMessageData>
): data is IElementClickedMessageData {
  if (!data.elementCodename) {
    Logger.error('Warning: element codename is required to handle element click.');
    return false;
  }

  return validateContentItemClickEditMessageData(data);
}

export function validatePlusRequestMessageData(
  data: DeepPartial<IPlusRequestMessageData>
): data is IPlusRequestMessageData {
  const errors: string[] = [];

  if (!data.projectId) {
    errors.push('Project ID is required to handle plus button click.');
  }

  if (!data.languageCodename) {
    errors.push('Language codename is required to handle plus button click.');
  }

  if (!data.itemId) {
    errors.push('Item ID is required to handle plus button click.');
  }

  if (!data.elementCodename) {
    errors.push('Element codename is required to handle plus button click.');
  }

  if (!data.insertPosition) {
    errors.push('Insert position (placement, targetId) is required to handle plus button click.');
  }

  logErrors(errors);

  return errors.length === 0;
}

export function validatePlusActionMessageData(
  data: DeepPartial<IPlusActionMessageData>
): data is IPlusActionMessageData {
  if (!data.action) {
    Logger.error('Action is required to handle plus button click.');
    return false;
  }

  return validatePlusRequestMessageData(data);
}

export function hasPlusButtonPermissions(
  permissions: ReadonlyMap<PlusButtonPermission, PlusButtonPermissionOption>
): boolean {
  for (const permission of permissions.values()) {
    if ([PlusButtonPermissionOption.PermissionMissing].includes(permission)) {
      return false;
    }
  }
  return true;
}
