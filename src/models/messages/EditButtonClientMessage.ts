import {
  IEditButtonContentComponentClickedMessageData,
  IEditButtonContentItemClickedMessageData,
  IEditButtonElementClickedMessageData,
} from './MessageData';
import { ISmartLinkSdkMessageMetadata } from './MessageMetadata';
import { ClientMessageType } from './MessageEnums';

export type EditButtonClientMessage =
  | IEditButtonElementClickClientMessage
  | IEditButtonContentItemClickClientMessage
  | IEditButtonContentComponentClickClientMessage;

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
