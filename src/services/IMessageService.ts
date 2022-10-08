import { IEventDescriptor, IEventEmitter } from '../utils/EventEmitter';
import {
  ClientMessage,
  HostMessage,
  HostMessageType,
  IAddButtonInitialClickResponseHostMessage,
  IReloadPreviewHostMessage,
  ISdkInitializedResponseHostMessage,
  ISdkStatusHostMessage,
} from '../models/messages/message';

export type MessageServiceEventsMap = {
  readonly [HostMessageType.AddButtonInitialResponse]: IEventDescriptor<IAddButtonInitialClickResponseHostMessage>;
  readonly [HostMessageType.InitializedResponse]: IEventDescriptor<ISdkInitializedResponseHostMessage>;
  readonly [HostMessageType.RefreshPreview]: IEventDescriptor<IReloadPreviewHostMessage>;
  readonly [HostMessageType.Status]: IEventDescriptor<ISdkStatusHostMessage>;
};

export interface IMessageService extends IEventEmitter<MessageServiceEventsMap> {
  readonly listen: () => void;
  readonly sendMessage: (message: ClientMessage) => void;
  readonly sendMessageWithResponse: <TRequest extends ClientMessage, TResponse extends HostMessage>(message: TRequest) => Promise<TResponse>;
  readonly unlisten: () => void;
}
