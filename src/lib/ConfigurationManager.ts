import { isInsideIFrame } from '../utils/iframe';
import { defaultConfiguration, KSLConfiguration } from '../models/configuration/KSLConfiguration';

export interface IConfigurationManager {
  readonly debug?: boolean;
  readonly defaultLanguageCodename?: string;
  readonly defaultProjectId?: string;
  readonly isInsideWebSpotlightPreviewIFrame: boolean;
  readonly queryParam?: string;
  readonly update: (configuration?: Partial<KSLConfiguration>) => void;
}

export class ConfigurationManager implements IConfigurationManager {
  private static instance: ConfigurationManager;

  public get debug(): boolean {
    return this.configuration.debug;
  }

  public get queryParam(): string | undefined {
    return this.configuration.queryParam;
  }

  public get defaultLanguageCodename(): string | undefined {
    return this.configuration.defaultDataAttributes.languageCodename;
  }

  public get defaultProjectId(): string | undefined {
    return this.configuration.defaultDataAttributes.projectId;
  }

  public get isInsideWebSpotlightPreviewIFrame(): boolean {
    const { forceWebSpotlightMode, isInsideWebSpotlight } = this.configuration;
    return forceWebSpotlightMode || (isInsideIFrame() && isInsideWebSpotlight);
  }

  private configuration: KSLConfiguration;

  private constructor() {
    this.configuration = defaultConfiguration;
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }

    return ConfigurationManager.instance;
  }

  public update = (configuration: Partial<KSLConfiguration> = {}): void => {
    this.configuration = { ...this.configuration, ...configuration };
  };
}
