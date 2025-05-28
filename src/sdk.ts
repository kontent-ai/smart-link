import { isInsideIFrame } from './utils/iframe';
import { NodeSmartLinkProvider } from './lib/NodeSmartLinkProvider';
import { createStorage, IStorage } from './utils/storage';
import { IFrameCommunicator } from './lib/IFrameCommunicator';
import {
  IFrameMessageType,
  IPreviewIFrameCurrentUrlMessageData,
  IRefreshMessageData,
  IRefreshMessageMetadata,
  ISDKInitializedMessageData,
  ISDKStatusMessageData,
  IUpdateMessageData,
} from './lib/IFrameCommunicatorTypes';
import { watchQueryParamPresence } from './lib/QueryParamPresenceWatcher';
import { defineAllRequiredWebComponents } from './web-components/components';
import { defaultConfiguration, KSLConfiguration, KSLPublicConfiguration } from './utils/configuration';
import { Logger, LogLevel } from './lib/Logger';
import { reload } from './utils/reload';
import { addListener, Callback, emitEvents, EventHandler, EventListeners, removeListener } from './utils/events';

type KontentSmartLinkStoredSettings = Readonly<{
  enabled: boolean;
}>;

export enum KontentSmartLinkEvent {
  Refresh = 'refresh',
  Update = 'update',
}

export type KontentSmartLinkEventMap = Readonly<{
  [KontentSmartLinkEvent.Refresh]: EventHandler<IRefreshMessageData, IRefreshMessageMetadata, Callback>;
  [KontentSmartLinkEvent.Update]: EventHandler<IUpdateMessageData>;
}>;

class KontentSmartLinkSDK {
  private configuration: KSLConfiguration = defaultConfiguration;
  private readonly iframeCommunicator: IFrameCommunicator;
  private readonly nodeSmartLinkProvider: NodeSmartLinkProvider;
  private events: EventListeners<KontentSmartLinkEventMap>;
  private queryPresenceIntervalCleanup: (() => void) | null = null;

  constructor(configuration?: Partial<KSLPublicConfiguration>) {
    this.configuration = { ...this.configuration, ...configuration };
    this.events = new Map();

    this.iframeCommunicator = new IFrameCommunicator();

    this.nodeSmartLinkProvider = new NodeSmartLinkProvider(this.iframeCommunicator, this.configuration);

    this.initialize();
  }

  private static getSettingsStorage(): IStorage<KontentSmartLinkStoredSettings> {
    return createStorage<KontentSmartLinkStoredSettings>('kontent-smart-link:iframe-settings');
  }

  public initialize = async (): Promise<void> => {
    await defineAllRequiredWebComponents();

    const level = this.configuration.debug ? LogLevel.Debug : LogLevel.Info;
    Logger.setLogLevel(level);

    if (this.configuration.queryParam) {
      this.queryPresenceIntervalCleanup = watchQueryParamPresence(
        this.configuration.queryParam,
        this.nodeSmartLinkProvider.toggle
      );
    } else {
      this.nodeSmartLinkProvider.enable();
    }

    if (isInsideIFrame()) {
      this.initializeIFrameCommunication();
    }
  };

  public destroy = (): void => {
    this.events = new Map();
    this.queryPresenceIntervalCleanup?.();
    this.iframeCommunicator.destroy();
    this.nodeSmartLinkProvider.destroy();
  };

  public updateConfiguration = (configuration: Partial<KSLPublicConfiguration>): void => {
    if (configuration.queryParam !== undefined) {
      if (configuration.queryParam === '') {
        this.nodeSmartLinkProvider.enable();
      } else if (configuration.queryParam !== this.configuration.queryParam) {
        this.queryPresenceIntervalCleanup?.();
        this.queryPresenceIntervalCleanup = watchQueryParamPresence(
          configuration.queryParam,
          this.nodeSmartLinkProvider.toggle
        );
      }
    }

    if (configuration.debug) {
      const level = configuration.debug ? LogLevel.Debug : LogLevel.Info;
      Logger.setLogLevel(level);
    }

    this.configuration = { ...this.configuration, ...configuration };
  };

  public on = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    addListener(this.events, event, handler);
  };

  public off = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    removeListener(this.events, event, handler);
  };

  private initializeIFrameCommunication = (): void => {
    this.iframeCommunicator.initialize();

    const storage = KontentSmartLinkSDK.getSettingsStorage();
    const settings = storage.get();
    const enabled = settings !== null ? settings?.enabled : true;

    const messageData: ISDKInitializedMessageData = {
      enabled,
      languageCodename: this.configuration.defaultDataAttributes.languageCodename ?? null,
      projectId: this.configuration.defaultDataAttributes.projectId ?? null,
      supportedFeatures: {
        previewIFrameCurrentUrlHandler: true,
        refreshHandler: true,
        updateHandler: true,
      },
    };

    this.iframeCommunicator.sendMessageWithResponse(IFrameMessageType.Initialized, messageData, () => {
      this.configuration = { ...this.configuration, isInsideWebSpotlight: true };
      this.queryPresenceIntervalCleanup?.();
      this.nodeSmartLinkProvider.disable();

      if (enabled) {
        this.nodeSmartLinkProvider.enable();
      }

      this.iframeCommunicator.addMessageListener(IFrameMessageType.Status, this.handleStatusMessage);
      this.iframeCommunicator.addMessageListener(IFrameMessageType.RefreshPreview, this.handleRefreshMessage);
      this.iframeCommunicator.addMessageListener(IFrameMessageType.UpdatePreview, this.handleUpdateMessage);
      this.iframeCommunicator.addMessageListener(
        IFrameMessageType.PreviewIFrameCurrentUrl,
        this.handlePreviewIFrameCurrentUrlRequestMessage
      );
    });
  };

  private handleStatusMessage = (data: ISDKStatusMessageData): void => {
    if (!data || !this.nodeSmartLinkProvider) return;

    this.nodeSmartLinkProvider.toggle(data.enabled);

    KontentSmartLinkSDK.getSettingsStorage().set({
      enabled: data.enabled,
    });
  };

  private handleRefreshMessage = (data: IRefreshMessageData, metadata: IRefreshMessageMetadata): void => {
    const isCustomRefreshHandlerImplemented = this.events.has(KontentSmartLinkEvent.Refresh);

    if (isCustomRefreshHandlerImplemented) {
      emitEvents(this.events, KontentSmartLinkEvent.Refresh, data, metadata, reload);
    } else {
      reload();
    }
  };

  private handleUpdateMessage = (data: IUpdateMessageData): void => {
    emitEvents(this.events, KontentSmartLinkEvent.Update, data, undefined, undefined);
  };

  private handlePreviewIFrameCurrentUrlRequestMessage = (): void => {
    const messageData: IPreviewIFrameCurrentUrlMessageData = {
      previewUrl: window.location.href,
    };

    this.iframeCommunicator.sendMessage(IFrameMessageType.PreviewIFrameCurrentUrlResponse, messageData);
  };
}

export default KontentSmartLinkSDK;
