import { ButtonType, KSLButtonElement } from './KSLButtonElement';
import { IconName } from './KSLIconElement';
import { assert } from '../utils/assert';
import { KSLPopoverElement } from './KSLPopoverElement';
import { ElementPositionOffset, KSLPositionedElement } from './abstract/KSLPositionedElement';
import { KSLContainerElement } from './KSLContainerElement';
import { createTemplateForCustomElement } from '../utils/node';
import { DeepPartial, MetadataAttribute, parseAddButtonDataAttributes } from '../utils/dataAttributes';
import {
  AddButtonAction,
  AddButtonElementType,
  AddButtonPermission,
  AddButtonPermissionCheckResult,
  IAddActionMessageData,
  IAddButtonInitialMessageData,
  IAddButtonPermissionsServerModel,
} from '../lib/IFrameCommunicatorTypes';
import { AsyncCustomEvent } from '../utils/events';
import { Logger } from '../lib/Logger';
import { BaseZIndex } from './constants/zIndex';

const ContentIsPublishedTooltip = 'Content is published';
const DefaultTooltipMessage = 'Insert...';
const getCreateLinkedItemTooltip = (canUserCreateLinkedItem: boolean) =>
  canUserCreateLinkedItem ? 'Create new item' : 'Your role cannot create items from the allowed types';

enum PopoverButtonId {
  CreateComponent = 'create-component',
  CreateLinkedItem = 'create-linked-item',
  InsertLinkedItem = 'insert-linked-item',
}

interface IKSLAddButtonElementEventData<TMessageData> {
  readonly data: DeepPartial<TMessageData>;
  readonly targetNode: HTMLElement;
}

interface IKSLAddButtonElementInitialEventReason {
  readonly message: string;
}

type KSLAddButtonElementInitialEventData = IKSLAddButtonElementEventData<IAddButtonInitialMessageData>;
type KSLAddButtonElementActionEventData = IKSLAddButtonElementEventData<IAddActionMessageData>;

export type KSLAddButtonElementActionEvent = CustomEvent<KSLAddButtonElementActionEventData>;
export type KSLAddButtonElementInitialAsyncEvent = AsyncCustomEvent<
  KSLAddButtonElementInitialEventData,
  IAddButtonPermissionsServerModel,
  IKSLAddButtonElementInitialEventReason
>;

declare global {
  interface WindowEventMap {
    'ksl:add-button:action': KSLAddButtonElementActionEvent;
    'ksl:add-button:initial': KSLAddButtonElementInitialAsyncEvent;
  }

  interface HTMLElementEventMap {
    'ksl:add-button:action': KSLAddButtonElementActionEvent;
    'ksl:add-button:initial': KSLAddButtonElementInitialAsyncEvent;
  }
}

const getPopoverHtml =
  (cspNonce?: string) =>
  ({ elementType, isParentPublished, permissions }: IAddButtonPermissionsServerModel) => {
    const canUserCreateLinkedItem =
      permissions.get(AddButtonPermission.CreateNew) === AddButtonPermissionCheckResult.Ok;

    return `
    <style ${cspNonce ? `nonce=${cspNonce}` : ''}>
    .ksl-add-button__popover-button + .ksl-add-button__popover-button {
      margin-left: 4px;
    }
  </style>
  <ksl-button
    id="${PopoverButtonId.InsertLinkedItem}"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-position="${ElementPositionOffset.Top}"
    tooltip-message="${isParentPublished ? ContentIsPublishedTooltip : 'Insert existing item'}"
    ${isParentPublished && 'disabled'}
  >
    <ksl-icon icon-name="${IconName.Puzzle}"/>
  </ksl-button>
  <ksl-button
    id="${PopoverButtonId.CreateLinkedItem}"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-position="${ElementPositionOffset.Top}"
    tooltip-message="${
      isParentPublished ? ContentIsPublishedTooltip : getCreateLinkedItemTooltip(canUserCreateLinkedItem)
    }"
    ${(isParentPublished || !canUserCreateLinkedItem) && 'disabled'}
    ${elementType !== AddButtonElementType.LinkedItems && 'hidden'}
  >
    <ksl-icon icon-name="${IconName.PlusPuzzle}"/>
  </ksl-button>
  <ksl-button
    id="${PopoverButtonId.CreateComponent}"
    class="ksl-add-button__popover-button"
    type="${ButtonType.Quinary}"
    tooltip-position="${ElementPositionOffset.Top}"
    tooltip-message="${isParentPublished ? ContentIsPublishedTooltip : 'Insert new component'}"
    ${isParentPublished && 'disabled'}
    ${elementType !== AddButtonElementType.RichText && 'hidden'}
  >
    <ksl-icon icon-name="${IconName.CollapseScheme}"/>
  </ksl-button>
`;
  };

const templateHTML = `
  <style>
    :host {
      display: inline-block;
      position: absolute;
      z-index: calc(var(--ksl-z-index, ${BaseZIndex}) + 20);
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

export class KSLAddButtonElement extends KSLPositionedElement {
  private static PopOverElement: ((params: IAddButtonPermissionsServerModel) => string) | null = null;

  public static get is() {
    return 'ksl-add-button' as const;
  }

  public get position(): string {
    return this.targetRef?.getAttribute(MetadataAttribute.AddButtonRenderPosition) ?? ElementPositionOffset.Bottom;
  }

  private readonly buttonRef: KSLButtonElement;
  private popoverRef: KSLPopoverElement | null = null;

  constructor() {
    super();

    assert(this.shadowRoot, 'Shadow root must be available in "open" mode.');
    this.buttonRef = this.shadowRoot.querySelector(KSLButtonElement.is) as KSLButtonElement;
  }

  public static initializeTemplate(cspNonce?: string): HTMLTemplateElement {
    KSLAddButtonElement.PopOverElement = getPopoverHtml(cspNonce);
    return createTemplateForCustomElement(templateHTML);
  }

  public connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('click', this.handleClickOutside, { capture: true });
    this.buttonRef.addEventListener('click', this.handleClick);
    this.buttonRef.tooltipMessage = DefaultTooltipMessage;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener('click', this.handleClickOutside, { capture: true });
    this.buttonRef.removeEventListener('click', this.handleClick);
    this.dismissPopover();
  }

  public adjustPosition = (): void => {
    if (!this.targetRef || !this.offsetParent) {
      return;
    }

    if (!(this.offsetParent instanceof KSLContainerElement)) {
      console.warn('KSLAddButtonElement: should be located inside KSLContainerElement to be positioned properly.');
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

    assert(this.targetRef, 'Target node is not set for this add button.');

    event.preventDefault();
    event.stopPropagation();

    this.buttonRef.loading = true;

    const data = parseAddButtonDataAttributes(this.targetRef);

    try {
      const eventData = { data, targetNode: this.targetRef };

      const response: IAddButtonPermissionsServerModel = await this.dispatchAsyncEvent(
        'ksl:add-button:initial',
        eventData
      );

      const { permissions } = response;
      const isUserMissingPermissions =
        !permissions ||
        permissions.get(AddButtonPermission.ViewParent) !== AddButtonPermissionCheckResult.Ok ||
        permissions.get(AddButtonPermission.Edit) !== AddButtonPermissionCheckResult.Ok;
      const areComponentsForbidden =
        permissions.get(AddButtonPermission.CreateNew) === AddButtonPermissionCheckResult.RteWithForbiddenComponents;

      if (isUserMissingPermissions || areComponentsForbidden) {
        this.buttonRef.loading = false;
        this.buttonRef.disabled = true;
        this.buttonRef.tooltipMessage = isUserMissingPermissions
          ? 'You are not allowed to add content here'
          : "Components and items can't be added here";
      } else {
        this.buttonRef.loading = false;
        this.buttonRef.disabled = false;
        this.buttonRef.tooltipMessage = DefaultTooltipMessage;

        this.displayPopover(response);
      }
    } catch (reason) {
      Logger.error(reason);

      this.buttonRef.loading = false;
      this.buttonRef.disabled = true;

      if (reason && typeof reason.message === 'string') {
        this.buttonRef.tooltipMessage = reason.message;
      } else {
        this.buttonRef.tooltipMessage = 'Something went wrong';
      }
    }
  };

  private handleClickOutside = (event: MouseEvent): void => {
    if (!this.popoverRef || !(event.target instanceof Element)) {
      return;
    }

    const clickedInside = this.isSameNode(event.target) || this.contains(event.target);
    if (!clickedInside) {
      this.dismissPopover();
    }
  };

  private displayPopover = (response: IAddButtonPermissionsServerModel): void => {
    assert(this.shadowRoot, 'Shadow root must be available in "open" mode.');

    if (this.popoverRef) {
      this.dismissPopover();
    }

    this.buttonRef.tooltipPosition = ElementPositionOffset.Bottom;

    const popover = document.createElement(KSLPopoverElement.is);
    popover.innerHTML = KSLAddButtonElement.PopOverElement?.(response) ?? '';

    const popoverParent = this.shadowRoot;

    this.popoverRef = popoverParent.appendChild(popover);
    this.popoverRef.position = ElementPositionOffset.Top;
    this.popoverRef.attachTo(this);

    this.addPopoverEventListeners(response.elementType);

    this.popoverRef.visible = true;
    this.popoverRef.adjustPosition();
  };

  private dismissPopover = (): void => {
    this.buttonRef.tooltipPosition = ElementPositionOffset.Top;

    if (this.popoverRef) {
      this.removePopoverEventListeners();

      this.popoverRef.visible = false;
      this.popoverRef.remove();
      this.popoverRef = null;
    }
  };

  private addPopoverEventListeners = (elementType: AddButtonElementType): void => {
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

    if (createComponentButtonRef && elementType === AddButtonElementType.RichText) {
      createComponentButtonRef.addEventListener('click', this.handleCreateComponentClick);
    }

    if (createLinkedItemButtonRef && elementType === AddButtonElementType.LinkedItems) {
      createLinkedItemButtonRef.addEventListener('click', this.handleCreateLinkedItemClick);
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
    this.handleAddActionClick(event, AddButtonAction.CreateComponent);
  };

  private handleCreateLinkedItemClick = (event: MouseEvent): void => {
    this.handleAddActionClick(event, AddButtonAction.CreateLinkedItem);
  };

  private handleInsertLinkedItemClick = (event: MouseEvent): void => {
    this.handleAddActionClick(event, AddButtonAction.InsertLinkedItem);
  };

  private handleAddActionClick = (event: MouseEvent, action: AddButtonAction): void => {
    assert(this.targetRef, 'Target node is not set for this add button.');

    event.preventDefault();
    event.stopPropagation();

    const data = parseAddButtonDataAttributes(this.targetRef);
    const customEvent = new CustomEvent<KSLAddButtonElementActionEventData>('ksl:add-button:action', {
      detail: {
        data: { ...data, action },
        targetNode: this.targetRef,
      },
    });

    this.dismissPopover();
    this.dispatchEvent(customEvent);
  };
}
