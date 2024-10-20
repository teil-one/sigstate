import {
  sigstate as sigstateCore,
  Signal as SigstateSignal,
  effect as sigstateEffect,
} from '@sigstate/core';

export function sigstateInterop<TSignal>(
  signalFactory: <T>(value: T) => TSignal,
  getValue: <T>(frameworkSignal: TSignal) => T,
  setValue: <T>(frameworkSignal: TSignal, value: T) => void,
  effect: (effectFn: () => void) => void,
) {
  const signals = new Map<string, TSignal>();

  return function sigstate<T>(name: string, defaultValue: T) {
    const signal = sigstateCore<T>(name, defaultValue);

    let frameworkSignal = signals.get(name);
    if (!frameworkSignal) {
      frameworkSignal = createFrameworkSignal<T>(name, defaultValue, signal);
    }

    return frameworkSignal;
  };

  function createFrameworkSignal<T>(
    name: string,
    value: T,
    sigstateSignal: SigstateSignal.State<T>,
  ) {
    const frameworkSignal = signalFactory(value);
    signals.set(name, frameworkSignal);

    sigstateEffect(() => {
      setValue(frameworkSignal, sigstateSignal.get());
    });

    effect(() => {
      sigstateSignal.set(getValue(frameworkSignal) as T);
    });

    return frameworkSignal;
  }
}
