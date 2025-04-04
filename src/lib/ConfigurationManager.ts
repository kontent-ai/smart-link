import { isInsideIFrame } from '../utils/iframe';

export interface IKSLPublicConfiguration {
  /**
   * When it's set to `true`, enables all debug logs.
   * Can be useful to get more information about how the SDK works inside.
   */
  readonly debug: boolean;
  /**
   * Default values for data attributes, which are only used when those data attributes
   * are not found in DOM during data attributes parsing process.
   */
  readonly defaultDataAttributes: IDefaultDataAttributes;
  /**
   * When it's set to `true`, iframe communication will always be enabled,
   * even when outside Web Spotlight.
   */
  readonly forceWebSpotlightMode: boolean;
  /**
   * Name of the query parameter that should be present in the URL to enable the SDK. Query parameter is only used
   * outside Web Spotlight.
   */
  readonly queryParam: string;

  readonly cspNonce?: string;
}

export interface IKSLPrivateConfiguration {
  /**
   * When it's set to `true`, enables iframe communication instead of redirects.
   */
  readonly isInsideWebSpotlight: boolean;
}

export type KSLConfiguration = IKSLPublicConfiguration & IKSLPrivateConfiguration;

export interface IDefaultDataAttributes {
  readonly languageCodename?: string;
  readonly projectId?: string;
}

export interface IConfigurationManager {
  readonly debug?: boolean;
  readonly defaultLanguageCodename?: string;
  readonly defaultProjectId?: string;
  readonly isInsideWebSpotlightPreviewIFrame: boolean;
  readonly queryParam?: string;
  readonly cspNonce?: string;
  readonly update: (configuration?: Partial<KSLConfiguration>) => void;
}

const defaultConfiguration: KSLConfiguration = {
  debug: false,
  defaultDataAttributes: {
    languageCodename: undefined,
    projectId: undefined,
  },
  forceWebSpotlightMode: false,
  isInsideWebSpotlight: false,
  queryParam: 'ksl-enabled',
};

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
  public get cspNonce(): string | undefined {
    return this.configuration.cspNonce;
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
