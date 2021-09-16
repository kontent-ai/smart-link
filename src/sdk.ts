import { isInsideIFrame } from './utils/iframe';
import { NodeSmartLinkProvider } from './lib/NodeSmartLinkProvider';
import { createStorage } from './utils/storage';
import { IFrameCommunicator } from './lib/IFrameCommunicator';
import { IFrameMessageType, ISDKInitializedMessageData, ISDKStatusMessageData } from './lib/IFrameCommunicatorTypes';
import { QueryParamPresenceWatcher } from './lib/QueryParamPresenceWatcher';
import { defineAllRequiredWebComponents } from './web-components/components';
import { ConfigurationManager, IConfigurationManager, IKSLPublicConfiguration } from './lib/ConfigurationManager';
import { NotInitializedError } from './utils/errors';
import { Logger, LogLevel } from './lib/Logger';
import { reload } from './utils/reload';

interface IKontentSmartLinkIFrameSettings {
  readonly enabled: boolean;
}

class KontentSmartLinkSDK {
  private readonly configurationManager: IConfigurationManager;
  private readonly queryParamPresenceWatcher: QueryParamPresenceWatcher;
  private readonly iframeCommunicator: IFrameCommunicator;
  private readonly nodeSmartLinkProvider: NodeSmartLinkProvider;

  constructor(configuration?: Partial<IKSLPublicConfiguration>) {
    this.configurationManager = ConfigurationManager.getInstance();
    this.configurationManager.update(configuration);

    this.queryParamPresenceWatcher = new QueryParamPresenceWatcher();
    this.iframeCommunicator = new IFrameCommunicator();

    this.nodeSmartLinkProvider = new NodeSmartLinkProvider(this.iframeCommunicator);

    this.initialize();
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

    if (isInsideIFrame()) {
      this.initializeIFrameCommunication();
    }
  };

  public destroy = (): void => {
    this.queryParamPresenceWatcher.unwatchAll();
    this.iframeCommunicator.destroy();
    this.nodeSmartLinkProvider.destroy();
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

  private initializeIFrameCommunication = (): void => {
    this.iframeCommunicator.initialize();

    const storage = createStorage<IKontentSmartLinkIFrameSettings>('kontent-smart-link:iframe-settings');
    const stored = storage.get();
    const enabled = stored !== null ? stored?.enabled : true;

    const messageData: ISDKInitializedMessageData = {
      enabled,
      languageCodename: this.configurationManager.defaultLanguageCodename ?? null,
      projectId: this.configurationManager.defaultProjectId ?? null,
      supportedFeatures: {
        refreshHandler: true,
      },
    };

    this.iframeCommunicator.sendMessageWithResponse(IFrameMessageType.Initialized, messageData, () => {
      this.configurationManager.update({ isInsideWebSpotlight: true });
      this.queryParamPresenceWatcher.unwatchAll();
      this.nodeSmartLinkProvider.disable();

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

      this.iframeCommunicator.addMessageListener(IFrameMessageType.RefreshPreview, () => {
        reload();
      });
    });
  };
}

class KontentSmartLink {
  private static instance: KontentSmartLink;
  private sdk: KontentSmartLinkSDK | null = null;

  public static initializeOnLoad(configuration?: Partial<IKSLPublicConfiguration>): Promise<KontentSmartLink> {
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
}

export default KontentSmartLink;
