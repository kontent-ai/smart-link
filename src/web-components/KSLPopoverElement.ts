import { createTemplateForCustomElement } from '../utils/customElements';
import { KSLPositionedElement } from './abstract/KSLPositionedElement';

const templateHTML = `
  <style>
    :host {
      --ksl-positioned-element-background-color: #fff;
      --ksl-positioned-element-color: #000;
      --ksl-positioned-element-arrow-size: 12px;
      --ksl-positioned-element-padding-vertical: 8px;
      --ksl-positioned-element-padding-horizontal: 8px;
      --ksl-positioned-element-border-radius: 8px;
    }
    
    .ksl-positioned-element__content {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0px 8px 32px rgba(16, 33, 60, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.03);
    }
  </style>
`;

export class KSLPopoverElement extends KSLPositionedElement {
  public static get is() {
    return 'ksl-popover' as const;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    const baseTemplate = KSLPositionedElement.initializeTemplate();
    const thisTemplate = createTemplateForCustomElement(templateHTML);
    baseTemplate.content.appendChild(thisTemplate.content.cloneNode(true));
    return baseTemplate;
  }
}
