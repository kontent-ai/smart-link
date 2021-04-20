export enum LogLevel {
  Debug = 1,
  Info,
  Warn,
  Error,
}

export abstract class Logger {
  private static logLevel: LogLevel = LogLevel.Info;

  public static setLogLevel(level: LogLevel): void {
    Logger.logLevel = level;
  }

  public static error(...args: any[]): void {
    if (Logger.logLevel <= LogLevel.Error) {
      console.error('[KSL][Error]: ', ...args);
    }
  }

  public static warn(...args: any[]): void {
    if (Logger.logLevel <= LogLevel.Warn) {
      console.warn('[KSL][Warning]: ', ...args);
    }
  }

  public static info(...args: any[]): void {
    if (Logger.logLevel <= LogLevel.Info) {
      console.info('[KSL][Info]: ', ...args);
    }
  }

  public static debug(...args: any[]): void {
    if (Logger.logLevel <= LogLevel.Debug) {
      console.log(...args);
    }
  }

  public static debugGroupCollapsed(...args: any): void {
    if (Logger.logLevel <= LogLevel.Debug) {
      console.groupCollapsed(...args);
    }
  }

  public static debugGroup(...args: any): void {
    if (Logger.logLevel <= LogLevel.Debug) {
      console.group(...args);
    }
  }

  public static debugGroupEnd(): void {
    if (Logger.logLevel <= LogLevel.Debug) {
      console.groupEnd();
    }
  }
}
