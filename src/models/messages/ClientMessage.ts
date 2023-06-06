import { EditButtonClientMessage } from './EditButtonClientMessage';
import { IAddButtonActionMessageData, IAddButtonInitialMessageData, IInitializedMessageData } from './MessageData';
import { ISmartLinkSdkMessageMetadata } from './MessageMetadata';
import { ClientMessageType } from './MessageEnums';

export type ClientMessage =
  | ISdkInitializedClientMessage
  | EditButtonClientMessage
  | IAddButtonInitialClickClientMessage
  | IAddButtonActionClickClientMessage;

export interface ISdkInitializedClientMessage {
  readonly data: IInitializedMessageData;
  readonly requestId: string;
  readonly type: ClientMessageType.Initialized;
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
