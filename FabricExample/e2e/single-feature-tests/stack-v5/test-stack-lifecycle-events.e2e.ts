import { device, element, by, waitFor } from 'detox';
import { IosElementAttributes, AndroidElementAttributes } from 'detox/detox';
import {
  describeIfAndroid,
  describeIfiOS,
  selectSingleFeatureTestsScreen,
  dismissToast,
} from '../../e2e-utils';
import { tapBarBackButton } from '../../elements/back-button';

/**
 * Stack v5 lifecycle events.
 *
 * Verifies that `onWillAppear`, `onDidAppear`, `onWillDisappear`, and
 * `onDidDisappear` fire in the correct order on stack navigation. Each event
 * pushes a toast labelled `<n>. <ScreenName>: <event>`, where `<n>` is the
 * toast's 1-based position in the currently-visible stack of toasts. Every
 * step dismisses all of its toasts (tapping removes them), so the next
 * transition's batch renumbers from `1.` again. Toasts are dismissed
 * highest-number-first so the remaining lower indices stay stable.
 *
 * The two platforms fire a fundamentally different event set and are verified
 * with different mechanisms, so each keeps its own suite:
 *
 * - iOS: react-native-screens detaches covered screens, so every matcher
 *   resolves unambiguously to the top screen. Both screens fire on a
 *   transition (the leaving screen's disappear brackets the entering screen's
 *   appear). Covers the on-screen Pop button and the native header back button.
 * - Android: covered screens stay attached, so a matcher can resolve to one
 *   element per stacked screen and button taps must be normalized to the
 *   topmost match. Only the screen entering or leaving the stack fires. In
 *   addition, this screen is opened through the example app's own navigation
 *   (not launched directly via `App.tsx`), so the native header back button and
 *   the system gesture-back do not pop the nested `StackContainer` — see issue
 *   #1459. The Android suite therefore covers only navigation driven by the
 *   on-screen Push/Pop buttons; native-back and gesture-back are verified on
 *   iOS and manually on Android via the direct launch documented in the
 *   scenario.
 */

type AnyAttributes = IosElementAttributes | AndroidElementAttributes;

async function waitForRoute(routeName: string): Promise<void> {
  await waitFor(element(by.text(`Name: ${routeName}`)))
    .toBeVisible()
    .withTimeout(3000);
}

describeIfiOS('Stack v5: lifecycle events', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-lifecycle-events',
    );
  });

  it('should show Home and fire onWillAppear + onDidAppear on launch', async () => {
    await waitForRoute('Home');
    await dismissToast('2. Home: onDidAppear');
    await dismissToast('1. Home: onWillAppear');
  });

  it('should fire the push event set when pushing A over Home', async () => {
    await element(by.text('Push A')).tap();

    await waitForRoute('A');
    await dismissToast('4. A: onDidAppear');
    await dismissToast('3. Home: onDidDisappear');
    await dismissToast('2. A: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');
  });

  it('should fire the pop event set when popping A via the native header back button', async () => {
    await tapBarBackButton();

    await waitForRoute('Home');
    await dismissToast('4. Home: onDidAppear');
    await dismissToast('3. A: onDidDisappear');
    await dismissToast('2. Home: onWillAppear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire the identical pop event set when popping A via native back gesture', async () => {
    await element(by.text('Push A')).tap();
    await waitForRoute('A');
    await dismissToast('4. A: onDidAppear');
    await dismissToast('3. Home: onDidDisappear');
    await dismissToast('2. A: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.id('screenA-layout-view')).swipe('right');

    await waitForRoute('Home');
    await dismissToast('4. Home: onDidAppear');
    await dismissToast('3. A: onDidDisappear');
    await dismissToast('2. Home: onWillAppear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire the identical pop event set when popping A via the Pop button', async () => {
    await element(by.text('Push A')).tap();
    await waitForRoute('A');
    await dismissToast('4. A: onDidAppear');
    await dismissToast('3. Home: onDidDisappear');
    await dismissToast('2. A: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.text('Pop')).tap();

    await waitForRoute('Home');
    await dismissToast('4. Home: onDidAppear');
    await dismissToast('3. A: onDidDisappear');
    await dismissToast('2. Home: onWillAppear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire the duplicated container + initial-screen push event set when pushing NestedStack', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRoute('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');
  });

  it('should fire the inner push event set when pushing NestedA inside the nested stack', async () => {
    await element(by.text('Push NestedA')).tap();

    await waitForRoute('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');
  });

  it('should fire the inner pop event set when popping NestedA via the inner NestedA header back button', async () => {
    await element(
      by.type('_UIButtonBarButton').withAncestor(by.id('NestedA')),
    ).tap();

    await waitForRoute('NestedHome');
    await dismissToast('4. NestedHome: onDidAppear');
    await dismissToast('3. NestedA: onDidDisappear');
    await dismissToast('2. NestedHome: onWillAppear');
    await dismissToast('1. NestedA: onWillDisappear');
  });

  it('should fire the identical inner pop event set when popping NestedA via native back gesture', async () => {
    await element(by.text('Push NestedA')).tap();
    await waitForRoute('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');

    await element(by.id('nested-screenA-layout-view')).swipe('right');

    await waitForRoute('NestedHome');
    await dismissToast('4. NestedHome: onDidAppear');
    await dismissToast('3. NestedA: onDidDisappear');
    await dismissToast('2. NestedHome: onWillAppear');
    await dismissToast('1. NestedA: onWillDisappear');
  });

  it('should fire the identical inner pop event set when popping NestedA via the Pop button', async () => {
    await element(by.text('Push NestedA')).tap();
    await waitForRoute('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');

    await element(by.text('Pop')).tap();

    await waitForRoute('NestedHome');
    await dismissToast('4. NestedHome: onDidAppear');
    await dismissToast('3. NestedA: onDidDisappear');
    await dismissToast('2. NestedHome: onWillAppear');
    await dismissToast('1. NestedA: onWillDisappear');
  });

  it('should pop the whole NestedStack container from NestedHome to Home via native back gesture', async () => {
    // NestedHome is the nested stack's only (root) screen, so dismissing it
    // bubbles up to pop the whole NestedStack container rather than a screen
    // within it. The native gesture, the native header back button, and the Pop
    // button (the following tests) must all produce this identical container-pop
    // event set — see issue #1459 and the E2E section in scenario.md.
    await element(by.id('nested-home-screen-layout-view')).swipe('right');

    await waitForRoute('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. NestedHome: onDidDisappear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. NestedHome: onWillDisappear');
    await dismissToast('1. NestedStack: onWillDisappear');
  });

  it('should fire the identical container-pop event set when popping the container from NestedHome via the NestedStack header back button', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRoute('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await tapBarBackButton();

    await waitForRoute('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. NestedHome: onDidDisappear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. NestedHome: onWillDisappear');
    await dismissToast('1. NestedStack: onWillDisappear');
  });

  it('should fire the identical container-pop event set when the Pop button on the nested root bubbles to a container pop', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRoute('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.text('Pop')).tap();

    await waitForRoute('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. NestedHome: onDidDisappear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. NestedHome: onWillDisappear');
    await dismissToast('1. NestedStack: onWillDisappear');
  });

  it('should pop the whole NestedStack container from NestedA to Home in one step via the outer NestedStack header back button (skipping NestedHome)', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRoute('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.text('Push NestedA')).tap();
    await waitForRoute('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');

    await element(
      by.type('_UIButtonBarButton').withAncestor(by.id('NestedStack')),
    ).tap();

    await waitForRoute('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. NestedA: onDidDisappear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. NestedA: onWillDisappear');
    await dismissToast('1. NestedStack: onWillDisappear');
  });
});

describeIfAndroid('Stack v5: lifecycle events', () => {
  // React Native's core `<Button>` uppercases its `title` on Android
  // (`title.toUpperCase()`), so buttons are matched by their rendered text.
  const PUSH_A = 'PUSH A';
  const PUSH_NESTED_STACK = 'PUSH NESTEDSTACK';
  const PUSH_NESTED_A = 'PUSH NESTEDA';
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

  /** Taps a Push/Pop button on the topmost stacked screen (the last match). */
  async function tapTopmostButton(title: string): Promise<void> {
    const matcher = by.text(title);
    const count = (await getMatches(matcher)).length;
    await element(matcher)
      .atIndex(count - 1)
      .tap();
  }

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-lifecycle-events',
    );
  });

  it('should show Home and fire onWillAppear + onDidAppear on launch', async () => {
    await waitForRoute('Home');
    await dismissToast('2. Home: onDidAppear');
    await dismissToast('1. Home: onWillAppear');
  });

  it('should fire the push events (onWillAppear + onDidAppear) for A only when pushing A over Home', async () => {
    await tapTopmostButton(PUSH_A);

    await waitForRoute('A');
    await dismissToast('2. A: onDidAppear');
    await dismissToast('1. A: onWillAppear');
  });

  it('should fire the pop events (onWillDisappear + onDidDisappear) for A only when popping A via the Pop button', async () => {
    await tapTopmostButton(POP);

    await waitForRoute('Home');
    await dismissToast('2. A: onDidDisappear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire duplicated push events (onWillAppear + onDidAppear) for both the NestedStack container and its initial NestedHome screen when pushing NestedStack', async () => {
    await tapTopmostButton(PUSH_NESTED_STACK);

    await waitForRoute('NestedHome');
    await dismissToast('4. NestedHome: onDidAppear');
    await dismissToast('3. NestedStack: onDidAppear');
    await dismissToast('2. NestedHome: onWillAppear');
    await dismissToast('1. NestedStack: onWillAppear');
  });

  it('should fire the push events (onWillAppear + onDidAppear) for the inner NestedA screen only when pushing NestedA inside the nested stack', async () => {
    await tapTopmostButton(PUSH_NESTED_A);

    await waitForRoute('NestedA');
    await dismissToast('2. NestedA: onDidAppear');
    await dismissToast('1. NestedA: onWillAppear');
  });

  it('should fire the pop events (onWillDisappear + onDidDisappear) for the inner NestedA screen only when popping NestedA via the Pop button', async () => {
    await tapTopmostButton(POP);

    await waitForRoute('NestedHome');
    await dismissToast('2. NestedA: onDidDisappear');
    await dismissToast('1. NestedA: onWillDisappear');
  });

  it('should fire duplicated pop events (onWillDisappear + onDidDisappear) for both the NestedHome screen and the NestedStack container when the Pop button on the nested root bubbles to a container pop', async () => {
    // NestedHome is the nested stack's only (root) screen, so calling pop()
    // here bubbles up to pop the whole NestedStack container instead of a
    // screen within it.
    await tapTopmostButton(POP);

    await waitForRoute('Home');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedStack: onWillDisappear');
    await dismissToast('1. NestedHome: onWillDisappear');
  });
});
