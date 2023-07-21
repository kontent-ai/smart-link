interface ISDKSupportedFeatures {
  readonly previewIFrameCurrentUrlHandler: boolean;
  readonly refreshHandler: boolean;
}

export interface ISDKInitializedMessageData {
  readonly enabled: boolean;
  readonly languageCodename: string | null;
  readonly projectId: string | null;
  readonly supportedFeatures: ISDKSupportedFeatures;
}

export interface IClickedMessageMetadata {
  readonly elementRect: DOMRect;
}

export interface ISDKStatusMessageData {
  readonly enabled: boolean;
}

interface IClickedMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
}

export interface IContentItemClickedMessageData extends IClickedMessageData {
  readonly itemId: string;
}

export interface IContentComponentClickedMessageData extends IContentItemClickedMessageData {
  readonly contentComponentId: string;
}

export interface IElementClickedMessageData extends IContentItemClickedMessageData {
  readonly contentComponentId?: string;
  readonly elementCodename: string;
}

export interface IRefreshMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly updatedItemCodename: string;
}

export interface IRefreshMessageMetadata {
  readonly manualRefresh: boolean;
}

export interface IPreviewIFrameCurrentUrlMessageData {
  readonly previewUrl: string;
}

export enum InsertPositionPlacement {
  After = 'after',
  Before = 'before',
  End = 'end',
  Start = 'start',
}

interface IRelativeInsertPosition {
  readonly targetId: string;
  readonly placement: InsertPositionPlacement.Before | InsertPositionPlacement.After;
}

interface IFixedInsertPosition {
  readonly placement: InsertPositionPlacement.Start | InsertPositionPlacement.End;
}

export type InsertPosition = IRelativeInsertPosition | IFixedInsertPosition;

export interface IAddButtonInitialMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly itemId: string;
  readonly contentComponentId?: string;
  readonly elementCodename: string;
  readonly insertPosition: InsertPosition;
}

export enum AddButtonAction {
  CreateComponent = 'CreateComponent',
  CreateLinkedItem = 'CreateLinkedItem',
  InsertLinkedItem = 'InsertLinkedItem',
}

export interface IAddActionMessageData extends IAddButtonInitialMessageData {
  readonly action: AddButtonAction;
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

export interface IAddButtonPermissionsServerModel {
  readonly elementType: AddButtonElementType;
  readonly isParentPublished: boolean;
  readonly permissions: ReadonlyMap<AddButtonPermission, AddButtonPermissionCheckResult>;
}

export enum IFrameMessageType {
  ElementClicked = 'kontent-smart-link:element:clicked',
  ContentItemClicked = 'kontent-smart-link:content-item:clicked',
  ContentComponentClicked = 'kontent-smart-link:content-component:clicked',
  Initialized = 'kontent-smart-link:initialized',
  Status = 'kontent-smart-link:status',
  AddInitial = 'kontent-smart-link:add:initial',
  AddAction = 'kontent-smart-link:add:action',
  RefreshPreview = 'kontent-smart-link:preview:refresh',
  PreviewIFrameCurrentUrl = 'kontent-smart-link:preview:currentUrl',
  PreviewIFrameCurrentUrlResponse = 'kontent-smart-link:preview:currentUrl:response',
}

export enum IFrameResponseType {
  AddInitialResponse = 'kontent-smart-link:add:initial:response',
}

export interface IFrameResponseMessage {
  readonly type: IFrameResponseType;
  readonly requestId: string;
}
