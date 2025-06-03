import { isInsideIFrame } from '../utils/iframe';
import { addListener, Callback, emitEvents, EventHandler, EventListeners, removeListener } from '../utils/events';
import {
  IAddActionMessageData,
  IAddButtonInitialMessageData,
  IAddButtonPermissionsServerModel,
  IClickedMessageMetadata,
  IContentComponentClickedMessageData,
  IContentItemClickedMessageData,
  IElementClickedMessageData,
  IFrameMessageType,
  IPreviewIFrameCurrentUrlMessageData,
  IRefreshMessageData,
  IRefreshMessageMetadata,
  ISDKInitializedMessageData,
  ISDKStatusMessageData,
  IUpdateMessageData,
} from './IFrameCommunicatorTypes';
import { createRequestId } from '../utils/request';
import { InvalidEnvironmentError } from '../utils/errors';

export type IFrameMessageMap = Readonly<{
  [IFrameMessageType.Initialized]: EventHandler<ISDKInitializedMessageData, undefined, Callback>;
  [IFrameMessageType.Status]: EventHandler<ISDKStatusMessageData>;
  [IFrameMessageType.ElementClicked]: EventHandler<IElementClickedMessageData, IClickedMessageMetadata>;
  [IFrameMessageType.ContentItemClicked]: EventHandler<IContentItemClickedMessageData, IClickedMessageMetadata>;
  [IFrameMessageType.ContentComponentClicked]: EventHandler<
    IContentComponentClickedMessageData,
    IClickedMessageMetadata
  >;
  [IFrameMessageType.AddInitial]: EventHandler<
    IAddButtonInitialMessageData,
    IClickedMessageMetadata,
    Callback<IAddButtonPermissionsServerModel>
  >;
  [IFrameMessageType.AddAction]: EventHandler<IAddActionMessageData, IClickedMessageMetadata>;
  [IFrameMessageType.RefreshPreview]: EventHandler<IRefreshMessageData, IRefreshMessageMetadata>;
  [IFrameMessageType.UpdatePreview]: EventHandler<IUpdateMessageData>;
  [IFrameMessageType.PreviewIFrameCurrentUrl]: EventHandler;
  [IFrameMessageType.PreviewIFrameCurrentUrlResponse]: EventHandler<IPreviewIFrameCurrentUrlMessageData>;
}>;

type IFrameMessage<TMessageType extends keyof IFrameMessageMap> = Readonly<{
  type: TMessageType;
  data: Parameters<IFrameMessageMap[TMessageType]>[0];
  metadata?: Parameters<IFrameMessageMap[TMessageType]>[1];
  requestId?: string;
}>;

export class IFrameCommunicator {
  private events: EventListeners<IFrameMessageMap> = new Map();
  private readonly callbacks: Map<string, Callback<any>> = new Map();

  public initialize(): void {
    if (!window) {
      throw InvalidEnvironmentError('IFrameCommunicator can only be initialized in a browser environment.');
    }

    window.addEventListener('message', this.onMessage, true);
  }

  public destroy(): void {
    this.events = new Map();
    window.removeEventListener('message', this.onMessage, true);
  }

  public sendMessageWithResponse = <M extends keyof IFrameMessageMap>(
    type: M,
    data: Parameters<IFrameMessageMap[M]>[0],
    callback: Parameters<IFrameMessageMap[M]>[2],
    metadata?: Parameters<IFrameMessageMap[M]>[1]
  ): void => {
    const requestId = createRequestId();

    if (callback) {
      this.callbacks.set(requestId, callback);
    }

    this.sendMessage(type, data, metadata, requestId);
  };

  public sendMessage = <M extends keyof IFrameMessageMap>(
    type: M,
    data: Parameters<IFrameMessageMap[M]>[0],
    metadata?: Parameters<IFrameMessageMap[M]>[1],
    requestId?: string
  ): void => {
    if (!isInsideIFrame()) {
      throw InvalidEnvironmentError('IFrameCommunicator: iframe message can only be send while inside iframe.');
    }

    const message: IFrameMessage<M> = { type, data, metadata, requestId };
    window.parent.postMessage(message, '*');
  };

  public addMessageListener = <M extends keyof IFrameMessageMap>(type: M, listener: IFrameMessageMap[M]): void => {
    addListener(this.events, type, listener);
  };

  public removeMessageListener = <M extends keyof IFrameMessageMap>(type: M, listener: IFrameMessageMap[M]): void => {
    removeListener(this.events, type, listener);
  };

  private onMessage = (event: MessageEvent): void => {
    if (!event.data) return;
    const message = event.data as IFrameMessage<any>;
    emitEvents(this.events, message.type, message.data, message.metadata);

    if (message.requestId) {
      this.executeCallback(message.requestId, message.data);
    }
  };

  private executeCallback = <TData>(requestId: string, data: TData): void => {
    const callback = this.callbacks.get(requestId);

    if (callback) {
      callback(data);

      this.callbacks.delete(requestId);
    }
  };
}
