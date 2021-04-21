export interface IPluginInitializedMessageData {
  readonly projectId: string | null;
  readonly languageCodename: string | null;
  readonly enabled: boolean;
}

export interface IElementClickedMessageMetadata {
  readonly elementRect: DOMRect;
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

export interface IPluginStatusMessageData {
  readonly enabled: boolean;
}

export interface IElementDummyData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly dummy: string;
}

export interface IElementDummyDataResponse {
  readonly data: string;
}

export enum IFrameMessageType {
  ElementDummy = 'kontent-smart-link:element:dummy',
  ElementClicked = 'kontent-smart-link:element:clicked',
  ContentItemClicked = 'kontent-smart-link:content-item:clicked',
  Initialized = 'kontent-smart-link:initialized',
  Status = 'kontent-smart-link:status',
}

export enum IFrameResponseType {
  ElementDummyResponse = 'element-dummy-response',
}

export interface IFrameResponseMessage {
  readonly type?: IFrameResponseType;
  readonly requestId: string;
}
