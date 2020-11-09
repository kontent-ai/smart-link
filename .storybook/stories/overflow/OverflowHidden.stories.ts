import { OverflowTemplate, overflowTemplateArgTypes } from './overflow.helpers';
import { OverflowProperty, PositionProperty } from '../../types';

export const RelativeContainerWithHiddenOverflow = OverflowTemplate.bind({});
RelativeContainerWithHiddenOverflow.args = { position: PositionProperty.Relative, overflow: OverflowProperty.Hidden };
RelativeContainerWithHiddenOverflow.storyName = 'relative container';

export const StaticContainerWithHiddenOverflow = OverflowTemplate.bind({});
StaticContainerWithHiddenOverflow.args = { position: PositionProperty.Static, overflow: OverflowProperty.Hidden };
StaticContainerWithHiddenOverflow.storyName = 'static container';

export const FixedContainerWithHiddenOverflow = OverflowTemplate.bind({});
FixedContainerWithHiddenOverflow.args = { position: PositionProperty.Fixed, overflow: OverflowProperty.Hidden };
FixedContainerWithHiddenOverflow.storyName = 'fixed container';

export default {
  title: '/overflow/hidden',
  argTypes: overflowTemplateArgTypes,
};
