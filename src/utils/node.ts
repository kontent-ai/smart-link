export function groupElementsByRenderingRoot(
  elements: ReadonlySet<HTMLElement>
): Map<HTMLElement | null, ReadonlySet<HTMLElement>> {
  const results = new Map();

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
 *
 * @param {HTMLElement} element
 * @returns {HTMLElement | null}
 */
export function getRenderingRootForElement(element: HTMLElement): HTMLElement | null {
  const parentElement = element.parentElement;

  if (parentElement instanceof HTMLElement) {
    const metadata = getRenderingRootMetadata(parentElement);

    // Table HTML element (td, th, table) can be an offset parent of some node, but unless it is positioned it will not be
    // used as a offset parent for the absolute positioned child (highlight). That is why we should ignore those elements and
    // do not use them as parents unless they are positioned. Otherwise, the highlighting might broke for the tables.
    const isNotTable = !['TD', 'TH', 'TABLE'].includes(parentElement.tagName);

    return metadata.isPositioned || (metadata.isContentClipped && isNotTable)
      ? parentElement
      : getRenderingRootForElement(parentElement);
  }

  return null;
}

export interface IRenderingRootMetadata {
  // The positioned element is an element whose computed position is anything except static.
  // Offset top and offset left values of child element are relative to the first positioned ancestor, so we can use
  // it to correctly position the highlight.
  readonly isPositioned: boolean;
  // Content is clipped when overflow of the element is hidden (auto, scroll, clip, hidden). Highlights should be placed
  // inside such elements so that they do not overflow their parent.
  readonly isContentClipped: boolean;
}

export function getRenderingRootMetadata(root: HTMLElement): IRenderingRootMetadata {
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
 *
 * @param {HTMLElement | null} node
 * @returns {[number, number]}
 *  where the first number is a totalScrollTop, and the second number is a totalScrollLeft.
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

  let scrollTop = 0;
  let scrollLeft = 0;
  let currentNode = node;

  while (currentNode.parentElement) {
    currentNode = currentNode.parentElement;

    if (offsetParent.isSameNode(currentNode)) {
      break;
    }

    scrollTop += currentNode.scrollTop;
    scrollLeft += currentNode.scrollLeft;
  }

  return [scrollTop, scrollLeft];
}

/**
 * Get all element ancestors.
 * @param {HTMLElement} element
 */
export function getElementAncestors(element: HTMLElement): ReadonlyArray<HTMLElement> {
  const ancestors = [];

  let parent = element.parentElement;
  while (parent !== null) {
    ancestors.push(parent);
    parent = parent.parentElement;
  }

  return ancestors;
}

export function createTemplateForCustomElement(html: string): HTMLTemplateElement {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}
