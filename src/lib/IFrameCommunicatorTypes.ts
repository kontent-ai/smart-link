export interface IPluginInitializedMessageData {
  readonly projectId: string | null;
  readonly languageCodename: string | null;
  readonly enabled: boolean;
}

export interface IElementClickedMessageMetadata {
  readonly elementRect: DOMRect;
}

export interface IElementClickedMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly itemId: string;
  readonly elementCodename: string;
  readonly contentComponentId: string;
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
  Initialized = 'kontent-smart-link:initialized',
  Status = 'kontent-smart-link:status',
}

export enum IFrameResponseType {
  ElementDummyResponse = 'element-dummy-response',
}

export interface IFrameResponseMessage {
  readonly type?: IFrameResponseType;
  readonly operationId: string;
}
