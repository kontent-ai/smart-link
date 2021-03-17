import { KSLCustomElement } from './abstract/KSLCustomElement';
import { assert } from '../utils/assert';
import { createTemplateForCustomElement } from '../utils/customElements';

export enum IconName {
  Bin = 'icon-bin',
  CollapseScheme = 'icon-collapse-scheme',
  Edit = 'icon-edit',
  Plus = 'icon-plus',
  Puzzle = 'icon-puzzle',
  Spinner = 'icon-spinner',
  Times = 'icon-times',
}

const iconsHTML = `
  <template id="${IconName.Bin}">
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0)">
        <path
            d="M5.07471 0.498291C5.07471 0.222149 5.29856 -0.00170898 5.57471 -0.00170898H10.5747C10.8509 -0.00170898 11.0747 0.222149 11.0747 0.498291C11.0747 0.774434 10.8508 0.998291 10.5747 0.998291L5.57471 0.998291C5.29856 0.998291 5.07471 0.774433 5.07471 0.498291Z"
        />
        <path
            d="M2 2.50879C2 2.23265 2.22386 2.00879 2.5 2.00879L13.5 2.00879C13.7761 2.00879 14 2.23265 14 2.50879C14 2.78493 13.7761 3.00879 13.5 3.00879L2.5 3.00879C2.22386 3.00879 2 2.78493 2 2.50879Z"
        />
        <path
            d="M4.01172 5.5C4.01172 5.22386 3.78786 5 3.51172 5C3.23558 5 3.01172 5.22386 3.01172 5.5V13.7442C3.01172 14.9747 3.99578 16 5.226 16H10.7974C12.0277 16 13.0117 14.9747 13.0117 13.7442V5.5C13.0117 5.22386 12.7879 5 12.5117 5C12.2356 5 12.0117 5.22386 12.0117 5.5V13.7442C12.0117 14.4451 11.4529 15 10.7974 15H5.226C4.57051 15 4.01172 14.4451 4.01172 13.7442V5.5Z"
        />
        <path
            d="M6.52734 5C6.80349 5 7.02734 5.22386 7.02734 5.5V12.5C7.02734 12.7761 6.80349 13 6.52734 13C6.2512 13 6.02734 12.7761 6.02734 12.5V5.5C6.02734 5.22386 6.2512 5 6.52734 5Z"
        />
        <path
            d="M10.0195 5.5C10.0195 5.22386 9.79567 5 9.51953 5C9.24339 5 9.01953 5.22386 9.01953 5.5V12.5C9.01953 12.7761 9.24339 13 9.51953 13C9.79567 13 10.0195 12.7761 10.0195 12.5V5.5Z"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </template>
  <template id="${IconName.Edit}">
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M1 14.993V10.0515L9.47121 1.58221C10.2522 0.801373 11.5183 0.801373 12.2993 1.58221L14.4132 3.69561C15.1945 4.47669 15.1945 5.74327 14.4132 6.52436L5.94263 14.993H1ZM5.52848 13.993L10.7581 8.7646L7.22982 5.23714L2 10.4658V13.993H5.52848ZM7.937 4.53012L11.4653 8.05757L13.7062 5.81717C14.0968 5.42663 14.0968 4.79334 13.7062 4.4028L11.5923 2.28939C11.2018 1.89898 10.5687 1.89898 10.1782 2.28939L7.937 4.53012Z"
      />
      <path
          d="M9.48975 13.9982C9.2136 13.9982 8.98975 14.2221 8.98975 14.4982C8.98975 14.7743 9.2136 14.9982 9.48975 14.9982H14.4865C14.7626 14.9982 14.9865 14.7743 14.9865 14.4982C14.9865 14.2221 14.7626 13.9982 14.4865 13.9982H9.48975Z"
      />
    </svg>
  </template>
  <template id="${IconName.Plus}">
    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M7.75366 16.5C7.75366 17.1904 8.31331 17.75 9.00366 17.75C9.69402 17.75 10.2537 17.1904 10.2537 16.5V10.2861H16.5C17.1904 10.2861 17.75 9.72642 17.75 9.03606C17.75 8.34571 17.1904 7.78606 16.5 7.78606H10.2537V1.5C10.2537 0.809643 9.69402 0.25 9.00366 0.25C8.31331 0.25 7.75366 0.809644 7.75366 1.5V7.78606H1.5C0.809644 7.78606 0.25 8.34571 0.25 9.03606C0.25 9.72642 0.809644 10.2861 1.5 10.2861H7.75366V16.5Z"
      />
    </svg>
  </template>
  <template id="${IconName.Spinner}">
    <svg class="spin-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M1.25049 10.0001C1.25049 5.16797 5.16766 1.25069 9.99979 1.25061C10.345 1.2506 10.6248 1.53042 10.6248 1.8756C10.6248 2.22078 10.345 2.5006 9.99981 2.50061C5.85803 2.50068 2.50049 5.85831 2.50049 10.0001C2.50049 14.1418 5.85811 17.4995 9.99993 17.4995C14.1418 17.4995 17.4994 14.1418 17.4994 10.0001C17.4994 8.00692 16.7227 6.19654 15.4542 4.85289C15.2172 4.60189 15.2286 4.20633 15.4796 3.96937C15.7306 3.73241 16.1261 3.74379 16.3631 3.99479C17.8419 5.5612 18.7494 7.67533 18.7494 10.0001C18.7494 14.8322 14.8321 18.7495 9.99993 18.7495C5.16775 18.7495 1.25049 14.8322 1.25049 10.0001Z"
      />
    </svg>
  </template>
  <template id="${IconName.Times}">
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M1.85355 1.14644C1.65828 0.951182 1.3417 0.951187 1.14644 1.14645C0.951182 1.34172 0.951187 1.6583 1.14645 1.85356L7.29202 7.99895L1.14645 14.1443C0.951187 14.3396 0.951182 14.6562 1.14644 14.8515C1.3417 15.0467 1.65828 15.0467 1.85355 14.8515L7.99913 8.70605L14.1443 14.8511C14.3396 15.0463 14.6562 15.0463 14.8515 14.8511C15.0467 14.6558 15.0467 14.3392 14.8514 14.144L8.70625 7.99895L14.8514 1.85393C15.0467 1.65867 15.0467 1.34209 14.8515 1.14683C14.6562 0.95156 14.3396 0.951556 14.1443 1.14681L7.99913 7.29185L1.85355 1.14644Z"
      />
    </svg>
  </template>
  <template id="${IconName.Puzzle}">
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M5.36522 2.48835C5.12409 2.7724 5.03429 3.10232 5.03429 3.27273V4.50861C5.03429 4.78476 4.81043 5.00861 4.53429 5.00861H2V14H4.0343V13.2727C4.0343 12.8522 4.21698 12.2958 4.60288 11.8412C5.00497 11.3675 5.63191 11 6.49745 11C7.36086 11 7.99972 11.3654 8.41593 11.8319C8.81555 12.2798 9.02461 12.8381 9.02461 13.2727V14.0072L11.0125 14.0014V11.4936C11.0125 11.2175 11.2363 10.9936 11.5125 10.9936H12.7273C12.8923 10.9936 13.2215 10.9016 13.5081 10.6537C13.7758 10.4221 14 10.0599 14 9.50642C14 8.95199 13.7748 8.58042 13.5038 8.34043C13.2141 8.08395 12.8857 7.98937 12.7273 7.98937H11.5125C11.2363 7.98937 11.0125 7.76551 11.0125 7.48937V5.00861H8.52459C8.24845 5.00861 8.02459 4.78476 8.02459 4.50861V3.27273C8.02459 3.11648 7.92916 2.7884 7.66975 2.49765C7.42692 2.2255 7.0522 2 6.49743 2C5.94479 2 5.59016 2.22337 5.36522 2.48835ZM4.60286 1.84119C5.00495 1.36753 5.6319 1 6.49743 1C7.36085 1 7.9997 1.36541 8.41592 1.83189C8.81554 2.27978 9.0246 2.83807 9.0246 3.27273V4.00861H11.5125C11.7886 4.00861 12.0125 4.23247 12.0125 4.50861V6.98937H12.7273C13.1597 6.98937 13.7177 7.19422 14.1667 7.59172C14.6343 8.00572 15 8.64268 15 9.50642C15 10.3712 14.6333 11.0025 14.1624 11.41C13.7103 11.8011 13.1531 11.9936 12.7273 11.9936H12.0125V14.5C12.0125 14.7756 11.7895 14.9992 11.5139 15L8.52605 15.0086C8.3932 15.009 8.26565 14.9565 8.17157 14.8627C8.07749 14.7689 8.02461 14.6415 8.02461 14.5086V13.2727C8.02461 13.1165 7.92918 12.7884 7.66976 12.4977C7.42694 12.2255 7.05222 12 6.49745 12C5.9448 12 5.59017 12.2234 5.36523 12.4884C5.12411 12.7724 5.0343 13.1023 5.0343 13.2727V14.5C5.0343 14.7761 4.81044 15 4.5343 15H1.5C1.22386 15 1 14.7761 1 14.5V4.50861C1 4.23247 1.22386 4.00861 1.5 4.00861H4.03429V3.27273C4.03429 2.85223 4.21696 2.29579 4.60286 1.84119Z"/>
    </svg>
  </template>
  <template id="${IconName.CollapseScheme}">
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M14.9952 2.54249V4.99715H15.0024V6.99547H14.0027V6.00319H2.00561L2.00561 6.99547H1.00586L1.00586 6.00319H1.00244V2.54249C1.00244 1.69346 1.62932 1.00439 2.40172 1.00439H13.596C14.3684 1.00439 14.9952 1.69346 14.9952 2.54249ZM13.9955 5.00403H2.00561V4.99715H2.0022V2.54249C2.0022 2.15367 2.26888 2.00356 2.40172 2.00356H13.596C13.7288 2.00356 13.9955 2.15366 13.9955 2.54249V5.00403Z"
      />
      <path
          d="M1.00625 14.0052H3.00537L3.00498 15.0044H1.50732C1.37433 15.0044 1.24678 14.938 1.15273 14.8198C1.05869 14.7016 1.00586 14.5412 1.00586 14.3741L1.00625 14.0052Z"
      />
      <path
          d="M13.0029 13.9964H15.0021L15.0024 14.3653C15.0024 14.5325 14.9496 14.6928 14.8556 14.811C14.7615 14.9292 14.634 14.9956 14.501 14.9956H13.0033L13.0029 13.9964Z"
      />
      <path d="M1.00586 11.0039L1.00586 13.0022H2.00561L2.00561 11.0039H1.00586Z"/>
      <path d="M14.0027 13.0022V11.0039H15.0024V13.0022H14.0027Z"/>
      <path d="M1.00586 7.99464L1.00586 9.99296H2.00561L2.00561 7.99464H1.00586Z"/>
      <path d="M14.0027 7.99464V9.99296H15.0024V7.99464H14.0027Z"/>
      <path d="M6.00464 14.0052H4.00513L4.00513 15.0044H6.00464V14.0052Z"/>
      <path d="M7.00439 14.0052H9.00391V15.0044H7.00439V14.0052Z"/>
      <path d="M12.0032 14.0052H10.0037V15.0044H12.0032V14.0052Z"/>
    </svg>
  </template>
`;

const templateHTML = `
  <style>
    @-webkit-keyframes spin-500 {
      0% {
        -webkit-transform: rotate(0deg);
      }
  
      100% {
        -webkit-transform: rotate(359deg);
      }
    }
  
    @keyframes spin-500 {
      0% {
        transform: rotate(0deg);
      }
  
      100% {
        transform: rotate(359deg);
      }
    }
  
  
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: var(--ksl-icon-width, 0px);
      height: var(--ksl-icon-height, 0px);
    }
  
    .spin-500 {
      animation-direction: normal;
      animation-delay: 0s;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-name: spin-500;
      animation-timing-function: linear;
      transform-origin: center;
    }
  </style>
`;

export class KSLIconElement extends KSLCustomElement {
  private static _icons: HTMLTemplateElement | null = null;

  public static get is() {
    return 'ksl-icon' as const;
  }

  public static get icons(): HTMLTemplateElement {
    if (!this._icons) {
      const template = document.createElement('template');
      template.innerHTML = iconsHTML;
      this._icons = template;
    }

    return this._icons;
  }

  public static get observedAttributes(): string[] {
    return ['icon-name'];
  }

  public get iconName(): string | null {
    return this.getAttribute('icon-name');
  }

  public set iconName(value: string | null) {
    if (value) {
      this.setAttribute('icon-name', value);
    } else {
      this.removeAttribute('icon-name');
    }
  }

  private iconRef: Element | null;

  constructor() {
    super();

    assert(this.shadowRoot, 'Shadow root must be always accessible in "open" mode.');

    const name = this.getAttribute('icon-name');
    const template = this.getTemplateByIconName(name);

    if (template) {
      const content = template.content.cloneNode(true);
      this.shadowRoot.appendChild(content);
      this.iconRef = this.shadowRoot.lastElementChild;
    } else {
      this.iconRef = null;
    }
  }

  public static initializeTemplate(): HTMLTemplateElement {
    return createTemplateForCustomElement(templateHTML);
  }

  public attributeChangedCallback(attributeName: string, _oldValue: string | null, newValue: string | null): void {
    if (attributeName === 'icon-name') {
      this.updateIcon(newValue);
    }
  }

  private getTemplateByIconName = (iconName: string | null): HTMLTemplateElement | null => {
    if (!iconName) {
      return null;
    }

    const template = KSLIconElement.icons.content.querySelector(`template#${iconName}`);

    if (template instanceof HTMLTemplateElement) {
      return template;
    } else {
      return null;
    }
  };

  private updateIcon = (iconName: string | null): void => {
    if (!this.shadowRoot) {
      return;
    }

    const template = this.getTemplateByIconName(iconName);
    if (template) {
      const content = template.content.cloneNode(true);

      if (this.iconRef) {
        this.shadowRoot.replaceChild(content, this.iconRef);
      } else {
        this.shadowRoot.appendChild(content);
      }

      this.iconRef = this.shadowRoot.lastElementChild;
    } else if (this.iconRef) {
      this.iconRef.remove();
      this.iconRef = null;
    }
  };
}
