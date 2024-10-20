import { expect, test, beforeEach } from 'bun:test';

import { Signal, sigstate } from '@sigstate/core';

test('Given a sigstate', () => {
  let signal: Signal.State<number>;

  beforeEach(() => {
    signal = sigstate('test', 0);
  });

  test('When another sigstate is created with the same name', () => {
    let signal2: Signal.State<number>;

    beforeEach(() => {
      signal2 = sigstate('test', 0);
    });

    test('Then it is the same signal', () => {
      expect(signal).toBe(signal2);
    });
  });
});
