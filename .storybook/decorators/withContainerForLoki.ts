import { StoryFnHtmlReturnType } from '@storybook/html/dist/client/preview/types';

/**
 * Loki takes screenshots of #root element's bounding rect. This element is located
 * inside <body> and has no padding and margin, but smart links are sometimes placed
 * inside body and can overflow this bounding rect, that is why this decorator creates
 * a new wrapper for every story inside #root element, so that the whole smart link is
 * visible on the screenshot even if it overflows.
 *
 * @param {() => StoryFnHtmlReturnType} storyFn
 */
export function withContainerForLoki(storyFn: () => StoryFnHtmlReturnType) {
  const story = storyFn();

  return `
    <div style="padding: 1rem;">
        ${story instanceof HTMLElement ? story.outerHTML : story}
    </div>
    <style>
        body {
            padding: 0;
        }
    </style>
  `;
}
