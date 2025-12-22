import { DOMSmartLinkManager } from "./lib/DOMSmartLinkManager";
import { IFrameCommunicator } from "./lib/IFrameCommunicator";
import {
  IFrameMessageType,
  type IPreviewIFrameCurrentUrlMessageData,
  type IRefreshMessageData,
  type IRefreshMessageMetadata,
  type ISDKInitializedMessageData,
  type ISDKStatusMessageData,
  type IUpdateMessageData,
} from "./lib/IFrameCommunicatorTypes";
import { LogLevel, setLogLevel } from "./lib/Logger";
import {
  defaultConfiguration,
  type KSLConfiguration,
  type KSLPublicConfiguration,
} from "./utils/configuration";
import {
  addListener,
  type Callback,
  type EventHandler,
  type EventListeners,
  emitEvents,
  removeListener,
} from "./utils/events";
import { isInsideIFrame } from "./utils/iframe";
import { watchQueryParamPresence } from "./utils/queryParams";
import { reload } from "./utils/reload";
import { createStorage, type IStorage } from "./utils/storage";
import { defineAllRequiredWebComponents } from "./web-components/components";

type KontentSmartLinkStoredSettings = Readonly<{
  enabled: boolean;
}>;

export enum KontentSmartLinkEvent {
  Refresh = "refresh",
  Update = "update",
}

export type KontentSmartLinkEventMap = Readonly<{
  [KontentSmartLinkEvent.Refresh]: EventHandler<
    IRefreshMessageData,
    IRefreshMessageMetadata,
    Callback
  >;
  [KontentSmartLinkEvent.Update]: EventHandler<IUpdateMessageData>;
}>;

class KontentSmartLinkSDK {
  private configuration: KSLConfiguration = defaultConfiguration;
  private readonly iframeCommunicator: IFrameCommunicator;
  private readonly domSmartLinkManager: DOMSmartLinkManager;
  private events: EventListeners<KontentSmartLinkEventMap>;
  private queryPresenceIntervalCleanup: (() => void) | null = null;

  constructor(configuration?: Partial<KSLPublicConfiguration>) {
    this.configuration = { ...this.configuration, ...configuration };
    this.events = new Map();

    this.iframeCommunicator = new IFrameCommunicator();

    this.domSmartLinkManager = new DOMSmartLinkManager(this.iframeCommunicator, this.configuration);

    void this.initialize();
  }

  private static getSettingsStorage(): IStorage<KontentSmartLinkStoredSettings> {
    return createStorage<KontentSmartLinkStoredSettings>("kontent-smart-link:iframe-settings");
  }

  public initialize = async (): Promise<void> => {
    await defineAllRequiredWebComponents();

    const level = this.configuration.debug ? LogLevel.Debug : LogLevel.Info;
    setLogLevel(level);

    if (this.configuration.queryParam) {
      this.queryPresenceIntervalCleanup = watchQueryParamPresence(
        this.configuration.queryParam,
        this.domSmartLinkManager.toggle,
      );
    } else {
      this.domSmartLinkManager.enable();
    }

    if (isInsideIFrame()) {
      this.initializeIFrameCommunication();
    }
  };

  public destroy = (): void => {
    this.events = new Map();
    this.queryPresenceIntervalCleanup?.();
    this.iframeCommunicator.destroy();
    this.domSmartLinkManager.destroy();
  };

  public updateConfiguration = (configuration: Partial<KSLPublicConfiguration>): void => {
    if (configuration.queryParam !== undefined) {
      if (configuration.queryParam === "") {
        this.domSmartLinkManager.enable();
      } else if (configuration.queryParam !== this.configuration.queryParam) {
        this.queryPresenceIntervalCleanup?.();
        this.queryPresenceIntervalCleanup = watchQueryParamPresence(
          configuration.queryParam,
          this.domSmartLinkManager.toggle,
        );
      }
    }

    if (configuration.debug === true) {
      setLogLevel(LogLevel.Debug);
    }

    // need to use .assign to prevent changing the reference of the configuration object
    Object.assign(this.configuration, configuration);
  };

  public on = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent],
  ): void => {
    addListener(this.events, event, handler);
  };

  public off = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent],
  ): void => {
    removeListener(this.events, event, handler);
  };

  private initializeIFrameCommunication = (): void => {
    this.iframeCommunicator.initialize();

    const storage = KontentSmartLinkSDK.getSettingsStorage();
    const settings = storage.get();
    const enabled = settings !== null ? settings.enabled : true;

    const messageData: ISDKInitializedMessageData = {
      enabled,
      languageCodename: this.configuration.defaultDataAttributes.languageCodename ?? null,
      projectId: this.configuration.defaultDataAttributes.environmentId ?? null,
      supportedFeatures: {
        previewIFrameCurrentUrlHandler: true,
        refreshHandler: true,
        updateHandler: true,
      },
    };

    this.iframeCommunicator.sendMessageWithResponse(
      IFrameMessageType.Initialized,
      messageData,
      () => {
        Object.assign(this.configuration, { isInsideWebSpotlight: true });
        this.queryPresenceIntervalCleanup?.();
        this.domSmartLinkManager.disable();

        if (enabled) {
          this.domSmartLinkManager.enable();
        }

        this.iframeCommunicator.addMessageListener(
          IFrameMessageType.Status,
          this.handleStatusMessage,
        );
        this.iframeCommunicator.addMessageListener(
          IFrameMessageType.RefreshPreview,
          this.handleRefreshMessage,
        );
        this.iframeCommunicator.addMessageListener(
          IFrameMessageType.UpdatePreview,
          this.handleUpdateMessage,
        );
        this.iframeCommunicator.addMessageListener(
          IFrameMessageType.PreviewIFrameCurrentUrl,
          this.handlePreviewIFrameCurrentUrlRequestMessage,
        );
      },
    );
  };

  private handleStatusMessage = (data: ISDKStatusMessageData): void => {
    this.domSmartLinkManager.toggle(data.enabled);

    KontentSmartLinkSDK.getSettingsStorage().set({
      enabled: data.enabled,
    });
  };

  private handleRefreshMessage = (
    data: IRefreshMessageData,
    metadata: IRefreshMessageMetadata,
  ): void => {
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

    this.iframeCommunicator.sendMessage(
      IFrameMessageType.PreviewIFrameCurrentUrlResponse,
      messageData,
    );
  };
}

export default KontentSmartLinkSDK;
