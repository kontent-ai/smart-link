import { isInsideIFrame } from './utils/iframe';
import { buildElementLink } from './utils/link';
import {
  IElementClickMessageData,
  IFrameCommunicator,
  IFrameMessageType,
  IHighlightsStatusMessageData,
} from './lib/IFrameCommunicator';
import { NodeHighlighter, NodeHighlighterEventType } from './lib/NodeHighlighter';
import { createStorage } from './utils/storage';

interface IPluginState {
  readonly queryTimerId: ReturnType<typeof setTimeout>;
}

interface IPluginIFrameSettings {
  readonly highlighterEnabled: boolean;
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
  queryParam: 'kk-plugin-enabled',
};

class Plugin {
  private state: IPluginState;
  private configuration: IPluginConfiguration;
  private iFrameCommunicator?: IFrameCommunicator;
  private readonly nodeHighlighter: NodeHighlighter;

  constructor(configuration?: Partial<IPluginConfiguration>) {
    this.nodeHighlighter = new NodeHighlighter();

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
    this.nodeHighlighter.destroy();
    this.iFrameCommunicator?.destroy();
  };

  public updateConfiguration = (configuration: Partial<IPluginConfiguration>): void => {
    this.configuration = { ...(this.configuration || defaultConfiguration), ...configuration };
  };

  private updateState = (state: Partial<IPluginState>): void => {
    this.state = { ...this.state, ...state };
  };

  private initializeIFrameCommunication = (): void => {
    if (!isInsideIFrame() || this.iFrameCommunicator) return;

    this.iFrameCommunicator = new IFrameCommunicator();

    const storage = createStorage<IPluginIFrameSettings>('kk:plugin:iframe-settings');
    const stored = storage.get();
    const highlighterEnabled = stored !== null ? stored?.highlighterEnabled : true;

    if (highlighterEnabled) {
      this.nodeHighlighter.enable();
    }

    this.iFrameCommunicator.addMessageListener(
      IFrameMessageType.HighlightsStatus,
      (data: IHighlightsStatusMessageData) => {
        if (!data || !this.nodeHighlighter) return;

        if (data.enabled) {
          this.nodeHighlighter.enable();
        } else {
          this.nodeHighlighter.disable();
        }

        storage.set({
          highlighterEnabled: data.enabled,
        });
      }
    );

    this.iFrameCommunicator.sendMessage(IFrameMessageType.Initialized, {
      projectId: this.configuration.projectId,
      languageCodename: this.configuration.languageCodename,
      highlighterEnabled,
    });
  };

  private watchQueryParams = (): void => {
    if (isInsideIFrame()) return;

    if (this.state.queryTimerId) {
      clearTimeout(this.state.queryTimerId);
    }

    const currentPageUrl = new URL(document.URL);
    const isPluginEnabled = currentPageUrl.search.includes(this.configuration.queryParam);
    const hasChanged = this.nodeHighlighter.enabled !== isPluginEnabled;

    if (hasChanged) {
      if (isPluginEnabled) {
        this.nodeHighlighter.enable();
      } else {
        this.nodeHighlighter.disable();
      }
    }

    this.updateState({
      queryTimerId: setTimeout(this.watchQueryParams, 1000),
    });
  };

  private unwatchQueryParams = (): void => {
    clearTimeout(this.state.queryTimerId);
  };

  private listenToHighlighterEvents = (): void => {
    this.nodeHighlighter.addEventListener(NodeHighlighterEventType.ElementClicked, this.onElementClick);
  };

  private onElementClick = (elementClickData: Partial<IElementClickMessageData>): void => {
    const data: Partial<IElementClickMessageData> = {
      ...elementClickData,
      projectId: elementClickData.projectId || this.configuration.projectId || undefined,
      languageCodename: elementClickData.languageCodename || this.configuration.languageCodename || undefined,
    };

    let errorsCount = 0;

    if (!data.projectId) {
      console.error('Warning: project ID is required to handle element click.');
      errorsCount++;
    }

    if (!data.languageCodename) {
      console.error('Warning: language codename is required to handle element click.');
      errorsCount++;
    }

    if (!data.itemId) {
      console.error('Warning: item ID is required to handle element click.');
      errorsCount++;
    }

    if (!data.elementCodename) {
      console.error('Warning: element codename is required to handle element click.');
      errorsCount++;
    }

    if (errorsCount > 0) return;

    if (isInsideIFrame() && this.iFrameCommunicator) {
      this.iFrameCommunicator.sendMessage(IFrameMessageType.ElementClicked, data as IElementClickMessageData);
    } else {
      const link = buildElementLink(data.projectId!, data.languageCodename!, data.itemId!, data.elementCodename!);
      window.open(link, '_blank');
    }
  };
}

class PluginWrapper {
  private static plugin: Plugin | null;

  public static initializeOnLoad(configuration?: Partial<IPluginConfiguration>): Promise<Plugin> {
    return new Promise<Plugin>((resolve) => {
      window.addEventListener('load', () => {
        resolve(PluginWrapper.initialize(configuration));
      });
    });
  }

  public static initialize(configuration?: Partial<IPluginConfiguration>): Plugin {
    if (!PluginWrapper.plugin) {
      PluginWrapper.plugin = new Plugin(configuration);
    }
    return PluginWrapper.plugin;
  }

  public destroy(): void {
    PluginWrapper.plugin?.destroy();
    PluginWrapper.plugin = null;
  }

  public setConfiguration(configuration: Partial<IPluginConfiguration>): void {
    if (!PluginWrapper.plugin) {
      console.error('Plugin is not initialized or has already been destroyed.');
    } else {
      PluginWrapper.plugin.updateConfiguration(configuration);
    }
  }
}

export default PluginWrapper;
