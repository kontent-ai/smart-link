import { KSLCustomElement } from './abstract/KSLCustomElement';
import { KSLAddButtonElement } from './KSLAddButtonElement';
import { KSLHighlightElement } from './KSLHighlightElement';
import { createTemplateForCustomElement, getRenderingRootMetadata, getTotalScrollOffset } from '../utils/domElement';
import { IPositionable } from './abstract/KSLPositionedElement';
import { BaseZIndex } from './constants/zIndex';

const templateHTML = `
  <style>
    :host {
      display: block;
      position: absolute;
      box-sizing: border-box;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      pointer-events: none;
      touch-action: none;
      z-index: var(--ksl-z-index, ${BaseZIndex});
    }
    
    :host([clipped]) {
      overflow: hidden;
    }
  </style>
  <slot></slot>
`;

export class KSLContainerElement extends KSLCustomElement implements IPositionable {
  public static get is() {
    return 'ksl-container' as const;
  }

  private _boundingClientRect: DOMRect | null = null;

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  public getBoundingClientRect(shouldRecompute = false): DOMRect {
    if (!this._boundingClientRect || shouldRecompute) {
      this._boundingClientRect = super.getBoundingClientRect();
    }
    return this._boundingClientRect;
  }

  public createHighlightForElement = (element: HTMLElement): KSLHighlightElement => {
    const highlight = document.createElement(KSLHighlightElement.is);
    highlight.attachTo(element);
    this.appendChild(highlight);
    return highlight;
  };

  public createAddButtonForElement = (element: HTMLElement): KSLAddButtonElement => {
    const button = document.createElement(KSLAddButtonElement.is);
    button.attachTo(element);
    this.appendChild(button);
    return button;
  };

  public adjustPosition = (): void => {
    const parent = this.parentElement;

    if (!parent) {
      return; // No need to adjust position when element is not mounted.
    }

    const metadata = getRenderingRootMetadata(parent);

    if (!metadata.isPositioned) {
      // When parent element is not positioned it means that container
      // will be positioned relatively to some other element. That is why we need
      // to keep in mind all of the scroll offsets on the way to this relative element.
      const [scrollOffsetTop, scrollOffsetLeft] = getTotalScrollOffset(parent);

      this.style.height = `${parent.clientHeight}px`;
      this.style.width = `${parent.clientWidth}px`;
      this.style.top = `${parent.offsetTop - scrollOffsetTop}px`;
      this.style.left = `${parent.offsetLeft - scrollOffsetLeft}px`;

      // When parent element is not positioned and its content is clipped
      // we need to hide overflow of the container as well to prevent
      // highlights from appearing for overflown content.
      this.updateAttribute('clipped', Boolean(metadata.isContentClipped));
    }

    this.getBoundingClientRect(true);
  };
}
