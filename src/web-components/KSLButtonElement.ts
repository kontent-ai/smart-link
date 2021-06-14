import { IconName } from './KSLIconElement';
import { assert } from '../utils/assert';
import { KSLCustomElementWithTooltip } from './abstract/KSLCustomElementWithTooltip';
import { createTemplateForCustomElement } from '../utils/node';
import { Colors } from './tokens/colors';
import { Shadows } from './tokens/shadows';

export enum ButtonType {
  Primary = 'primary',
  Quinary = 'quinary',
}

const templateHTML = `
  <style>
    :host,
    :host * {
      box-sizing: border-box;
    }
    
    :host {
      display: block;
    }
    
    :host([hidden]) {
      display: none;
    }
    
    :host(:focus) {
      outline: none;
    }

    .ksl-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: none;
      cursor: pointer;
    }
    
    .ksl-button:focus {
      outline: none;
    }
    
    :host([disabled]) .ksl-button {
      cursor: not-allowed;
    }
    
    .ksl-button__content,
    :host([loading]) .ksl-button__loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .ksl-button__loader,
    :host([loading]) .ksl-button__content {
      display: none;
    }
    
    :host([type=${ButtonType.Primary}]) .ksl-button {
      --ksl-icon-width: 18px;
      --ksl-icon-height: 18px;
      min-width: 40px;
      max-width: 40px;
      min-height: 40px;
      max-height: 40px;
      border-radius: 5000px;
      box-shadow: var(--ksl-shadow-primary, ${Shadows.Primary});
      background-color: var(--ksl-color-primary, ${Colors.Primary});
      color: var(--ksl-color-text-secondary, ${Colors.TextSecondary});
      fill: var(--ksl-color-text-secondary, ${Colors.TextSecondary});
    }
    
    :host([type=${ButtonType.Primary}]:not([disabled])) .ksl-button:hover,
    :host([type=${ButtonType.Primary}]:not([disabled])) .ksl-button:active {
      background-color: var(--ksl-color-primary-hover, ${Colors.PrimaryHover});
    }
    
    :host([type=${ButtonType.Primary}][disabled]) .ksl-button {
      background-color: var(--ksl-color-background-default-disabled, ${Colors.BackgroundDefaultDisabled});
      color: var(--ksl-color-text-default-disabled, ${Colors.TextDefaultDisabled});
      fill: var(--ksl-color-text-default-disabled, ${Colors.TextDefaultDisabled});
      box-shadow: none;
    }
    
    :host([type=${ButtonType.Primary}][loading]) .ksl-button {
      color: var(--ksl-color-primary, ${Colors.Primary});
      fill: var(--ksl-color-primary, ${Colors.Primary});
      box-shadow: none;
    }
    
    :host([type=${ButtonType.Quinary}]) .ksl-button {
      --ksl-icon-width: 16px;
      --ksl-icon-height: 16px;
      border-radius: 5px;
      padding: 0;
      min-height: 24px;
      min-width: 24px;
      max-height: 24px;
      max-width: 24px;
      color: var(--ksl-color-text-default, ${Colors.TextDefault});
      fill: var(--ksl-color-text-default, ${Colors.TextDefault});
      background-color: var(--ksl-color-background-default, ${Colors.BackgroundDefault});
    }
    
    :host([type=${ButtonType.Quinary}][disabled]) .ksl-button {
      color: var(--ksl-color-text-default-disabled, ${Colors.TextDefaultDisabled});
      fill: var(--ksl-color-text-default-disabled, ${Colors.TextDefaultDisabled});
    }
    
    :host([type=${ButtonType.Quinary}]:not([disabled])) .ksl-button:hover {
      background-color: var(--ksl-color-background-default-hover, ${Colors.BackgroundDefaultHover});
    }
    
    :host([type=${ButtonType.Quinary}]:not([disabled])) .ksl-button:active {
      background-color: var(--ksl-color-background-default-selected, ${Colors.BackgroundDefaultSelected});
    }
  </style>
  <button class="ksl-button">
    <div class="ksl-button__content">
      <slot></slot>
    </div>
    <ksl-icon icon-name="${IconName.Spinner}" class="ksl-button__loader" />
  </button>
`;

export class KSLButtonElement extends KSLCustomElementWithTooltip {
  public static get is() {
    return 'ksl-button' as const;
  }

  public static get observedAttributes(): string[] {
    const base = KSLCustomElementWithTooltip.observedAttributes;
    return [...base, 'loading'];
  }

  public get loading(): boolean {
    return this.hasAttribute('loading');
  }

  public set loading(value: boolean) {
    this.updateAttribute('loading', value);
  }

  public get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  public set disabled(value: boolean) {
    this.updateAttribute('disabled', value);
  }

  private readonly buttonRef: HTMLButtonElement;

  constructor() {
    super();

    assert(this.shadowRoot, 'Shadow root must be always accessible in "open" mode.');
    this.buttonRef = this.shadowRoot.querySelector('button') as HTMLButtonElement;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick, { capture: true });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleClick, { capture: true });
  }

  public attributeChangedCallback(attributeName: string, _oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(attributeName, _oldValue, newValue);

    if (attributeName === 'loading') {
      const value = Boolean(newValue);
      this.disabled = value;
      this.tooltipDisabled = value;
    }
  }

  private handleClick = (event: MouseEvent): void => {
    // make sure the disabled button does not trigger events
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  };
}
