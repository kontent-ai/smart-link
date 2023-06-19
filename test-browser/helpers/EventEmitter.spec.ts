import { EventDescriptor, EventEmitter } from '../../src/helpers/EventEmitter';

describe('EventEmitter', () => {
  let emitter: EventEmitter<{
    event1: EventDescriptor<number>;
    event2: EventDescriptor<string>;
  }>;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  afterEach(() => {
    emitter.removeAllListeners();
  });

  it('should add and emit event listeners', () => {
    const callback1 = jasmine.createSpy('callback1');
    const callback2 = jasmine.createSpy('callback2');

    emitter.addListener('event1', callback1);
    emitter.addListener('event2', callback2);

    emitter.emit('event1', 123);
    emitter.emit('event2', 'hello');

    expect(callback1).toHaveBeenCalledWith(123);
    expect(callback2).toHaveBeenCalledWith('hello');
  });

  it('should remove event listeners', () => {
    const callback1 = jasmine.createSpy('callback1');
    const callback2 = jasmine.createSpy('callback2');

    emitter.addListener('event1', callback1);
    emitter.addListener('event1', callback2);

    emitter.removeListener('event1', callback1);
    emitter.emit('event1', 123);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(123);
  });

  it('should check if a listener exists', () => {
    const callback = () => void 0;

    expect(emitter.hasListener('event1')).toBe(false);

    emitter.addListener('event1', callback);

    expect(emitter.hasListener('event1')).toBe(true);
  });

  it('should remove all event listeners', () => {
    const callback1 = jasmine.createSpy('callback1');
    const callback2 = jasmine.createSpy('callback2');

    emitter.addListener('event1', callback1);
    emitter.addListener('event2', callback2);

    emitter.removeAllListeners();

    emitter.emit('event1', 123);
    emitter.emit('event2', '456');

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });
});
