import { KSLCustomElement } from './abstract/KSLCustomElement';
import { createTemplateForCustomElement } from '../utils/customElements';

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
    }
    
    :host([clipped]) {
      overflow: hidden;
    }
  </style>
  <slot></slot>
`;

export class KSLContainerElement extends KSLCustomElement {
  public static get is() {
    return 'ksl-container' as const;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }
}
