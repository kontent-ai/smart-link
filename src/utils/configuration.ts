import { isInsideIFrame } from "./iframe";

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
  /**
   * Bare domain of the Kontent.ai web application used when redirecting to the editor
   * (no scheme, no `app.` prefix, no leading dot). For example: `"kontent.ai"` or
   * `"devkontentmasters.com"`. The SDK always builds URLs as `https://app.${baseUrl}/goto/...`.
   */
  baseUrl: string;
  /**
   * Origin that is trusted for iframe (postMessage) communication with Web Spotlight.
   * It is used both to validate incoming messages (messages from any other origin are
   * ignored) and as the target origin for outgoing messages. Must be a full origin
   * (scheme + host, no trailing slash), e.g. `"https://app.kontent.ai"`.
   *
   * Defaults to `https://app.${baseUrl}`. Only needs to be set in nested-iframe setups,
   * where it should be the origin of the intermediate iframe that relays the messages.
   */
  webSpotlightOrigin?: string;
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
  queryParam: "ksl-enabled",
  baseUrl: "kontent.ai",
} as const;

export function isInsideWebSpotlightPreviewIFrame(configuration: KSLConfiguration): boolean {
  return (
    configuration.forceWebSpotlightMode || (isInsideIFrame() && configuration.isInsideWebSpotlight)
  );
}

/**
 * Resolves the origin that is trusted for iframe (postMessage) communication with
 * Web Spotlight. Falls back to `https://app.${baseUrl}` when not explicitly configured.
 */
export function getWebSpotlightOrigin(configuration: KSLConfiguration): string {
  return configuration.webSpotlightOrigin ?? `https://app.${configuration.baseUrl}`;
}
