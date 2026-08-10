import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  dismissToast,
  getTopmostMatch,
  selectSingleFeatureTestsScreen,
  tapTopmost,
  waitForTopmostVisible,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
} from '../../native-class-names';

/**
 * Stack v5 `preventNativeDismiss` — single stack. Android only; `ios/stack/`
 * has no handling for the prop, so there is nothing to assert there.
 *
 * Covers the interception itself — the header back button is swallowed, the
 * `onNativeDismissPrevented` toast fires, the stack stays put — plus the
 * runtime toggle and the JS-driven Pop. Two groups stay manual: the
 * gesture-back steps (5, 8), since Detox cannot drive the system edge swipe,
 * and the *Disabled* chevron steps (7, 10), which need the direct `App.tsx`
 * launch the scenario documents — reached through the example app's own
 * navigation, an unintercepted back press navigates out to the system menu
 * instead of popping the gamma `StackContainer`
 * (software-mansion/react-native-screens-labs#1459).
 *
 * Interception is unaffected by #1459: `StackScreenFragment` registers its
 * `PreventNativeDismissCallback` after the outer navigator's, and the
 * `OnBackPressedDispatcher` invokes enabled callbacks in reverse order.
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

  // Scoped to the toolbar the Stack v5 (gamma) header builds — the example
  // app's own v4 header is a `CustomToolbar`, which extends `Toolbar` but not
  // `MaterialToolbar`, so it is not matched here.
  const backButtonMatcher = by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
    .withAncestor(by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR));

  // Covered screens stay attached on Android, so a matcher resolves to one
  // element per stacked screen and has to be normalized to the topmost match.
  async function readTopmostText(testID: string): Promise<string> {
    const top = await getTopmostMatch(by.id(testID));
    return (top.text ?? top.label ?? '').trim();
  }

  const readRouteKey = () => readTopmostText('stack-route-key');
  const readPreventInfo = () => readTopmostText('prevent-native-dismiss-info');

  type RouteName = 'Home' | 'A' | 'B';

  /**
   * Matches the `stack-route-key` label of any screen on `routeName`. Keys are
   * minted as `r-<routeName>-<id>` with an increasing id
   * (`generateRouteKeyForRouteName`), so this pins the route while staying
   * agnostic about which instance of it is on top.
   */
  const routeKeyPattern = (routeName: RouteName) =>
    new RegExp(`^Key: r-${routeName}-\\d+$`);

  /** Taps a Push/Pop/Toggle button on the topmost stacked screen. */
  async function tapTopmostButton(title: string): Promise<void> {
    await tapTopmost(by.text(title));
  }

  /** Asserts the Push/Pop/Toggle buttons present on the topmost screen. */
  async function expectTopmostButtons(titles: string[]): Promise<void> {
    for (const title of titles) {
      await waitForTopmostVisible(by.text(title));
    }
  }

  /**
   * Waits until the topmost stacked screen is `routeName` and returns its route
   * key. Matching the key rather than the `Name: X` label lets one read identify
   * both the route and *which* instance is on top, so callers can assert
   * continuity (same key) or a push (new key) without a second racing read.
   *
   * The pattern is polled against `getTopmostMatch` rather than handed to Detox
   * as `by.text(...)`: covered screens stay attached on Android and Detox's
   * visibility matcher only intersects a view with its *parents*, never with an
   * occluding sibling — so `toBeVisible()` on a screen underneath the top one
   * passes immediately and would not gate a pop.
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

  /** Asserts B is still on top with its original key — the press was swallowed. */
  async function expectStillOnB(expectedKey: string): Promise<void> {
    jestExpect(await waitForTopmostRoute('B')).toBe(expectedKey);
  }

  /**
   * Dismisses `count` toasts newest-first. Labels carry the 1-based position,
   * so clearing from the highest down keeps the remaining ones stable.
   */
  async function dismissToasts(count: number): Promise<void> {
    for (let position = count; position >= 1; position--) {
      await dismissToast(toastLabel(position));
    }
  }

  /**
   * Asserts no `onNativeDismissPrevented` toast is on screen. Every step clears
   * its toasts, so position 1 is enough — an unexpected toast always lands there.
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
    await waitForTopmostVisible(backButtonMatcher);
    await expectTopmostButtons([PUSH_A, PUSH_B, POP]);
  });

  it('should push B with prevent native dismiss enabled', async () => {
    await tapTopmostButton(PUSH_B);

    bKey = await waitForTopmostRoute('B');
    jestExpect(bKey).not.toBe(aKey);
    jestExpect(bKey).not.toBe(homeKey);
    jestExpect(await readPreventInfo()).toBe('Prevent native dismiss: Enabled');
    await waitForTopmostVisible(backButtonMatcher);
    await expectTopmostButtons([PUSH_A, PUSH_B, POP, TOGGLE]);
  });

  it('should intercept the native header back button while prevent is enabled', async () => {
    await expectStillOnB(bKey);
    await tapTopmost(backButtonMatcher);

    // Asserts the toast fired, then clears it so the next step starts from an
    // empty toast list.
    await dismissToasts(1);
    await expectStillOnB(bKey);
  });

  it('should intercept every back press individually while prevent is enabled', async () => {
    await expectStillOnB(bKey);
    await tapTopmost(backButtonMatcher);
    await tapTopmost(backButtonMatcher);
    await tapTopmost(backButtonMatcher);

    // A new toast per press — three presses, three toasts, and B never popped.
    await dismissToasts(3);
    await expectStillOnB(bKey);
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

  it('should flip the label when toggling prevent native dismiss at runtime', async () => {
    await tapTopmostButton(PUSH_B);
    const currentBKey = await waitForTopmostRoute('B');
    jestExpect(await readPreventInfo()).toBe('Prevent native dismiss: Enabled');

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
});
