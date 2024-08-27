import { Signal } from 'signal-polyfill';
import './top-down-iframe-communication';
import { signals, trustedOrigins } from './constants';
import {
  ensureTopDownIframeCommunicationForAllSignals,
  replaySignalsToNewTrustedOrigins,
} from './top-down-iframe-communication';
import { effect } from './effect';
import { ensureBottomUpIframeCommunicationForAllSignals } from './bottom-up-iframe-communication';

export const Sigstate = {
  get<T>(name: string) {
    const signal = getSignal<T | undefined>(name, undefined);

    return signal as Signal.State<T>;
  },

  set<T>(name: string, value: T) {
    const signal = getSignal<T>(name, value);

    signal.set(value);

    return signal;
  },

  computed(func: () => unknown) {
    return new Signal.Computed(func);
  },

  effect: effect,

  addTrustedOrigins(origins: string[]) {
    const newOrigins: string[] = [];
    for (const origin of origins) {
      if (trustedOrigins.has(origin)) continue;

      trustedOrigins.add(origin);
      newOrigins.push(origin);
    }

    if (newOrigins.length) {
      replaySignalsToNewTrustedOrigins(newOrigins);
    }
  },
};

function getSignal<T>(name: string, value: T) {
  let signal = signals.get(name) as Signal.State<T>;
  if (!signal) {
    signal = new Signal.State(value);
    signals.set(name, signal);

    console.log('!! new signal', document.title, name, value);

    ensureBottomUpIframeCommunicationForAllSignals();
    ensureTopDownIframeCommunicationForAllSignals();
  }

  return signal;
}
