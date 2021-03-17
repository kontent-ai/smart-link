import { StoryFnHtmlReturnType } from '@storybook/html/dist/client/preview/types';
import { StoryContext } from '@storybook/addons';
import { useEffect } from '@storybook/client-api';
import KontentSmartLink from '../../es/index.js';

export function withSdk(storyFn: () => StoryFnHtmlReturnType, context: StoryContext) {
  const { sdkConfiguration } = context.parameters;

  useEffect(() => {
    const plugin = KontentSmartLink.initialize(sdkConfiguration);
    return () => {
      plugin.destroy();
    };
  }, []);

  return storyFn();
}
