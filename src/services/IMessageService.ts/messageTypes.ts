export type ClientMessage =
  | ISdkInitializedClientMessage
  | EditButtonClientMessage
  | IAddButtonInitialClickClientMessage
  | IAddButtonActionClickClientMessage;

export type HostMessage =
  | ISdkStatusHostMessage
  | IAddButtonInitialClickResponseHostMessage
  | ISdkInitializedResponseHostMessage
  | IReloadPreviewHostMessage;

export type EditButtonClientMessage =
  | IEditButtonElementClickClientMessage
  | IEditButtonContentItemClickClientMessage
  | IEditButtonContentComponentClickClientMessage;

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

export interface ISdkInitializedClientMessage {
  readonly data: IInitializedMessageData;
  readonly requestId: string;
  readonly type: ClientMessageType.Initialized;
}

export interface IEditButtonElementClickClientMessage {
  readonly data: IEditButtonElementClickedMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.EditElementClicked;
}

export interface IEditButtonContentItemClickClientMessage {
  readonly data: IEditButtonContentItemClickedMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.EditContentItemClicked;
}

export interface IEditButtonContentComponentClickClientMessage {
  readonly data: IEditButtonContentComponentClickedMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.EditContentComponentClicked;
}

export interface IAddButtonInitialClickClientMessage {
  readonly data: IAddButtonInitialMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly requestId: string;
  readonly type: ClientMessageType.AddButtonInitial;
}

export interface IAddButtonActionClickClientMessage {
  readonly data: IAddButtonActionMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.AddButtonAction;
}

export interface ISdkStatusHostMessage {
  readonly data: IHighlightStatusMessageData;
  readonly type: HostMessageType.Status;
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
  readonly data?: IReloadPreviewMessageData;
  readonly metadata: IReloadPreviewMessageMetadata;
}

export interface IReloadPreviewMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly updatedItemCodename: string;
}

export interface IReloadPreviewMessageMetadata {
  readonly manualRefresh: boolean;
}

export interface IHighlightStatusMessageData {
  readonly enabled: boolean;
}

export interface ISmartLinkSDKSupportedFeatures {
  readonly refreshHandler: boolean;
}

export interface IInitializedMessageData {
  readonly enabled: boolean;
  readonly languageCodename: string | null;
  readonly projectId: string | null;
  readonly supportedFeatures?: ISmartLinkSDKSupportedFeatures;
}

export interface IMessageBaseData {
  readonly itemId: string;
  readonly languageCodename: string;
  readonly projectId: string;
}

export type IEditButtonContentItemClickedMessageData = IMessageBaseData;

export interface IEditButtonContentComponentClickedMessageData extends IEditButtonContentItemClickedMessageData {
  readonly contentComponentId: string;
}

export interface IEditButtonElementClickedMessageData extends IEditButtonContentItemClickedMessageData {
  readonly contentComponentId?: string;
  readonly elementCodename: string;
}

export interface IAddButtonInitialMessageData extends IMessageBaseData {
  readonly contentComponentId?: string;
  readonly elementCodename: string;
  readonly insertPosition: InsertPosition;
}

export interface IAddButtonActionMessageData extends IAddButtonInitialMessageData {
  readonly action: AddButtonAction;
}

export enum AddButtonAction {
  CreateComponent = 'CreateComponent',
  CreateLinkedItem = 'CreateLinkedItem',
  InsertLinkedItem = 'InsertLinkedItem',
}

export interface ISmartLinkSdkMessageMetadata {
  readonly elementRect: DOMRect;
}
