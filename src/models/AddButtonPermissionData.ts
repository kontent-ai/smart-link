export enum AddButtonElementType {
  LinkedItems = 'LinkedItems',
  RichText = 'RichText',
  Unknown = 'Unknown',
}

export enum AddButtonPermission {
  CreateNew = 'createNew',
  Edit = 'edit',
  ViewParent = 'viewParent',
}

export enum AddButtonPermissionCheckResult {
  ItemNotTranslated = 'ItemNotTranslated',
  Ok = 'Ok',
  PermissionMissing = 'PermissionMissing',
  RteWithForbiddenComponents = 'RteWithForbiddenComponents',
  Unknown = 'Unknown',
}

export interface AddButtonPermissionData {
  readonly elementType: AddButtonElementType;
  readonly isParentPublished: boolean;
  readonly permissions: ReadonlyMap<AddButtonPermission, AddButtonPermissionCheckResult>;
}
