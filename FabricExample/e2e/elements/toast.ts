import { expect, element, by, waitFor } from 'detox';

/**
 * The example app's toasts are rendered as a queue and labelled
 * `<position>. <message>`, so the head is always `1.` as long as each one is
 * dismissed before the next assertion.
 */

/** Waits for the toast labelled `message`, then taps it to dismiss it. */
export async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.label(message)).tap();
}

/** Dismisses the head of the toast queue — always `1.` if each is dismissed. */
export async function dismissNextToast(message: string) {
  await dismissToast(`1. ${message}`);
}

/**
 * Detox matches a regex against the *whole* string — without the trailing `.*`
 * this matches nothing and always passes.
 */
export async function expectNoToast() {
  await expect(element(by.label(/\d+\. .*/))).not.toExist();
}
