export enum HostMessageType {
  AddButtonInitialResponse = 'kontent-smart-link:add:initial:response',
  InitializedResponse = 'kontent-smart-link:initialized:response',
  RefreshPreview = 'kontent-smart-link:preview:refresh',
  Status = 'kontent-smart-link:status',
}

export type HostMessage =
  | ISdkStatusHostMessage
  | IAddButtonInitialClickResponseHostMessage
  | ISdkInitializedResponseHostMessage
  | IReloadPreviewHostMessage;

export interface ISdkStatusHostMessage {
  readonly data: IHighlightStatusMessageData;
  readonly type: HostMessageType.Status;
}

export interface IAddButtonInitialClickResponseHostMessage {
  readonly data: IAddButtonPermissionsServerModel;
  readonly requestId: string;
  readonly type: HostMessageType.AddButtonInitialResponse;
}

export interface ISdkInitializedResponseHostMessage {
  readonly requestId: string;
  readonly type: HostMessageType.InitializedResponse;
}

export interface IReloadPreviewHostMessage {
  readonly type: HostMessageType.RefreshPreview;
  readonly data: IReloadPreviewMessageData;
  readonly metadata: IReloadPreviewMessageMetadata;
}

export interface IHighlightStatusMessageData {
  readonly enabled: boolean;
}

export interface IAddButtonPermissionsServerModel {
  readonly elementType: AddButtonElementType;
  readonly isParentPublished: boolean;
  readonly permissions: ReadonlyMap<AddButtonPermission, AddButtonPermissionCheckResult>;
}

export interface IReloadPreviewMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly updatedItemCodename: string;
}

export interface IReloadPreviewMessageMetadata {
  readonly manualRefresh: boolean;
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
