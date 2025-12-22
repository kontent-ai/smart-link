import { logWarn } from "../lib/Logger";
import { assert } from "../utils/assert";
import {
  getHighlightTypeForElement,
  HighlightType,
} from "../utils/dataAttributes/elementHighlight";
import { type ParseResult, parseEditButtonDataAttributes } from "../utils/dataAttributes/parser";
import { createTemplateForCustomElement } from "../utils/domElement";
import { ElementPositionOffset, KSLPositionedElement } from "./abstract/KSLPositionedElement";
import { ButtonType, type KSLButtonElement } from "./KSLButtonElement";
import { KSLContainerElement } from "./KSLContainerElement";
import { IconName } from "./KSLIconElement";
import { Colors } from "./tokens/colors";
import { Shadows } from "./tokens/shadows";
import { BaseZIndex } from "./tokens/zIndex";

interface IKSLHighlightElementEventData {
  readonly data: ParseResult;
  readonly targetNode: HTMLElement;
}

export type KSLHighlightElementEvent = CustomEvent<IKSLHighlightElementEventData>;

declare global {
  interface WindowEventMap {
    "ksl:highlight:edit": KSLHighlightElementEvent;
  }

  interface HTMLElementEventMap {
    "ksl:highlight:edit": KSLHighlightElementEvent;
  }
}

const templateHTML = `
  <style>
    :host,
    :host * {
      box-sizing: border-box;
    }
    
    :host {
      display: block;
      position: absolute;
      pointer-events: none;
      touch-action: none;
      min-height: 40px;
      min-width: 40px;
      width: 100%;
      height: 100%;
      border: 2px dashed;
      border-color: var(--ksl-color-primary-transparent, ${Colors.PrimaryTransparent});
      border-radius: 5px;
    }
    
    :host([hidden]) {
      display: none;
    }
    
    :host(:hover),
    :host([selected]) {
      border-color: var(--ksl-color-primary, ${Colors.Primary});
      z-index: calc(var(--ksl-z-index, ${BaseZIndex}) + 10);
    }
    
    :host(:focus) {
      outline: none;
    }
    
    .ksl-highlight__toolbar {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      pointer-events: all;
      touch-action: auto;
      min-height: 40px;
      max-height: 40px;
      border-radius: 8px;
      background-color: var(--ksl-color-background-default, ${Colors.BackgroundDefault});
      z-index: var(--ksl-z-index, ${BaseZIndex});
      padding: 8px;
      box-shadow: var(--ksl-shadow-default, ${Shadows.Default});
    }
    
    .ksl-highlight__toolbar:hover {
      z-index: calc(var(--ksl-z-index, ${BaseZIndex}) + 10);
    }
    
    .ksl-highlight__toolbar-button + .ksl-highlight__toolbar-button {
      margin-left: 4px;
    }
  </style>
  <div id="ksl-toolbar" class="ksl-highlight__toolbar">
    <ksl-button 
      id="ksl-edit" 
      class="ksl-highlight__toolbar-button"
      type="${ButtonType.Quinary}"
      tooltip-position="${ElementPositionOffset.BottomEnd}"
    >
      <ksl-icon icon-name="${IconName.Edit}" />
    </ksl-button>
  </div>
`;

export class KSLHighlightElement extends KSLPositionedElement {
  public static get is() {
    return "ksl-highlight" as const;
  }

  public get type(): HighlightType {
    return getHighlightTypeForElement(this.targetRef);
  }

  public get selected(): boolean {
    return this.hasAttribute("selected");
  }

  public set selected(value: boolean) {
    this.updateAttribute("selected", value);
  }

  private readonly editButtonRef: KSLButtonElement;

  constructor() {
    super();

    assert(this.shadowRoot, 'Shadow root must be always accessible in "open" mode.');
    this.editButtonRef = this.shadowRoot.querySelector("#ksl-edit") as KSLButtonElement;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  private static getEditButtonTooltip(type: HighlightType): string {
    switch (type) {
      case HighlightType.Element:
        return "Edit element";

      case HighlightType.ContentComponent:
        return "Edit component";

      case HighlightType.ContentItem:
        return "Edit item";

      case HighlightType.None:
        return "Edit";
    }
  }

  public connectedCallback(): void {
    super.connectedCallback();

    this.editButtonRef.addEventListener("click", this.handleEditButtonClick);
  }

  public disconnectedCallback(): void {
    super.connectedCallback();

    this.editButtonRef.removeEventListener("click", this.handleEditButtonClick);
    this.unregisterTargetNodeListeners();
  }

  public attachTo = (node: HTMLElement): void => {
    this.unregisterTargetNodeListeners();

    super.attachTo(node);

    const type = this.type;
    this.hidden = type === HighlightType.None;
    this.editButtonRef.tooltipMessage = KSLHighlightElement.getEditButtonTooltip(type);

    if (this.targetRef) {
      this.targetRef.addEventListener("mousemove", this.handleTargetNodeMouseEnter);
      this.targetRef.addEventListener("mouseleave", this.handleTargetNodeMouseLeave);
      this.targetRef.addEventListener("click", this.handleEditButtonClick);
    }
  };

  public adjustPosition = (): void => {
    if (!this.targetRef || !this.offsetParent) {
      return;
    }

    if (!(this.offsetParent instanceof KSLContainerElement)) {
      logWarn(
        "KSLHighlightElement: should be located inside KSLContainerElement to be positioned properly.",
      );
    }

    const offsetParentRect = this.offsetParent.getBoundingClientRect();
    const targetRect = this.targetRef.getBoundingClientRect();

    this.style.top = `${targetRect.top - offsetParentRect.top}px`;
    this.style.left = `${targetRect.left - offsetParentRect.left}px`;

    this.style.width = `${targetRect.width}px`;
    this.style.height = `${targetRect.height}px`;
  };

  private unregisterTargetNodeListeners = (): void => {
    if (this.targetRef) {
      this.targetRef.removeEventListener("mousemove", this.handleTargetNodeMouseEnter);
      this.targetRef.removeEventListener("mouseleave", this.handleTargetNodeMouseLeave);
      this.targetRef.removeEventListener("click", this.handleEditButtonClick);
    }
  };

  private handleTargetNodeMouseEnter = (): void => {
    this.selected = true;
  };

  private handleTargetNodeMouseLeave = (): void => {
    this.selected = false;
  };

  private handleEditButtonClick = (event: MouseEvent): void => {
    assert(this.targetRef, "Target node is not set for this highlight.");

    event.preventDefault();
    event.stopPropagation();

    const dataAttributes = parseEditButtonDataAttributes(this.targetRef);
    this.dispatchEditEvent(dataAttributes);
  };

  private dispatchEditEvent = (data: ParseResult): void => {
    assert(this.targetRef, "Target node is not set for this highlight element.");

    const customEvent = new CustomEvent<IKSLHighlightElementEventData>("ksl:highlight:edit", {
      detail: {
        data,
        targetNode: this.targetRef,
      },
    });

    this.dispatchEvent(customEvent);
  };
}
