import { isInsideIFrame } from './iframe';

export type KSLPublicConfiguration = Readonly<{
  /**
   * When it's set to `true`, enables all debug logs.
   */
  debug: boolean;
  /**
   * Default values for data attributes, which are only used when those data attributes
   * are not found in DOM during data attributes parsing process.
   */
  defaultDataAttributes: DefaultDataAttributes;
  /**
   * When it's set to `true`, iframe communication will always be enabled,
   * even when outside Web Spotlight.
   */
  forceWebSpotlightMode: boolean;
  /**
   * Name of the query parameter that should be present in the URL to enable the SDK. Query parameter is only used
   * outside Web Spotlight.
   */
  queryParam: string;
}>;

export type KSLPrivateConfiguration = Readonly<{
  /**
   * When it's set to `true`, enables iframe communication instead of redirects.
   */
  isInsideWebSpotlight: boolean;
}>;

export type KSLConfiguration = KSLPublicConfiguration & KSLPrivateConfiguration;

type DefaultDataAttributes = Readonly<{
  languageCodename?: string;
  environmentId?: string;
}>;

export const defaultConfiguration: KSLConfiguration = {
  debug: false,
  defaultDataAttributes: {
    languageCodename: undefined,
    environmentId: undefined,
  },
  forceWebSpotlightMode: false,
  isInsideWebSpotlight: false,
  queryParam: 'ksl-enabled',
} as const;

export function isInsideWebSpotlightPreviewIFrame(configuration: KSLConfiguration): boolean {
  return configuration.forceWebSpotlightMode || (isInsideIFrame() && configuration.isInsideWebSpotlight);
}
