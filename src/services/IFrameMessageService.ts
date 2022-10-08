import { CleanUpFunction, IParentCommunicationAPI } from '../api/IParentCommunicationAPI';
import { Deferred } from '../helpers/Deferred';
import { ClientMessage, HostMessage } from '../models/messages/message';
import { EventEmitter } from '../utils/EventEmitter';
import { createUuid } from '../utils/createUuid';
import { IMessageService, MessageServiceEventsMap } from './IMessageService';

export class IFrameMessageService extends EventEmitter<MessageServiceEventsMap> implements IMessageService {
  private readonly promises: Map<string, Deferred<any>>;
  private readonly handleMessage: (e: MessageEvent) => void;
  private cleanUp: CleanUpFunction | null;

  public constructor(private readonly parentCommunicationAPI: IParentCommunicationAPI) {
    super();

    this.cleanUp = null;
    this.promises = new Map();
    this.handleMessage = this.onMessage.bind(this);
  }

  public sendMessageWithResponse<TMessage extends ClientMessage, TResponse extends HostMessage>(message: TMessage): Promise<TResponse> {
    const requestId = createUuid();
    const deferred = new Deferred<TResponse>();

    try {
      this.sendMessage(message);
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
    this.cleanUp = this.parentCommunicationAPI.onMessageReceived(this.handleMessage);
  }

  public unlisten(): void {
    this.removeAllListeners();
    this.cleanUp?.();
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
