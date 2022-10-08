import { ILogger, LogLevel } from './ILogger';

export class ConsoleLogger implements ILogger {
  private logLevel: LogLevel = LogLevel.Info;

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public error(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Error) {
      console.error('[@kontent-ai/smart-link][error]: ', ...args);
    }
  }

  public warn(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Warn) {
      console.warn('[@kontent-ai/smart-link][warn]: ', ...args);
    }
  }

  public info(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Info) {
      console.info('[@kontent-ai/smart-link][info]: ', ...args);
    }
  }

  public debug(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.debug('[@kontent-ai/smart-link][debug]: ', ...args);
    }
  }

  public debugGroupCollapsed(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.groupCollapsed(...args);
    }
  }

  public debugGroup(...args: unknown[]): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.group(...args);
    }
  }

  public debugGroupEnd(): void {
    if (this.logLevel <= LogLevel.Debug) {
      console.groupEnd();
    }
  }
}
