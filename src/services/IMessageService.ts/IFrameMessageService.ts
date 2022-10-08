import { InvalidEnvironmentError } from '../../utils/errors';
import { EventEmitter } from '../../utils/EventEmitter';
import { isInsideIFrame } from '../../utils/iframe';
import { IMessageService, MessageServiceEventsMap } from './IMessageService';
import { ClientMessage, HostMessage } from './messageTypes';

export class IFrameMessageService extends EventEmitter<MessageServiceEventsMap> implements IMessageService {
  private readonly promises: Map<string, Promise<any>> = new Map();
  private handleMessage: (e: MessageEvent) => void;

  public constructor() {
    super();

    this.handleMessage = this.onMessage.bind(this);
  }

  public sendMessage(message: ClientMessage): void {
    if (!isInsideIFrame()) {
      throw InvalidEnvironmentError('IFrameMessageService can only send messages while inside iframe.');
    }

    window.parent.postMessage(message, '*');
  }

  public sendMessageWithResponse<TMessage extends ClientMessage, TResponse extends HostMessage>(
    message: TMessage
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {});
  }

  public listen(): void {
    if (typeof window === 'undefined') {
      throw InvalidEnvironmentError('IFrameMessageService can only be initialized in a browser environment.');
    }

    if (!isInsideIFrame()) {
      throw InvalidEnvironmentError('IFrameMessageService can  only be initialized inside iframe.');
    }

    window.addEventListener('message', this.handleMessage, true);
  }

  public unlisten(): void {
    this.removeAllListeners();
    window.removeEventListener('message', this.handleMessage, true);
  }

  private onMessage(event: MessageEvent): void {}
}
