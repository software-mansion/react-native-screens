import { expect, element, by, waitFor } from 'detox';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

/**
 * Toasts render as `<n>. <message>`, where `<n>` is the toast's 1-based
 * position in the on-screen queue. The helpers below match on `message` only
 * and ignore `<n>`, so they don't depend on the order in which toasts were
 * pushed (e.g. lifecycle event order differs between iOS versions).
 */
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
