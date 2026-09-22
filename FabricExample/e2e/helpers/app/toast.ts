import { expect, element, by, waitFor } from 'detox';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

export async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
  await element(by.label(message)).tap();
}

/** Dismisses the head of the toast queue — always `1.` if each is dismissed. */
export async function dismissNextToast(message: string) {
  await dismissToast(`1. ${message}`);
}

/**
 * Asserts no toast is on screen. Passing `message` pins the check to the
 * queue head (`1.`) — every caller here dismisses its own toasts first, so an
 * unexpected one always lands there, same as `dismissNextToast`. Omitting it
 * falls back to Detox matching a regex against the whole string, so any
 * position and text counts as a toast; dropping that wildcard suffix would
 * match nothing and always pass.
 */
export async function expectNoToast(message?: string) {
  const matcher =
    message === undefined ? by.label(/\d+\. .*/) : by.label(`1. ${message}`);
  await expect(element(matcher)).not.toExist();
}
