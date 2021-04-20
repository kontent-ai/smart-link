export interface ISDKInitializedMessageData {
  readonly projectId: string | null;
  readonly languageCodename: string | null;
  readonly enabled: boolean;
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

export enum InsertPosition {
  After = 'after',
  Before = 'before',
  End = 'end',
  Start = 'start',
}

interface IRelativeInsertPosition {
  readonly targetId: string;
  readonly placement: InsertPosition.Before | InsertPosition.After;
}

interface IFixedInsertPosition {
  readonly placement: InsertPosition.Start | InsertPosition.End;
}

export type PlusRequestInsertPosition = IRelativeInsertPosition | IFixedInsertPosition;

export interface IPlusRequestMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly itemId: string;
  readonly contentComponentId?: string;
  readonly elementCodename: string;
  readonly insertPosition: PlusRequestInsertPosition;
}

export enum PlusButtonAction {
  CreateComponent = 'CreateComponent',
  CreateLinkedItem = 'CreateLinkedItem',
  InsertLinkedItem = 'InsertLinkedItem',
}

export interface IPlusActionMessageData extends IPlusRequestMessageData {
  readonly action: PlusButtonAction;
}

export enum PlusButtonElementType {
  LinkedItems = 'LinkedItems',
  RichText = 'RichText',
  Unknown = 'Unknown',
}

export enum PlusButtonPermission {
  CreateNew = 'CreateNew',
  Edit = 'Edit',
  ViewParent = 'ViewParent',
}

export enum PlusButtonPermissionOption {
  ItemNotTranslated = 'ItemNotTranslated',
  Ok = 'Ok',
  PermissionMissing = 'PermissionMissing',
  Unknown = 'Unknown',
}

export interface IPlusButtonPermissionsServerModel {
  readonly elementType: PlusButtonElementType;
  readonly isParentPublished: boolean;
  readonly permissions: ReadonlyMap<PlusButtonPermission, PlusButtonPermissionOption>;
}

export enum IFrameMessageType {
  ElementClicked = 'kontent-smart-link:element:clicked',
  ContentItemClicked = 'kontent-smart-link:content-item:clicked',
  Initialized = 'kontent-smart-link:initialized',
  Status = 'kontent-smart-link:status',
  PlusRequest = 'kontent-smart-link:plus:request',
  PlusAction = 'kontent-smart-link:plus:action',
}

export enum IFrameResponseType {
  PlusRequestResponse = 'kontent-smart-link:plus:response',
  PlusActionResponse = 'kontent-smart-link:plus:action-response',
}

export interface IFrameResponseMessage {
  readonly type: IFrameResponseType;
  readonly requestId: string;
}
