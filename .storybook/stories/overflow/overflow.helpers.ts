import { OverflowProperty, PositionProperty } from '../../types';
import { getEnumValues } from '../../helpers';

interface IOverflowTemplateArgs {
  readonly overflow: OverflowProperty;
  readonly position: PositionProperty;
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
};

export const OverflowTemplate = ({ overflow, position }: IOverflowTemplateArgs) => `
  <div 
    id="container" 
    class="bg-light p-3 border border-secondary"
    style="position: ${position}; overflow: ${overflow}; max-height: 390px; max-width: 390px;"
    data-kontent-project-id="p"
    data-kontent-language-codename="l"
    data-kontent-item-id="i"
    data-kontent-component-id="c"
  >
    <div data-kontent-element-codename="e" style="width: 800px;">
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
    <div data-kontent-element-codename="e" style="width: 800px;">
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
