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

export const defaultConfiguration: KSLConfiguration = {
  debug: false,
  defaultDataAttributes: {
    languageCodename: undefined,
    projectId: undefined,
  },
  forceWebSpotlightMode: false,
  isInsideWebSpotlight: false,
  queryParam: 'ksl-enabled',
};
