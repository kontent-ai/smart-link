import { KSLPopUpElement } from './abstract/KSLPopUpElement';
import { createTemplateForCustomElement } from '../utils/domElement';
import { Colors } from './tokens/colors';

const templateHTML = `
  <style>
    :host {
      --ksl-pop-up-arrow-size: 4px;
      --ksl-pop-up-background-color: var(--ksl-color-background-secondary, ${Colors.BackgroundSecondary});
      --ksl-pop-up-box-shadow: none;
      --ksl-pop-up-color: var(--ksl-color-text-secondary, ${Colors.TextSecondary});
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
