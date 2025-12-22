import KontentSmartLinkSDK, { type KontentSmartLinkEventMap } from "./sdk";
import type { KSLPublicConfiguration } from "./utils/configuration";
import { InvalidEnvironmentError, NotInitializedError } from "./utils/errors";

/**
 * KontentSmartLink is the main entry point for the Kontent Smart Link SDK.
 * It provides a singleton wrapper around the SDK instance to manage initialization,
 * configuration updates, and cleanup while maintaining a consistent API for users.
 */
class KontentSmartLink {
  // This wrapper is publicly exposed instead of the SDK to avoid exposing the SDK to the user
  // so they can't accidentally create multiple instances of the SDK as it might duplicate events or custom elements initialization.
  private static instance: KontentSmartLink | null = null;
  private sdk: KontentSmartLinkSDK | null = null;

  public static initializeOnLoad(
    configuration?: Partial<KSLPublicConfiguration>,
  ): Promise<KontentSmartLink> {
    // window === undefined crashes
    if (typeof window === "undefined") {
      throw new InvalidEnvironmentError(
        "KontentSmartLink can only be initialized in a browser environment.",
      );
    }

    return new Promise<KontentSmartLink>((resolve) => {
      window.addEventListener("load", () => {
        resolve(KontentSmartLink.initialize(configuration));
      });
    });
  }

  public static initialize(configuration?: Partial<KSLPublicConfiguration>): KontentSmartLink {
    KontentSmartLink.instance ??= new KontentSmartLink();

    KontentSmartLink.instance.sdk ??= new KontentSmartLinkSDK(configuration);

    return KontentSmartLink.instance;
  }

  public destroy = (): void => {
    this.sdk?.destroy();
    this.sdk = null;
  };

  public setConfiguration = (configuration: Partial<KSLPublicConfiguration>): void => {
    if (!this.sdk) {
      throw new NotInitializedError(
        "KontentSmartLink is not initialized or has already been destroyed.",
      );
    } else {
      this.sdk.updateConfiguration(configuration);
    }
  };

  public on = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent],
  ): void => {
    if (!this.sdk) {
      throw new NotInitializedError(
        "KontentSmartLink is not initialized or has already been destroyed.",
      );
    } else {
      this.sdk.on(event, handler);
    }
  };

  public off = <TEvent extends keyof KontentSmartLinkEventMap>(
    event: TEvent,
    handler: KontentSmartLinkEventMap[TEvent],
  ): void => {
    if (!this.sdk) {
      throw new NotInitializedError(
        "KontentSmartLink is not initialized or has already been destroyed.",
      );
    } else {
      this.sdk.off(event, handler);
    }
  };
}

export default KontentSmartLink;
