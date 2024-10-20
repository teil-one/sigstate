import { Signal } from 'signal-polyfill';

import { signalCreatedCallbacks, signals } from './constants';

export function sigstate<T>(name: string, defaultValue: T) {
  let signal = signals.get(name) as Signal.State<T>;
  if (!signal) {
    signal = createSignal<T>(name, defaultValue);
  }

  return signal;
}

function createSignal<T>(name: string, value: T) {
  const signal = new Signal.State(value);
  signals.set(name, signal);

  console.log(
    '!! new signal',
    document.title,
    name,
    value,
    signalCreatedCallbacks.size,
  );

  for (let callback of signalCreatedCallbacks) {
    callback(signal);
  }

  return signal;
}
