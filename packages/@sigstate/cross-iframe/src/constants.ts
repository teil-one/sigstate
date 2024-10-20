import type { Signal } from 'signal-polyfill';

export const trustedOrigins = new Set<string>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const s =
  (globalThis as any)[Symbol.for('@sigstate/core/signals-map')] ??
  new Map<string, Signal.State<any>>();

(globalThis as any)[Symbol.for('@sigstate/core/signals-map')] = s;

export const signals = s;

const c =
  (globalThis as any)[Symbol.for('@sigstate/core/signal-created-callbacks')] ??
  new Set<(signal: Signal.State<unknown>) => unknown>();

(globalThis as any)[Symbol.for('@sigstate/core/signal-created-callbacks')] = c;

export const signalCreatedCallbacks = c;
