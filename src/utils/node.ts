export function isNodeOverlapped(node: HTMLElement, rect: DOMRect): boolean {
  const centerX = (rect.left + rect.right) / 2;
  const centerY = (rect.top + rect.bottom) / 2;
  const topElement = document.elementFromPoint(centerX, centerY);
  return !node.isSameNode(topElement) && !node.contains(topElement);
}
