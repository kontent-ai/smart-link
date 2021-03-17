import { ButtonType, KSLButtonElement } from './KSLButtonElement';
import { IconName } from './KSLIconElement';
import { KSLCustomElement } from './abstract/KSLCustomElement';
import { assert } from '../utils/assert';
import { createTemplateForCustomElement } from '../utils/customElements';
import { ElementPosition } from './abstract/KSLPositionedElement';
import { KSLPopoverElement } from './KSLPopoverElement';

const popoverHTML = `
  <ksl-button
    id="component"
    type="${ButtonType.Quinary}"
    tooltip-message="Add component"
    tooltip-position="${ElementPosition.Top}"
  >
    <ksl-icon icon-name="${IconName.CollapseScheme}"/>
  </ksl-button>
  <ksl-button
    id="linked-item"
    type="${ButtonType.Quinary}"
    tooltip-message="Add linked item"
    tooltip-position="${ElementPosition.Top}"
  >
    <ksl-icon icon-name="${IconName.Puzzle}"/>
  </ksl-button>
`;

const templateHTML = `
  <style>
    :host {
      display: inline-block;
    }
  </style>
  <ksl-button
      type="${ButtonType.Primary}"
      tooltip-position="${ElementPosition.Top}"
  >
    <ksl-icon icon-name="${IconName.Plus}"/>
  </ksl-button>
`;

export class KSLAddButtonElement extends KSLCustomElement {
  public static get is() {
    return 'ksl-add-button' as const;
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
    window.addEventListener('click', this.handleClickOutside, { capture: true });
    this.addEventListener('click', this.handleClick);
    this.buttonRef.tooltipMessage = 'Add component/item';
  }

  public disconnectedCallback(): void {
    window.removeEventListener('click', this.handleClickOutside, { capture: true });
    this.removeEventListener('click', this.handleClick);
    this.hidePopover();
  }

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    this.buttonRef.loading = true;

    setTimeout(() => {
      this.showPopover();
      this.buttonRef.loading = false;
    }, 3000);
  };

  private handleClickOutside = (event: MouseEvent): void => {
    if (!this.popoverRef || !(event.target instanceof HTMLElement)) {
      return;
    }

    const clickedInsidePopover = this.popoverRef.isSameNode(event.target) || this.popoverRef.contains(event.target);
    if (!clickedInsidePopover) {
      this.hidePopover();
    }
  };

  private showPopover = (): void => {
    if (this.popoverRef) {
      this.hidePopover();
    }

    this.buttonRef.tooltipPosition = ElementPosition.Bottom;

    const popover = document.createElement(KSLPopoverElement.is);
    popover.innerHTML = popoverHTML;

    this.popoverRef = document.body.appendChild(popover);
    this.popoverRef.position = ElementPosition.Top;
    this.popoverRef.attachTo(this);

    this.addPopoverEventListeners();

    this.popoverRef.visible = true;
  };

  private hidePopover = (): void => {
    this.buttonRef.tooltipPosition = ElementPosition.Top;

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
    const linkedItemButtonRef = this.popoverRef.querySelector('#linked-item') as KSLButtonElement;

    if (componentButtonRef) {
      componentButtonRef.addEventListener('click', this.handleAddComponent);
    }

    if (linkedItemButtonRef) {
      linkedItemButtonRef.addEventListener('click', this.handleAddLinkedItem);
    }
  };

  private removePopoverEventListeners = (): void => {
    if (!this.popoverRef) {
      return;
    }

    const componentButtonRef = this.popoverRef.querySelector('#component') as KSLButtonElement;
    const linkedItemButtonRef = this.popoverRef.querySelector('#linked-item') as KSLButtonElement;

    if (componentButtonRef) {
      componentButtonRef.removeEventListener('click', this.handleAddComponent);
    }

    if (linkedItemButtonRef) {
      linkedItemButtonRef.removeEventListener('click', this.handleAddLinkedItem);
    }
  };

  private handleAddComponent = (): void => {
    this.hidePopover();
    this.buttonRef.disabled = true;
    this.buttonRef.tooltipMessage = 'You have no rights to do this.';
  };

  private handleAddLinkedItem = (): void => {
    this.hidePopover();
    this.buttonRef.disabled = true;
    this.buttonRef.tooltipMessage = 'You have no rights to do this.';
  };
}
