import { isInsideIFrame } from '../utils/iframe';
import { EventManager } from './EventManager';
import {
  IElementClickedMessageData,
  IElementClickedMessageMetadata,
  IFrameMessageType,
  IPluginInitializedMessageData,
  IPluginStatusMessageData,
} from './IFrameCommunicatorTypes';

export type IFrameMessagesMap = {
  readonly [IFrameMessageType.ElementDummy]: (
    data: any,
    metadata: IElementClickedMessageMetadata,
    callback: () => void
  ) => void;
  readonly [IFrameMessageType.Initialized]: (data: IPluginInitializedMessageData) => void;
  readonly [IFrameMessageType.ElementClicked]: (
    data: IElementClickedMessageData,
    metadata: IElementClickedMessageMetadata
  ) => void;
  readonly [IFrameMessageType.Status]: (data: IPluginStatusMessageData) => void;
};

export interface IFrameMessage<E extends keyof IFrameMessagesMap> {
  readonly type: E;
  readonly data: Parameters<IFrameMessagesMap[E]>[0];
  readonly metadata?: Parameters<IFrameMessagesMap[E]>[1];
  readonly operationId?: string;
}

export class IFrameCommunicator {
  private readonly events: EventManager<IFrameMessagesMap>;
  private readonly callbacks: any = {};

  constructor() {
    this.events = new EventManager<IFrameMessagesMap>();
    window.addEventListener('message', this.onMessage, true);
  }

  public addMessageListener = <M extends keyof IFrameMessagesMap>(type: M, listener: IFrameMessagesMap[M]): void => {
    this.events.on(type, listener);
  };

  public removeMessageListener = <M extends keyof IFrameMessagesMap>(type: M, listener: IFrameMessagesMap[M]): void => {
    this.events.off(type, listener);
  };

  public destroy(): void {
    this.events.removeAllListeners();
    window.removeEventListener('message', this.onMessage, true);
  }

  public sendMessage = <M extends keyof IFrameMessagesMap>(
    type: M,
    data: Parameters<IFrameMessagesMap[M]>[0],
    metadata?: Parameters<IFrameMessagesMap[M]>[1],
    operationId?: string
  ): void => {
    if (!isInsideIFrame()) {
      console.error("Warning: can't send an iframe message, because the application is not hosted in an iframe");
      return;
    }

    const message: IFrameMessage<M> = { type, data, metadata, operationId };
    window.parent.postMessage(message, '*');
  };

  public sendMessageWithResponse = <M extends keyof IFrameMessagesMap>(
    type: M,
    data: Parameters<IFrameMessagesMap[M]>[0],
    callback: () => void,
    metadata?: Parameters<IFrameMessagesMap[M]>[1]
  ): void => {
    const operationId = this.createUuid();
    this.registerCallback(callback, operationId);
    this.sendMessage(type, data, metadata, operationId);
  };

  private onMessage = (event: MessageEvent): void => {
    if (!event.data) return;
    const message = event.data as IFrameMessage<any>;
    this.events.emit(message.type, message.data);

    if (message.operationId) {
      this.executeCallback(message.operationId, {});
    }
  };

  public createUuid(): string {
    const randomUint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return randomUint32.toString(16);
  }

  private registerCallback(callback: () => void, operationId: string): void {
    if (!callback) {
      return;
    }

    this.callbacks[operationId] = callback;
  }

  private executeCallback(operationId: string, data: any): void {
    const callback = this.callbacks[operationId];

    if (callback) {
      callback(data);
    }
  }
}
