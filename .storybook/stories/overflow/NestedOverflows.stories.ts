import { withScrollOffsets } from '../../decorators/withScrollOffsets';
import { OverflowProperty, PositionProperty } from '../../types';
import { getEnumValues } from '../../helpers';

interface ITemplateArgs {
  readonly containerOverflow: OverflowProperty;
  readonly containerPosition: PositionProperty;
  readonly nestedOverflow: OverflowProperty;
  readonly nestedPosition: PositionProperty;
}

const nestedOverflowTemplateArgTypes = {
  containerOverflow: {
    control: {
      type: 'select',
      options: getEnumValues(OverflowProperty),
    },
  },
  containerPosition: {
    control: {
      type: 'select',
      options: getEnumValues(PositionProperty),
    },
  },
  nestedOverflow: {
    control: {
      type: 'select',
      options: getEnumValues(OverflowProperty),
    },
  },
  nestedPosition: {
    control: {
      type: 'select',
      options: getEnumValues(PositionProperty),
    },
  },
};

const NestedOverflowTemplate = ({ containerOverflow, containerPosition, nestedOverflow, nestedPosition }: ITemplateArgs) => `
  <div
    id="container"
    class="bg-light p-3 border border-secondary"
    style="position: ${containerPosition}; overflow: ${containerOverflow}; max-height: 390px; max-width: 390px;"
    data-kontent-project-id="p"
    data-kontent-language-codename="l"
    data-kontent-item-id="i"
  >
    <div
      id="nested"
      class="bg-white p-3 border border-info"
      data-kontent-component-id="c"
      style="position: ${nestedPosition}; overflow: ${nestedOverflow}; max-height: 400px;"
    >
      <div data-kontent-element-codename="e">
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
      <div data-kontent-element-codename="e">
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
  
    <div data-kontent-element-codename="e">
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

export const RelativeContainerWithStaticScrollableInside = NestedOverflowTemplate.bind({});
RelativeContainerWithStaticScrollableInside.storyName = 'relative container with static scrollable inside';
RelativeContainerWithStaticScrollableInside.args = {
  containerPosition: PositionProperty.Relative,
  containerOverflow: OverflowProperty.Scroll,
  nestedPosition: PositionProperty.Static,
  nestedOverflow: OverflowProperty.Scroll,
};
RelativeContainerWithStaticScrollableInside.decorators = [
  withScrollOffsets({
    container: [140, 0],
    nested: [550, 0],
  }),
];

export const StaticContainerWithRelativeScrollableInside = NestedOverflowTemplate.bind({});
StaticContainerWithRelativeScrollableInside.storyName = 'static container with relative scrollable inside';
StaticContainerWithRelativeScrollableInside.args = {
  containerPosition: PositionProperty.Static,
  containerOverflow: OverflowProperty.Scroll,
  nestedPosition: PositionProperty.Relative,
  nestedOverflow: OverflowProperty.Scroll,
};
StaticContainerWithRelativeScrollableInside.decorators = [
  withScrollOffsets({
    container: [140, 0],
    nested: [550, 0],
  }),
];

export const RelativeContainerWithRelativeScrollableInside = NestedOverflowTemplate.bind({});
RelativeContainerWithRelativeScrollableInside.storyName = 'relative container with relative scrollable inside';
RelativeContainerWithRelativeScrollableInside.args = {
  containerPosition: PositionProperty.Relative,
  containerOverflow: OverflowProperty.Scroll,
  nestedPosition: PositionProperty.Relative,
  nestedOverflow: OverflowProperty.Scroll,
};
RelativeContainerWithRelativeScrollableInside.decorators = [
  withScrollOffsets({
    container: [140, 0],
    nested: [550, 0],
  }),
];

export const StaticContainerWithStaticScrollableInside = NestedOverflowTemplate.bind({});
StaticContainerWithStaticScrollableInside.storyName = 'static container with static scrollable inside';
StaticContainerWithStaticScrollableInside.args = {
  containerPosition: PositionProperty.Static,
  containerOverflow: OverflowProperty.Scroll,
  nestedPosition: PositionProperty.Static,
  nestedOverflow: OverflowProperty.Scroll,
};
StaticContainerWithStaticScrollableInside.decorators = [
  withScrollOffsets({
    container: [140, 0],
    nested: [650, 0],
  }),
];

export default {
  title: '/overflow/nested overflows',
  argTypes: nestedOverflowTemplateArgTypes,
};
