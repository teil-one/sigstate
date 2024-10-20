import {
  effect as preactEffect,
  Signal as PreactSignal,
} from '@preact/signals';
import {
  sigstate as sigstateCore,
  Signal as SigstateSignal,
  effect as sigstateEffect,
} from '@sigstate/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signals = new Map<string, PreactSignal<any>>();

export function sigstate<T>(name: string, defaultValue: T) {
  const signal = sigstateCore<T>(name, defaultValue);

  let preactSignal = signals.get(name) as PreactSignal<T>;
  if (!preactSignal) {
    preactSignal = createPreactSignal<T>(name, defaultValue, signal);
  }

  return preactSignal;
}

function createPreactSignal<T>(
  name: string,
  value: T,
  sigstateSignal: SigstateSignal.State<T>,
) {
  const preactSignal = new PreactSignal(value);
  signals.set(name, preactSignal);

  sigstateEffect(() => {
    preactSignal.value = sigstateSignal.get();
  });

  preactEffect(() => {
    sigstateSignal.set(preactSignal.value);
  });

  return preactSignal;
}
