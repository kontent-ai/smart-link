import { OverflowTemplate, overflowTemplateArgTypes } from './overflow.helpers';
import { OverflowProperty, PositionProperty } from '../../types';

export const RelativeContainerWithVisibleOverflow = OverflowTemplate.bind({});
RelativeContainerWithVisibleOverflow.args = { position: PositionProperty.Relative, overflow: OverflowProperty.Visible };
RelativeContainerWithVisibleOverflow.storyName = 'relative container';

export const StaticContainerWithVisibleOverflow = OverflowTemplate.bind({});
StaticContainerWithVisibleOverflow.args = { position: PositionProperty.Static, overflow: OverflowProperty.Visible };
StaticContainerWithVisibleOverflow.storyName = 'static container';

export const FixedContainerWithVisibleOverflow = OverflowTemplate.bind({});
FixedContainerWithVisibleOverflow.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Visible };
FixedContainerWithVisibleOverflow.storyName = 'fixed container';

export default {
  title: '/overflow/visible',
  argTypes: overflowTemplateArgTypes,
};
