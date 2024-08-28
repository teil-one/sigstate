import {
  signal as angularSignalFunc,
  effect as angularEffect,
  WritableSignal as AngularSignal,
} from '@angular/core';

import {
  sigstate as sigstateCore,
  Signal as SigstateSignal,
  effect as sigstateEffect,
} from '@sigstate/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signals = new Map<string, AngularSignal<any>>();

export function sigstate<T>(name: string, defaultValue: T) {
  const signal = sigstateCore<T>(name, defaultValue);

  let angularSignal = signals.get(name) as AngularSignal<T>;
  if (!angularSignal) {
    angularSignal = createAngularSignal<T>(name, defaultValue, signal);
  }

  return angularSignal;
}

function createAngularSignal<T>(
  name: string,
  value: T,
  sigstateSignal: SigstateSignal.State<T>,
) {
  const angularSignal = angularSignalFunc(value);
  signals.set(name, angularSignal);

  sigstateEffect(() => {
    angularSignal.set(sigstateSignal.get());
  });

  angularEffect(() => {
    sigstateSignal.set(angularSignal());
  });

  return angularSignal;
}
