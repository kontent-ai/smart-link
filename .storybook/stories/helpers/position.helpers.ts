import { PositionProperty } from '../../types';
import { getEnumValues } from '../../helpers';
import { ElementPositionOffset } from '../../../src/web-components/abstract/KSLPositionedElement';

interface IPositionTemplateArgs {
  readonly containerPosition: PositionProperty;
  readonly nestedPosition: PositionProperty;
  readonly buttonPosition: ElementPositionOffset;
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
  buttonPosition: {
    defaultValue: ElementPositionOffset.Bottom,
    control: {
      type: 'select',
      options: getEnumValues(ElementPositionOffset),
    },
  },
};

const PositionTemplate = ({ containerPosition, nestedPosition, buttonPosition }: IPositionTemplateArgs) => `
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
      <div data-kontent-element-codename="e" data-kontent-add-button="true" data-kontent-add-button-render-position="${buttonPosition}">
        This text block has 'position: ${nestedPosition}' and it is located
        inside an element with '${containerPosition}' position.
      </div>
    </div>
  </div>
`;

export const AbsoluteSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideAbsoluteContainer.storyName = 'Absolute smart link inside absolute container';
AbsoluteSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideAbsoluteContainer.storyName = 'Relative smart link inside absolute container';
RelativeSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
StaticSmartLinkInsideAbsoluteContainer.storyName = 'Static smart link inside absolute container';
StaticSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
FixedSmartLinkInsideAbsoluteContainer.storyName = 'Fixed smart link inside absolute container';
FixedSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Fixed,
};

export const AbsoluteSmartLinkInsideFixedContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideFixedContainer.storyName = 'Absolute smart link inside fixed container';
AbsoluteSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideFixedContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideFixedContainer.storyName = 'Relative smart link inside fixed container';
RelativeSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideFixedContainer = PositionTemplate.bind({});
StaticSmartLinkInsideFixedContainer.storyName = 'Static smart link inside fixed container';
StaticSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideFixedContainer = PositionTemplate.bind({});
FixedSmartLinkInsideFixedContainer.storyName = 'Fixed smart link inside fixed container';
FixedSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Fixed,
};

export const AbsoluteSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideRelativeContainer.storyName = 'Absolute smart link inside relative container';
AbsoluteSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideRelativeContainer.storyName = 'Relative smart link inside relative container';
RelativeSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
StaticSmartLinkInsideRelativeContainer.storyName = 'Static smart link inside relative container';
StaticSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
FixedSmartLinkInsideRelativeContainer.storyName = 'Fixed smart link inside relative container';
FixedSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Fixed,
};

export const AbsoluteSmartLinkInsideStaticContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideStaticContainer.storyName = 'Absolute smart link inside static container';
AbsoluteSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideStaticContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideStaticContainer.storyName = 'Relative smart link inside static container';
RelativeSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideStaticContainer = PositionTemplate.bind({});
StaticSmartLinkInsideStaticContainer.storyName = 'Static smart link inside static container';
StaticSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideStaticContainer = PositionTemplate.bind({});
FixedSmartLinkInsideStaticContainer.storyName = 'Fixed smart link inside static container';
FixedSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Fixed,
};
