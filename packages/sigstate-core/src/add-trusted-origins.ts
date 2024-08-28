import { trustedOrigins } from './constants';
import { replaySignalsToNewTrustedOrigins } from './top-down-iframe-communication';

export function addTrustedOrigins(origins: string[]) {
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
