export enum LogLevel {
  Debug = 1,
  Info,
  Warn,
  Error,
}

export interface ILogger {
  debug(...args: unknown[]): void;
  debugGroup(...args: unknown[]): void;
  debugGroupCollapsed(...args: unknown[]): void;
  debugGroupEnd(...args: unknown[]): void;
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  setLogLevel(level: LogLevel): void;
  warn(...args: unknown[]): void;
}

export class Logger implements ILogger {
  private logLevel: LogLevel = LogLevel.Info;

  public debug(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.debug('[@kontent-ai/smart-link][debug]: ', ...args);
    }
  }

  public debugGroup(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.group(...args);
    }
  }

  public debugGroupCollapsed(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.groupCollapsed(...args);
    }
  }

  public debugGroupEnd(): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.groupEnd();
    }
  }

  public error(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Error) {
      console.error('[@kontent-ai/smart-link][error]: ', ...args);
    }
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public info(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Info) {
      console.info('[@kontent-ai/smart-link][info]: ', ...args);
    }
  }

  public warn(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Warn) {
      console.warn('[@kontent-ai/smart-link][warn]: ', ...args);
    }
  }
}
