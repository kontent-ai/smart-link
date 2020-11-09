import { PositionTemplate, positionTemplateArgTypes } from './position.helpers';
import { PositionProperty } from '../../types';

export const AbsoluteSmartLinkInsideFixedContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideFixedContainer.storyName = 'absolute smart link';
AbsoluteSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideFixedContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideFixedContainer.storyName = 'relative smart link';
RelativeSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideFixedContainer = PositionTemplate.bind({});
StaticSmartLinkInsideFixedContainer.storyName = 'static smart link';
StaticSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideFixedContainer = PositionTemplate.bind({});
FixedSmartLinkInsideFixedContainer.storyName = 'fixed smart link';
FixedSmartLinkInsideFixedContainer.args = {
  containerPosition: PositionProperty.Fixed,
  nestedPosition: PositionProperty.Fixed,
};

export default {
  title: '/position/fixed container',
  argTypes: positionTemplateArgTypes,
};
