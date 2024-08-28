import { Signal } from 'signal-polyfill';

export function effect(callback: () => (() => unknown) | void) {
  let cleanup: (() => unknown) | void;

  const computed = new Signal.Computed(() => {
    if (typeof cleanup === 'function') cleanup();
    cleanup = callback();
  });

  w.watch(computed);
  computed.get();

  return () => {
    w.unwatch(computed);
    if (typeof cleanup === 'function') cleanup();
    cleanup = undefined;
  };
}

let needsEnqueue = true;

const w = new Signal.subtle.Watcher(() => {
  if (needsEnqueue) {
    needsEnqueue = false;
    queueMicrotask(processPending);
  }
});

function processPending() {
  needsEnqueue = true;

  for (const s of w.getPending()) {
    s.get();
  }

  w.watch();
}
