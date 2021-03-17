import { KSLCustomElement } from './KSLCustomElement';
import { assert } from '../../utils/assert';
import { createTemplateForCustomElement } from '../../utils/customElements';

export enum ElementPosition {
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Top = 'top',
  BottomStart = 'bottom-start',
  BottomEnd = 'bottom-end',
  TopStart = 'top-start',
  TopEnd = 'top-end',
  LeftStart = 'left-start',
  LeftEnd = 'left-end',
  RightStart = 'right-start',
  RightEnd = 'right-end',
}

const templateHTML = `
  <style>
      :host {
        --arrow-size: var(--ksl-positioned-element-arrow-size, 4px);
        --background-color: var(--ksl-positioned-element-background-color, #141619);
        --border-radius: var(--ksl-positioned-element-border-radius, 4px);
        --color: var(--ksl-positioned-element-color, #fff);
        --padding-horizontal: var(--ksl-positioned-element-padding-horizontal, 6px);
        --padding-vertical: var(--ksl-positioned-element-padding-vertical, 4px);
        display: block;
        position: absolute;
        opacity: 0;
        z-index: 10000;
        transition: opacity 250ms ease-in-out;
      }
  
      :host([visible]) {
        opacity: 1;
      }
  
      .ksl-positioned-element__content {
        background-color: var(--background-color);
        padding: var(--padding-vertical) var(--padding-horizontal);
        border-radius: var(--border-radius);
        font-size: 12px;
        line-height: 16px;
        font-weight: normal;
        color: var(--color);
      }
      
    :host([position="${ElementPosition.RightStart}"]) .ksl-positioned-element__content, 
    :host([position="${ElementPosition.Right}"]) .ksl-positioned-element__content,
    :host([position="${ElementPosition.RightEnd}"]) .ksl-positioned-element__content {
      margin-left: var(--arrow-size);
    }
    
    :host([position="${ElementPosition.LeftStart}"]) .ksl-positioned-element__content, 
    :host([position="${ElementPosition.Left}"]) .ksl-positioned-element__content,
    :host([position="${ElementPosition.LeftEnd}"]) .ksl-positioned-element__content {
      margin-right: var(--arrow-size);
    }
    
    :host([position="${ElementPosition.BottomStart}"]) .ksl-positioned-element__content, 
    :host([position="${ElementPosition.Bottom}"]) .ksl-positioned-element__content,
    :host([position="${ElementPosition.BottomEnd}"]) .ksl-positioned-element__content {
      margin-top: var(--arrow-size);
    }
    
    :host([position="${ElementPosition.TopStart}"]) .ksl-positioned-element__content, 
    :host([position="${ElementPosition.Top}"]) .ksl-positioned-element__content,
    :host([position="${ElementPosition.TopEnd}"]) .ksl-positioned-element__content {
      margin-bottom: var(--arrow-size);
    }
    
    .ksl-positioned-element__arrow {
      position: absolute;
      width: 0;
      height: 0;
      margin: 0 .25rem;
    }
    
    :host([position="${ElementPosition.RightStart}"]) .ksl-positioned-element__arrow, 
    :host([position="${ElementPosition.Right}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.RightEnd}"]) .ksl-positioned-element__arrow {
      left: -(var(--arrow-size));
      border-right: var(--arrow-size) solid var(--background-color);
      border-top: var(--arrow-size) solid transparent;
      border-bottom: var(--arrow-size) solid transparent;
    }
    
    :host([position="${ElementPosition.LeftStart}"]) .ksl-positioned-element__arrow, 
    :host([position="${ElementPosition.Left}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.LeftEnd}"]) .ksl-positioned-element__arrow {
      right: -(var(--arrow-size));
      border-top: var(--arrow-size) solid transparent;
      border-left: var(--arrow-size) solid var(--background-color);
      border-bottom: var(--arrow-size) solid transparent;
    }
    
    :host([position="${ElementPosition.BottomStart}"]) .ksl-positioned-element__arrow, 
    :host([position="${ElementPosition.Bottom}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.BottomEnd}"]) .ksl-positioned-element__arrow {
      top: 0;
      border-left: var(--arrow-size) solid transparent;
      border-right: var(--arrow-size) solid transparent;
      border-bottom: var(--arrow-size) solid var(--background-color);
    }
    
    :host([position="${ElementPosition.TopStart}"]) .ksl-positioned-element__arrow, 
    :host([position="${ElementPosition.Top}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.TopEnd}"]) .ksl-positioned-element__arrow {
      bottom: 0;
      border-top: var(--arrow-size) solid var(--background-color);
      border-left: var(--arrow-size) solid transparent;
      border-right: var(--arrow-size) solid transparent;
    }
    
    :host([position="${ElementPosition.Top}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.Bottom}"]) .ksl-positioned-element__arrow {
      left: calc(50% - var(--arrow-size) - 0.25rem);
    }
    
    :host([position="${ElementPosition.TopEnd}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.BottomEnd}"]) .ksl-positioned-element__arrow {
      right: 0;
    }
    
    :host([position="${ElementPosition.TopStart}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.BottomStart}"]) .ksl-positioned-element__arrow {
      left: 0;
    }
    
    :host([position="${ElementPosition.Left}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.Right}"]) .ksl-positioned-element__arrow {
      top: 8px;
    }
    
    :host([position="${ElementPosition.LeftEnd}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.RightEnd}"]) .ksl-positioned-element__arrow {
      bottom: 0;
    }
    
    :host([position="${ElementPosition.LeftStart}"]) .ksl-positioned-element__arrow,
    :host([position="${ElementPosition.RightStart}"]) .ksl-positioned-element__arrow {
      top: 0;
    }
  </style>
  <div class="ksl-positioned-element__content">
    <slot></slot>
  </div>
  <div class="ksl-positioned-element__arrow"/>
`;

export abstract class KSLPositionedElement extends KSLCustomElement {
  public get position(): string {
    return this.getAttribute('position') || ElementPosition.Bottom;
  }

  public set position(value: string) {
    if (value) {
      this.setAttribute('position', value);
    } else {
      this.removeAttribute('position');
    }
  }

  public get visible(): boolean {
    return this.hasAttribute('visible');
  }

  public set visible(value: boolean) {
    if (value) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  private readonly arrowRef: HTMLDivElement;
  private targetRef: HTMLElement | null = null;

  protected constructor() {
    super();

    assert(this.shadowRoot, 'Shadow root must be always available in "open" mode.');
    this.arrowRef = this.shadowRoot.querySelector('.ksl-positioned-element__arrow') as HTMLDivElement;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  public connectedCallback(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tooltip');
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }
  }

  public disconnectedCallback(): void {
    this.targetRef = null;
  }

  public attachTo = (node: HTMLElement): void => {
    this.targetRef = node;
    this.adjustPosition();
  };

  protected adjustPosition = (): void => {
    if (!this.targetRef || !this.offsetParent) {
      return; // No need to adjust anything
    }

    const parentRect = this.offsetParent.getBoundingClientRect();
    const targetRect = this.targetRef.getBoundingClientRect();
    const tooltipRect = this.getBoundingClientRect();

    const tooltipTop = this.calculateTooltipTop(targetRect, tooltipRect);
    const tooltipLeft = this.calculateTooltipLeft(targetRect, tooltipRect);

    if (parentRect.top + tooltipTop + tooltipRect.height > window.innerHeight) {
      this.style.bottom = parentRect.height + 'px';
      this.style.top = 'auto';
    } else {
      this.style.bottom = 'auto';
      this.style.top = Math.max(-parentRect.top, tooltipTop) + 'px';
    }

    if (parentRect.left + tooltipLeft + tooltipRect.width > window.innerWidth) {
      this.style.right = '0px';
      this.style.left = 'auto';
    } else {
      this.style.right = 'auto';
      this.style.left = Math.max(0, tooltipLeft) + 'px';
    }
  };

  protected calculateTooltipTop = (targetRect: DOMRect, tooltipRect: DOMRect): number => {
    const verticalCenterOffset = (targetRect.height - tooltipRect.height) / 2;

    switch (this.position) {
      case ElementPosition.TopStart:
      case ElementPosition.Top:
      case ElementPosition.TopEnd:
        return targetRect.top - tooltipRect.height + window.pageYOffset;
      case ElementPosition.BottomStart:
      case ElementPosition.Bottom:
      case ElementPosition.BottomEnd:
        return targetRect.top + targetRect.height + window.pageYOffset;
      case ElementPosition.LeftStart:
      case ElementPosition.RightStart:
        return targetRect.top + window.pageYOffset;
      case ElementPosition.Left:
      case ElementPosition.Right:
        return targetRect.top + verticalCenterOffset + window.pageYOffset;
      case ElementPosition.LeftEnd:
      case ElementPosition.RightEnd:
        return targetRect.top + targetRect.height - tooltipRect.height + window.pageYOffset;
      default:
        console.error(`Can't calculate tooltip top for unknown position: ${this.position}.`);
        return 0;
    }
  };

  protected calculateTooltipLeft = (targetRect: DOMRect, tooltipRect: DOMRect): number => {
    const horizontalCenterOffset = (targetRect.width - tooltipRect.width) / 2;

    switch (this.position) {
      case ElementPosition.TopStart:
      case ElementPosition.BottomStart:
        return targetRect.left + window.pageXOffset;
      case ElementPosition.Top:
      case ElementPosition.Bottom:
        return targetRect.left + horizontalCenterOffset + window.pageXOffset;
      case ElementPosition.TopEnd:
      case ElementPosition.BottomEnd:
        return targetRect.left + targetRect.width - tooltipRect.width;
      case ElementPosition.LeftStart:
      case ElementPosition.Left:
      case ElementPosition.LeftEnd:
        return targetRect.left - tooltipRect.width + window.pageXOffset;
      case ElementPosition.RightStart:
      case ElementPosition.Right:
      case ElementPosition.RightEnd:
        return targetRect.left + targetRect.width + window.pageXOffset;
      default:
        console.error(`Can't calculate tooltip left for unknown position: ${this.position}.`);
        return 0;
    }
  };
}
