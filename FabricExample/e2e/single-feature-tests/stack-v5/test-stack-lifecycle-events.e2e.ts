import { device, element, by } from 'detox';
import { waitForRouteName } from '@e2e/app/stack-route';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { dismissToast, expectNoToast } from '@e2e/app/toast';
import { tapBarBackButton } from '@e2e/framework/back-button';
import { tapTopmostButton } from '@e2e/framework/gestures';
import { describeIfAndroid, describeIfIOS } from '@e2e/framework/platform';

/**
 * Stack v5 lifecycle events.
 *
 * Verifies that `onWillAppear`, `onDidAppear`, `onWillDisappear`, and
 * `onDidDisappear` fire for the expected screens on stack navigation. Each
 * event pushes a toast labelled `<n>. <ScreenName>: <event>`, where `<n>` is
 * the toast's 1-based position in the currently-visible stack of toasts.
 *
 * Event order is intentionally NOT asserted: it differs between iOS versions
 * (iOS 27 reorders the appear/disappear callbacks), so toasts are matched by
 * message only, ignoring the `<n>.` prefix. Every step dismisses all of its
 * toasts and then asserts none are left, so the full event set is still
 * verified — a missing event fails the dismiss, an extra one fails
 * `expectNoToast`.
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

describeIfIOS('Stack v5: lifecycle events', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-lifecycle-events',
    );
  });

  it('should show Home and fire onWillAppear + onDidAppear on launch', async () => {
    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('Home: onWillAppear');
    await expectNoToast();
  });

  it('should fire the push event set when pushing A over Home', async () => {
    await element(by.text('Push A')).tap();

    await waitForRouteName('A');
    await dismissToast('A: onDidAppear');
    await dismissToast('Home: onDidDisappear');
    await dismissToast('A: onWillAppear');
    await dismissToast('Home: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the pop event set when popping A via the native header back button', async () => {
    await tapBarBackButton();

    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('A: onDidDisappear');
    await dismissToast('Home: onWillAppear');
    await dismissToast('A: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the identical pop event set when popping A via native back gesture', async () => {
    await element(by.text('Push A')).tap();
    await waitForRouteName('A');
    await dismissToast('A: onDidAppear');
    await dismissToast('Home: onDidDisappear');
    await dismissToast('A: onWillAppear');
    await dismissToast('Home: onWillDisappear');
    await expectNoToast();

    await element(by.id('screenA-layout-view')).swipe('right');

    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('A: onDidDisappear');
    await dismissToast('Home: onWillAppear');
    await dismissToast('A: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the identical pop event set when popping A via the Pop button', async () => {
    await element(by.text('Push A')).tap();
    await waitForRouteName('A');
    await dismissToast('A: onDidAppear');
    await dismissToast('Home: onDidDisappear');
    await dismissToast('A: onWillAppear');
    await dismissToast('Home: onWillDisappear');
    await expectNoToast();

    await element(by.text('Pop')).tap();

    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('A: onDidDisappear');
    await dismissToast('Home: onWillAppear');
    await dismissToast('A: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the duplicated container + initial-screen push event set when pushing NestedStack', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedStack: onDidAppear');
    await dismissToast('Home: onDidDisappear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedStack: onWillAppear');
    await dismissToast('Home: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the inner push event set when pushing NestedA inside the nested stack', async () => {
    await element(by.text('Push NestedA')).tap();

    await waitForRouteName('NestedA');
    await dismissToast('NestedA: onDidAppear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedA: onWillAppear');
    await dismissToast('NestedHome: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the inner pop event set when popping NestedA via the inner NestedA header back button', async () => {
    await tapBarBackButton('NestedA');

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedA: onDidDisappear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedA: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the identical inner pop event set when popping NestedA via native back gesture', async () => {
    await element(by.text('Push NestedA')).tap();
    await waitForRouteName('NestedA');
    await dismissToast('NestedA: onDidAppear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedA: onWillAppear');
    await dismissToast('NestedHome: onWillDisappear');
    await expectNoToast();

    await element(by.id('nested-screenA-layout-view')).swipe('right');

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedA: onDidDisappear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedA: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the identical inner pop event set when popping NestedA via the Pop button', async () => {
    await element(by.text('Push NestedA')).tap();
    await waitForRouteName('NestedA');
    await dismissToast('NestedA: onDidAppear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedA: onWillAppear');
    await dismissToast('NestedHome: onWillDisappear');
    await expectNoToast();

    await element(by.text('Pop')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedA: onDidDisappear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedA: onWillDisappear');
    await expectNoToast();
  });

  it('should pop the whole NestedStack container from NestedHome to Home via native back gesture', async () => {
    // NestedHome is the nested stack's only (root) screen, so dismissing it
    // bubbles up to pop the whole NestedStack container rather than a screen
    // within it. The native gesture, the native header back button, and the Pop
    // button (the following tests) must all produce this identical container-pop
    // event set.
    await element(by.id('nested-home-screen-layout-view')).swipe('right');

    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedStack: onDidDisappear');
    await dismissToast('Home: onWillAppear');
    await dismissToast('NestedHome: onWillDisappear');
    await dismissToast('NestedStack: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the identical container-pop event set when popping the container from NestedHome via the NestedStack header back button', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedStack: onDidAppear');
    await dismissToast('Home: onDidDisappear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedStack: onWillAppear');
    await dismissToast('Home: onWillDisappear');
    await expectNoToast();

    await tapBarBackButton();

    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedStack: onDidDisappear');
    await dismissToast('Home: onWillAppear');
    await dismissToast('NestedHome: onWillDisappear');
    await dismissToast('NestedStack: onWillDisappear');
    await expectNoToast();
  });

  it('should fire the identical container-pop event set when the Pop button on the nested root bubbles to a container pop', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedStack: onDidAppear');
    await dismissToast('Home: onDidDisappear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedStack: onWillAppear');
    await dismissToast('Home: onWillDisappear');
    await expectNoToast();

    await element(by.text('Pop')).tap();

    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedStack: onDidDisappear');
    await dismissToast('Home: onWillAppear');
    await dismissToast('NestedHome: onWillDisappear');
    await dismissToast('NestedStack: onWillDisappear');
    await expectNoToast();
  });

  it('should pop the whole NestedStack container from NestedA to Home in one step via the outer NestedStack header back button (skipping NestedHome)', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedStack: onDidAppear');
    await dismissToast('Home: onDidDisappear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedStack: onWillAppear');
    await dismissToast('Home: onWillDisappear');
    await expectNoToast();

    await element(by.text('Push NestedA')).tap();
    await waitForRouteName('NestedA');
    await dismissToast('NestedA: onDidAppear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedA: onWillAppear');
    await dismissToast('NestedHome: onWillDisappear');
    await expectNoToast();

    await tapBarBackButton('NestedStack');

    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('NestedA: onDidDisappear');
    await dismissToast('NestedStack: onDidDisappear');
    await dismissToast('Home: onWillAppear');
    await dismissToast('NestedA: onWillDisappear');
    await dismissToast('NestedStack: onWillDisappear');
    await expectNoToast();
  });
});

describeIfAndroid('Stack v5: lifecycle events', () => {
  // React Native's core `<Button>` uppercases its `title` on Android
  // (`title.toUpperCase()`), so buttons are matched by their rendered text.
  const PUSH_A = 'PUSH A';
  const PUSH_NESTED_STACK = 'PUSH NESTEDSTACK';
  const PUSH_NESTED_A = 'PUSH NESTEDA';
  const POP = 'POP';

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-lifecycle-events',
    );
  });

  it('should show Home and fire onWillAppear + onDidAppear on launch', async () => {
    await waitForRouteName('Home');
    await dismissToast('Home: onDidAppear');
    await dismissToast('Home: onWillAppear');
    await expectNoToast();
  });

  it('should fire the push events (onWillAppear + onDidAppear) for A only when pushing A over Home', async () => {
    await tapTopmostButton(PUSH_A);

    await waitForRouteName('A');
    await dismissToast('A: onDidAppear');
    await dismissToast('A: onWillAppear');
    await expectNoToast();
  });

  it('should fire the pop events (onWillDisappear + onDidDisappear) for A only when popping A via the Pop button', async () => {
    await tapTopmostButton(POP);

    await waitForRouteName('Home');
    await dismissToast('A: onDidDisappear');
    await dismissToast('A: onWillDisappear');
    await expectNoToast();
  });

  it('should fire duplicated push events (onWillAppear + onDidAppear) for both the NestedStack container and its initial NestedHome screen when pushing NestedStack', async () => {
    await tapTopmostButton(PUSH_NESTED_STACK);

    await waitForRouteName('NestedHome');
    await dismissToast('NestedHome: onDidAppear');
    await dismissToast('NestedStack: onDidAppear');
    await dismissToast('NestedHome: onWillAppear');
    await dismissToast('NestedStack: onWillAppear');
    await expectNoToast();
  });

  it('should fire the push events (onWillAppear + onDidAppear) for the inner NestedA screen only when pushing NestedA inside the nested stack', async () => {
    await tapTopmostButton(PUSH_NESTED_A);

    await waitForRouteName('NestedA');
    await dismissToast('NestedA: onDidAppear');
    await dismissToast('NestedA: onWillAppear');
    await expectNoToast();
  });

  it('should fire the pop events (onWillDisappear + onDidDisappear) for the inner NestedA screen only when popping NestedA via the Pop button', async () => {
    await tapTopmostButton(POP);

    await waitForRouteName('NestedHome');
    await dismissToast('NestedA: onDidDisappear');
    await dismissToast('NestedA: onWillDisappear');
    await expectNoToast();
  });

  it('should fire duplicated pop events (onWillDisappear + onDidDisappear) for both the NestedHome screen and the NestedStack container when the Pop button on the nested root bubbles to a container pop', async () => {
    // NestedHome is the nested stack's only (root) screen, so calling pop()
    // here bubbles up to pop the whole NestedStack container instead of a
    // screen within it.
    await tapTopmostButton(POP);

    await waitForRouteName('Home');
    await dismissToast('NestedStack: onDidDisappear');
    await dismissToast('NestedHome: onDidDisappear');
    await dismissToast('NestedStack: onWillDisappear');
    await dismissToast('NestedHome: onWillDisappear');
    await expectNoToast();
  });
});
