// TODO: decide whether to use I prefix
// TODO: use these types and deprecate old types
import { AddButtonPermissionData } from './AddButtonPermissionData';

export enum HostMessageType {
  AddButtonInitialResponse = 'kontent-smart-link:add:initial:response',
  InitializedResponse = 'kontent-smart-link:initialized:response',
  PreviewIFrameCurrentUrl = 'kontent-smart-link:preview:current-url',
  RefreshPreview = 'kontent-smart-link:preview:refresh',
  Status = 'kontent-smart-link:status',
  UpdatePreview = 'kontent-smart-link:preview:update',
}

// TODO: move
export interface SdkStatus {
  readonly enabled: boolean;
}

// TODO: move
export interface RefreshPreviewMessageData {
  readonly projectId: string;
  readonly languageCodename: string; // TODO: id + codename as object
  readonly updatedItemCodename: string;
}

// TODO: move
export interface RefreshPreviewMessageMetadata {
  readonly manualRefresh: boolean;
}

export interface SdkStatusHostMessage {
  readonly data: SdkStatus;
  readonly type: HostMessageType.Status;
}

export interface SdkInitializedResponseHostMessage {
  readonly requestId: string;
  readonly type: HostMessageType.InitializedResponse;
}

export interface RefreshPreviewHostMessage {
  readonly data: RefreshPreviewMessageData;
  readonly metadata: RefreshPreviewMessageMetadata;
  readonly type: HostMessageType.RefreshPreview;
}

export interface AddButtonInitialClickResponseHostMessage {
  readonly data: AddButtonPermissionData;
  readonly requestId: string;
  readonly type: HostMessageType.AddButtonInitialResponse;
}

export type HostMessage =
  | AddButtonInitialClickResponseHostMessage
  | SdkInitializedResponseHostMessage
  | SdkStatusHostMessage
  | RefreshPreviewHostMessage;
