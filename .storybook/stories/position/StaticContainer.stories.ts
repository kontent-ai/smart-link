import { PositionTemplate, positionTemplateArgTypes } from './position.helpers';
import { PositionProperty } from '../../types';

export const AbsoluteSmartLinkInsideStaticContainer = PositionTemplate.bind({});
AbsoluteSmartLinkInsideStaticContainer.storyName = 'absolute smart link';
AbsoluteSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Absolute,
};

export const RelativeSmartLinkInsideStaticContainer = PositionTemplate.bind({});
RelativeSmartLinkInsideStaticContainer.storyName = 'relative smart link';
RelativeSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Relative,
};

export const StaticSmartLinkInsideStaticContainer = PositionTemplate.bind({});
StaticSmartLinkInsideStaticContainer.storyName = 'static smart link';
StaticSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Static,
};

export const FixedSmartLinkInsideStaticContainer = PositionTemplate.bind({});
FixedSmartLinkInsideStaticContainer.storyName = 'fixed smart link';
FixedSmartLinkInsideStaticContainer.args = {
  containerPosition: PositionProperty.Static,
  nestedPosition: PositionProperty.Fixed,
};

export default {
  title: '/position/static container',
  argTypes: positionTemplateArgTypes,
};
