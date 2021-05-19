import { withSdk } from './decorators/withSdk';
import { withQuery } from '@storybook/addon-queryparams';
import { withContainerForLoki } from './decorators/withContainerForLoki';
import { DefaultSdkConfigurationWithWs } from "./constants";

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  query: { 'kontent-smart-link-enabled': 'true' },
  sdkConfiguration: DefaultSdkConfigurationWithWs,
};

export const decorators = [
  withQuery,
  withSdk,
  withContainerForLoki,
];
