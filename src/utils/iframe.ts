export function isInsideIFrame(): boolean {
  return window.self !== window.top;
}
