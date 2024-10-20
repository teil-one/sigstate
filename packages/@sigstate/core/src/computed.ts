import { Signal } from 'signal-polyfill';

export function computed(func: () => unknown) {
  return new Signal.Computed(func);
}
