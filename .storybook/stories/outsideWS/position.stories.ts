import { positionTemplateArgTypes } from '../helpers/position.helpers';
import { DefaultSdkConfigurationWithoutWs } from '../../constants';

export {
  AbsoluteSmartLinkInsideAbsoluteContainer,
  AbsoluteSmartLinkInsideFixedContainer,
  AbsoluteSmartLinkInsideRelativeContainer,
  AbsoluteSmartLinkInsideStaticContainer,
  FixedSmartLinkInsideAbsoluteContainer,
  FixedSmartLinkInsideFixedContainer,
  FixedSmartLinkInsideRelativeContainer,
  FixedSmartLinkInsideStaticContainer,
  RelativeSmartLinkInsideAbsoluteContainer,
  RelativeSmartLinkInsideFixedContainer,
  RelativeSmartLinkInsideRelativeContainer,
  RelativeSmartLinkInsideStaticContainer,
  StaticSmartLinkInsideAbsoluteContainer,
  StaticSmartLinkInsideFixedContainer,
  StaticSmartLinkInsideRelativeContainer,
  StaticSmartLinkInsideStaticContainer,
} from '../helpers/position.helpers';

export default {
  title: 'Outside WS/Position',
  argTypes: positionTemplateArgTypes,
  parameters: {
    sdkConfiguration: DefaultSdkConfigurationWithoutWs,
  },
};
