import { ButtonType, KSLButtonElement } from './KSLButtonElement';
import { IconName, KSLIconElement } from './KSLIconElement';
import { assert } from '../utils/assert';
import { getDataAttributesFromElementAncestors, getDataAttributesFromEventPath } from '../utils/dataAttributes';
import { createTemplateForCustomElement, getHighlightTypeForElement, HighlightType } from '../utils/customElements';
import { ElementPositionOffset, KSLPositionedElement } from './abstract/KSLPositionedElement';
import { KSLContainerElement } from './KSLContainerElement';

interface IKSLHighlightElementEventData {
  readonly dataAttributes: ReadonlyMap<string, string>;
  readonly targetNode: HTMLElement;
}

export type KSLHighlightElementEvent = CustomEvent<IKSLHighlightElementEventData>;

declare global {
  interface WindowEventMap {
    'ksl:highlight:edit': KSLHighlightElementEvent;
  }

  interface HTMLElementEventMap {
    'ksl:highlight:edit': KSLHighlightElementEvent;
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
      border-width: var(--ksl-highlight-border-width, 2px);
      border-style: var(--ksl-highlight-border-style, dashed);
      border-color: var(--ksl-highlight-border-color, rgba(219, 60, 0, .5));
      border-radius: var(--ksl-highlight-border-radius, 5px);
    }
    
    :host([hidden]) {
      display: none;
    }
    
    :host([selected]) {
      border-color: var(--ksl-highlight-border-color-selected, rgba(219, 60, 0, 1));
      z-index: 20;
    }
    
    :host([deleted]) {
      background-color: rgba(0, 0, 0, 0.5);
      border-color: gray;
      z-index: 11;
      pointer-events: all;
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
      background-color: #fff;
      z-index: 10;
      padding: 8px;
      box-shadow: 0 8px 32px rgba(16, 33, 60, 0.24), 0 0 8px rgba(0, 0, 0, 0.03);
    }
    
    .ksl-highlight__toolbar:hover {
      z-index: 20;
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
      tooltip-message="Edit">
      <ksl-icon icon-name="${IconName.Edit}" />
    </ksl-button>
    <ksl-button 
      id="ksl-remove" 
      class="ksl-highlight__toolbar-button"
      type="${ButtonType.DestructiveQuinary}" 
      tooltip-position="${ElementPositionOffset.BottomEnd}"
      tooltip-message="Remove"
    >
      <ksl-icon icon-name="${IconName.Bin}" />
    </ksl-button>
  </div>
`;

export class KSLHighlightElement extends KSLPositionedElement {
  public static get is() {
    return 'ksl-highlight' as const;
  }

  public static get observedAttributes(): string[] {
    return ['deleted'];
  }

  public get type(): HighlightType {
    return getHighlightTypeForElement(this.targetRef);
  }

  public get selected(): boolean {
    return this.hasAttribute('selected');
  }

  public set selected(value: boolean) {
    this.updateAttribute('selected', value);
  }

  public get deleted(): boolean {
    return this.hasAttribute('deleted');
  }

  public set deleted(value: boolean) {
    this.updateAttribute('deleted', value);
  }

  private readonly editButtonRef: KSLButtonElement;
  private readonly removeButtonRef: KSLButtonElement;
  private readonly removeButtonIconRef: KSLIconElement;

  constructor() {
    super();

    assert(this.shadowRoot, 'Shadow root must be always accessible in "open" mode.');
    this.editButtonRef = this.shadowRoot.querySelector('#ksl-edit') as KSLButtonElement;
    this.removeButtonRef = this.shadowRoot.querySelector('#ksl-remove') as KSLButtonElement;
    this.removeButtonIconRef = this.removeButtonRef.querySelector('ksl-icon') as KSLIconElement;
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  public connectedCallback(): void {
    super.connectedCallback();

    this.editButtonRef.addEventListener('click', this.handleEditButtonClick);
    this.removeButtonRef.addEventListener('click', this.handleRemoveButtonClick);
  }

  public disconnectedCallback(): void {
    super.connectedCallback();

    this.editButtonRef.addEventListener('click', this.handleEditButtonClick);
    this.removeButtonRef.addEventListener('click', this.handleRemoveButtonClick);
    this.unregisterTargetNodeListeners();
  }

  public attributeChangedCallback(attributeName: string, _oldValue: string | null, newValue: string | null): void {
    if (attributeName === 'deleted') {
      this.editButtonRef.disabled = Boolean(newValue);
      this.removeButtonRef.disabled = Boolean(newValue);
    }
  }

  public attachTo = (node: HTMLElement): void => {
    this.unregisterTargetNodeListeners();

    super.attachTo(node);

    const highlightType = this.type;
    this.hidden = highlightType === HighlightType.None;
    this.removeButtonRef.hidden = ![HighlightType.ContentItem, HighlightType.ContentComponent].includes(highlightType);
    this.removeButtonIconRef.iconName = highlightType === HighlightType.ContentItem ? IconName.Times : IconName.Bin;

    if (this.targetRef) {
      this.targetRef.addEventListener('mousemove', this.handleTargetNodeMouseEnter);
      this.targetRef.addEventListener('mouseleave', this.handleTargetNodeMouseLeave);
      this.targetRef.addEventListener('click', this.handleTargetNodeClick);
    }
  };

  public adjustPosition = (): void => {
    if (!this.targetRef || !this.offsetParent) {
      return;
    }

    if (!(this.offsetParent instanceof KSLContainerElement)) {
      console.warn('KSLHighlightElement: should be located inside KSLContainerElement to be positioned properly.');
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
      this.targetRef.removeEventListener('mousemove', this.handleTargetNodeMouseEnter);
      this.targetRef.removeEventListener('mouseleave', this.handleTargetNodeMouseLeave);
      this.targetRef.removeEventListener('click', this.handleTargetNodeClick);
    }
  };

  private handleTargetNodeMouseEnter = (): void => {
    this.selected = true;
  };

  private handleTargetNodeMouseLeave = (): void => {
    this.selected = false;
  };

  private handleEditButtonClick = (event: MouseEvent): void => {
    assert(this.targetRef, 'Target node is not set for this highlight.');

    event.preventDefault();
    event.stopPropagation();

    const dataAttributes = getDataAttributesFromElementAncestors(this.targetRef);
    this.dispatchEditEvent(dataAttributes);
  };

  private handleTargetNodeClick = (event: MouseEvent): void => {
    assert(this.targetRef, 'Target node is not set for this highlight.');

    event.preventDefault();
    event.stopPropagation();

    const dataAttributes = getDataAttributesFromEventPath(event);
    this.dispatchEditEvent(dataAttributes);
  };

  private dispatchEditEvent = (dataAttributes: ReadonlyMap<string, string>): void => {
    assert(this.targetRef, 'Target node is not set for this highlight element.');

    const customEvent = new CustomEvent<IKSLHighlightElementEventData>('ksl:highlight:edit', {
      detail: {
        dataAttributes,
        targetNode: this.targetRef,
      },
    });

    this.dispatchEvent(customEvent);
  };

  private handleRemoveButtonClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    this.removeButtonRef.loading = true;

    setTimeout(() => {
      this.removeButtonRef.loading = false;
      this.removeButtonRef.disabled = true;
      this.removeButtonRef.tooltipMessage = 'This feature is not supported.';
    }, 3000);

    console.warn('This button is not supported yet.');
  };
}
