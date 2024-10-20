import type { Signal as ReactSignal } from '@preact/signals-core';
import {
  effect as reactEffect,
  signal as reactSignal,
} from '@preact/signals';
import {
  type Signal as SigstateSignal,
  sigstate as sigstateCore,
  effect as sigstateEffect,
} from '@sigstate/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signals = new Map<string, ReactSignal<any>>();

export function sigstate<T>(name: string, defaultValue: T) {
  const signal = sigstateCore<T>(name, defaultValue);

  let reactSignal = signals.get(name) as ReactSignal<T>;
  if (!reactSignal) {
    reactSignal = createReactSignal<T>(name, defaultValue, signal);
  }

  return reactSignal;
}

function createReactSignal<T>(
  name: string,
  value: T,
  sigstateSignal: SigstateSignal.State<T>,
) {
  const rs = reactSignal(value);
  signals.set(name, rs);

  sigstateEffect(() => {
    console.log('!! rs effect', rs.value);
    rs.value = sigstateSignal.get();
  });

  reactEffect(() => {
    sigstateSignal.set(rs.value);
  });

  return rs;
}
