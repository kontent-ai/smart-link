export function isQueryParamPresent(queryParam: string): boolean {
  const regex = new RegExp(`[?&]${queryParam}([=&]|$)`, 'i');
  return regex.test(window.location.search);
}
