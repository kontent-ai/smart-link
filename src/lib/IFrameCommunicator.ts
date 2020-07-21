import { isInsideIFrame } from '../utils/iframe';
import { EventManager } from './EventManager';

export interface IPluginInitializedMessageData {
  readonly projectId: string | null;
  readonly languageCodename: string | null;
  readonly enabled: boolean;
}

export interface IElementClickedMessageData {
  readonly projectId: string;
  readonly languageCodename: string;
  readonly itemId: string;
  readonly elementCodename: string;
}

export interface IPluginStatusMessageData {
  readonly enabled: boolean;
}

export enum IFrameMessageType {
  ElementClicked = 'kontent-smart-link:element:clicked',
  Initialized = 'kontent-smart-link:initialized',
  Status = 'kontent-smart-link:status',
}

export type IFrameMessagesMap = {
  readonly [IFrameMessageType.Initialized]: (data: IPluginInitializedMessageData) => void;
  readonly [IFrameMessageType.ElementClicked]: (data: IElementClickedMessageData) => void;
  readonly [IFrameMessageType.Status]: (data: IPluginStatusMessageData) => void;
};

export interface IFrameMessage<E extends keyof IFrameMessagesMap> {
  readonly type: E;
  readonly data: Parameters<IFrameMessagesMap[E]>[0];
}

export class IFrameCommunicator {
  private readonly events: EventManager<IFrameMessagesMap>;

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
    data: Parameters<IFrameMessagesMap[M]>[0]
  ): void => {
    if (!isInsideIFrame()) {
      console.error("Warning: can't send an iframe message, because the application is not hosted in an iframe");
      return;
    }

    const message: IFrameMessage<M> = { type, data };
    window.parent.postMessage(message, '*');
  };

  private onMessage = (event: MessageEvent): void => {
    if (!event.data) return;
    const message = event.data as IFrameMessage<any>;
    this.events.emit(message.type, message.data);
  };
}
