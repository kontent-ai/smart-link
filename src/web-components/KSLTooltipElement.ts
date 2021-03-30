import { createTemplateForCustomElement } from '../utils/customElements';
import { KSLPopUpElement } from './abstract/KSLPopUpElement';

const templateHTML = `
  <style>
    :host {
      --ksl-pop-up-arrow-size: 4px;
      --ksl-pop-up-background-color: #141619;
      --ksl-pop-up-box-shadow: none;
      --ksl-pop-up-color: #fff;
      --ksl-pop-up-padding: 4px 6px;
    }
  </style>
`;

export class KSLTooltipElement extends KSLPopUpElement {
  public static get is() {
    return 'ksl-tooltip' as const;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    const baseTemplate = KSLPopUpElement.initializeTemplate();
    const thisTemplate = createTemplateForCustomElement(templateHTML);
    baseTemplate.content.appendChild(thisTemplate.content.cloneNode(true));
    return baseTemplate;
  }
}
