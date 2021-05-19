import { nestedOverflowTemplateArgTypes } from '../helpers/overflow.helpers';
import { DefaultSdkConfigurationWithoutWs } from '../../constants';

export {
  RelativeContainerWithRelativeScrollableInside,
  RelativeContainerWithStaticScrollableInside,
  StaticContainerWithRelativeScrollableInside,
  StaticContainerWithStaticScrollableInside
} from '../helpers/overflow.helpers';

export default {
  title: 'Outside WS/Nested overflow',
  argTypes: nestedOverflowTemplateArgTypes,
  parameters: {
    sdkConfiguration: DefaultSdkConfigurationWithoutWs,
  }
};
