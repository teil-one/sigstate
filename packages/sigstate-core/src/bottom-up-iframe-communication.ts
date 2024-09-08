import { signals } from './constants';
import { diff } from './diff';
import { effect } from './effect';

let dropExistingEffect: () => void;
let timeout: number | undefined;

let lastPostedValues: Map<string, unknown>;

export function ensureBottomUpIframeCommunicationForAllSignals() {
  if (window === window.parent) return;

  if (timeout) {
    clearTimeout(timeout);

    if (dropExistingEffect) {
      dropExistingEffect();
    }
  }

  // Schedule posting to parent.
  // If there is another signal added, the scheduled task will be replaced with a new one covering all signals
  timeout = setTimeout(() => {
    if (dropExistingEffect) {
      dropExistingEffect();
    }

    dropExistingEffect = effect(() => {
      const message = new Map<string, unknown>();

      for (const signalName of signals.keys()) {
        const signal = signals.get(signalName);

        if (!signal || signal.get() === undefined) continue;

        message.set(signalName, signal.get());
      }

      const changedValues = diff(message, lastPostedValues);

      if (changedValues.size === 0) return;

      console.log(
        `!! post ${window.document.title} -> <Parent>`,
        window.parent,
        changedValues,
      );

      window.parent.postMessage({ store: true, signals: changedValues }, '*');

      lastPostedValues = message;
    });
  }, 0);
}
