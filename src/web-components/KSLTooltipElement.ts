import { createTemplateForCustomElement } from '../utils/customElements';
import { KSLPositionedElement } from './abstract/KSLPositionedElement';

const templateHTML = `
  <style>
    :host {
      --ksl-positioned-element-background-color: #141619;
      --ksl-positioned-element-color: #fff;
      --ksl-positioned-element-arrow-size: 4px;
      --ksl-positioned-element-padding-vertical: 4px;
      --ksl-positioned-element-padding-horizontal: 6px;
    }
  </style>
`;

export class KSLTooltipElement extends KSLPositionedElement {
  public static get is() {
    return 'ksl-tooltip' as const;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    const baseTemplate = KSLPositionedElement.initializeTemplate();
    const thisTemplate = createTemplateForCustomElement(templateHTML);
    baseTemplate.content.appendChild(thisTemplate.content.cloneNode(true));
    return baseTemplate;
  }
}
