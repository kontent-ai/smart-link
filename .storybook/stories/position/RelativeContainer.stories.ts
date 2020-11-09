import { PositionTemplate, positionTemplateArgTypes } from './position.helpers';
import { PositionProperty } from '../../types';

export const AbsoluteSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideRelativeContainer.storyName = 'absolute smart link';
AbsoluteSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideRelativeContainer.storyName = 'relative smart link';
RelativeSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
StaticSmartLinkInsideRelativeContainer.storyName = 'static smart link';
StaticSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideRelativeContainer = PositionTemplate.bind({});
FixedSmartLinkInsideRelativeContainer.storyName = 'fixed smart link';
FixedSmartLinkInsideRelativeContainer.args = {
  containerPosition: PositionProperty.Relative,
  nestedPosition: PositionProperty.Fixed,
};

export default {
  title: '/position/relative container',
  argTypes: positionTemplateArgTypes,
};
