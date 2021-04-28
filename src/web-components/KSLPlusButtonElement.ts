import { ButtonType, KSLButtonElement } from './KSLButtonElement';
import { IconName } from './KSLIconElement';
import { assert } from '../utils/assert';
import { KSLPopoverElement } from './KSLPopoverElement';
import { ElementPositionOffset, KSLPositionedElement } from './abstract/KSLPositionedElement';
import { KSLContainerElement } from './KSLContainerElement';
import { createTemplateForCustomElement } from '../utils/node';
import { DeepPartial, MetadataAttribute, parsePlusButtonDataAttributes } from '../utils/dataAttributes';
import {
  IPlusActionMessageData,
  IPlusButtonPermissionsServerModel,
  IPlusInitialMessageData,
  PlusButtonAction,
  PlusButtonElementType,
} from '../lib/IFrameCommunicatorTypes';
import { AsyncCustomEvent } from '../utils/events';
import { hasPlusButtonPermissions } from '../utils/validation';
import { Logger } from '../lib/Logger';

enum PopoverButtonId {
  CreateComponent = 'create-component',
  CreateLinkedItem = 'create-linked-item',
  InsertLinkedItem = 'insert-linked-item',
}

interface IKSLPlusButtonElementEventData<TMessageData> {
  readonly data: DeepPartial<TMessageData>;
  readonly targetNode: HTMLElement;
}

interface IKSLPlusButtonElementInitialEventReason {
  readonly message: string;
}

type KSLPlusButtonElementInitialEventData = IKSLPlusButtonElementEventData<IPlusInitialMessageData>;
type KSLPlusButtonElementActionEventData = IKSLPlusButtonElementEventData<IPlusActionMessageData>;

export type KSLPlusButtonElementActionEvent = CustomEvent<KSLPlusButtonElementActionEventData>;
export type KSLPlusButtonElementInitialAsyncEvent = AsyncCustomEvent<
  KSLPlusButtonElementInitialEventData,
  IPlusButtonPermissionsServerModel,
  IKSLPlusButtonElementInitialEventReason
>;

declare global {
  interface WindowEventMap {
    'ksl:plus-button:action': KSLPlusButtonElementActionEvent;
    'ksl:plus-button:initial': KSLPlusButtonElementInitialAsyncEvent;
  }

  interface HTMLElementEventMap {
    'ksl:plus-button:action': KSLPlusButtonElementActionEvent;
    'ksl:plus-button:initial': KSLPlusButtonElementInitialAsyncEvent;
  }
}

const popoverHTML = `
  <style>
    .ksl-add-button__popover-button + .ksl-add-button__popover-button {
      margin-left: 4px;
    }
  </style>
  <ksl-button
    id="${PopoverButtonId.InsertLinkedItem}"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-message="Add existing linked item"
    tooltip-position="${ElementPositionOffset.Top}"
  >
    <ksl-icon icon-name="${IconName.Puzzle}"/>
  </ksl-button>
  <ksl-button
    id="${PopoverButtonId.CreateLinkedItem}"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-message="Add new linked item"
    tooltip-position="${ElementPositionOffset.Top}"
  >
    <ksl-icon icon-name="${IconName.PlusPuzzle}"/>
  </ksl-button>
  <ksl-button
    id="${PopoverButtonId.CreateComponent}"
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

  private handleClick = async (event: MouseEvent): Promise<void> => {
    if (this.popoverRef) {
      return;
    }

    assert(this.targetRef, 'Target node is not set for this plus button.');

    event.preventDefault();
    event.stopPropagation();

    this.buttonRef.loading = true;

    const data = parsePlusButtonDataAttributes(this.targetRef);

    try {
      const eventData = { data, targetNode: this.targetRef };

      const response: IPlusButtonPermissionsServerModel = await this.dispatchAsyncEvent(
        'ksl:plus-button:initial',
        eventData
      );

      const { elementType, permissions } = response;

      if (!permissions || !hasPlusButtonPermissions(permissions)) {
        this.buttonRef.loading = false;
        this.buttonRef.disabled = false;
        this.buttonRef.tooltipMessage = 'You have no rights to do this.';
      } else {
        this.buttonRef.loading = false;
        this.buttonRef.disabled = false;
        this.buttonRef.tooltipMessage = 'Add component/item';

        this.showPopover(elementType);
      }
    } catch (reason) {
      Logger.error(reason);

      this.buttonRef.loading = false;
      this.buttonRef.disabled = true;

      if (reason && typeof reason.message === 'string') {
        this.buttonRef.tooltipMessage = reason.message;
      } else {
        this.buttonRef.tooltipMessage = 'Something went wrong.';
      }
    }
  };

  private handleClickOutside = (event: MouseEvent): void => {
    if (!this.popoverRef || !(event.target instanceof Element)) {
      return;
    }

    const clickedInside = this.isSameNode(event.target) || this.contains(event.target);
    if (!clickedInside) {
      this.hidePopover();
    }
  };

  private showPopover = (elementType: PlusButtonElementType): void => {
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

    this.addPopoverEventListeners(elementType);

    this.popoverRef.visible = true;
    this.popoverRef.adjustPosition();
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

  private addPopoverEventListeners = (elementType: PlusButtonElementType): void => {
    if (!this.popoverRef) {
      return;
    }

    const createComponentButtonRef = this.popoverRef.querySelector(
      `#${PopoverButtonId.CreateComponent}`
    ) as KSLButtonElement;
    const createLinkedItemButtonRef = this.popoverRef.querySelector(
      `#${PopoverButtonId.CreateLinkedItem}`
    ) as KSLButtonElement;
    const insertLinkedItemButtonRef = this.popoverRef.querySelector(
      `#${PopoverButtonId.InsertLinkedItem}`
    ) as KSLButtonElement;

    if (createComponentButtonRef) {
      if (elementType === PlusButtonElementType.RichText) {
        createComponentButtonRef.addEventListener('click', this.handleCreateComponentClick);
      } else {
        createComponentButtonRef.hidden = true;
      }
    }

    if (createLinkedItemButtonRef) {
      if (elementType === PlusButtonElementType.LinkedItems) {
        createLinkedItemButtonRef.addEventListener('click', this.handleCreateLinkedItemClick);
      } else {
        createLinkedItemButtonRef.hidden = true;
      }
    }

    if (insertLinkedItemButtonRef) {
      insertLinkedItemButtonRef.addEventListener('click', this.handleInsertLinkedItemClick);
    }
  };

  private removePopoverEventListeners = (): void => {
    if (!this.popoverRef) {
      return;
    }

    const createComponentButtonRef = this.popoverRef.querySelector(
      `#${PopoverButtonId.CreateComponent}`
    ) as KSLButtonElement;
    const createLinkedItemButtonRef = this.popoverRef.querySelector(
      `#${PopoverButtonId.CreateLinkedItem}`
    ) as KSLButtonElement;
    const insertLinkedItemButtonRef = this.popoverRef.querySelector(
      `#${PopoverButtonId.InsertLinkedItem}`
    ) as KSLButtonElement;

    if (createComponentButtonRef) {
      createComponentButtonRef.removeEventListener('click', this.handleCreateComponentClick);
    }

    if (createLinkedItemButtonRef) {
      createLinkedItemButtonRef.removeEventListener('click', this.handleCreateLinkedItemClick);
    }

    if (insertLinkedItemButtonRef) {
      insertLinkedItemButtonRef.removeEventListener('click', this.handleInsertLinkedItemClick);
    }
  };

  private handleCreateComponentClick = (event: MouseEvent): void => {
    this.handlePlusActionClick(event, PlusButtonAction.CreateComponent);
  };

  private handleCreateLinkedItemClick = (event: MouseEvent): void => {
    this.handlePlusActionClick(event, PlusButtonAction.CreateLinkedItem);
  };

  private handleInsertLinkedItemClick = (event: MouseEvent): void => {
    this.handlePlusActionClick(event, PlusButtonAction.InsertLinkedItem);
  };

  private handlePlusActionClick = (event: MouseEvent, action: PlusButtonAction): void => {
    assert(this.targetRef, 'Target node is not set for this plus button.');

    event.preventDefault();
    event.stopPropagation();

    const data = parsePlusButtonDataAttributes(this.targetRef);
    const customEvent = new CustomEvent<KSLPlusButtonElementActionEventData>('ksl:plus-button:action', {
      detail: {
        data: { ...data, action },
        targetNode: this.targetRef,
      },
    });

    this.hidePopover();
    this.dispatchEvent(customEvent);
  };
}
