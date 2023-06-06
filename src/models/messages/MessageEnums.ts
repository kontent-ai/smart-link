export enum ClientMessageType {
  AddButtonAction = 'kontent-smart-link:add:action',
  AddButtonInitial = 'kontent-smart-link:add:initial',
  EditContentComponentClicked = 'kontent-smart-link:content-component:clicked',
  EditContentItemClicked = 'kontent-smart-link:content-item:clicked',
  EditElementClicked = 'kontent-smart-link:element:clicked',
  Initialized = 'kontent-smart-link:initialized',
}

export enum HostMessageType {
  AddButtonInitialResponse = 'kontent-smart-link:add:initial:response',
  InitializedResponse = 'kontent-smart-link:initialized:response',
  RefreshPreview = 'kontent-smart-link:preview:refresh',
  Status = 'kontent-smart-link:status',
}

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

export enum AddButtonAction {
  CreateComponent = 'CreateComponent',
  CreateLinkedItem = 'CreateLinkedItem',
  InsertLinkedItem = 'InsertLinkedItem',
}
