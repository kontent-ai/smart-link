import { ButtonType, KSLButtonElement } from './KSLButtonElement';
import { IconName } from './KSLIconElement';
import { assert } from '../utils/assert';
import { KSLPopoverElement } from './KSLPopoverElement';
import { ElementPositionOffset, KSLPositionedElement } from './abstract/KSLPositionedElement';
import { MetadataAttribute } from '../utils/dataAttributes';
import { KSLContainerElement } from './KSLContainerElement';
import { createTemplateForCustomElement } from '../utils/node';

const popoverHTML = `
  <style>
    .ksl-add-button__popover-button + .ksl-add-button__popover-button {
      margin-left: 4px;
    }
  </style>
  <ksl-button
    id="existing-linked-item"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-message="Add existing linked item"
    tooltip-position="${ElementPositionOffset.Top}"
  >
    <ksl-icon icon-name="${IconName.Puzzle}"/>
  </ksl-button>
  <ksl-button
    id="new-linked-item"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-message="Add new linked item"
    tooltip-position="${ElementPositionOffset.Top}"
  >
    <ksl-icon icon-name="${IconName.PlusPuzzle}"/>
  </ksl-button>
  <ksl-button
    id="component"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-message="Add component"
    tooltip-position="${ElementPositionOffset.Top}"
  >
    <ksl-icon icon-name="${IconName.CollapseScheme}"/>
  </ksl-button>
`;

const templateHTML = `
  <style>
    :host {
      display: inline-block;
      position: absolute;
      z-index: 9999;
      pointer-events: all;
      touch-action: initial;
    }
    
    :host(:focus) {
      outline: none;
    }
    
    ${KSLButtonElement.is} {
      display: block;
    }
  </style>
  <ksl-button
      type="${ButtonType.Primary}"
      tooltip-position="${ElementPositionOffset.Top}"
  >
    <ksl-icon icon-name="${IconName.Plus}"/>
  </ksl-button>
`;

export class KSLPlusButtonElement extends KSLPositionedElement {
  public static get is() {
    return 'ksl-plus-button' as const;
  }

  public get position(): string {
    return this.targetRef?.getAttribute(MetadataAttribute.PlusButtonRenderPosition) ?? ElementPositionOffset.Bottom;
  }

  private readonly buttonRef: KSLButtonElement;
  private popoverRef: KSLPopoverElement | null = null;

  constructor() {
    super();

    assert(this.shadowRoot, 'Shadow root must be available in "open" mode.');
    this.buttonRef = this.shadowRoot.querySelector(KSLButtonElement.is) as KSLButtonElement;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  public connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('click', this.handleClickOutside, { capture: true });
    this.buttonRef.addEventListener('click', this.handleClick);
    this.buttonRef.tooltipMessage = 'Add component/item';
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener('click', this.handleClickOutside, { capture: true });
    this.buttonRef.removeEventListener('click', this.handleClick);
    this.hidePopover();
  }

  public adjustPosition = (): void => {
    if (!this.targetRef || !this.offsetParent) {
      return;
    }

    if (!(this.offsetParent instanceof KSLContainerElement)) {
      console.warn('KSLPlusButtonElement: should be located inside KSLContainerElement to be positioned properly.');
    }

    const offsetParentRect = this.offsetParent.getBoundingClientRect();
    const targetRect = this.targetRef.getBoundingClientRect();
    const thisRect = this.getBoundingClientRect();

    const verticalOffset = this.calculateTopOffset(thisRect, targetRect);
    const horizontalOffset = this.calculateLeftOffset(thisRect, targetRect);

    this.style.top = `${targetRect.top - offsetParentRect.top + verticalOffset}px`;
    this.style.left = `${targetRect.left - offsetParentRect.left + horizontalOffset}px`;
  };

  protected calculateTopOffset(thisRect: DOMRect, targetRect: DOMRect): number {
    const offset = super.calculateTopOffset(thisRect, targetRect);

    switch (this.position) {
      case ElementPositionOffset.TopStart:
      case ElementPositionOffset.Top:
      case ElementPositionOffset.TopEnd:
        return offset / 2;
      case ElementPositionOffset.BottomStart:
      case ElementPositionOffset.Bottom:
      case ElementPositionOffset.BottomEnd:
        return offset - thisRect.height / 2;
      default:
        return offset;
    }
  }

  protected calculateLeftOffset(thisRect: DOMRect, targetRect: DOMRect): number {
    const offset = super.calculateLeftOffset(thisRect, targetRect);

    switch (this.position) {
      case ElementPositionOffset.LeftStart:
      case ElementPositionOffset.Left:
      case ElementPositionOffset.LeftEnd:
        return offset / 2;
      case ElementPositionOffset.RightStart:
      case ElementPositionOffset.Right:
      case ElementPositionOffset.RightEnd:
        return targetRect.width - thisRect.width / 2;
      default:
        return offset;
    }
  }

  private handleClick = (event: MouseEvent): void => {
    if (this.popoverRef) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.buttonRef.loading = true;

    setTimeout(() => {
      this.showPopover();
      this.buttonRef.loading = false;
    }, 1000);
  };

  private handleClickOutside = (event: MouseEvent): void => {
    if (!this.popoverRef || !(event.target instanceof HTMLElement)) {
      return;
    }

    const clickedInside = this.isSameNode(event.target) || this.contains(event.target);
    if (!clickedInside) {
      this.hidePopover();
    }
  };

  private showPopover = (): void => {
    assert(this.shadowRoot, 'Shadow root must be available in "open" mode.');

    if (this.popoverRef) {
      this.hidePopover();
    }

    this.buttonRef.tooltipPosition = ElementPositionOffset.Bottom;

    const popover = document.createElement(KSLPopoverElement.is);
    popover.innerHTML = popoverHTML;

    const popoverParent = this.shadowRoot;

    this.popoverRef = popoverParent.appendChild(popover);
    this.popoverRef.position = ElementPositionOffset.Top;
    this.popoverRef.attachTo(this);

    this.addPopoverEventListeners();

    this.popoverRef.visible = true;
  };

  private hidePopover = (): void => {
    this.buttonRef.tooltipPosition = ElementPositionOffset.Top;

    if (this.popoverRef) {
      this.removePopoverEventListeners();

      this.popoverRef.visible = false;
      this.popoverRef.remove();
      this.popoverRef = null;
    }
  };

  private addPopoverEventListeners = (): void => {
    if (!this.popoverRef) {
      return;
    }

    const componentButtonRef = this.popoverRef.querySelector('#component') as KSLButtonElement;
    const linkedItemButtonRef = this.popoverRef.querySelector('#existing-linked-item') as KSLButtonElement;
    const newLinkedItemButtonRef = this.popoverRef.querySelector('#new-linked-item') as KSLButtonElement;

    if (componentButtonRef) {
      componentButtonRef.addEventListener('click', this.handleAddComponent);
    }

    if (linkedItemButtonRef) {
      linkedItemButtonRef.addEventListener('click', this.handleAddExistingLinkedItem);
    }

    if (newLinkedItemButtonRef) {
      newLinkedItemButtonRef.addEventListener('click', this.handleAddNewLinkedItem);
    }
  };

  private removePopoverEventListeners = (): void => {
    if (!this.popoverRef) {
      return;
    }

    const componentButtonRef = this.popoverRef.querySelector('#component') as KSLButtonElement;
    const existingLinkedItemButtonRef = this.popoverRef.querySelector('#existing-linked-item') as KSLButtonElement;
    const newLinkedItemButtonRef = this.popoverRef.querySelector('#new-linked-item') as KSLButtonElement;

    if (componentButtonRef) {
      componentButtonRef.removeEventListener('click', this.handleAddComponent);
    }

    if (existingLinkedItemButtonRef) {
      existingLinkedItemButtonRef.removeEventListener('click', this.handleAddExistingLinkedItem);
    }

    if (newLinkedItemButtonRef) {
      newLinkedItemButtonRef.removeEventListener('click', this.handleAddNewLinkedItem);
    }
  };

  private handleAddComponent = (): void => {
    this.hidePopover();
    this.buttonRef.disabled = true;
    this.buttonRef.tooltipMessage = 'You have no rights to do this.';
  };

  private handleAddExistingLinkedItem = (): void => {
    this.hidePopover();
    this.buttonRef.disabled = true;
    this.buttonRef.tooltipMessage = 'You have no rights to do this.';
  };

  private handleAddNewLinkedItem = (): void => {
    this.hidePopover();
    this.buttonRef.disabled = true;
    this.buttonRef.tooltipMessage = 'You have no rights to do this.';
  };
}
