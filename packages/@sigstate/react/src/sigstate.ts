import type { Signal } from '@preact/signals-core';
import { effect, signal } from '@preact/signals';
import { sigstateInterop } from '@sigstate/interop';

export const sigstate: <T>(name: string, defaultValue: T) => Signal<T> =
  sigstateInterop<Signal>(
    <T>(value: T) => signal(value),
    <T>(signal: Signal<T>) => signal.value,
    <T>(signal: Signal<T>, value: T) => (signal.value = value),
    effect,
  );
