import { expect as jestExpect } from '@jest/globals';
import { element, by, waitFor } from 'detox';
import { readTopmostText } from '@e2e/framework/matchers';
import { DEFAULT_TIMEOUT_MS, waitUntil } from '@e2e/framework/wait';

// Stack v5 test screens: route information.

/** @see apps/src/tests/shared/components/stack-v5/StackRouteInformation.tsx */
const ROUTE_KEY_TEST_ID = 'stack-route-key';

/** The `Key: ...` label of the topmost screen. */
const readTopmostRouteKey = () => readTopmostText(ROUTE_KEY_TEST_ID);

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Matches the route key label of any screen on `routeName`. Keys are minted as
 * `r-<routeName>-<id>` with an increasing id (`generateRouteKeyForRouteName`),
 * so this pins the route, not the instance.
 */
const routeKeyPattern = (routeName: string) =>
  new RegExp(`^Key: r-${escapeRegExp(routeName)}-\\d+$`);

/**
 * Waits for the `Name: <routeName>` label to be visible. Only where that
 * label is unique in the hierarchy — iOS (covered screens are detached) or an
 * Android stack that never holds two screens of one route; otherwise use
 * `waitForTopmostRoute`, which reads the topmost copy.
 */
export async function waitForRouteName(routeName: string): Promise<void> {
  await waitFor(element(by.text(`Name: ${routeName}`)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
}

/**
 * Waits until the topmost screen is `routeName` and returns its route key,
 * which pins the instance too (same key: preserved; new key: pushed). Polled:
 * `toBeVisible()` passes on a buried screen, so `waitFor` would not gate a pop.
 */
export async function waitForTopmostRoute(routeName: string): Promise<string> {
  const pattern = routeKeyPattern(routeName);
  let lastSeen = '<never read>';

  await waitUntil(
    async () => {
      lastSeen = await readTopmostRouteKey();
      return pattern.test(lastSeen);
    },
    {
      message: () =>
        `the topmost route to be "${routeName}"; topmost key was "${lastSeen}"`,
    },
  );

  return lastSeen;
}

/**
 * Asserts `routeName` is still on top under `expectedKey` — nothing was pushed
 * or popped. A different key means the screen was replaced by another instance
 * of the same route.
 */
export async function expectStillOnRoute(
  routeName: string,
  expectedKey: string,
): Promise<void> {
  jestExpect(await waitForTopmostRoute(routeName)).toBe(expectedKey);
}
