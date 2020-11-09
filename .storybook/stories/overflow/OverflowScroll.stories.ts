import { OverflowTemplate, overflowTemplateArgTypes } from './overflow.helpers';
import { withScrollOffsets } from '../../decorators/withScrollOffsets';
import { OverflowProperty, PositionProperty } from '../../types';

export const RelativeContainerWithScrollbars = OverflowTemplate.bind({});
RelativeContainerWithScrollbars.storyName = 'relative container with scrollbars';
RelativeContainerWithScrollbars.args = { position: PositionProperty.Relative, overflow: OverflowProperty.Scroll };

export const RelativeContainerWithScrollbarsWithOffset = OverflowTemplate.bind({});
RelativeContainerWithScrollbarsWithOffset.storyName = 'relative container with scrollbars (with offset)';
RelativeContainerWithScrollbarsWithOffset.args = {
  position: PositionProperty.Relative,
  overflow: OverflowProperty.Scroll,
};
RelativeContainerWithScrollbarsWithOffset.decorators = [withScrollOffsets({ container: [150, 800] })];

export const StaticContainerWithScrollbars = OverflowTemplate.bind({});
StaticContainerWithScrollbars.storyName = 'static container with scrollbars';
StaticContainerWithScrollbars.args = { position: PositionProperty.Static, overflow: OverflowProperty.Scroll };

export const StaticContainerWithScrollbarsWithOffset = OverflowTemplate.bind({});
StaticContainerWithScrollbarsWithOffset.storyName = 'static container with scrollbars (with offset)';
StaticContainerWithScrollbarsWithOffset.args = { position: PositionProperty.Static, overflow: OverflowProperty.Scroll };
StaticContainerWithScrollbarsWithOffset.decorators = [withScrollOffsets({ container: [150, 800] })];

export const FixedContainerWithScrollbars = OverflowTemplate.bind({});
FixedContainerWithScrollbars.storyName = 'fixed container with scrollbars';
FixedContainerWithScrollbars.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Scroll };

export const FixedContainerWithScrollbarsWithOffset = OverflowTemplate.bind({});
FixedContainerWithScrollbarsWithOffset.storyName = 'fixed container with scrollbars (with offset)';
FixedContainerWithScrollbarsWithOffset.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Scroll };
FixedContainerWithScrollbarsWithOffset.decorators = [withScrollOffsets({ container: [150, 800] })];

export default {
  title: '/overflow/scroll | auto',
  argTypes: overflowTemplateArgTypes,
};
