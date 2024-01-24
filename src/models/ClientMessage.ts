export enum ClientMessageType {
  AddButtonAction = 'kontent-smart-link:add:action',
  AddButtonInitial = 'kontent-smart-link:add:initial',
  EditContentComponentClicked = 'kontent-smart-link:content-component:clicked',
  EditContentItemClicked = 'kontent-smart-link:content-item:clicked',
  EditElementClicked = 'kontent-smart-link:element:clicked',
  Initialized = 'kontent-smart-link:initialized',
  PreviewIFrameCurrentUrlResponse = 'kontent-smart-link:preview:current-url:response',
}

export interface EditButtonElementClickClientMessage {
  readonly data: IEditButtonElementClickedMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.EditElementClicked;
}

export interface EditButtonContentItemClickClientMessage {
  readonly data: IEditButtonContentItemClickedMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.EditContentItemClicked;
}

export interface EditButtonContentComponentClickClientMessage {
  readonly data: IEditButtonContentComponentClickedMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.EditContentComponentClicked;
}

export interface SdkInitializedClientMessage {
  readonly data: IInitializedMessageData;
  readonly requestId?: string;
  readonly type: ClientMessageType.Initialized;
}

export interface AddButtonInitialClickClientMessage {
  readonly data: IAddButtonInitialMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly requestId?: string;
  readonly type: ClientMessageType.AddButtonInitial;
}

export interface AddButtonActionClickClientMessage {
  readonly data: IAddButtonActionMessageData;
  readonly metadata: ISmartLinkSdkMessageMetadata;
  readonly type: ClientMessageType.AddButtonAction;
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

export interface IInitializedMessageData {
  readonly enabled: boolean;
  readonly languageCodename: string | null;
  readonly projectId: string | null;
  readonly supportedFeatures?: ISmartLinkSDKSupportedFeatures;
}

export interface ISmartLinkSdkMessageMetadata {
  readonly elementRect: DOMRect;
}

export interface IMessageBaseData {
  readonly itemId: string;
  readonly languageCodename: string;
  readonly projectId: string;
}

export interface ISmartLinkSDKSupportedFeatures {
  readonly refreshHandler: boolean;
}

export enum InsertPositionPlacement {
  After = 'after',
  Before = 'before',
  End = 'end',
  Start = 'start',
}

export enum AddButtonAction {
  CreateComponent = 'CreateComponent',
  CreateLinkedItem = 'CreateLinkedItem',
  InsertLinkedItem = 'InsertLinkedItem',
}

interface IRelativeInsertPosition {
  readonly targetId: string;
  readonly placement: InsertPositionPlacement.Before | InsertPositionPlacement.After;
}

interface IFixedInsertPosition {
  readonly placement: InsertPositionPlacement.Start | InsertPositionPlacement.End;
}

export type InsertPosition = IRelativeInsertPosition | IFixedInsertPosition;

export type EditButtonClientMessage =
  | EditButtonElementClickClientMessage
  | EditButtonContentItemClickClientMessage
  | EditButtonContentComponentClickClientMessage;

export type ClientMessageWithResponse = SdkInitializedClientMessage | AddButtonInitialClickClientMessage;

export type ClientMessage = ClientMessageWithResponse | EditButtonClientMessage | AddButtonActionClickClientMessage;
