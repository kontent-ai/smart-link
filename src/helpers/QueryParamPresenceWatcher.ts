import { InvalidEnvironmentError } from '../utils/errors';

type QueryParamChangeCallback = (isPresent: boolean) => void;

interface IQueryParamPresenceWatcher {
  watch(queryParam: string, onChange: QueryParamChangeCallback): void;
  unwatchAll(): void;
}

export class QueryParamPresenceWatcher implements IQueryParamPresenceWatcher {
  private static WatchTimeoutMs = 1000;

  private previousValue: Map<string, boolean> = new Map();
  private timers: Map<string, number> = new Map();

  constructor(private readonly window: Window) {
    if (typeof window === 'undefined') {
      throw InvalidEnvironmentError('QueryParamPresenceWatcher can only be initialized in a browser environment');
    }
  }

  private isQueryParamPresent(queryParam: string): boolean {
    const regex = new RegExp(`[?&]${queryParam}([=&]|$)`, 'i');
    return regex.test(this.window.location.search);
  }

  public watch(queryParam: string, onChange: QueryParamChangeCallback): void {
    const timerId = this.timers.get(queryParam);

    if (timerId) {
      this.window.clearTimeout(timerId);
    }

    const isPresent = this.isQueryParamPresent(queryParam);
    const hasChanged = this.previousValue.get(queryParam) !== isPresent;

    if (hasChanged) {
      onChange(isPresent);
    }

    const newTimerId = this.window.setTimeout(
      () => this.watch(queryParam, onChange),
      QueryParamPresenceWatcher.WatchTimeoutMs
    );

    this.timers.set(queryParam, newTimerId);
    this.previousValue.set(queryParam, isPresent);
  }

  public unwatchAll(): void {
    this.timers.forEach((timerId) => {
      this.window.clearTimeout(timerId);
    });

    this.timers.clear();
  }
}
