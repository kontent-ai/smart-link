import type { KSLCustomElement } from "./abstract/KSLCustomElement";
import { KSLAddButtonElement } from "./KSLAddButtonElement";
import { KSLButtonElement } from "./KSLButtonElement";
import { KSLContainerElement } from "./KSLContainerElement";
import { KSLHighlightElement } from "./KSLHighlightElement";
import { KSLIconElement } from "./KSLIconElement";
import { KSLPopoverElement } from "./KSLPopoverElement";
import { KSLTooltipElement } from "./KSLTooltipElement";

declare global {
  interface HTMLElementTagNameMap {
    [KSLIconElement.is]: KSLIconElement;
    [KSLButtonElement.is]: KSLButtonElement;
    [KSLAddButtonElement.is]: KSLAddButtonElement;
    [KSLHighlightElement.is]: KSLHighlightElement;
    [KSLContainerElement.is]: KSLContainerElement;
    [KSLTooltipElement.is]: KSLTooltipElement;
    [KSLPopoverElement.is]: KSLPopoverElement;
  }
}

const webComponents: ReadonlyArray<typeof KSLCustomElement> = [
  KSLIconElement,
  KSLButtonElement,
  KSLAddButtonElement,
  KSLHighlightElement,
  KSLContainerElement,
  KSLTooltipElement,
  KSLPopoverElement,
];

const webComponentTags: ReadonlyArray<string> = webComponents.map((component) => component.is);

/**
 * Define all web components if it is possible.
 */
export function defineAllRequiredWebComponents(): Promise<CustomElementConstructor[]> {
  const allDefined = webComponents.map(async (webComponent) => await webComponent.define());
  return Promise.all(allDefined);
}

/**
 * Check if element is a web component based on its tag name.
 */
export function isElementWebComponent(element: HTMLElement): boolean {
  return webComponentTags.includes(element.tagName.toLowerCase());
}
