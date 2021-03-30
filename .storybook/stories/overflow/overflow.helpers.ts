import { OverflowProperty, PositionProperty } from '../../types';
import { getEnumValues } from '../../helpers';
import { ElementPositionOffset } from '../../../src/web-components/abstract/KSLPositionedElement';

interface IOverflowTemplateArgs {
  readonly overflow: OverflowProperty;
  readonly position: PositionProperty;
  readonly buttonPosition: ElementPositionOffset;
}

export const overflowTemplateArgTypes = {
  overflow: {
    control: {
      type: 'select',
      options: getEnumValues(OverflowProperty),
    },
  },
  position: {
    control: {
      type: 'select',
      options: getEnumValues(PositionProperty),
    },
  },
  buttonPosition: {
    defaultValue: ElementPositionOffset.Bottom,
    control: {
      type: 'select',
      options: getEnumValues(ElementPositionOffset),
    },
  },
};

export const OverflowTemplate = ({ overflow, position, buttonPosition }: IOverflowTemplateArgs) => `
  <div 
    id="container" 
    class="bg-light p-3 border border-secondary"
    style="position: ${position}; overflow: ${overflow}; max-height: 390px; max-width: 390px;"
    data-kontent-project-id="p"
    data-kontent-language-codename="l"
    data-kontent-item-id="i"
    data-kontent-component-id="c"
  >
    <div data-kontent-element-codename="e" style="width: 800px;"  data-kontent-plus-button="true" data-kontent-plus-button-render-position="${buttonPosition}">
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
    </div>
    <div data-kontent-element-codename="e" style="width: 800px;"  data-kontent-plus-button="true" data-kontent-plus-button-render-position="${buttonPosition}">
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
      This text node overflows its parent. This text node overflows its parent. This text node overflows its parent.
    </div>
  </div>
`;
