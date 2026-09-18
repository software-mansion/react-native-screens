import { expect, element, by, waitFor } from 'detox';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

/**
 * Toasts render as `<n>. <message>`, where `<n>` is the toast's 1-based
 * position in the on-screen queue; dismissing one renumbers those behind it.
 *
 * `dismissToastAt` / `dismissNextToast` pin `<n>`, which also asserts what is
 * queued ahead — use them wherever the emission order is deterministic.
 * `dismissToast` ignores `<n>`, for lifecycle (`onWill*` / `onDid*`) events
 * whose order differs between iOS versions.
 */

/** Dismisses the toast at 1-based `position` showing `message`. */
export async function dismissToastAt(position: number, message: string) {
  const toast = element(by.label(`${position}. ${message}`));
  await waitFor(toast).toBeVisible().withTimeout(DEFAULT_TIMEOUT_MS);
  await toast.tap();
}

/** Dismisses the head of the toast queue — always `1.` if each is dismissed. */
export async function dismissNextToast(message: string) {
  await dismissToastAt(1, message);
}

function toastMatcher(message?: string) {
  if (message === undefined) {
    return by.label(/^\d+\. .*$/);
  }
  const escaped = message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return by.label(new RegExp(`^\\d+\\. ${escaped}$`));
}

/**
 * Dismisses a toast showing `message`, whatever its position. When several
 * toasts share the message, the first match is dismissed.
 */
export async function dismissToast(message: string) {
  const toast = element(toastMatcher(message)).atIndex(0);
  await waitFor(toast).toBeVisible().withTimeout(DEFAULT_TIMEOUT_MS);
  await toast.tap();
}

/**
 * Asserts no toast showing `message` is on screen, at any position. Omitting
 * `message` asserts that no toast at all is on screen.
 */
export async function expectNoToast(message?: string) {
  await expect(element(toastMatcher(message))).not.toExist();
}
