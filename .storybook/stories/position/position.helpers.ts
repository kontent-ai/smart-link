import { PositionProperty } from '../../types';
import { getEnumValues } from '../../helpers';

interface IPositionTemplateArgs {
  readonly containerPosition: PositionProperty;
  readonly nestedPosition: PositionProperty;
}

export const positionTemplateArgTypes = {
  containerPosition: {
    control: {
      type: 'select',
      options: getEnumValues(PositionProperty),
    },
  },
  nestedPosition: {
    control: {
      type: 'select',
      options: getEnumValues(PositionProperty),
    },
  },
};

export const PositionTemplate = ({ containerPosition, nestedPosition }: IPositionTemplateArgs) => `
  <div 
    class="bg-secondary" 
    style="position: ${containerPosition}; top: 20px; left: 20px; width: 400px; height: 400px;"
    data-kontent-project-id="p"
    data-kontent-language-codename="l"
  >
    <div
        data-kontent-item-id="i"
        data-kontent-component-id="c"
        class="bg-light p-4"
        style="position: ${nestedPosition}; top: 40px; left: 40px; width: 300px; height: 300px;"
    >
      <div data-kontent-element-codename="e">
        This text block has 'position: ${nestedPosition}' and it is located
        inside an element with '${containerPosition}' position.
      </div>
    </div>
  </div>
`;
