import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import { IosElementAttributes, AndroidElementAttributes } from 'detox/detox';
import {
  describeIfAndroid,
  describeIfiOS,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import { tapBarBackButton } from '../../elements/back-button';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_IMAGE_VIEW,
} from '../../native-class-names';

/**
 * Stack v5 simple navigation.
 *
 * The two platforms are verified with different mechanisms and different
 * scopes, so each keeps its own suite below:
 *
 * - iOS: react-native-screens detaches covered screens, so every matcher
 *   resolves unambiguously to the top screen. The full scenario is covered,
 *   including the native header back button and the edge (gesture) back swipe  *   except rapid tapping.
 *
 * - Android: covered screens stay attached, so a matcher can resolve to one
 *   element per stacked screen and must be normalized to the topmost match.
 *   In addition, this screen is opened through the example app's own
 *   navigation (not launched directly via `App.tsx`), so the native header
 *   back button and the system gesture-back do not pop the nested gamma
 *   `StackContainer` — see issue #1459. The Android suite therefore covers
 *   only navigation driven by the on-screen Push/Pop buttons; native-back and
 *   gesture-back are verified on iOS and manually on Android via the direct
 *   launch documented in the scenario.
 */

type AnyAttributes = IosElementAttributes | AndroidElementAttributes;

describeIfiOS('Stack v5: simple navigation', () => {
  /**
   * Reads the currently-visible route's `Key` label. Because
   * react-native-screens detaches covered screens, only the top screen's
   * `stack-route-key` element is in the hierarchy, so this resolves
   * unambiguously to the current screen.
   */
  async function readRouteKey(): Promise<string> {
    const attrs = (await element(
      by.id('stack-route-key'),
    ).getAttributes()) as AnyAttributes;
    const value =
      (attrs as { text?: string }).text ??
      (attrs as { label?: string }).label ??
      '';
    return value.trim();
  }

  async function waitForRoute(routeName: 'Home' | 'A' | 'B'): Promise<void> {
    await waitFor(element(by.text(`Name: ${routeName}`)))
      .toBeVisible()
      .withTimeout(3000);
  }

  /**
   * Waits until the topmost route's `Key` differs from `previousKey`. Every push
   * mints a new key and every pop reveals a screen with a different key, so this
   * gates a transition between two same-named screens (e.g. A → A), which
   * `waitForRoute` cannot detect because the route name is unchanged. The
   * empty-string guard skips the brief window mid-transition where two
   * `stack-route-key` elements coexist and the read is ambiguous.
   */
  async function waitForKeyChange(previousKey: string): Promise<void> {
    const deadline = Date.now() + 3000;
    while (Date.now() <= deadline) {
      const key = await readRouteKey();
      if (key !== '' && key !== previousKey) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(
      `waitForKeyChange timed out; topmost key is still "${previousKey}"`,
    );
  }

  const backButtonIcon = element(
    by
      .id('chevron.backward')
      .and(by.type(CLASS_NAME_UI_IMAGE_VIEW))
      .withAncestor(by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON)),
  );

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Stackv5', 'test-stack-simple-nav');
  });

  // Keys captured as the suite progresses, so later steps can assert that a
  // preserved screen keeps its key and every push produces a strictly new one.
  let homeKey = '';
  let firstAKey = '';
  let firstBKey = '';

  it('should show Home as the root screen with no back or Pop button', async () => {
    await waitForRoute('Home');
    homeKey = await readRouteKey();
    await expect(element(by.text('Push A'))).toBeVisible();
    await expect(element(by.text('Push B'))).toBeVisible();
    await expect(element(by.text('Pop'))).not.toExist();
    await expect(backButtonIcon).not.toExist();
  });

  it('should push A with a new key and reveal Pop + back button', async () => {
    await element(by.text('Push A')).tap();
    await waitForRoute('A');
    firstAKey = await readRouteKey();
    jestExpect(firstAKey).not.toBe(homeKey);
    await expect(element(by.text('Pop'))).toBeVisible();
    await expect(backButtonIcon).toBeVisible();
  });

  it('should push B on top of A with a new key', async () => {
    await element(by.text('Push B')).tap();
    await waitForRoute('B');
    firstBKey = await readRouteKey();
    jestExpect(firstBKey).not.toBe(firstAKey);
    jestExpect(firstBKey).not.toBe(homeKey);
    await expect(backButtonIcon).toBeVisible();
  });

  it('should push a second A instance with a key distinct from the first A', async () => {
    await element(by.text('Push A')).tap();
    await waitForRoute('A');
    const secondAKey = await readRouteKey();
    jestExpect(secondAKey).not.toBe(firstAKey);
  });

  it('should pop back to B keeping its original key', async () => {
    await element(by.text('Pop')).tap();
    await waitForRoute('B');
    jestExpect(await readRouteKey()).toBe(firstBKey);
  });

  it('should pop back to A keeping its original key', async () => {
    await element(by.text('Pop')).tap();
    await waitForRoute('A');
    jestExpect(await readRouteKey()).toBe(firstAKey);
  });

  it('should pop back to Home with no Pop or back button', async () => {
    await element(by.text('Pop')).tap();
    await waitForRoute('Home');
    jestExpect(await readRouteKey()).toBe(homeKey);
    await expect(element(by.text('Pop'))).not.toExist();
    await expect(backButtonIcon).not.toExist();
  });

  it('should navigate to Home with egde swipe', async () => {
    await element(by.text('Push A')).tap();
    await waitForRoute('A');
    firstAKey = await readRouteKey();
    await element(by.text('Push B')).tap();
    await waitForRoute('B');
    await element(by.id('screenB-layout-view')).swipe('right');
    jestExpect(await readRouteKey()).toBe(firstAKey);
  });

  it('should assign a distinct key to every pushed A instance', async () => {
    await waitForRoute('A');
    const a1 = await readRouteKey();

    await element(by.text('Push A')).tap();
    await waitForKeyChange(a1);
    const a2 = await readRouteKey();

    await element(by.text('Push A')).tap();
    await waitForKeyChange(a2);
    const a3 = await readRouteKey();

    jestExpect(new Set([a1, a2, a3]).size).toBe(3);

    // Unwind back to Home for a clean state. Each pop changes the topmost key.
    let top = a3;
    await element(by.text('Pop')).tap();
    await waitForKeyChange(top);
    top = await readRouteKey();
    await element(by.text('Pop')).tap();
    await waitForKeyChange(top);
    await element(by.text('Pop')).tap();
    await waitForRoute('Home');
  });

  it('should pop via the native back button like the Pop button', async () => {
    await waitForRoute('Home');

    await element(by.text('Push A')).tap();
    await waitForRoute('A');
    const aKey = await readRouteKey();

    await element(by.text('Push B')).tap();
    await waitForRoute('B');

    await tapBarBackButton();
    await waitForRoute('A');
    jestExpect(await readRouteKey()).toBe(aKey);
  });
});

describeIfAndroid('Stack v5: simple navigation', () => {
  // React Native's core `<Button>` uppercases its `title` on Android
  // (`title.toUpperCase()`), so buttons are matched by their rendered text.
  const PUSH_A = 'PUSH A';
  const PUSH_B = 'PUSH B';
  const POP = 'POP';

  /**
   * Returns every element matching `matcher`. Unlike iOS, react-native-screens
   * keeps covered screens attached on Android, so a matcher can resolve to one
   * element per stacked screen. When more than one matches, `getAttributes()`
   * returns a `{ elements: [...] }` wrapper instead of a flat attributes
   * object; this normalizes both cases to an array ordered so the topmost
   * stacked screen is last.
   */
  async function getMatches(
    matcher: Detox.NativeMatcher,
  ): Promise<AnyAttributes[]> {
    const attrs = await element(matcher).getAttributes();
    return 'elements' in attrs ? (attrs.elements as AnyAttributes[]) : [attrs];
  }

  /** Reads the `Key`/`Name` label text from the topmost stacked screen. */
  async function readTopmostText(testID: string): Promise<string> {
    const matches = await getMatches(by.id(testID));
    const top = matches[matches.length - 1];
    return (
      (top as { text?: string }).text ??
      (top as { label?: string }).label ??
      ''
    ).trim();
  }

  /** Reads the topmost route's unique `routeKey`. */
  async function readRouteKey(): Promise<string> {
    return readTopmostText('stack-route-key');
  }

  /** Taps a Push/Pop button on the topmost stacked screen (the last match). */
  async function tapTopmostButton(title: string): Promise<void> {
    const matcher = by.text(title);
    const count = (await getMatches(matcher)).length;
    await element(matcher)
      .atIndex(count - 1)
      .tap();
  }

  /**
   * Waits until the topmost stacked screen is `routeName`. A plain
   * `by.text('Name: X')` matcher can resolve to several elements (e.g. two
   * stacked `A` screens), which makes `toBeVisible()` throw "matches N views",
   * so we poll the topmost `stack-route-name` label instead.
   */
  async function waitForRoute(
    routeName: 'Home' | 'A' | 'B',
    timeout = 3000,
    interval = 100,
  ): Promise<void> {
    const expected = `Name: ${routeName}`;
    const deadline = Date.now() + timeout;
    while (Date.now() <= deadline) {
      if ((await readTopmostText('stack-route-name')) === expected) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error(
      `waitForRoute timed out waiting for topmost route to be "${routeName}"`,
    );
  }

  /**
   * Waits until the topmost route's `Key` differs from `previousKey`. Every push
   * mints a new key and every pop reveals a screen with a different key, so this
   * gates a transition between two same-named screens (e.g. A → A), which
   * `waitForRoute` cannot detect because the route name is unchanged.
   */
  async function waitForKeyChange(previousKey: string): Promise<void> {
    const deadline = Date.now() + 3000;
    while (Date.now() <= deadline) {
      const key = await readRouteKey();
      if (key !== '' && key !== previousKey) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(
      `waitForKeyChange timed out; topmost key is still "${previousKey}"`,
    );
  }

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Stackv5', 'test-stack-simple-nav');
  });

  // Keys captured as the suite progresses, so later steps can assert that a
  // preserved screen keeps its key and every push produces a strictly new one.
  let homeKey = '';
  let firstAKey = '';
  let firstBKey = '';

  it('should show Home as the root screen with no Pop button', async () => {
    await waitForRoute('Home');
    homeKey = await readRouteKey();
    await expect(element(by.text(PUSH_A))).toBeVisible();
    await expect(element(by.text(PUSH_B))).toBeVisible();
    await expect(element(by.text(POP))).not.toExist();
  });

  it('should push A with a new key and reveal the Pop button', async () => {
    await tapTopmostButton(PUSH_A);
    await waitForRoute('A');
    firstAKey = await readRouteKey();
    jestExpect(firstAKey).not.toBe(homeKey);
    await expect(element(by.text(POP))).toBeVisible();
  });

  it('should push B on top of A with a new key', async () => {
    await tapTopmostButton(PUSH_B);
    await waitForRoute('B');
    firstBKey = await readRouteKey();
    jestExpect(firstBKey).not.toBe(firstAKey);
    jestExpect(firstBKey).not.toBe(homeKey);
  });

  it('should push a second A instance with a key distinct from the first A', async () => {
    await tapTopmostButton(PUSH_A);
    await waitForRoute('A');
    const secondAKey = await readRouteKey();
    jestExpect(secondAKey).not.toBe(firstAKey);
  });

  it('should pop back to B keeping its original key', async () => {
    await tapTopmostButton(POP);
    await waitForRoute('B');
    jestExpect(await readRouteKey()).toBe(firstBKey);
  });

  it('should pop back to A keeping its original key', async () => {
    await tapTopmostButton(POP);
    await waitForRoute('A');
    jestExpect(await readRouteKey()).toBe(firstAKey);
  });

  it('should pop back to Home with no Pop button', async () => {
    await tapTopmostButton(POP);
    await waitForRoute('Home');
    jestExpect(await readRouteKey()).toBe(homeKey);
    await expect(element(by.text(POP))).not.toExist();
  });

  it('should assign a distinct key to every pushed A instance', async () => {
    await tapTopmostButton(PUSH_A);
    await waitForRoute('A');
    const a1 = await readRouteKey();

    await tapTopmostButton(PUSH_A);
    await waitForKeyChange(a1);
    const a2 = await readRouteKey();

    await tapTopmostButton(PUSH_A);
    await waitForKeyChange(a2);
    const a3 = await readRouteKey();

    jestExpect(new Set([a1, a2, a3]).size).toBe(3);

    // Unwind back to Home for a clean state. Each pop changes the topmost key.
    let top = a3;
    await tapTopmostButton(POP);
    await waitForKeyChange(top);
    top = await readRouteKey();
    await tapTopmostButton(POP);
    await waitForKeyChange(top);
    await tapTopmostButton(POP);
    await waitForRoute('Home');
  });
});
