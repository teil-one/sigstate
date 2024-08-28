import { Signal } from 'signal-polyfill';
import './top-down-iframe-communication';
import { signals } from './constants';
import { ensureTopDownIframeCommunicationForAllSignals } from './top-down-iframe-communication';
import { ensureBottomUpIframeCommunicationForAllSignals } from './bottom-up-iframe-communication';

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

  console.log('!! new signal', document.title, name, value);

  ensureBottomUpIframeCommunicationForAllSignals();
  ensureTopDownIframeCommunicationForAllSignals();
  return signal;
}
