import { IEventDescriptor, IEventEmitter } from '../../utils/EventEmitter';
import {
  ClientMessage,
  HostMessage,
  HostMessageType,
  IReloadPreviewHostMessage,
  ISdkStatusHostMessage,
} from './messageTypes';

export type MessageServiceEventsMap = {
  readonly [HostMessageType.Status]: IEventDescriptor<ISdkStatusHostMessage>;
  readonly [HostMessageType.RefreshPreview]: IEventDescriptor<IReloadPreviewHostMessage>;
};

export interface IMessageService extends IEventEmitter<MessageServiceEventsMap> {
  readonly listen: () => void;
  readonly sendMessage: (message: ClientMessage) => void;
  readonly sendMessageWithResponse: <TMessage extends ClientMessage, TResponse extends HostMessage>(
    message: TMessage
  ) => Promise<TResponse>;
  readonly unlisten: () => void;
}
