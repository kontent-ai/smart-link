const WatchTimeoutMs = 1000;

/**
 * Check the presence of query parameter in the current page URL.
 */
export function isQueryParamPresent(queryParam: string): boolean {
  const regex = new RegExp(`[?&]${queryParam}([=&]|$)`, 'i');
  return regex.test(window.location.search);
}

/**
 * Watches for changes in the presence of a query parameter in the URL and calls a callback when it changes.
 */
export const watchQueryParamPresence = (queryParam: string, onChange: (isPresent: boolean) => void): (() => void) => {
  // consider returning a timerIds instead of a function to unwatch and add a function to unwatch all
  let previousValue = false; // will work due to clojures

  const checkAndNotifyChange = () => {
    const isPresent = isQueryParamPresent(queryParam);
    const hasChanged = previousValue !== isPresent;

    if (hasChanged) {
      onChange(isPresent);
      previousValue = isPresent;
    }
  };

  // Check once before starting the interval
  checkAndNotifyChange();

  const timerId = window.setInterval(checkAndNotifyChange, WatchTimeoutMs);

  return () => {
    clearInterval(timerId);
  };
};
