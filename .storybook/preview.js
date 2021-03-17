import { withSdk } from './decorators/withSdk';
import { withQuery } from '@storybook/addon-queryparams';
import { withContainerForLoki } from './decorators/withContainerForLoki';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  query: { 'kontent-smart-link-enabled': 'true' },
  sdkConfiguration: { queryParam: 'kontent-smart-link-enabled' },
};

export const decorators = [
  withQuery,
  withSdk,
  withContainerForLoki,
];
