import { overflowTemplateArgTypes } from '../helpers/overflow.helpers';
import { DefaultSdkConfigurationWithoutWs } from '../../constants';

export {
  FixedContainerWithHiddenOverflow,
  FixedContainerWithScrollbars,
  FixedContainerWithScrollbarsWithOffset,
  FixedContainerWithVisibleOverflow,
  RelativeContainerWithHiddenOverflow,
  RelativeContainerWithScrollbars,
  RelativeContainerWithScrollbarsWithOffset,
  RelativeContainerWithVisibleOverflow,
  StaticContainerWithHiddenOverflow,
  StaticContainerWithScrollbars,
  StaticContainerWithScrollbarsWithOffset,
  StaticContainerWithVisibleOverflow,
} from '../helpers/overflow.helpers';

export default {
  title: 'Outside WS/Overflow',
  argTypes: overflowTemplateArgTypes,
  parameters: {
    sdkConfiguration: DefaultSdkConfigurationWithoutWs,
  }
};
