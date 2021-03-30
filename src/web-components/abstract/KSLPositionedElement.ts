import { KSLCustomElement } from './KSLCustomElement';

export enum ElementPositionOffset {
  Bottom = 'bottom',
  BottomEnd = 'bottom-end',
  BottomStart = 'bottom-start',
  Left = 'left',
  LeftEnd = 'left-end',
  LeftStart = 'left-start',
  None = '',
  Right = 'right',
  RightEnd = 'right-end',
  RightStart = 'right-start',
  Top = 'top',
  TopEnd = 'top-end',
  TopStart = 'top-start',
}

export interface IPositionable {
  readonly adjustPosition: () => void;
}

export abstract class KSLPositionedElement extends KSLCustomElement implements IPositionable {
  public get position(): string {
    return ElementPositionOffset.None;
  }

  protected targetRef: HTMLElement | null = null;

  public connectedCallback(): void {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }
  }

  public disconnectedCallback(): void {
    this.targetRef = null;
  }

  public attachTo(element: HTMLElement): void {
    this.targetRef = element;
  }

  protected calculateTopOffset(thisRect: DOMRect, targetRect: DOMRect): number {
    switch (this.position) {
      case ElementPositionOffset.TopStart:
      case ElementPositionOffset.Top:
      case ElementPositionOffset.TopEnd:
        return -thisRect.height;
      case ElementPositionOffset.BottomStart:
      case ElementPositionOffset.Bottom:
      case ElementPositionOffset.BottomEnd:
        return targetRect.height;
      case ElementPositionOffset.Left:
      case ElementPositionOffset.Right:
        return (targetRect.height - thisRect.height) / 2;
      case ElementPositionOffset.LeftEnd:
      case ElementPositionOffset.RightEnd:
        return targetRect.height - thisRect.height;
      case ElementPositionOffset.LeftStart:
      case ElementPositionOffset.RightStart:
      case ElementPositionOffset.None:
      default:
        return 0;
    }
  }

  protected calculateLeftOffset(thisRect: DOMRect, targetRect: DOMRect): number {
    switch (this.position) {
      case ElementPositionOffset.Top:
      case ElementPositionOffset.Bottom:
        return (targetRect.width - thisRect.width) / 2;
      case ElementPositionOffset.TopEnd:
      case ElementPositionOffset.BottomEnd:
        return targetRect.width - thisRect.width;
      case ElementPositionOffset.LeftStart:
      case ElementPositionOffset.Left:
      case ElementPositionOffset.LeftEnd:
        return -thisRect.width;
      case ElementPositionOffset.RightStart:
      case ElementPositionOffset.Right:
      case ElementPositionOffset.RightEnd:
        return targetRect.width;
      case ElementPositionOffset.TopStart:
      case ElementPositionOffset.BottomStart:
      case ElementPositionOffset.None:
      default:
        return 0;
    }
  }

  public abstract adjustPosition(): void;
}
