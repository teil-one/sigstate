import { ensureBottomUpIframeCommunicationForAllSignals } from './bottom-up-iframe-communication';
import { trustedOrigins, signalCreatedCallbacks } from './constants';
import {
  ensureTopDownIframeCommunicationForAllSignals,
  replaySignalsToNewTrustedOrigins,
} from './top-down-iframe-communication';

export function addTrustedOrigins(origins: string[]) {
  signalCreatedCallbacks.add(ensureBottomUpIframeCommunicationForAllSignals);
  signalCreatedCallbacks.add(ensureTopDownIframeCommunicationForAllSignals);

  console.log(
    '!! new signal - addTrustedOrigins',
    document.title,
    signalCreatedCallbacks,
  );

  const newOrigins: string[] = [];
  for (const origin of origins) {
    if (trustedOrigins.has(origin)) continue;

    trustedOrigins.add(origin);
    newOrigins.push(origin);
  }

  if (newOrigins.length) {
    replaySignalsToNewTrustedOrigins(newOrigins);
  }
}
