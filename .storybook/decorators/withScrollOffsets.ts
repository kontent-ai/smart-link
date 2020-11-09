import { StoryFnHtmlReturnType } from '@storybook/html/dist/client/preview/types';
import { useEffect } from '@storybook/client-api';

interface IScrollOffsets {
  [elementId: string]: [number, number];
}

export function withScrollOffsets(scrollOffsets: IScrollOffsets) {
  return (storyFn: () => StoryFnHtmlReturnType) => {
    useEffect(() => {
      for (const [elementId, [scrollTop, scrollLeft]] of Object.entries(scrollOffsets)) {
        const element = document.getElementById(elementId);

        if (element) {
          element.scrollTop = scrollTop;
          element.scrollLeft = scrollLeft;
        }
      }
    }, []);

    return storyFn();
  };
}
