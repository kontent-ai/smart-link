/**
 * Groups HTML elements by their rendering root element.
 * The rendering root is determined by traversing up the DOM tree to find an element that is either:
 * - Positioned (position is not static)
 * - Has clipped content (overflow is auto, scroll, clip, or hidden)
 * For table elements (td, th, table), they must be positioned to be considered a rendering root.
 */
export function groupElementsByRenderingRoot(
  elements: ReadonlySet<HTMLElement>
): Map<HTMLElement | null, ReadonlySet<HTMLElement>> {
  const results = new Map<HTMLElement | null, Set<HTMLElement>>();

  for (const element of elements) {
    const root = getRenderingRootForElement(element);
    const prev = results.get(root) ?? new Set();
    results.set(root, prev.add(element));
  }

  return results;
}

/**
 * Iterate through node ancestors and find an element which will be used as a parent for
 * the ksl-container. This element should either be positioned (position is anything except static) or should
 * have its content clipped. In case of table element (td, th, table) it should be positioned or it will be ignored
 * (even if its content is clipped).
 */
export function getRenderingRootForElement(element: HTMLElement): HTMLElement | null {
  const parentElement = element.parentElement;

  if (!parentElement) {
    return null;
  }

  const metadata = getRenderingRootMetadata(parentElement);

  // Table HTML element (td, th, table) can be an offset parent of some node, but unless it is positioned it will not be
  // used as a offset parent for the absolute positioned child (highlight). That is why we should ignore those elements and
  // do not use them as parents unless they are positioned. Otherwise, the highlighting might broke for the tables.
  const isNotTable = !['TD', 'TH', 'TABLE'].includes(parentElement.tagName);

  return metadata.isPositioned || (metadata.isContentClipped && isNotTable)
    ? parentElement
    : getRenderingRootForElement(parentElement);
}

export type RenderingRootMetadata = {
  /**
   * Indicates if the element is positioned (computed position is anything except static).
   * Offset top and offset left values of child elements are relative to the first positioned ancestor,
   * which is used to correctly position the highlight.
   */
  readonly isPositioned: boolean;

  /**
   * Content is clipped when overflow of the element is hidden (overflow is auto, scroll, clip, or hidden).
   * Highlights should be placed inside such elements to prevent overflow of their parent.
   */
  readonly isContentClipped: boolean;
};

/**
 * Gets metadata about an element's rendering properties that determine how it should be used as a container.
 */
export function getRenderingRootMetadata(root: HTMLElement): RenderingRootMetadata {
  const computedStyles = window.getComputedStyle(root);

  const position = computedStyles.getPropertyValue('position');
  const overflow = computedStyles.getPropertyValue('overflow');

  return {
    isPositioned: position !== 'static',
    isContentClipped: overflow.split(' ').some((value) => ['auto', 'scroll', 'clip', 'hidden'].includes(value)),
  };
}

/**
 * Iterate through node ancestors until HTMLElement.offsetParent is reached and sum scroll offsets.
 */
export function getTotalScrollOffset(node: HTMLElement | null): [number, number] {
  if (!node) {
    return [0, 0];
  }

  const offsetParent = node.offsetParent;

  // HTMLElement.offsetParent can be null when the node is <body> or <html>
  if (!offsetParent) {
    return [0, 0];
  }

  const calculateOffset = (currentNode: HTMLElement | null): [number, number] => {
    if (offsetParent.isSameNode(currentNode) || !currentNode) {
      return [0, 0];
    }

    const [scrollTop, scrollLeft] = calculateOffset(currentNode.parentElement);

    return [scrollTop + currentNode.scrollTop, scrollLeft + currentNode.scrollLeft];
  };

  return calculateOffset(node.parentElement);
}

export function createTemplateForCustomElement(html: string): HTMLTemplateElement {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}
