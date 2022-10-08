type QueryParamChangeCallback = (isPresent: boolean) => void;

export interface IQueryParamWatcherService {
  readonly watch: (queryParam: string, onChange: QueryParamChangeCallback) => void;
  readonly unwatchAll: () => void;
}

export class QueryParamWatcherService implements IQueryParamWatcherService {
  private static WatchTimeoutMs = 1000;

  private previousValue: Map<string, boolean> = new Map();
  private timers: Map<string, number> = new Map();

  /**
   * Check if query parameter is present in the current page URL.
   * Query parameter value is ignored, only presence is checked.
   *
   * @param {string} queryParam
   * @returns {boolean}
   */
  public static isQueryParamPresent(queryParam: string): boolean {
    const regex = new RegExp(`[?&]${queryParam}([=&]|$)`, 'i');
    return regex.test(window.location.search);
  }

  public watch = (queryParam: string, onChange: QueryParamChangeCallback): void => {
    const timerId = this.timers.get(queryParam);

    if (timerId) {
      clearTimeout(timerId);
    }

    const isPresent = QueryParamWatcherService.isQueryParamPresent(queryParam);
    const hasChanged = this.previousValue.get(queryParam) !== isPresent;

    if (hasChanged) {
      onChange(isPresent);
    }

    const newTimerId = window.setTimeout(() => this.watch(queryParam, onChange), QueryParamWatcherService.WatchTimeoutMs);
    this.timers.set(queryParam, newTimerId);
  };

  public unwatchAll = (): void => {
    this.timers.forEach((timerId: number) => {
      clearTimeout(timerId);
    });

    this.timers.clear();
  };
}
