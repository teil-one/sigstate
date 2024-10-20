import { signal, effect, Signal, WritableSignal } from '@angular/core';

import { sigstateInterop } from '@sigstate/interop';

export const sigstate: <T>(name: string, defaultValue: T) => WritableSignal<T> =
  sigstateInterop<WritableSignal<any>>(
    <T>(value: T) => signal(value),
    <T>(signal: Signal<T>) => signal(),
    <T>(signal: WritableSignal<T>, value: T) => signal.set(value),
    effect,
  );
