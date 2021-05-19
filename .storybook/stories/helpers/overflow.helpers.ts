import { OverflowProperty, PositionProperty } from '../../types';
import { getEnumValues } from '../../helpers';
import { ElementPositionOffset } from '../../../src/web-components/abstract/KSLPositionedElement';
import { withScrollOffsets } from '../../decorators/withScrollOffsets';

interface IOverflowTemplateArgs {
  readonly overflow: OverflowProperty;
  readonly position: PositionProperty;
  readonly buttonPosition: ElementPositionOffset;
}

interface INestedOverflowTemplateArgs {
  readonly containerOverflow: OverflowProperty;
  readonly containerPosition: PositionProperty;
  readonly nestedOverflow: OverflowProperty;
  readonly nestedPosition: PositionProperty;
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

export const nestedOverflowTemplateArgTypes = {
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
    <div data-kontent-element-codename="e" style="width: 800px;"  data-kontent-add-button="true" data-kontent-add-button-render-position="${buttonPosition}">
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
    <div data-kontent-element-codename="e" style="width: 800px;"  data-kontent-add-button="true" data-kontent-add-button-render-position="${buttonPosition}">
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

const NestedOverflowTemplate = ({
  containerOverflow,
  containerPosition,
  nestedOverflow,
  nestedPosition,
  buttonPosition,
}: INestedOverflowTemplateArgs) => `
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
      <div data-kontent-element-codename="e" data-kontent-add-button="true" data-kontent-add-button-render-position="${buttonPosition}">
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
      <div data-kontent-element-codename="e" data-kontent-add-button="true" data-kontent-add-button-render-position="${buttonPosition}">
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
  
    <div data-kontent-element-codename="e" data-kontent-add-button="true" data-kontent-add-button-render-position="${buttonPosition}">
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

export const RelativeContainerWithHiddenOverflow = OverflowTemplate.bind({});
RelativeContainerWithHiddenOverflow.args = { position: PositionProperty.Relative, overflow: OverflowProperty.Hidden };
RelativeContainerWithHiddenOverflow.storyName = 'Relative container with hidden overflow';

export const StaticContainerWithHiddenOverflow = OverflowTemplate.bind({});
StaticContainerWithHiddenOverflow.args = { position: PositionProperty.Static, overflow: OverflowProperty.Hidden };
StaticContainerWithHiddenOverflow.storyName = 'Static container with hidden overflow';

export const FixedContainerWithHiddenOverflow = OverflowTemplate.bind({});
FixedContainerWithHiddenOverflow.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Hidden };
FixedContainerWithHiddenOverflow.storyName = 'Fixed container with hidden overflow';

export const RelativeContainerWithScrollbars = OverflowTemplate.bind({});
RelativeContainerWithScrollbars.storyName = 'Relative container with scrollbars';
RelativeContainerWithScrollbars.args = { position: PositionProperty.Relative, overflow: OverflowProperty.Scroll };

export const RelativeContainerWithScrollbarsWithOffset = OverflowTemplate.bind({});
RelativeContainerWithScrollbarsWithOffset.storyName = 'Relative container with scrollbars (with offset)';
RelativeContainerWithScrollbarsWithOffset.args = {
  position: PositionProperty.Relative,
  overflow: OverflowProperty.Scroll,
};
RelativeContainerWithScrollbarsWithOffset.decorators = [withScrollOffsets({ container: [150, 800] })];

export const StaticContainerWithScrollbars = OverflowTemplate.bind({});
StaticContainerWithScrollbars.storyName = 'Static container with scrollbars';
StaticContainerWithScrollbars.args = { position: PositionProperty.Static, overflow: OverflowProperty.Scroll };

export const StaticContainerWithScrollbarsWithOffset = OverflowTemplate.bind({});
StaticContainerWithScrollbarsWithOffset.storyName = 'Static container with scrollbars (with offset)';
StaticContainerWithScrollbarsWithOffset.args = { position: PositionProperty.Static, overflow: OverflowProperty.Scroll };
StaticContainerWithScrollbarsWithOffset.decorators = [withScrollOffsets({ container: [150, 800] })];

export const FixedContainerWithScrollbars = OverflowTemplate.bind({});
FixedContainerWithScrollbars.storyName = 'Fixed container with scrollbars';
FixedContainerWithScrollbars.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Scroll };

export const FixedContainerWithScrollbarsWithOffset = OverflowTemplate.bind({});
FixedContainerWithScrollbarsWithOffset.storyName = 'Fixed container with scrollbars (with offset)';
FixedContainerWithScrollbarsWithOffset.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Scroll };
FixedContainerWithScrollbarsWithOffset.decorators = [withScrollOffsets({ container: [150, 800] })];

export const RelativeContainerWithVisibleOverflow = OverflowTemplate.bind({});
RelativeContainerWithVisibleOverflow.args = { position: PositionProperty.Relative, overflow: OverflowProperty.Visible };
RelativeContainerWithVisibleOverflow.storyName = 'Relative container with visible overflow';

export const StaticContainerWithVisibleOverflow = OverflowTemplate.bind({});
StaticContainerWithVisibleOverflow.args = { position: PositionProperty.Static, overflow: OverflowProperty.Visible };
StaticContainerWithVisibleOverflow.storyName = 'Static container with visible overflow';

export const FixedContainerWithVisibleOverflow = OverflowTemplate.bind({});
FixedContainerWithVisibleOverflow.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Visible };
FixedContainerWithVisibleOverflow.storyName = 'Fixed container with visible overflow';

export const RelativeContainerWithStaticScrollableInside = NestedOverflowTemplate.bind({});
RelativeContainerWithStaticScrollableInside.storyName = 'Relative container with static scrollable inside';
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
StaticContainerWithRelativeScrollableInside.storyName = 'Static container with relative scrollable inside';
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
RelativeContainerWithRelativeScrollableInside.storyName = 'Relative container with relative scrollable inside';
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
StaticContainerWithStaticScrollableInside.storyName = 'Static container with static scrollable inside';
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
