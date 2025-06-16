export enum LogLevel {
  Debug = 1,
  Info,
  Warn,
  Error,
}

let logLevel: LogLevel = LogLevel.Info;

/**
 * Sets the global log level for all logging functions.
 * Note: This function is impure as it modifies the module-scoped logLevel variable.
 */
export function setLogLevel(level: LogLevel): void {
  logLevel = level;
}

/**
 * Logs error messages to the console with '[KSL][Error]:' prefix.
 * Note: This function is impure as it depends on the module-scoped logLevel variable.
 */
export function logError(...args: unknown[]): void {
  if (logLevel <= LogLevel.Error) {
    console.error('[KSL][Error]: ', ...args);
  }
}

/**
 * Logs warning messages to the console with '[KSL][Warning]:' prefix.
 * Note: This function is impure as it depends on the module-scoped logLevel variable.
 */
export function logWarn(...args: unknown[]): void {
  if (logLevel <= LogLevel.Warn) {
    console.warn('[KSL][Warning]: ', ...args);
  }
}

/**
 * Logs informational messages to the console with '[KSL][Info]:' prefix.
 * Note: This function is impure as it depends on the module-scoped logLevel variable.
 */
export function logInfo(...args: unknown[]): void {
  if (logLevel <= LogLevel.Info) {
    console.info('[KSL][Info]: ', ...args);
  }
}

/**
 * Logs debug messages to the console.
 * Note: This function is impure as it depends on the module-scoped logLevel variable.
 */
export function logDebug(...args: unknown[]): void {
  if (logLevel <= LogLevel.Debug) {
    console.log(...args);
  }
}

/**
 * Creates a collapsed console group for debug logging.
 * Note: This function is impure as it depends on the module-scoped logLevel variable.
 */
export function logGroupCollapsed(...args: unknown[]): void {
  if (logLevel <= LogLevel.Info) {
    console.groupCollapsed(...args);
  }
}

/**
 * Creates an expanded console group for debug logging.
 * Note: This function is impure as it depends on the module-scoped logLevel variable.
 */
export function logGroup(...args: unknown[]): void {
  if (logLevel <= LogLevel.Info) {
    console.group(...args);
  }
}

/**
 * Ends the current console group for debug logging.
 * Note: This function is impure as it depends on the module-scoped logLevel variable.
 */
export function logGroupEnd(): void {
  if (logLevel <= LogLevel.Info) {
    console.groupEnd();
  }
}
