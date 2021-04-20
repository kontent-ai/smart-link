export interface IKSLConfiguration {
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
   * Name of the query parameter that should be present in the URL to enable the SDK. Query parameter is only used
   * outside Web Spotlight.
   */
  readonly queryParam: string;
}

export interface IDefaultDataAttributes {
  readonly languageCodename?: string;
  readonly projectId?: string;
}

export interface IConfigurationManager {
  readonly debug?: boolean;
  readonly defaultLanguageCodename?: string;
  readonly defaultProjectId?: string;
  readonly queryParam?: string;
  readonly update: (configuration: Partial<IKSLConfiguration>) => void;
}

const defaultConfiguration: IKSLConfiguration = {
  debug: false,
  defaultDataAttributes: {
    languageCodename: undefined,
    projectId: undefined,
  },
  queryParam: 'ksl-enabled',
};

export class ConfigurationManager implements IConfigurationManager {
  private configuration: IKSLConfiguration;

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

  constructor(initialConfiguration?: Partial<IKSLConfiguration>) {
    this.configuration = { ...defaultConfiguration, ...initialConfiguration };
  }

  public update = (configuration: Partial<IKSLConfiguration>): void => {
    this.configuration = { ...this.configuration, ...configuration };
  };
}
