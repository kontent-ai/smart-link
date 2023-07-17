import { NodeSmartLinkProvider } from './lib/NodeSmartLinkProvider';
import { createStorage, IStorage } from './utils/storage';
import { defineAllRequiredWebComponents } from './web-components/components';
import { ConfigurationManager, IConfigurationManager, IKSLPublicConfiguration } from './lib/ConfigurationManager';
import { InvalidEnvironmentError, NotInitializedError } from './utils/errors';
import { reload } from './utils/reload';
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
import { EventDescriptor, EventEmitter, EventListener } from './helpers/EventEmitter';
import { ILogger, Logger, LogLevel } from './helpers/Logger';
import { QueryParamPresenceWatcher } from './helpers/QueryParamPresenceWatcher';

interface IKontentSmartLinkStoredSettings {
  readonly enabled: boolean;
}

export enum KontentSmartLinkEvent {
  Refresh = 'refresh',
}

type KontentSmartLinkSDKEventsMap = {
  readonly [KontentSmartLinkEvent.Refresh]: EventDescriptor<{
    readonly data: IReloadPreviewMessageData;
    readonly metadata: IReloadPreviewMessageMetadata;
    readonly originalRefresh: () => void;
  }>;
};

type DeprecateRefreshHandler = (
  data: IReloadPreviewMessageData,
  metadata: IReloadPreviewMessageMetadata,
  callback: () => void
) => void;

class KontentSmartLinkSDK extends EventEmitter<KontentSmartLinkSDKEventsMap> {
  private readonly listenersCache = new WeakMap();

  private readonly parentWindowCommunicationAPI: IParentWindowCommunicationAPI;
  private readonly messageService: IMessageService;
  private readonly configurationManager: IConfigurationManager;
  private readonly queryParamPresenceWatcher: QueryParamPresenceWatcher;
  private readonly nodeSmartLinkProvider: NodeSmartLinkProvider;
  private readonly logger: ILogger;

  constructor(configuration?: Partial<IKSLPublicConfiguration>) {
    super();

    this.configurationManager = ConfigurationManager.getInstance();
    this.configurationManager.update(configuration);

    this.logger = new Logger();
    this.logger.setLogLevel(this.configurationManager.debug ? LogLevel.Debug : LogLevel.Info);

    this.queryParamPresenceWatcher = new QueryParamPresenceWatcher(window);

    this.parentWindowCommunicationAPI = new ParentWindowCommunicationAPI(window);
    this.messageService = new MessageService(this.parentWindowCommunicationAPI);
    this.nodeSmartLinkProvider = new NodeSmartLinkProvider(this.messageService, this.logger);

    this.handleRefreshMessage = this.handleRefreshMessage.bind(this);
    this.handleStatusMessage = this.handleStatusMessage.bind(this);

    this.initialize();
  }

  private static getSettingsStorage(): IStorage<IKontentSmartLinkStoredSettings> {
    return createStorage<IKontentSmartLinkStoredSettings>('kontent-smart-link:iframe-settings');
  }

  public initialize = async (): Promise<void> => {
    await defineAllRequiredWebComponents();

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
    this.queryParamPresenceWatcher.unwatchAll();
    this.nodeSmartLinkProvider.destroy();

    this.messageService.unlisten();
    this.removeAllListeners();
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
      this.logger.setLogLevel(configuration.debug ? LogLevel.Debug : LogLevel.Info);
    }

    this.configurationManager.update(configuration);
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
    const isCustomRefreshHandlerImplemented = this.hasListener(KontentSmartLinkEvent.Refresh);

    if (isCustomRefreshHandlerImplemented) {
      this.emit(KontentSmartLinkEvent.Refresh, {
        data: message.data,
        metadata: message.metadata,
        originalRefresh: reload,
      });
    } else {
      reload();
    }
  }

  /**
   * @deprecated This function is deprecated, please use `addListener` instead.
   */
  public on(event: KontentSmartLinkEvent.Refresh, handler: DeprecateRefreshHandler): void {
    this.logger.warn('The `on` method is deprectated. Please use `addListener` instead.');
    const transformedHandler: EventListener<KontentSmartLinkSDKEventsMap[KontentSmartLinkEvent.Refresh]> = ({
      data,
      metadata,
      originalRefresh,
    }) => {
      handler(data, metadata, originalRefresh);
    };

    this.listenersCache.set(handler, transformedHandler);
    this.addListener(event, transformedHandler);
  }

  /**
   * @deprecated This function is deprecated, please use `removeListener` instead.
   */
  public off(event: KontentSmartLinkEvent.Refresh, handler: DeprecateRefreshHandler): void {
    this.logger.warn('The `off` method is deprectated. Please use `removeListener` instead.');
    const transformedHandler = this.listenersCache.get(handler);
    this.removeListener(event, transformedHandler);
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

  public addListener = <T extends keyof KontentSmartLinkSDKEventsMap>(
    event: T,
    listener: EventListener<KontentSmartLinkSDKEventsMap[T]>
  ): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.addListener(event, listener);
    }
  };

  public removeListener = <T extends keyof KontentSmartLinkSDKEventsMap>(
    event: T,
    listener: EventListener<KontentSmartLinkSDKEventsMap[T]>
  ): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.removeListener(event, listener);
    }
  };

  /**
   * @deprecated This function is deprecated, please use `addListener` instead.
   */
  public on = (event: KontentSmartLinkEvent.Refresh, handler: DeprecateRefreshHandler): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.on(event, handler);
    }
  };

  /**
   * @deprecated This function is deprecated, please use `removeListener` instead.
   */
  public off = (event: KontentSmartLinkEvent.Refresh, handler: DeprecateRefreshHandler): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.off(event, handler);
    }
  };
}

export default KontentSmartLink;
