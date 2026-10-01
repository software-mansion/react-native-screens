import { expect, element, by } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { countMatches } from './matchers';
import { waitUntil, type WaitUntilOptions } from './wait';

/** Only "no match yet" (Espresso / iOS wording) and "not visible yet" retry. */
function isTransientMatchError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('No views in hierarchy found matching') ||
    message.includes('No elements found') ||
    message.includes('not visible')
  );
}

/**
 * Polls until the last match of `buildMatcher()` (the topmost stacked screen's
 * copy) is visible. Takes a factory: on Android `atIndex` mutates the matcher,
 * so a reused one would stay pinned to the first poll's index.
 */
export async function expectTopmostVisible(
  buildMatcher: () => NativeMatcher,
  options: Omit<WaitUntilOptions, 'message'> = {},
): Promise<void> {
  let lastError: unknown = '<never attempted>';

  await waitUntil(
    async () => {
      const matcher = buildMatcher();
      try {
        const count = await countMatches(matcher);
        await expect(element(matcher).atIndex(count - 1)).toBeVisible();
        return true;
      } catch (error) {
        if (!isTransientMatchError(error)) {
          throw error;
        }
        lastError = error;
        return false;
      }
    },
    {
      ...options,
      message: () =>
        `the topmost match to be visible; last failure: ${lastError}`,
    },
  );
}

/** Asserts the Push/Pop/Toggle buttons present on the topmost screen. */
export async function expectTopmostButtons(titles: string[]): Promise<void> {
  for (const title of titles) {
    await expectTopmostVisible(() => by.text(title));
  }
}
