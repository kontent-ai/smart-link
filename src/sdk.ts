import { NodeSmartLinkProvider } from './lib/NodeSmartLinkProvider';
import { createStorage, IStorage } from './utils/storage';
import { QueryParamPresenceWatcher } from './lib/QueryParamPresenceWatcher';
import { defineAllRequiredWebComponents } from './web-components/components';
import { ConfigurationManager, IConfigurationManager, IKSLPublicConfiguration } from './lib/ConfigurationManager';
import { InvalidEnvironmentError, NotInitializedError } from './utils/errors';
import { Logger, LogLevel } from './lib/Logger';
import { reload } from './utils/reload';
import { Callback, EventHandler, EventManager } from './lib/EventManager';
import { IMessageService, MessageService } from './services/MessageService';
import { IParentWindowCommunicationAPI, ParentWindowCommunicationAPI } from './helpers/ParentWindowCommunicationAPI';
import { ClientMessageType } from './models/clientMessages';
import {
  HostMessageType,
  IReloadPreviewHostMessage,
  IReloadPreviewMessageData,
  IReloadPreviewMessageMetadata,
  ISdkStatusHostMessage,
} from './models/hostMessages';

interface IKontentSmartLinkStoredSettings {
  readonly enabled: boolean;
}

export enum KontentSmartLinkEvent {
  Refresh = 'refresh',
}

type KontentSmartLinkEventMap = {
  readonly [KontentSmartLinkEvent.Refresh]: EventHandler<
    IReloadPreviewMessageData,
    IReloadPreviewMessageMetadata,
    Callback
  >;
};

class KontentSmartLinkSDK {
  private readonly parentWindowCommunicationAPI: IParentWindowCommunicationAPI;
  private readonly messageService: IMessageService;
  private readonly configurationManager: IConfigurationManager;
  private readonly queryParamPresenceWatcher: QueryParamPresenceWatcher;
  private readonly nodeSmartLinkProvider: NodeSmartLinkProvider;
  private readonly events: EventManager<KontentSmartLinkEventMap>;

  constructor(configuration?: Partial<IKSLPublicConfiguration>) {
    this.configurationManager = ConfigurationManager.getInstance();
    this.configurationManager.update(configuration);

    this.events = new EventManager<KontentSmartLinkEventMap>();
    this.queryParamPresenceWatcher = new QueryParamPresenceWatcher();

    this.parentWindowCommunicationAPI = new ParentWindowCommunicationAPI(window);
    this.messageService = new MessageService(this.parentWindowCommunicationAPI);
    this.nodeSmartLinkProvider = new NodeSmartLinkProvider(this.messageService);

    this.handleRefreshMessage = this.handleRefreshMessage.bind(this);
    this.handleStatusMessage = this.handleStatusMessage.bind(this);

    this.initialize();
  }

  private static getSettingsStorage(): IStorage<IKontentSmartLinkStoredSettings> {
    return createStorage<IKontentSmartLinkStoredSettings>('kontent-smart-link:iframe-settings');
  }

  public initialize = async (): Promise<void> => {
    await defineAllRequiredWebComponents();

    const level = this.configurationManager.debug ? LogLevel.Debug : LogLevel.Info;
    Logger.setLogLevel(level);

    if (this.configurationManager.queryParam) {
      this.queryParamPresenceWatcher.watch(this.configurationManager.queryParam, this.nodeSmartLinkProvider.toggle);
    } else {
      this.nodeSmartLinkProvider.enable();
    }

    if (this.parentWindowCommunicationAPI.isEmbedded) {
      this.initializeParentWindowCommunication();
    }
  };

  public destroy = (): void => {
    this.events.removeAllListeners();
    this.queryParamPresenceWatcher.unwatchAll();
    this.nodeSmartLinkProvider.destroy();

    this.messageService.unlisten();
  };

  public updateConfiguration = (configuration: Partial<IKSLPublicConfiguration>): void => {
    if (typeof configuration.queryParam !== 'undefined') {
      if (!configuration.queryParam) {
        this.nodeSmartLinkProvider.enable();
      } else if (configuration.queryParam !== this.configurationManager.queryParam) {
        this.queryParamPresenceWatcher.unwatchAll();
        this.queryParamPresenceWatcher.watch(configuration.queryParam, this.nodeSmartLinkProvider.toggle);
      }
    }

    if (typeof configuration.debug !== 'undefined') {
      const level = configuration.debug ? LogLevel.Debug : LogLevel.Info;
      Logger.setLogLevel(level);
    }

    this.configurationManager.update(configuration);
  };

  public on = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    this.events.on(event, handler);
  };

  public off = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    this.events.off(event, handler);
  };

  private initializeParentWindowCommunication = async (): Promise<void> => {
    this.messageService.listen();

    const storage = KontentSmartLinkSDK.getSettingsStorage();
    const settings = storage.get();
    const enabled = settings !== null ? settings?.enabled : true;

    await this.messageService.sendMessageWithResponse({
      type: ClientMessageType.Initialized,
      data: {
        enabled,
        languageCodename: this.configurationManager.defaultLanguageCodename ?? null,
        projectId: this.configurationManager.defaultProjectId ?? null,
        supportedFeatures: {
          refreshHandler: true,
        },
      },
    });

    this.configurationManager.update({ isInsideWebSpotlight: true });
    this.queryParamPresenceWatcher.unwatchAll();
    this.nodeSmartLinkProvider.disable();

    if (enabled) {
      this.nodeSmartLinkProvider.enable();
    }

    this.messageService.addListener(HostMessageType.Status, this.handleStatusMessage);
    this.messageService.addListener(HostMessageType.RefreshPreview, this.handleRefreshMessage);
  };

  private handleStatusMessage(message: ISdkStatusHostMessage): void {
    if (!message || !message.data || !this.nodeSmartLinkProvider) return;

    this.nodeSmartLinkProvider.toggle(message.data.enabled);

    KontentSmartLinkSDK.getSettingsStorage().set({
      enabled: message.data.enabled,
    });
  }

  private handleRefreshMessage(message: IReloadPreviewHostMessage): void {
    const isCustomRefreshHandlerImplemented = this.events.hasEventListener(KontentSmartLinkEvent.Refresh);

    if (isCustomRefreshHandlerImplemented) {
      this.events.emit(KontentSmartLinkEvent.Refresh, message.data, message.metadata, reload);
    } else {
      reload();
    }
  }
}

class KontentSmartLink {
  private static instance: KontentSmartLink;
  private sdk: KontentSmartLinkSDK | null = null;

  public static initializeOnLoad(configuration?: Partial<IKSLPublicConfiguration>): Promise<KontentSmartLink> {
    if (typeof window === 'undefined') {
      throw InvalidEnvironmentError('KontentSmartLink can only be initialized in a browser environment.');
    }

    return new Promise<KontentSmartLink>((resolve) => {
      window.addEventListener('load', () => {
        resolve(KontentSmartLink.initialize(configuration));
      });
    });
  }

  public static initialize(configuration?: Partial<IKSLPublicConfiguration>): KontentSmartLink {
    if (!KontentSmartLink.instance) {
      KontentSmartLink.instance = new KontentSmartLink();
    }

    if (!KontentSmartLink.instance.sdk) {
      KontentSmartLink.instance.sdk = new KontentSmartLinkSDK(configuration);
    }

    return KontentSmartLink.instance;
  }

  public destroy = (): void => {
    this.sdk?.destroy();
    this.sdk = null;
  };

  public setConfiguration = (configuration: Partial<IKSLPublicConfiguration>): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.updateConfiguration(configuration);
    }
  };

  public on = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.on(event, handler);
    }
  };

  public off = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.off(event, handler);
    }
  };
}

export default KontentSmartLink;
