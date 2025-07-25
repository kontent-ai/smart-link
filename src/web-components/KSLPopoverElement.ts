import { KSLPopUpElement } from './abstract/KSLPopUpElement';
import { createTemplateForCustomElement } from '../utils/domElement';
import { Colors } from './tokens/colors';
import { Shadows } from './tokens/shadows';

const templateHTML = `
  <style>
    :host {
      --ksl-pop-up-arrow-size: 12px;
      --ksl-pop-up-background-color: var(--ksl-color-background-default, ${Colors.BackgroundDefault});
      --ksl-pop-up-border-radius: 4px;
      --ksl-pop-up-box-shadow: var(--ksl-shadow-default, ${Shadows.Default});;
      --ksl-pop-up-color: var(--ksl-color-text-default, ${Colors.TextDefault});
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
