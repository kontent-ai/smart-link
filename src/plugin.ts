import { isInsideIFrame } from './utils/iframe';
import { buildKontentLink } from './utils/link';
import { NodeSmartLinkProvider, NodeSmartLinkProviderEventType } from './lib/NodeSmartLinkProvider';
import { createStorage } from './utils/storage';
import { validateDummyElementMessageData, validateElementClickMessageData } from './utils/validation';
import { IFrameCommunicator } from './lib/IFrameCommunicator';
import {
  IElementClickedMessageData,
  IElementClickedMessageMetadata,
  IFrameMessageType,
  IPluginStatusMessageData,
} from './lib/IFrameCommunicatorTypes';
import { QueryParamPresenceWatcher } from './lib/QueryParamPresenceWatcher';
import { defineAllRequiredWebComponents } from './web-components/components';

interface IKontentSmartLinkIframeSettings {
  readonly enabled: boolean;
}

export interface IKontentSmartLinkConfiguration {
  readonly languageCodename: string | null;
  readonly projectId: string | null;
  readonly queryParam?: string;
}

const defaultConfiguration: IKontentSmartLinkConfiguration = {
  languageCodename: null,
  projectId: null,
  queryParam: 'kontent-smart-link-enabled',
};

class Plugin {
  private configuration: IKontentSmartLinkConfiguration;
  private iFrameCommunicator: IFrameCommunicator | null = null;
  private readonly nodeSmartLinkProvider: NodeSmartLinkProvider;
  private readonly queryParamPresenceWatcher: QueryParamPresenceWatcher;

  constructor(configuration?: Partial<IKontentSmartLinkConfiguration>) {
    this.nodeSmartLinkProvider = new NodeSmartLinkProvider();
    this.queryParamPresenceWatcher = new QueryParamPresenceWatcher();

    this.configuration = { ...defaultConfiguration, ...configuration };

    this.initialize();
  }

  public initialize = async (): Promise<void> => {
    await this.registerCustomElements();

    if (isInsideIFrame()) {
      this.initializeIFrameCommunication();
    } else if (this.configuration.queryParam) {
      this.queryParamPresenceWatcher.watch(this.configuration.queryParam, this.toggleNodeSmartLinkProvider);
    } else {
      this.nodeSmartLinkProvider.enable();
    }

    this.listenToHighlighterEvents();
  };

  public destroy = (): void => {
    this.queryParamPresenceWatcher.unwatchAll();
    this.nodeSmartLinkProvider.destroy();
    this.iFrameCommunicator?.destroy();
  };

  public updateConfiguration = (configuration: Partial<IKontentSmartLinkConfiguration>): void => {
    if (typeof configuration.queryParam !== 'undefined') {
      if (!configuration.queryParam) {
        this.nodeSmartLinkProvider.enable();
      } else if (configuration.queryParam !== this.configuration.queryParam) {
        this.queryParamPresenceWatcher.unwatchAll();
        this.queryParamPresenceWatcher.watch(configuration.queryParam, this.toggleNodeSmartLinkProvider);
      }
    }

    this.configuration = { ...this.configuration, ...configuration };
  };

  private registerCustomElements = async (): Promise<void[]> => {
    return defineAllRequiredWebComponents();
  };

  private initializeIFrameCommunication = (): void => {
    if (!isInsideIFrame() || this.iFrameCommunicator) {
      throw new Error('Cannot initialize iframe communication while not inside the iframe.');
    }

    this.iFrameCommunicator = new IFrameCommunicator();

    const storage = createStorage<IKontentSmartLinkIframeSettings>('kontent-smart-link:iframe-settings');
    const stored = storage.get();
    const enabled = stored !== null ? stored?.enabled : true;

    if (enabled) {
      this.nodeSmartLinkProvider.enable();
    }

    this.iFrameCommunicator.addMessageListener(IFrameMessageType.Status, (data: IPluginStatusMessageData) => {
      if (!data || !this.nodeSmartLinkProvider) return;

      this.toggleNodeSmartLinkProvider(data.enabled);

      storage.set({
        enabled: data.enabled,
      });
    });

    this.iFrameCommunicator.sendMessage(IFrameMessageType.Initialized, {
      projectId: this.configuration.projectId,
      languageCodename: this.configuration.languageCodename,
      enabled: enabled,
    });
  };

  private listenToHighlighterEvents = (): void => {
    this.nodeSmartLinkProvider.addEventListener(NodeSmartLinkProviderEventType.ElementClicked, this.onEditElementClick);
    this.nodeSmartLinkProvider.addEventListener(NodeSmartLinkProviderEventType.ElementDummy, this.onDummyAction);
  };

  private onEditElementClick = (
    elementClickData: Partial<IElementClickedMessageData>,
    elementClickMetadata: IElementClickedMessageMetadata
  ): void => {
    const data: Partial<IElementClickedMessageData> = {
      ...elementClickData,
      projectId: elementClickData.projectId || this.configuration.projectId || undefined,
      languageCodename: elementClickData.languageCodename || this.configuration.languageCodename || undefined,
    };

    if (validateElementClickMessageData(data)) {
      if (isInsideIFrame() && this.iFrameCommunicator) {
        this.iFrameCommunicator.sendMessage(IFrameMessageType.ElementClicked, data, elementClickMetadata);
      } else {
        const link = buildKontentLink(data);
        window.open(link, '_blank');
      }
    }
  };

  private onDummyAction = (
    elementClickData: Partial<any>,
    elementClickMetadata: IElementClickedMessageMetadata
  ): void => {
    const data: Partial<any> = {
      ...elementClickData,
      projectId: elementClickData.projectId || this.configuration.projectId || undefined,
      languageCodename: elementClickData.languageCodename || this.configuration.languageCodename || undefined,
      dummy: 'This is dummy data payload',
    };

    if (validateDummyElementMessageData(data)) {
      if (isInsideIFrame() && this.iFrameCommunicator) {
        this.iFrameCommunicator.sendMessageWithResponse(
          IFrameMessageType.ElementDummy,
          data,
          () => console.log('This is a registered callback method'),
          elementClickMetadata
        );
      } else {
        return;
      }
    }
  };

  private toggleNodeSmartLinkProvider = (force?: boolean): void => {
    const shouldEnable = typeof force !== 'undefined' ? force : !this.nodeSmartLinkProvider.enabled;
    if (shouldEnable) {
      this.nodeSmartLinkProvider.enable();
    } else {
      this.nodeSmartLinkProvider.disable();
    }
  };
}

class KontentSmartLink {
  private static instance: KontentSmartLink;
  private plugin: Plugin | null = null;

  public static initializeOnLoad(configuration?: Partial<IKontentSmartLinkConfiguration>): Promise<KontentSmartLink> {
    return new Promise<KontentSmartLink>((resolve) => {
      window.addEventListener('load', () => {
        resolve(KontentSmartLink.initialize(configuration));
      });
    });
  }

  public static initialize(configuration?: Partial<IKontentSmartLinkConfiguration>): KontentSmartLink {
    if (!KontentSmartLink.instance) {
      KontentSmartLink.instance = new KontentSmartLink();
    }

    if (!KontentSmartLink.instance.plugin) {
      KontentSmartLink.instance.plugin = new Plugin(configuration);
    }

    return KontentSmartLink.instance;
  }

  public destroy = (): void => {
    this.plugin?.destroy();
    this.plugin = null;
  };

  public setConfiguration = (configuration: Partial<IKontentSmartLinkConfiguration>): void => {
    if (!this.plugin) {
      throw new Error('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.plugin.updateConfiguration(configuration);
    }
  };
}

export default KontentSmartLink;
