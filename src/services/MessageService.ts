import {
  HostMessage,
  HostMessageType,
  IAddButtonInitialClickResponseHostMessage,
  IReloadPreviewHostMessage,
  ISdkInitializedResponseHostMessage,
  ISdkStatusHostMessage,
} from '../models/hostMessages';
import { EventDescriptor, EventEmitter, IEventEmitter } from '../helpers/EventEmitter';
import { ClientMessage, ClientMessageWithResponse } from '../models/clientMessages';
import { Deferred } from '../helpers/Deferred';
import { CleanUpFunction, IParentWindowCommunicationAPI } from '../helpers/ParentWindowCommunicationAPI';
import { createUuid } from '../utils/createUuid';

export type MessageServiceEventsMap = {
  [HostMessageType.AddButtonInitialResponse]: EventDescriptor<IAddButtonInitialClickResponseHostMessage>;
  [HostMessageType.InitializedResponse]: EventDescriptor<ISdkInitializedResponseHostMessage>;
  [HostMessageType.RefreshPreview]: EventDescriptor<IReloadPreviewHostMessage>;
  [HostMessageType.Status]: EventDescriptor<ISdkStatusHostMessage>;
};

export interface IMessageService extends IEventEmitter<MessageServiceEventsMap> {
  listen(): void;
  sendMessage(message: ClientMessage): void;
  sendMessageWithResponse<TRequest extends ClientMessageWithResponse, TResponse extends HostMessage>(
    message: TRequest
  ): Promise<TResponse>;
  unlisten(): void;
}

export class MessageService extends EventEmitter<MessageServiceEventsMap> implements IMessageService {
  private readonly promises: Map<string, Deferred<any>> = new Map();
  private cleanUp: CleanUpFunction | null = null;

  public constructor(private readonly parentCommunicationAPI: IParentWindowCommunicationAPI) {
    super();

    this.onMessage = this.onMessage.bind(this);
  }

  public sendMessageWithResponse<TRequest extends ClientMessageWithResponse, TResponse extends HostMessage>(
    message: TRequest
  ): Promise<TResponse> {
    const requestId = message.requestId ?? createUuid();
    const deferred = new Deferred<TResponse>();

    try {
      this.sendMessage({ ...message, requestId });
      this.promises.set(requestId, deferred);
    } catch (e) {
      deferred.reject(e);
      this.promises.delete(requestId);
    }

    return deferred.promise;
  }

  public sendMessage(message: ClientMessage): void {
    this.parentCommunicationAPI.postMessageToParent(message);
  }

  public listen(): void {
    this.cleanUp = this.parentCommunicationAPI.onMessageReceived(this.onMessage);
  }

  public unlisten(): void {
    this.removeAllListeners();
    this.cleanUp?.();
    this.cleanUp = null;
  }

  private onMessage(event: MessageEvent): void {
    if (!event.data) return;

    const message = event.data as HostMessage;
    this.emit(message.type, message);
    if ('requestId' in message && message.requestId) {
      const deferred = this.promises.get(message.requestId);
      deferred?.resolve(message);
    }
  }
}
