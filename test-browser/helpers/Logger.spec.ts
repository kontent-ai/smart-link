import { Logger, LogLevel } from '../../src/helpers/Logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  it('should not log debug messages when log level is set to Info', () => {
    spyOn(console, 'debug');
    logger.setLogLevel(LogLevel.Info);
    logger.debug('Debug message');
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('should log debug messages when log level is set to Debug', () => {
    spyOn(console, 'debug');
    logger.setLogLevel(LogLevel.Debug);
    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalledWith('[@kontent-ai/smart-link][debug]: ', 'Debug message');
  });

  it('should log error messages', () => {
    spyOn(console, 'error');
    logger.error('Error message');
    expect(console.error).toHaveBeenCalledWith('[@kontent-ai/smart-link][error]: ', 'Error message');
  });
});
