import { useEffect } from "react";

export type ScrollOffsets = Record<string, [number, number]>;

/**
 * Hook to manage scroll positions for multiple elements
 * @param scrollOffsets Object containing element IDs mapped to [scrollTop, scrollLeft] tuples
 */
export const useScroll = (scrollOffsets: ScrollOffsets): null => {
  useEffect(() => {
    Object.entries(scrollOffsets).forEach(([elementId, [scrollTop, scrollLeft]]) => {
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
      }
    });
  }, [scrollOffsets]);

  return null;
};
