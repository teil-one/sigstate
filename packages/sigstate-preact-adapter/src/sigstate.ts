import { effect, Signal } from '@preact/signals';
import { Sigstate, Signal as SigstateSignal } from '@teil-one/sigstate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signals = new Map<string, Signal<any>>();

export class PreactSigstate {
  static get<T>(name: string) {
    const preactSignal = this.getSignal<T | undefined>(name, undefined);

    return preactSignal;
  }

  static set<T>(name: string, value: T) {
    const preactSignal = this.getSignal<T>(name, value);

    preactSignal.value = value;

    return preactSignal;
  }

  private static getSignal<T>(name: string, value: T) {
    const signal = Sigstate.get<T>(name);

    let preactSignal = signals.get(name) as Signal<T>;
    if (!preactSignal) {
      preactSignal = this.createPreactSignal<T>(name, value, signal);
    }

    return preactSignal;
  }

  protected static createPreactSignal<T>(
    name: string,
    value: T,
    signal: SigstateSignal.State<T>,
  ) {
    const preactSignal = new Signal(value);
    signals.set(name, preactSignal);

    Sigstate.effect(() => {
      preactSignal.value = signal.get();
    });

    effect(() => {
      signal.set(preactSignal.value);
    });

    return preactSignal;
  }
}
