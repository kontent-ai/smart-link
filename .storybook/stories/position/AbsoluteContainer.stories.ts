import { PositionTemplate, positionTemplateArgTypes } from './position.helpers';
import { PositionProperty } from '../../types';

export const AbsoluteSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideAbsoluteContainer.storyName = 'absolute smart link';
AbsoluteSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideAbsoluteContainer.storyName = 'relative smart link';
RelativeSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
StaticSmartLinkInsideAbsoluteContainer.storyName = 'static smart link';
StaticSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideAbsoluteContainer = PositionTemplate.bind({});
FixedSmartLinkInsideAbsoluteContainer.storyName = 'fixed smart link';
FixedSmartLinkInsideAbsoluteContainer.args = {
  containerPosition: PositionProperty.Absolute,
  nestedPosition: PositionProperty.Fixed,
};

export default {
  title: '/position/absolute container',
  argTypes: positionTemplateArgTypes,
};
