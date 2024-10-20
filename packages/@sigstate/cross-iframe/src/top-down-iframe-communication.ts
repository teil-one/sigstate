import { signals, trustedOrigins } from './constants';
import { diff } from './diff';
import { effect, sigstate } from '@sigstate/core';

const processedIframes = new Map<
  HTMLIFrameElement,
  {
    existingEffectTimeout?: number;
    dropExistingEffect?: () => void;
  }
>();

const lastPostedValuesByIframe = new Map<
  HTMLIFrameElement,
  Map<string, unknown>
>();

export function ensureTopDownIframeCommunicationForAllSignals() {
  replaySignalsToIframes(Array.from(document.getElementsByTagName('iframe')));
}

export function replaySignalsToNewTrustedOrigins(newOrigins: string[]) {
  const newIframes: HTMLIFrameElement[] = [];

  for (const origin of newOrigins) {
    const iframes = document.getElementsByTagName('iframe');

    for (const iframe of iframes) {
      if (!iframe.src.startsWith(origin)) continue;

      newIframes.push(iframe);
    }
  }

  replaySignalsToIframes(newIframes);
}

function replaySignalsToIframes(iframes: HTMLIFrameElement[]) {
  if (signals.size === 0) {
    return;
  }

  if (iframes.length) {
    console.log(
      '!! replaySignalsToIframes',
      window.document.title,
      signals,
      iframes,
    );
  }

  for (const origin of trustedOrigins) {
    for (const iframe of iframes) {
      if (!iframe.src.startsWith(origin)) continue; // Skip iframes from other origins

      // TODO: Check behaviors for all possible readyState (including undefined)
      if (
        !iframe.contentDocument ||
        iframe.contentDocument.readyState === 'complete'
      ) {
        postMessageToIframe(iframe, origin);
      } else {
        iframe.addEventListener('load', () => {
          postMessageToIframe(iframe, origin);
        });
      }
    }
  }
}

function postMessageToIframe(iframe: HTMLIFrameElement, origin: string) {
  if (!iframe.src.startsWith(origin)) {
    console.error(
      "!! Can't post to iframe - origin does not match",
      iframe.src,
      origin,
    );
    throw new Error("Can't post to iframe - origin does not match");
  }

  const iframeHandler = processedIframes.get(iframe);
  let existingIframeEffectTimeout = iframeHandler?.existingEffectTimeout;
  let dropExistingIframeEffect = iframeHandler?.dropExistingEffect;

  if (existingIframeEffectTimeout) {
    clearTimeout(existingIframeEffectTimeout);

    if (dropExistingIframeEffect) {
      dropExistingIframeEffect();
    }
  }

  // Schedule posting to the iframe.
  // If there is another signal added, the scheduled task will be replaced with a new one covering all signals
  existingIframeEffectTimeout = setTimeout(() => {
    if (dropExistingIframeEffect) {
      dropExistingIframeEffect();
    }

    dropExistingIframeEffect = effect(() => {
      const message = new Map<string, unknown>();

      const lastPostedValues = lastPostedValuesByIframe.get(iframe);

      for (const signalName of signals.keys()) {
        const signal = signals.get(signalName);

        if (!signal) continue;

        message.set(signalName, signal.get());
      }

      const changedValues = diff(message, lastPostedValues);

      if (changedValues.size === 0) return;

      console.log(
        `!! post ${document.title} -> <Child>`,
        iframe,
        changedValues,
      );

      iframe.contentWindow?.postMessage(
        { store: true, signals: changedValues },
        origin,
      );

      lastPostedValuesByIframe.set(iframe, message);
    });

    processedIframes.set(iframe, {
      existingEffectTimeout: existingIframeEffectTimeout,
      dropExistingEffect: dropExistingIframeEffect,
    });
  }, 0);

  processedIframes.set(iframe, {
    existingEffectTimeout: existingIframeEffectTimeout,
    dropExistingEffect: undefined,
  });
}

// TODO: For bottom-up events listen only for events from trusted origins
window.addEventListener(
  'message',
  (message) => {
    if (message.data?.store !== true) return;

    const signalsInMessage = message.data.signals;

    console.log('!! on message', window.document.title, signalsInMessage);

    for (const signalName of signalsInMessage.keys()) {
      const signalValue = signalsInMessage.get(signalName);

      const signal = sigstate(signalName, signalValue);
      signal.set(signalValue);
    }
  },
  false,
);

const observer = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        processNewNode(node);
      }
    }
  }
});

observer.observe(document, { childList: true, subtree: true });

function processNewNode(node: Node) {
  const childIframes = getChildIframes(node);
  if (!childIframes.length) {
    return;
  }

  replaySignalsToIframes(childIframes);
}

function getChildIframes(node: Node): HTMLIFrameElement[] {
  if (node.nodeName === 'IFRAME') {
    return [node as HTMLIFrameElement];
  }

  const result = [];

  for (const childNode of node.childNodes) {
    for (const iframe of getChildIframes(childNode)) {
      result.push(iframe);
    }
  }

  return result;
}
