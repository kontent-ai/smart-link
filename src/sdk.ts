import { isInsideIFrame } from './utils/iframe';
import { NodeSmartLinkProvider } from './lib/NodeSmartLinkProvider';
import { createStorage } from './utils/storage';
import { IFrameCommunicator } from './lib/IFrameCommunicator';
import { IFrameMessageType, ISDKStatusMessageData } from './lib/IFrameCommunicatorTypes';
import { QueryParamPresenceWatcher } from './lib/QueryParamPresenceWatcher';
import { defineAllRequiredWebComponents } from './web-components/components';
import { ConfigurationManager, IConfigurationManager, IKSLConfiguration } from './lib/ConfigurationManager';
import { InvalidEnvironmentError, NotInitializedError } from './utils/errors';
import { Logger, LogLevel } from './lib/Logger';

interface IKontentSmartLinkIFrameSettings {
  readonly enabled: boolean;
}

class KontentSmartLinkSDK {
  private readonly configurationManager: IConfigurationManager;
  private readonly queryParamPresenceWatcher: QueryParamPresenceWatcher;
  private readonly iframeCommunicator: IFrameCommunicator;
  private readonly nodeSmartLinkProvider: NodeSmartLinkProvider;

  constructor(configuration?: Partial<IKSLConfiguration>) {
    this.configurationManager = new ConfigurationManager(configuration);
    this.queryParamPresenceWatcher = new QueryParamPresenceWatcher();
    this.iframeCommunicator = new IFrameCommunicator();

    this.nodeSmartLinkProvider = new NodeSmartLinkProvider(this.iframeCommunicator, this.configurationManager);

    this.initialize();
  }

  public initialize = async (): Promise<void> => {
    await defineAllRequiredWebComponents();

    const level = this.configurationManager.debug ? LogLevel.Debug : LogLevel.Info;
    Logger.setLogLevel(level);

    if (isInsideIFrame()) {
      this.initializeIFrameCommunication();
    } else if (this.configurationManager.queryParam) {
      this.queryParamPresenceWatcher.watch(this.configurationManager.queryParam, this.nodeSmartLinkProvider.toggle);
    } else {
      this.nodeSmartLinkProvider.enable();
    }
  };

  public destroy = (): void => {
    this.queryParamPresenceWatcher.unwatchAll();
    this.iframeCommunicator.destroy();
    this.nodeSmartLinkProvider.destroy();
  };

  public updateConfiguration = (configuration: Partial<IKSLConfiguration>): void => {
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

  private initializeIFrameCommunication = (): void => {
    if (!isInsideIFrame()) {
      throw InvalidEnvironmentError('[KSL]: iframe communication can only be initialized while inside iframe.');
    }

    this.iframeCommunicator.initialize();

    const storage = createStorage<IKontentSmartLinkIFrameSettings>('kontent-smart-link:iframe-settings');
    const stored = storage.get();
    const enabled = stored !== null ? stored?.enabled : true;

    if (enabled) {
      this.nodeSmartLinkProvider.enable();
    }

    this.iframeCommunicator.addMessageListener(IFrameMessageType.Status, (data: ISDKStatusMessageData) => {
      if (!data || !this.nodeSmartLinkProvider) return;

      this.nodeSmartLinkProvider.toggle(data.enabled);

      storage.set({
        enabled: data.enabled,
      });
    });

    this.iframeCommunicator.sendMessage(IFrameMessageType.Initialized, {
      projectId: this.configurationManager.defaultProjectId ?? null,
      languageCodename: this.configurationManager.defaultLanguageCodename ?? null,
      enabled,
    });
  };
}

class KontentSmartLink {
  private static instance: KontentSmartLink;
  private sdk: KontentSmartLinkSDK | null = null;

  public static initializeOnLoad(configuration?: Partial<IKSLConfiguration>): Promise<KontentSmartLink> {
    return new Promise<KontentSmartLink>((resolve) => {
      window.addEventListener('load', () => {
        resolve(KontentSmartLink.initialize(configuration));
      });
    });
  }

  public static initialize(configuration?: Partial<IKSLConfiguration>): KontentSmartLink {
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

  public setConfiguration = (configuration: Partial<IKSLConfiguration>): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.updateConfiguration(configuration);
    }
  };
}

export default KontentSmartLink;
