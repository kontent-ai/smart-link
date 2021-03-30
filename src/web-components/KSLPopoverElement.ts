import { createTemplateForCustomElement } from '../utils/customElements';
import { KSLPopUpElement } from './abstract/KSLPopUpElement';

const templateHTML = `
  <style>
    :host {
      --ksl-pop-up-arrow-size: 12px;
      --ksl-pop-up-background-color: #fff;
      --ksl-pop-up-border-radius: 4px;
      --ksl-pop-up-box-shadow: 0 8px 32px rgba(16, 33, 60, 0.24), 0 0 8px rgba(0, 0, 0, 0.03);
      --ksl-pop-up-color: #000;
      --ksl-pop-up-padding: 8px;
    }
  </style>
`;

export class KSLPopoverElement extends KSLPopUpElement {
  public static get is() {
    return 'ksl-popover' as const;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    const baseTemplate = KSLPopUpElement.initializeTemplate();
    const thisTemplate = createTemplateForCustomElement(templateHTML);
    baseTemplate.content.appendChild(thisTemplate.content.cloneNode(true));
    return baseTemplate;
  }
}
