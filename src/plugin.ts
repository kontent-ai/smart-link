import { isInsideIFrame } from './utils/iframe';
import { buildKontentLink } from './utils/link';
import {
  IElementClickedMessageData,
  IFrameCommunicator,
  IFrameMessageType,
  IPluginStatusMessageData,
} from './lib/IFrameCommunicator';
import { NodeSmartLinkProvider, NodeSmartLinkProviderEventType } from './lib/NodeSmartLinkProvider';
import { createStorage } from './utils/storage';
import { validateElementClickMessageData } from './utils/validation';
import { isQueryParamPresent } from './utils/query';

interface IPluginState {
  readonly queryTimerId: ReturnType<typeof setTimeout>;
}

interface IPluginIFrameSettings {
  readonly enabled: boolean;
}

export interface IPluginConfiguration {
  readonly languageCodename: string | null;
  readonly projectId: string | null;
  readonly queryParam: string;
}

const initialState: IPluginState = {
  queryTimerId: 0,
};

const defaultConfiguration: IPluginConfiguration = {
  languageCodename: null,
  projectId: null,
  queryParam: 'kontent-smart-link-enabled',
};

class Plugin {
  private state: IPluginState;
  private configuration: IPluginConfiguration;
  private iFrameCommunicator?: IFrameCommunicator;
  private readonly nodeSmartLinkProvider: NodeSmartLinkProvider;

  constructor(configuration?: Partial<IPluginConfiguration>) {
    this.nodeSmartLinkProvider = new NodeSmartLinkProvider();

    this.state = initialState;
    this.configuration = { ...defaultConfiguration, ...configuration };

    if (isInsideIFrame()) {
      this.initializeIFrameCommunication();
    } else {
      this.watchQueryParams();
    }

    this.listenToHighlighterEvents();
  }

  public destroy = (): void => {
    this.unwatchQueryParams();
    this.nodeSmartLinkProvider.destroy();
    this.iFrameCommunicator?.destroy();
  };

  public updateConfiguration = (configuration: Partial<IPluginConfiguration>): void => {
    this.configuration = { ...this.configuration, ...configuration };
  };

  private updateState = (state: Partial<IPluginState>): void => {
    this.state = { ...this.state, ...state };
  };

  private initializeIFrameCommunication = (): void => {
    if (!isInsideIFrame() || this.iFrameCommunicator) {
      throw new Error('Cannot initialize iframe communication while not inside the iframe.');
    }

    this.iFrameCommunicator = new IFrameCommunicator();

    const storage = createStorage<IPluginIFrameSettings>('kontent-smart-link:iframe-settings');
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

  private watchQueryParams = (): void => {
    if (isInsideIFrame()) {
      throw new Error('No need to watch query params inside the iframe.');
    }

    if (this.state.queryTimerId) {
      clearTimeout(this.state.queryTimerId);
    }

    const isPluginEnabled = isQueryParamPresent(this.configuration.queryParam);
    const hasChanged = this.nodeSmartLinkProvider.enabled !== isPluginEnabled;

    if (hasChanged) {
      this.toggleNodeSmartLinkProvider(isPluginEnabled);
    }

    this.updateState({
      queryTimerId: setTimeout(this.watchQueryParams, 1000),
    });
  };

  private unwatchQueryParams = (): void => {
    clearTimeout(this.state.queryTimerId);
  };

  private listenToHighlighterEvents = (): void => {
    this.nodeSmartLinkProvider.addEventListener(NodeSmartLinkProviderEventType.ElementClicked, this.onElementClick);
  };

  private onElementClick = (elementClickData: Partial<IElementClickedMessageData>): void => {
    const data: Partial<IElementClickedMessageData> = {
      ...elementClickData,
      projectId: elementClickData.projectId || this.configuration.projectId || undefined,
      languageCodename: elementClickData.languageCodename || this.configuration.languageCodename || undefined,
    };

    if (validateElementClickMessageData(data)) {
      if (isInsideIFrame() && this.iFrameCommunicator) {
        this.iFrameCommunicator.sendMessage(IFrameMessageType.ElementClicked, data as IElementClickedMessageData);
      } else {
        const link = buildKontentLink(data);
        window.open(link, '_blank');
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

class PluginWrapper {
  private static instance: PluginWrapper;

  private plugin: Plugin | null = null;

  public static initializeOnLoad(configuration?: Partial<IPluginConfiguration>): Promise<PluginWrapper> {
    return new Promise<PluginWrapper>((resolve) => {
      window.addEventListener('load', () => {
        resolve(PluginWrapper.initialize(configuration));
      });
    });
  }

  public static initialize(configuration?: Partial<IPluginConfiguration>): PluginWrapper {
    if (!PluginWrapper.instance) {
      PluginWrapper.instance = new PluginWrapper();
    }

    if (!PluginWrapper.instance.plugin) {
      PluginWrapper.instance.plugin = new Plugin(configuration);
    }

    return PluginWrapper.instance;
  }

  public destroy = (): void => {
    this.plugin?.destroy();
    this.plugin = null;
  };

  public setConfiguration = (configuration: Partial<IPluginConfiguration>): void => {
    if (!this.plugin) {
      throw new Error('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.plugin.updateConfiguration(configuration);
    }
  };
}

export default PluginWrapper;
