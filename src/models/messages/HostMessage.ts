import { IAddButtonPermissionsServerModel, IHighlightStatusMessageData, IReloadPreviewMessageData } from './MessageData';
import { IReloadPreviewMessageMetadata } from './MessageMetadata';
import { HostMessageType } from './MessageEnums';

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
  readonly data?: IReloadPreviewMessageData;
  readonly metadata: IReloadPreviewMessageMetadata;
}
