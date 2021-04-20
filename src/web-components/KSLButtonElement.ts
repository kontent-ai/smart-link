import { IconName } from './KSLIconElement';
import { assert } from '../utils/assert';
import { KSLCustomElementWithTooltip } from './abstract/KSLCustomElementWithTooltip';
import { createTemplateForCustomElement } from '../utils/node';

export enum ButtonType {
  Primary = 'primary',
  Quinary = 'quinary',
  DestructiveQuinary = 'destructive-quinary',
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
    
    .ksl-button[disabled] {
      cursor: not-allowed;
    }
    
    .ksl-button:focus {
      outline: none;
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
      box-shadow: 0 8px 10px rgba(219, 60, 0, 0.2), 0 6px 20px rgba(219, 60, 0, 0.12), 0 8px 14px rgba(219, 60, 0, 0.14);
      background-color: #DB3C00;
      color: #fff;
      fill: #fff;
    }
    
    :host([type=${ButtonType.Primary}]) .ksl-button:not([disabled]):hover,
    :host([type=${ButtonType.Primary}]) .ksl-button:not([disabled]):active {
      background-color: #953000;
    }
    
    :host([type=${ButtonType.Primary}]) .ksl-button[disabled] {
      background-color: #DFDFDF;
      color: #8C8C8C;
      fill: #8C8C8C;
      box-shadow: none;
    }
    
    :host([type=${ButtonType.Primary}][loading]) .ksl-button {
      color: #DB3C00;
      fill: #DB3C00;
      box-shadow: none;
    }
    
    :host([type=${ButtonType.Quinary}]) .ksl-button,
    :host([type=${ButtonType.DestructiveQuinary}]) .ksl-button {
      --ksl-icon-width: 16px;
      --ksl-icon-height: 16px;
      border-radius: 5px;
      padding: 0;
      min-height: 24px;
      min-width: 24px;
      max-height: 24px;
      max-width: 24px;
      color: #000;
      fill: #000;
      background-color: #fff;
    }
    
    :host([type=${ButtonType.Quinary}]) .ksl-button[disabled],
    :host([type=${ButtonType.DestructiveQuinary}]) .ksl-button[disabled] {
      color: #8c8c8c;
      fill: #8c8c8c;
    }
    
    :host([type=${ButtonType.Quinary}])  .ksl-button:not([disabled]):hover {
      background-color: rgba(21, 21, 21, 0.1);
    }
    
    :host([type=${ButtonType.Quinary}])  .ksl-button:not([disabled]):active {
      background-color: #fff0ef;
    }
    
    :host([type=${ButtonType.DestructiveQuinary}]) .ksl-button:hover:not([disabled]),
    :host([type=${ButtonType.DestructiveQuinary}]) .ksl-button:active:not([disabled]) {
      fill: #fff;
      color: #fff;
      background-color: #B10202;
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
    return this.buttonRef.disabled;
  }

  public set disabled(value: boolean) {
    this.buttonRef.disabled = value;
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
