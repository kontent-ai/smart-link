import {
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  IPlusActionMessageData,
  IPlusInitialMessageData,
  PlusButtonPermission,
  PlusButtonPermissionCheckResult,
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

export function validatePlusInitialMessageData(
  data: DeepPartial<IPlusInitialMessageData>
): data is IPlusInitialMessageData {
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

  return validatePlusInitialMessageData(data);
}

export function hasPlusButtonPermissions(
  permissions: ReadonlyMap<PlusButtonPermission, PlusButtonPermissionCheckResult>
): boolean {
  for (const permission of permissions.values()) {
    if ([PlusButtonPermissionCheckResult.PermissionMissing].includes(permission)) {
      return false;
    }
  }
  return true;
}
