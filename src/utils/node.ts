interface ICoords {
  readonly x: number;
  readonly y: number;
}

export function isNodeOverlapped(node: HTMLElement, rect: DOMRect): boolean {
  const center = findRectCenterCoords(rect);
  const topElement = document.elementFromPoint(center.x, center.y);
  return !node.isSameNode(topElement) && !node.contains(topElement);
}

export function findRectCenterCoords(rect: DOMRect): ICoords {
  const x1 = rect.x;
  const x2 = rect.x + rect.width;
  const y1 = rect.y;
  const y2 = rect.y + rect.height;
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}
