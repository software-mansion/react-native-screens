import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { NativeMatcher } from 'detox/detox';
import {
  describeIfAndroid,
  dismissToast,
  getMatches,
  getTopmostMatch,
  selectSingleFeatureTestsScreen,
  tapTopmost,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
} from '../../native-class-names';

/**
 * Stack v5 `preventNativeDismiss` — single stack.
 *
 * Android only: `preventNativeDismiss` is not implemented for stack v5 on iOS
 * (`ios/stack/` has no handling for it; only the Android side does), so there
 * is nothing to assert there.
 *
 * This suite covers the interception itself — the native header back button is
 * swallowed, the `onNativeDismissPrevented` toast fires, and the stack stays
 * put. What it cannot cover is the *Disabled* half (scenario steps 7, 8, 10):
 * this screen is opened through the example app's own navigation rather than
 * launched directly via `App.tsx`, and a back press that the screen does not
 * intercept escapes to the outer navigator instead of popping the gamma
 * `StackContainer` — see issue #1459. Those steps would navigate out of the
 * test screen and wreck the suite, so they stay manual (the scenario documents
 * the direct-launch procedure for them).
 *
 * Interception is unaffected by #1459: `StackScreenFragment` registers its
 * `PreventNativeDismissCallback` on the activity's `OnBackPressedDispatcher`
 * after the outer navigator registered its own, and the dispatcher invokes
 * enabled callbacks in reverse registration order — so while the flag is on,
 * the top v5 screen gets the back press first.
 */

// The toast renders as `${index + 1}. ${message}`, so its label carries the
// 1-based position of the toast in the (bottom-anchored) stack.
const TOAST_MESSAGE = 'Native dismiss prevented';
const toastLabel = (position: number) => `${position}. ${TOAST_MESSAGE}`;

describeIfAndroid('Stack v5: prevent native dismiss - single stack', () => {
  // React Native's core `<Button>` uppercases its `title` on Android
  // (`title.toUpperCase()`), so buttons are matched by their rendered text.
  const PUSH_A = 'PUSH A';
  const PUSH_B = 'PUSH B';
  const POP = 'POP';
  const TOGGLE = 'TOGGLE PREVENT NATIVE DISMISS';

  // Scoped to the toolbar the Stack v5 (gamma) header builds — the legacy v4
  // header used by the example app's own navigation is a `CustomToolbar`, which
  // extends `Toolbar` but not `MaterialToolbar`, so it is not matched here.
  const backButtonMatcher = by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
    .withAncestor(by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR));

  /**
   * Covered screens stay attached on Android, so a matcher can resolve to one
   * element per stacked screen and has to be normalized to the topmost match.
   */
  async function readTopmostText(testID: string): Promise<string> {
    const top = await getTopmostMatch(by.id(testID));
    return (top.text ?? top.label ?? '').trim();
  }

  const readRouteKey = () => readTopmostText('stack-route-key');
  const readPreventInfo = () => readTopmostText('prevent-native-dismiss-info');

  type RouteName = 'Home' | 'A' | 'B';

  /**
   * Matches the rendered `stack-route-key` label of any screen whose route is
   * `routeName`. Keys are minted as `r-<routeName>-<id>` with a monotonically
   * increasing id (`generateRouteKeyForRouteName` in the stack reducer), so the
   * pattern pins the route while staying agnostic about which instance of it is
   * on top.
   */
  const routeKeyPattern = (routeName: RouteName) =>
    new RegExp(`^Key: r-${routeName}-\\d+$`);

  /** Taps a Push/Pop/Toggle button on the topmost stacked screen. */
  async function tapTopmostButton(title: string): Promise<void> {
    await tapTopmost(by.text(title));
  }

  /**
   * Asserts `matcher` resolves on the topmost stacked screen. Every stacked
   * screen renders the same button labels, so a bare `toBeVisible()` throws
   * "matches N views" once more than one is attached — the check is scoped to
   * the last match, as `tapTopmost` does for taps.
   *
   * Only for elements expected to be present: `getMatches` throws when nothing
   * matches at all. Use `not.toExist()` for absence.
   */
  async function expectTopmostVisible(matcher: NativeMatcher): Promise<void> {
    const count = (await getMatches(matcher)).length;
    await expect(element(matcher).atIndex(count - 1)).toBeVisible();
  }

  /** Asserts the Push/Pop/Toggle buttons present on the topmost screen. */
  async function expectTopmostButtons(titles: string[]): Promise<void> {
    for (const title of titles) {
      await expectTopmostVisible(by.text(title));
    }
  }

  /**
   * Waits until the topmost stacked screen is `routeName`, and returns its route
   * key. Matching the key by regex rather than the exact `Name: X` label means a
   * single read identifies both the route and *which* instance of it is on top,
   * so callers can assert continuity (same key) or a push (new key) without a
   * second, separately-racing read.
   *
   * The pattern is applied to a polled `getTopmostMatch` read rather than handed
   * to Detox as `by.text(routeKeyPattern(...))`. Covered screens stay attached on
   * Android and Detox's visibility matcher only intersects a view with its
   * *parents* (`IsDisplayingAtLeastDetoxMatcher`) — it has no notion of occlusion
   * by a sibling — so `waitFor(...).toBeVisible()` on a screen sitting underneath
   * the top one passes immediately and would not gate a pop at all. The iOS half
   * of `test-stack-simple-nav` can hand the regex to Detox because iOS detaches
   * covered screens; here the regex has to be evaluated against the topmost
   * match.
   */
  async function waitForTopmostRoute(
    routeName: RouteName,
    timeout = 3000,
    interval = 100,
  ): Promise<string> {
    const pattern = routeKeyPattern(routeName);
    const deadline = Date.now() + timeout;
    let lastSeen = '<never read>';
    while (Date.now() <= deadline) {
      lastSeen = await readRouteKey();
      if (pattern.test(lastSeen)) {
        return lastSeen;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error(
      `waitForTopmostRoute timed out waiting for topmost route to be ` +
        `"${routeName}"; topmost key was "${lastSeen}"`,
    );
  }

  /**
   * Asserts the app is still on B with its original key — i.e. the back press
   * was swallowed rather than popping the stack.
   */
  async function expectStillOnB(expectedKey: string): Promise<void> {
    jestExpect(await waitForTopmostRoute('B')).toBe(expectedKey);
  }

  /**
   * Dismisses `count` toasts newest-first. The toast label carries the 1-based
   * position in the list, and removal is by id, so clearing from the highest
   * position down keeps the remaining labels stable.
   */
  async function dismissToasts(count: number): Promise<void> {
    for (let position = count; position >= 1; position--) {
      await dismissToast(toastLabel(position));
    }
  }

  /**
   * Asserts that no `onNativeDismissPrevented` toast is on screen. Every step
   * that dismisses its toasts leaves the list empty, so checking position 1 is
   * enough — a toast that fired unexpectedly always lands there.
   */
  async function expectNoToast(): Promise<void> {
    await expect(element(by.label(toastLabel(1)))).not.toExist();
  }

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-prevent-native-dismiss-single-stack',
    );
  });

  // Captured as the suite progresses, so later steps can assert that a
  // preserved screen keeps its key and every push produces a strictly new one.
  let homeKey = '';
  let aKey = '';
  let bKey = '';

  it('should show Home as the root screen with no back or Pop button', async () => {
    homeKey = await waitForTopmostRoute('Home');
    await expectTopmostButtons([PUSH_A, PUSH_B]);
    await expect(element(by.text(POP))).not.toExist();
    await expect(element(backButtonMatcher)).not.toExist();
  });

  it('should push A with prevent native dismiss disabled', async () => {
    await tapTopmostButton(PUSH_A);

    aKey = await waitForTopmostRoute('A');
    jestExpect(aKey).not.toBe(homeKey);
    jestExpect(await readPreventInfo()).toBe(
      'Prevent native dismiss: Disabled',
    );
    await expectTopmostVisible(backButtonMatcher);
    await expectTopmostButtons([PUSH_A, PUSH_B, POP]);
  });

  it('should push B with prevent native dismiss enabled', async () => {
    await tapTopmostButton(PUSH_B);

    bKey = await waitForTopmostRoute('B');
    jestExpect(bKey).not.toBe(aKey);
    jestExpect(bKey).not.toBe(homeKey);
    jestExpect(await readPreventInfo()).toBe('Prevent native dismiss: Enabled');
    await expectTopmostVisible(backButtonMatcher);
    await expectTopmostButtons([PUSH_A, PUSH_B, POP, TOGGLE]);
  });

  it('should intercept the native header back button while prevent is enabled', async () => {
    await tapTopmost(backButtonMatcher);

    // Asserts the toast fired, then clears it so the next step starts from an
    // empty toast list.
    await dismissToasts(1);
    await expectStillOnB(bKey);
  });

  it('should intercept every back press individually while prevent is enabled', async () => {
    await tapTopmost(backButtonMatcher);
    await tapTopmost(backButtonMatcher);
    await tapTopmost(backButtonMatcher);

    // A new toast per press — three presses, three toasts, and B never popped.
    await dismissToasts(3);
    await expectStillOnB(bKey);
  });

  it('should flip the label when toggling prevent native dismiss at runtime', async () => {
    const currentBKey = await waitForTopmostRoute('B');

    // Off, then straight back on — the press must see the latest value.
    await tapTopmostButton(TOGGLE);
    jestExpect(await readPreventInfo()).toBe(
      'Prevent native dismiss: Disabled',
    );
    await tapTopmostButton(TOGGLE);
    jestExpect(await readPreventInfo()).toBe('Prevent native dismiss: Enabled');

    await tapTopmost(backButtonMatcher);

    await dismissToasts(1);
    await expectStillOnB(currentBKey);
  });

  it('should pop with the on-screen Pop button even while prevent is enabled', async () => {
    jestExpect(await readPreventInfo()).toBe('Prevent native dismiss: Enabled');

    await tapTopmostButton(POP);

    jestExpect(await waitForTopmostRoute('A')).toBe(aKey);
    await expectNoToast();
    await tapTopmostButton(POP);

    jestExpect(await waitForTopmostRoute('Home')).toBe(homeKey);
    await expectNoToast();
  });
});
