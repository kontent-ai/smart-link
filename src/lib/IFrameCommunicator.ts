import { isInsideIFrame } from '../utils/iframe';
import { EventManager } from './EventManager';
import {
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  IElementClickedMessageMetadata,
  IElementDummyData,
  IElementDummyDataResponse,
  IFrameMessageType,
  IPluginInitializedMessageData,
  IPluginStatusMessageData,
} from './IFrameCommunicatorTypes';
import { createUuid } from '../utils/createUuid';

type Callback<TResponseData> = (data?: TResponseData) => void;
type MessageSignature<TMessageData, TMessageMetaData = undefined, TMessageCallback = undefined> = (
  data: TMessageData,
  metadata: TMessageMetaData,
  callback: TMessageCallback
) => void;

export type IFrameMessagesMap = {
  readonly [IFrameMessageType.ElementDummy]: MessageSignature<
    Partial<IElementDummyData>,
    IElementClickedMessageMetadata,
    Callback<IElementDummyDataResponse>
  >;
  readonly [IFrameMessageType.Initialized]: MessageSignature<IPluginInitializedMessageData>;
  readonly [IFrameMessageType.ElementClicked]: MessageSignature<
    IElementClickedMessageData,
    IElementClickedMessageMetadata
  >;
  readonly [IFrameMessageType.ContentItemClicked]: MessageSignature<
    IContentItemClickedMessageData,
    IElementClickedMessageMetadata
  >;
  readonly [IFrameMessageType.Status]: MessageSignature<IPluginStatusMessageData>;
};

export interface IFrameMessage<E extends keyof IFrameMessagesMap> {
  readonly type: E;
  readonly data: Parameters<IFrameMessagesMap[E]>[0];
  readonly metadata?: Parameters<IFrameMessagesMap[E]>[1];
  readonly requestId?: string;
}

export class IFrameCommunicator {
  private readonly events: EventManager<IFrameMessagesMap>;
  private readonly callbacks: Map<string, Callback<any>> = new Map();

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
    requestId?: string
  ): void => {
    if (!isInsideIFrame()) {
      console.error("Warning: can't send an iframe message, because the application is not hosted in an iframe");
      return;
    }

    const message: IFrameMessage<M> = { type, data, metadata, requestId };
    window.parent.postMessage(message, '*');
  };

  public sendMessageWithResponse = <M extends keyof IFrameMessagesMap>(
    type: M,
    data: Parameters<IFrameMessagesMap[M]>[0],
    callback: Parameters<IFrameMessagesMap[M]>[2],
    metadata?: Parameters<IFrameMessagesMap[M]>[1]
  ): void => {
    const requestId = createUuid();
    this.registerCallback(requestId, callback);
    this.sendMessage(type, data, metadata, requestId);
  };

  private onMessage = (event: MessageEvent): void => {
    if (!event.data) return;
    const message = event.data as IFrameMessage<any>;
    this.events.emit(message.type, message.data);

    if (message.requestId) {
      this.executeCallback(message.requestId, message.data);
    }
  };

  private registerCallback = <T>(requestId: string, callback?: Callback<T>): void => {
    if (!callback) {
      return;
    }

    this.callbacks.set(requestId, callback);
  };

  private executeCallback = <T>(requestId: string, data: T): void => {
    const callback = this.callbacks.get(requestId);

    if (callback) {
      callback(data);

      this.callbacks.delete(requestId);
    }
  };
}
