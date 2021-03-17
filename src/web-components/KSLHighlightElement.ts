import { ButtonType, KSLButtonElement } from './KSLButtonElement';
import { IconName, KSLIconElement } from './KSLIconElement';
import { ElementPosition } from './abstract/KSLPositionedElement';
import { getHighlightTypeForNode, HighlightType } from '../utils/highlight';
import { assert } from '../utils/assert';
import { getDataAttributesFromElementAncestors, getDataAttributesFromEventPath } from '../utils/dataAttributes';
import { KSLCustomElement } from './abstract/KSLCustomElement';
import { createTemplateForCustomElement } from '../utils/customElements';

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
      tooltip-position="${ElementPosition.BottomEnd}"
      tooltip-message="Edit">
      <ksl-icon icon-name="${IconName.Edit}" />
    </ksl-button>
    <ksl-button 
      id="ksl-remove" 
      class="ksl-highlight__toolbar-button"
      type="${ButtonType.DestructiveQuinary}" 
      tooltip-position="${ElementPosition.BottomEnd}"
      tooltip-message="Remove"
    >
      <ksl-icon icon-name="${IconName.Bin}" />
    </ksl-button>
  </div>
`;

export class KSLHighlightElement extends KSLCustomElement {
  public static get is() {
    return 'ksl-highlight' as const;
  }

  public get type(): HighlightType {
    return getHighlightTypeForNode(this.targetNode);
  }

  public get selected(): boolean {
    return this.hasAttribute('selected');
  }

  public set selected(value: boolean) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }

  public get deleted(): boolean {
    return this.hasAttribute('deleted');
  }

  public set deleted(value: boolean) {
    if (value) {
      this.setAttribute('deleted', '');
      this.editButtonRef.disabled = true;
      this.removeButtonRef.disabled = true;
    } else {
      this.removeAttribute('deleted');
      this.editButtonRef.disabled = false;
      this.removeButtonRef.disabled = false;
    }
  }

  private readonly editButtonRef: KSLButtonElement;
  private readonly removeButtonRef: KSLButtonElement;
  private readonly removeButtonIconRef: KSLIconElement;
  private targetNode: HTMLElement | null = null;

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
    this.editButtonRef.addEventListener('click', this.handleEditButtonClick);
    this.removeButtonRef.addEventListener('click', this.handleRemoveButtonClick);
  }

  public disconnectedCallback(): void {
    this.editButtonRef.addEventListener('click', this.handleEditButtonClick);
    this.removeButtonRef.addEventListener('click', this.handleRemoveButtonClick);
    this.unregisterTargetNodeListeners();
  }

  public attachTo = (node: HTMLElement): void => {
    this.unregisterTargetNodeListeners();

    this.targetNode = node;

    const highlightType = this.type;
    this.hidden = highlightType === HighlightType.None;
    this.removeButtonRef.hidden = ![HighlightType.ContentItem, HighlightType.ContentComponent].includes(highlightType);
    this.removeButtonIconRef.iconName = highlightType === HighlightType.ContentItem ? IconName.Times : IconName.Bin;

    this.targetNode.addEventListener('mousemove', this.handleTargetNodeMouseEnter);
    this.targetNode.addEventListener('mouseleave', this.handleTargetNodeMouseLeave);
    this.targetNode.addEventListener('click', this.handleTargetNodeClick);
  };

  private unregisterTargetNodeListeners = (): void => {
    if (this.targetNode) {
      this.targetNode.removeEventListener('mousemove', this.handleTargetNodeMouseEnter);
      this.targetNode.removeEventListener('mouseleave', this.handleTargetNodeMouseLeave);
      this.targetNode.removeEventListener('click', this.handleTargetNodeClick);
    }
  };

  private handleTargetNodeMouseEnter = (): void => {
    this.selected = true;
  };

  private handleTargetNodeMouseLeave = (): void => {
    this.selected = false;
  };

  private handleEditButtonClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    assert(this.targetNode, 'Target node is not set for this highlight.');
    const dataAttributes = getDataAttributesFromElementAncestors(this.targetNode);
    this.dispatchEditEvent(dataAttributes);
  };

  private handleTargetNodeClick = (event: MouseEvent): void => {
    assert(this.targetNode, 'Target node is not set for this highlight.');

    event.preventDefault();
    event.stopPropagation();

    const dataAttributes = getDataAttributesFromEventPath(event);
    this.dispatchEditEvent(dataAttributes);
  };

  private dispatchEditEvent = (dataAttributes: ReadonlyMap<string, string>): void => {
    assert(this.targetNode, 'Target node is not set for this highlight element.');

    const customEvent = new CustomEvent<IKSLHighlightElementEventData>('ksl:highlight:edit', {
      detail: {
        dataAttributes,
        targetNode: this.targetNode,
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
