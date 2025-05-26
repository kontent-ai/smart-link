import { IKSLPublicConfiguration } from './lib/ConfigurationManager';
import KontentSmartLinkSDK, { KontentSmartLinkEventMap } from './sdk';
import { InvalidEnvironmentError, NotInitializedError } from './utils/errors';

/**
 * KontentSmartLink is the main entry point for the Kontent Smart Link SDK.
 * It provides a singleton wrapper around the SDK instance to manage initialization,
 * configuration updates, and cleanup while maintaining a consistent API for users.
 */
class KontentSmartLink {
  // This wrapper is publicly exposed instead of the SDK to avoid exposing the SDK to the user
  // so they can't accidentally create multiple instances of the SDK as it might duplicate events or custom elements initialization.
  private static instance: KontentSmartLink;
  private sdk: KontentSmartLinkSDK | null = null;

  public static initializeOnLoad(configuration?: Partial<IKSLPublicConfiguration>): Promise<KontentSmartLink> {
    if (typeof window === 'undefined') {
      throw InvalidEnvironmentError('KontentSmartLink can only be initialized in a browser environment.');
    }

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

  public on = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.on(event, handler);
    }
  };

  public off = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent]
  ): void => {
    if (!this.sdk) {
      throw NotInitializedError('KontentSmartLink is not initialized or has already been destroyed.');
    } else {
      this.sdk.off(event, handler);
    }
  };
}

export default KontentSmartLink;
