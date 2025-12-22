/** biome-ignore-all lint/complexity/noThisInStatic: Break when using class name instead of this */
import { InvalidEnvironmentError, NotImplementedError } from "../../utils/errors";
import type { AsyncCustomEventDetail } from "../../utils/events";

// Custom elements API as well as all Web Component definitions can only be run in a browser environment,
// because they require build-in browser APIs, which are not available on the backend (during SSR).
// There are several libraries that allow server-side rendering of Web Components. It is usually done by
// redefining the whole DOM API on the backend. For the purpose of this SDK it is not required to
// support server-side rendering of Web Components, because whole page must be loaded for SDK to work properly.
// However, some SSR frameworks (such as Next.js) will try to run this code on the server side first during SSR,
// which could result in a crash because HTMLElement is not defined on the backend. That is why we are setting
// this property to null in a global Nodejs scope.
const isNotInBrowser = typeof window === "undefined"; // window === undefined crashes
if (isNotInBrowser) {
  // @ts-expect-error: required to support SSR frameworks
  global.HTMLElement = null;
}

/**
 * This is a base class for all kontent-smart-link custom elements.
 */
export abstract class KSLCustomElement extends HTMLElement {
  private static _template: HTMLTemplateElement | null = null;

  /**
   * Name of the custom element that will be added to the CustomElementRegistry.
   * This name will be used to add a custom element to the page.
   *
   * @type {string}
   */
  public static get is(): string {
    throw new NotImplementedError(
      'KSLCustomElement: "is" getter is not implemented for this custom element.',
    );
  }

  /**
   * Template is usually stored in the scope of custom element file, but this does not work with SSR,
   * since `document` is not available on the backend. That is why we are storing the template in a static
   * constructor property and initialize it when we are sure we are in a browser environment.
   *
   * @type {HTMLTemplateElement}
   */
  protected static get template(): HTMLTemplateElement {
    this._template ??= this.initializeTemplate();
    return this._template;
  }

  protected constructor() {
    super();

    // We are using an "open" mode here, so that it is easier for users to manipulate the shadow root
    // of our custom elements if they want to change or customize something.
    const shadowRootConfig: ShadowRootInit = { mode: "open" };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const selfClass = Object.getPrototypeOf(this).constructor as typeof KSLCustomElement;
    const shadowRoot = this.attachShadow(shadowRootConfig);
    shadowRoot.appendChild(selfClass.template.content.cloneNode(true));
  }

  /**
   * Add this custom element to the CustomElementRegistry so that it can be used on the page.
   * Usually customElements.define is called inline right at the bottom of the custom element file,
   * but this would not work with SSR, since custom elements can't be defined on the backend.
   */
  public static define(): Promise<CustomElementConstructor> {
    // window === undefined crashes
    if (typeof window === "undefined") {
      throw new InvalidEnvironmentError(
        "KSLCustomElement: custom elements can only be defined in a browser environment.",
      );
    }

    // The 'this' keyword refers to current constructor in static methods.
    // Conversion to unknown is needed so that we can explicitly converse
    // this class to CustomElementConstructor.
    const self = this as unknown;
    // biome-ignore lint/suspicious/noShadowRestrictedNames: this is workaround
    const constructor = window.customElements.get(this.is);

    if (!constructor) {
      customElements.define(this.is, self as CustomElementConstructor);
      return customElements.whenDefined(this.is);
    }

    return Promise.resolve(constructor);
  }

  /**
   * Initialize a template for the custom element.
   * Each KSL custom element class should implement this static method.
   *
   * @returns {HTMLTemplateElement}
   */
  protected static initializeTemplate(): HTMLTemplateElement {
    throw new NotImplementedError(
      'KSLCustomElement: "initializeTemplate" method should be implemented for every component.',
    );
  }

  /**
   * Update attribute value on the custom element.
   *
   * @param {string} attributeName
   * @param {string | number | boolean | null} attributeValue
   */
  protected updateAttribute(
    attributeName: string,
    attributeValue: string | number | boolean | null,
  ): void {
    if (attributeValue !== null && Boolean(attributeValue)) {
      this.setAttribute(attributeName, attributeValue.toString());
    } else {
      this.removeAttribute(attributeName);
    }
  }

  /**
   * Dispatch an asynchronous event from component. Dispatching this event returns Promise
   * which resolves if event was successful and rejects if events is not successful.
   *
   * @param {string} eventType
   * @param {TEventData} eventData
   * @param {number | null} timeout
   * @protected
   */
  protected dispatchAsyncEvent<TEventData, TResolveData, TRejectReason>(
    eventType: string,
    eventData: TEventData,
    timeout: number | null = null,
  ): Promise<TResolveData> {
    return new Promise((resolve, reject) => {
      const timeoutId = timeout !== null ? window.setTimeout(reject, timeout) : 0;

      const customEvent = new CustomEvent<
        AsyncCustomEventDetail<TEventData, TResolveData, TRejectReason>
      >(eventType, {
        detail: {
          eventData: eventData,
          onResolve: (data: TResolveData) => {
            window.clearTimeout(timeoutId);
            resolve(data);
          },
          onReject: (reason: TRejectReason) => {
            window.clearTimeout(timeoutId);
            reject(reason);
          },
        },
      });

      this.dispatchEvent(customEvent);
    });
  }
}
