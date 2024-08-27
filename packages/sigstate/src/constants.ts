import type { Signal } from 'signal-polyfill';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signals = new Map<string, Signal.State<any>>();
export const trustedOrigins = new Set<string>();
