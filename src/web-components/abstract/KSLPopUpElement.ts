import { ElementPositionOffset, KSLPositionedElement } from './KSLPositionedElement';
import { createTemplateForCustomElement, getTotalScrollOffset } from '../../utils/node';
import { Colors } from '../tokens/colors';
import { Shadows } from '../tokens/shadows';
import { BaseZIndex } from '../constants/zIndex';

const templateHTML = `
  <style>
    :host {
      --arrow-size: var(--ksl-pop-up-arrow-size, 12px);
      --background-color: var(--ksl-pop-up-background-color, ${Colors.BackgroundDefault});
      --border-radius: var(--ksl-pop-up-border-radius, 4px);
      --box-shadow: var(--ksl-pop-up-box-shadow, ${Shadows.Default});
      --color: var(--ksl-pop-up-color, ${Colors.TextDefault});
      --padding: var(--ksl-pop-up-padding, 8px 8px);
      
      display: block;
      position: absolute;
      opacity: 0;
      z-index: calc(var(--ksl-z-index, ${BaseZIndex}) + 1000);
      transition: opacity 250ms ease-in-out;
    }
  
    :host([visible]) {
      opacity: 1;
    }
    
    :host(:focus) {
      outline: none;
    }
  
    .ksl-pop-up__content {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      box-shadow: var(--box-shadow);
      background-color: var(--background-color);
      padding: var(--padding);
      border-radius: var(--border-radius);
      font-size: 12px;
      line-height: 16px;
      font-weight: normal;
      color: var(--color);
    }
  
    :host([position="${ElementPositionOffset.RightStart}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.Right}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.RightEnd}"]) .ksl-pop-up__content {
      margin-left: var(--arrow-size);
    }
  
    :host([position="${ElementPositionOffset.LeftStart}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.Left}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.LeftEnd}"]) .ksl-pop-up__content {
      margin-right: var(--arrow-size);
    }
  
    :host([position="${ElementPositionOffset.BottomStart}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.Bottom}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.BottomEnd}"]) .ksl-pop-up__content {
      margin-top: var(--arrow-size);
    }
  
    :host([position="${ElementPositionOffset.TopStart}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.Top}"]) .ksl-pop-up__content,
    :host([position="${ElementPositionOffset.TopEnd}"]) .ksl-pop-up__content {
      margin-bottom: var(--arrow-size);
    }
  
    .ksl-pop-up__arrow {
      position: absolute;
      width: 0;
      height: 0;
      margin: 0 .25rem;
    }
  
    :host([position="${ElementPositionOffset.RightStart}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.Right}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.RightEnd}"]) .ksl-pop-up__arrow {
      left: -(var(--arrow-size));
      border-right: var(--arrow-size) solid var(--background-color);
      border-top: var(--arrow-size) solid transparent;
      border-bottom: var(--arrow-size) solid transparent;
    }
  
    :host([position="${ElementPositionOffset.LeftStart}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.Left}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.LeftEnd}"]) .ksl-pop-up__arrow {
      right: -(var(--arrow-size));
      border-top: var(--arrow-size) solid transparent;
      border-left: var(--arrow-size) solid var(--background-color);
      border-bottom: var(--arrow-size) solid transparent;
    }
  
    :host([position="${ElementPositionOffset.BottomStart}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.Bottom}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.BottomEnd}"]) .ksl-pop-up__arrow {
      top: 0;
      border-left: var(--arrow-size) solid transparent;
      border-right: var(--arrow-size) solid transparent;
      border-bottom: var(--arrow-size) solid var(--background-color);
    }
  
    :host([position="${ElementPositionOffset.TopStart}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.Top}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.TopEnd}"]) .ksl-pop-up__arrow {
      bottom: 0;
      border-top: var(--arrow-size) solid var(--background-color);
      border-left: var(--arrow-size) solid transparent;
      border-right: var(--arrow-size) solid transparent;
    }
  
    :host([position="${ElementPositionOffset.Top}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.Bottom}"]) .ksl-pop-up__arrow {
      left: calc(50% - var(--arrow-size) - 0.25rem);
    }
  
    :host([position="${ElementPositionOffset.TopEnd}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.BottomEnd}"]) .ksl-pop-up__arrow {
      right: 0;
    }
  
    :host([position="${ElementPositionOffset.TopStart}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.BottomStart}"]) .ksl-pop-up__arrow {
      left: 0;
    }
  
    :host([position="${ElementPositionOffset.Left}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.Right}"]) .ksl-pop-up__arrow {
      top: 8px;
    }
  
    :host([position="${ElementPositionOffset.LeftEnd}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.RightEnd}"]) .ksl-pop-up__arrow {
      bottom: 0;
    }
  
    :host([position="${ElementPositionOffset.LeftStart}"]) .ksl-pop-up__arrow,
    :host([position="${ElementPositionOffset.RightStart}"]) .ksl-pop-up__arrow {
      top: 0;
    }
  </style>
  <div class="ksl-pop-up__content">
    <slot></slot>
  </div>
  <div class="ksl-pop-up__arrow"/>
`;

export abstract class KSLPopUpElement extends KSLPositionedElement {
  public get position(): string {
    return this.getAttribute('position') ?? ElementPositionOffset.Bottom;
  }

  public set position(value: string) {
    this.updateAttribute('position', value);
  }

  public get visible(): boolean {
    return this.hasAttribute('visible');
  }

  public set visible(value: boolean) {
    this.updateAttribute('visible', value);
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  public connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tooltip');
    }

    window.addEventListener('resize', this.adjustPosition, { capture: true });
    window.addEventListener('scroll', this.adjustPosition, { capture: true });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener('resize', this.adjustPosition, { capture: true });
    window.removeEventListener('scroll', this.adjustPosition, { capture: true });
  }

  public attachTo = (element: HTMLElement): void => {
    super.attachTo(element);
    this.adjustPosition();
  };

  public adjustPosition = (): void => {
    if (!this.targetRef || !this.offsetParent) {
      return; // Can't position without target reference or when not mounted to DOM.
    }

    const thisRect = this.getBoundingClientRect();
    const targetRect = this.targetRef.getBoundingClientRect();
    const parentRect = this.offsetParent.getBoundingClientRect();

    const isOffsetToBody = this.offsetParent.isSameNode(document.body);
    const isOffsetToTarget = this.offsetParent.isSameNode(this.targetRef);

    const topOffset = this.calculateTopOffset(thisRect, targetRect);
    const leftOffset = this.calculateLeftOffset(thisRect, targetRect);

    let thisTop: number;
    let thisLeft: number;

    if (isOffsetToTarget) {
      thisTop = topOffset;
      thisLeft = leftOffset;
    } else {
      const [scrollOffsetTop, scrollOffsetLeft] = getTotalScrollOffset(this.parentElement);

      thisTop = targetRect.top + topOffset + (isOffsetToBody ? window.pageYOffset : scrollOffsetTop);
      thisLeft = targetRect.left + leftOffset + (isOffsetToBody ? window.pageXOffset : scrollOffsetLeft);
    }

    if (isOffsetToBody) {
      if (parentRect.top + thisTop + thisRect.height > window.innerHeight) {
        this.style.bottom = parentRect.height + 'px';
        this.style.top = 'auto';
      } else {
        this.style.bottom = 'auto';
        this.style.top = Math.max(-parentRect.top, thisTop) + 'px';
      }

      if (parentRect.left + thisLeft + thisRect.width > window.innerWidth) {
        this.style.right = '0px';
        this.style.left = 'auto';
      } else {
        this.style.right = 'auto';
        this.style.left = Math.max(-parentRect.left, thisLeft) + 'px';
      }
    } else {
      this.style.right = 'auto';
      this.style.left = `${thisLeft}px`;
      this.style.bottom = 'auto';
      this.style.top = `${thisTop}px`;
    }
  };
}
