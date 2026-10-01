/** Default for waits Detox's idle sync already mostly covers. */
export const DEFAULT_TIMEOUT_MS = 3000;

export type WaitUntilOptions = {
  /** How long to keep polling before failing, in milliseconds. */
  timeout?: number;
  /** Delay between two `predicate` calls, in milliseconds. */
  interval?: number;
  /** What was awaited, appended to the timeout error. A function can build it
   * from whatever the last `predicate` call observed. */
  message: string | (() => string);
};

/**
 * Polls `predicate` until `true` or `timeout`. Prefer Detox's `waitFor`; use
 * this only for conditions it cannot express, e.g. match counts.
 */
export async function waitUntil(
  predicate: () => Promise<boolean>,
  { timeout = DEFAULT_TIMEOUT_MS, interval = 100, message }: WaitUntilOptions,
): Promise<void> {
  const deadline = Date.now() + timeout;

  while (Date.now() <= deadline) {
    if (await predicate()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(
    `waitUntil timed out after ${timeout}ms: ${
      typeof message === 'function' ? message() : message
    }`,
  );
}
