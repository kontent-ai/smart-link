interface IParentMetadata {
  readonly hasRelativePosition: boolean;
  readonly hasRestrictedOverflow: boolean;
}

export function getParentForHighlight(node: HTMLElement): [HTMLElement, IParentMetadata] | [null, null] {
  const parent = node.parentNode;

  if (parent instanceof HTMLElement) {
    const computedStyle = window.getComputedStyle(parent);

    const position = computedStyle.getPropertyValue('position');
    const overflow = computedStyle.getPropertyValue('overflow');

    const metadata: IParentMetadata = {
      hasRelativePosition: position === 'relative',
      hasRestrictedOverflow: overflow.split(' ').some((value) => ['auto', 'scroll', 'clip', 'hidden'].includes(value)),
    };

    return metadata.hasRelativePosition || metadata.hasRestrictedOverflow
      ? [parent, metadata]
      : getParentForHighlight(parent);
  }

  return [null, null];
}

export function getRelativeScrollOffset(node: Element | null): [number, number] {
  if (!node || !(node instanceof HTMLElement)) {
    return [0, 0];
  }

  const offsetParent = node.offsetParent;

  let scrollTop = 0;
  let scrollLeft = 0;
  let currentNode = node;

  while (currentNode.parentElement) {
    currentNode = currentNode.parentElement;

    if (offsetParent && offsetParent.isSameNode(currentNode)) {
      break;
    }

    scrollTop += currentNode.scrollTop;
    scrollLeft += currentNode.scrollLeft;
  }

  return [scrollTop, scrollLeft];
}
