import { EventEmitter } from '../../src/utils/EventEmitter';

type TestEventMap = {
  readonly eventA: (result: string) => void;
  readonly eventB: () => void;
};

describe('EventEmitter', () => {
  it('should call listeners when event is emitted', () => {
    const eventEmitter = new EventEmitter<TestEventMap>();
    const handlerA = jasmine.createSpy();
    const handlerB = jasmine.createSpy();

    eventEmitter.addListener('eventA', handlerA);
    eventEmitter.addListener('eventA', handlerB);
    eventEmitter.emit('eventA', 'result');

    expect(handlerA).toHaveBeenCalledWith('result');
    expect(handlerB).toHaveBeenCalledWith('result');
  });

  it('should not call listeners when they have been removed', () => {
    const eventEmitter = new EventEmitter<TestEventMap>();
    const handlerA = jasmine.createSpy();

    eventEmitter.addListener('eventA', handlerA);
    eventEmitter.removeListener('eventA', handlerA);
    eventEmitter.emit('eventA', 'result');

    expect(handlerA).toHaveBeenCalledTimes(0);

    const handlerB = jasmine.createSpy();

    eventEmitter.addListener('eventA', handlerA);
    eventEmitter.addListener('eventB', handlerB);

    eventEmitter.removeAllListeners();

    eventEmitter.emit('eventA', 'result');
    eventEmitter.emit('eventB');

    expect(handlerA).toHaveBeenCalledTimes(0);
    expect(handlerB).toHaveBeenCalledTimes(0);
  });
});
