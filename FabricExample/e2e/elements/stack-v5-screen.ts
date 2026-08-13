import { by } from 'detox';
import {
  expectTopmostVisible,
  getTopmostMatch,
  tapTopmost,
  waitUntil,
} from '../e2e-utils';

/**
 * Widgets the Stack v5 test screens render into their body, from the shared
 * components under `apps/src/tests/shared/components/stack-v5/`.
 *
 * Covered screens stay attached on Android, so each of these matchers resolves
 * to one element per stacked screen — nested screens included, as they are
 * descendants of the outer stack's topmost screen. Every read is therefore
 * normalized to the last match, which is the topmost screen of the innermost
 * stack.
 */

/** @see apps/src/tests/shared/components/stack-v5/StackRouteInformation.tsx */
const ROUTE_KEY_TEST_ID = 'stack-route-key';

/** Rendered by the `preventNativeDismiss` test screens' own info label. */
const PREVENT_NATIVE_DISMISS_TEST_ID = 'prevent-native-dismiss-info';

export const PREVENT_NATIVE_DISMISS_ENABLED = 'Prevent native dismiss: Enabled';
export const PREVENT_NATIVE_DISMISS_DISABLED =
  'Prevent native dismiss: Disabled';

/**
 * React Native's core `<Button>` uppercases its `title` on Android
 * (`title.toUpperCase()`), so its buttons are matched by their rendered text.
 */
const buttonLabel = (title: string) => title.toUpperCase();

/** @see apps/src/tests/shared/components/stack-v5/StackNavigationButtons.tsx */
export const pushButtonLabel = (routeName: string) =>
  buttonLabel(`Push ${routeName}`);

export const POP_BUTTON_LABEL = buttonLabel('Pop');

/** Rendered by the `preventNativeDismiss` test screens. */
export const TOGGLE_PREVENT_NATIVE_DISMISS_LABEL = buttonLabel(
  'Toggle Prevent Native Dismiss',
);

async function readTopmostText(testID: string): Promise<string> {
  const top = await getTopmostMatch(by.id(testID));
  return (top.text ?? top.label ?? '').trim();
}

/** The `Key: ...` label of the topmost screen. */
export const readTopmostRouteKey = () => readTopmostText(ROUTE_KEY_TEST_ID);

/** The `Prevent native dismiss: ...` label of the topmost screen. */
export const readTopmostPreventNativeDismissInfo = () =>
  readTopmostText(PREVENT_NATIVE_DISMISS_TEST_ID);

/**
 * Matches the route key label of any screen on `routeName`. Keys are minted as
 * `r-<routeName>-<id>` with an increasing id (`generateRouteKeyForRouteName`),
 * so this pins the route, not the instance.
 */
export const routeKeyPattern = (routeName: string) =>
  new RegExp(`^Key: r-${routeName}-\\d+$`);

type WaitOptions = {
  timeout?: number;
  interval?: number;
};

/**
 * Waits until the topmost screen is `routeName` and returns its route key.
 * Reading the key rather than the `Name: X` label identifies the route *and*
 * which instance is on top, so one read settles continuity (same key) or a
 * push (new key).
 *
 * Polled against the key label rather than `waitFor(...)`: covered screens stay
 * attached, and Detox intersects a view only with its parents, never with an
 * occluding sibling — so `toBeVisible()` on a buried screen passes at once and
 * would not gate a pop.
 */
export async function waitForTopmostRoute(
  routeName: string,
  options: WaitOptions = {},
): Promise<string> {
  const pattern = routeKeyPattern(routeName);
  let lastSeen = '<never read>';

  await waitUntil(
    async () => {
      lastSeen = await readTopmostRouteKey();
      return pattern.test(lastSeen);
    },
    {
      ...options,
      message: () =>
        `the topmost route to be "${routeName}"; topmost key was "${lastSeen}"`,
    },
  );

  return lastSeen;
}

/** Taps a Push/Pop/Toggle button on the topmost stacked screen. */
export async function tapTopmostStackButton(label: string): Promise<void> {
  await tapTopmost(by.text(label));
}

/** Asserts the Push/Pop/Toggle buttons present on the topmost screen. */
export async function expectTopmostStackButtons(
  labels: string[],
): Promise<void> {
  for (const label of labels) {
    await expectTopmostVisible(() => by.text(label));
  }
}
