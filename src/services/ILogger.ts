export enum LogLevel {
  Debug = 1,
  Info,
  Warn,
  Error,
}

export interface ILogger {
  readonly setLogLevel: (level: LogLevel) => void;
  readonly error: (...args: unknown[]) => void;
  readonly warn: (...args: unknown[]) => void;
  readonly info: (...args: unknown[]) => void;
  readonly debug: (...args: unknown[]) => void;
  readonly debugGroupCollapsed: (...args: unknown[]) => void;
  readonly debugGroup: (...args: unknown[]) => void;
  readonly debugGroupEnd: (...args: unknown[]) => void;
}
