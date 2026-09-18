import { device, element, by } from 'detox';
import {
  describeIfAndroid,
  describeIfiOS,
  selectSingleFeatureTestsScreen,
  dismissToast,
  tapTopmostButton,
  waitForRouteName,
} from '../../e2e-utils';
import { tapBarBackButton } from '../../elements/back-button';
import { CLASS_NAME_UI_BUTTON_BAR_BUTTON } from '../../native-class-names';

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
 * Both platforms detach covered screens, so both the entering and the leaving
 * screen fire on every transition and matchers resolve unambiguously to the
 * top screen. The platforms interleave the events differently, so each keeps
 * its own suite:
 *
 * - iOS: the leaving screen's disappear brackets the entering screen's appear
 *   (`willDisappear` → `willAppear` → `didDisappear` → `didAppear`). Covers
 *   the on-screen Pop button and the native header back button.
 * - Android: on push the entering screen's `willAppear` leads and its
 *   `didAppear` trails the covered screen's disappear pair; on pop the
 *   leaving screen finishes disappearing before the uncovered screen starts
 *   appearing. In addition, this screen is opened through the example app's
 *   own navigation (not launched directly via `App.tsx`), so the native
 *   header back button and the system gesture-back do not pop the nested
 *   `StackContainer` — see issue #1459. The Android suite therefore covers
 *   only navigation driven by the on-screen Push/Pop buttons; native-back and
 *   gesture-back are verified on iOS and manually on Android via the direct
 *   launch documented in the scenario.
 */

describeIfiOS('Stack v5: lifecycle events', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-lifecycle-events',
    );
  });

  it('should show Home and fire onWillAppear + onDidAppear on launch', async () => {
    await waitForRouteName('Home');
    await dismissToast('2. Home: onDidAppear');
    await dismissToast('1. Home: onWillAppear');
  });

  it('should fire the push event set when pushing A over Home', async () => {
    await element(by.text('Push A')).tap();

    await waitForRouteName('A');
    await dismissToast('4. A: onDidAppear');
    await dismissToast('3. Home: onDidDisappear');
    await dismissToast('2. A: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');
  });

  it('should fire the pop event set when popping A via the native header back button', async () => {
    await tapBarBackButton();

    await waitForRouteName('Home');
    await dismissToast('4. Home: onDidAppear');
    await dismissToast('3. A: onDidDisappear');
    await dismissToast('2. Home: onWillAppear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire the identical pop event set when popping A via native back gesture', async () => {
    await element(by.text('Push A')).tap();
    await waitForRouteName('A');
    await dismissToast('4. A: onDidAppear');
    await dismissToast('3. Home: onDidDisappear');
    await dismissToast('2. A: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.id('screenA-layout-view')).swipe('right');

    await waitForRouteName('Home');
    await dismissToast('4. Home: onDidAppear');
    await dismissToast('3. A: onDidDisappear');
    await dismissToast('2. Home: onWillAppear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire the identical pop event set when popping A via the Pop button', async () => {
    await element(by.text('Push A')).tap();
    await waitForRouteName('A');
    await dismissToast('4. A: onDidAppear');
    await dismissToast('3. Home: onDidDisappear');
    await dismissToast('2. A: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.text('Pop')).tap();

    await waitForRouteName('Home');
    await dismissToast('4. Home: onDidAppear');
    await dismissToast('3. A: onDidDisappear');
    await dismissToast('2. Home: onWillAppear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire the duplicated container + initial-screen push event set when pushing NestedStack', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');
  });

  it('should fire the inner push event set when pushing NestedA inside the nested stack', async () => {
    await element(by.text('Push NestedA')).tap();

    await waitForRouteName('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');
  });

  it('should fire the inner pop event set when popping NestedA via the inner NestedA header back button', async () => {
    await element(
      by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).withAncestor(by.id('NestedA')),
    ).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('4. NestedHome: onDidAppear');
    await dismissToast('3. NestedA: onDidDisappear');
    await dismissToast('2. NestedHome: onWillAppear');
    await dismissToast('1. NestedA: onWillDisappear');
  });

  it('should fire the identical inner pop event set when popping NestedA via native back gesture', async () => {
    await element(by.text('Push NestedA')).tap();
    await waitForRouteName('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');

    await element(by.id('nested-screenA-layout-view')).swipe('right');

    await waitForRouteName('NestedHome');
    await dismissToast('4. NestedHome: onDidAppear');
    await dismissToast('3. NestedA: onDidDisappear');
    await dismissToast('2. NestedHome: onWillAppear');
    await dismissToast('1. NestedA: onWillDisappear');
  });

  it('should fire the identical inner pop event set when popping NestedA via the Pop button', async () => {
    await element(by.text('Push NestedA')).tap();
    await waitForRouteName('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');

    await element(by.text('Pop')).tap();

    await waitForRouteName('NestedHome');
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
    // event set.
    await element(by.id('nested-home-screen-layout-view')).swipe('right');

    await waitForRouteName('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. NestedHome: onDidDisappear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. NestedHome: onWillDisappear');
    await dismissToast('1. NestedStack: onWillDisappear');
  });

  it('should fire the identical container-pop event set when popping the container from NestedHome via the NestedStack header back button', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await tapBarBackButton();

    await waitForRouteName('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. NestedHome: onDidDisappear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. NestedHome: onWillDisappear');
    await dismissToast('1. NestedStack: onWillDisappear');
  });

  it('should fire the identical container-pop event set when the Pop button on the nested root bubbles to a container pop', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.text('Pop')).tap();

    await waitForRouteName('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. NestedHome: onDidDisappear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. NestedHome: onWillDisappear');
    await dismissToast('1. NestedStack: onWillDisappear');
  });

  it('should pop the whole NestedStack container from NestedA to Home in one step via the outer NestedStack header back button (skipping NestedHome)', async () => {
    await element(by.text('Push NestedStack')).tap();

    await waitForRouteName('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedStack: onWillAppear');
    await dismissToast('1. Home: onWillDisappear');

    await element(by.text('Push NestedA')).tap();
    await waitForRouteName('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedA: onWillAppear');
    await dismissToast('1. NestedHome: onWillDisappear');

    await element(
      by
        .type(CLASS_NAME_UI_BUTTON_BAR_BUTTON)
        .withAncestor(by.id('NestedStack')),
    ).tap();

    await waitForRouteName('Home');
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

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-lifecycle-events',
    );
  });

  it('should show Home and fire onWillAppear + onDidAppear on launch', async () => {
    await waitForRouteName('Home');
    await dismissToast('2. Home: onDidAppear');
    await dismissToast('1. Home: onWillAppear');
  });

  it('should fire the push event set for both screens when pushing A over Home', async () => {
    await tapTopmostButton(PUSH_A);

    await waitForRouteName('A');
    await dismissToast('4. A: onDidAppear');
    await dismissToast('3. Home: onDidDisappear');
    await dismissToast('2. Home: onWillDisappear');
    await dismissToast('1. A: onWillAppear');
  });

  it('should fire the pop event set for both screens when popping A via the Pop button', async () => {
    await tapTopmostButton(POP);

    await waitForRouteName('Home');
    await dismissToast('4. Home: onDidAppear');
    await dismissToast('3. Home: onWillAppear');
    await dismissToast('2. A: onDidDisappear');
    await dismissToast('1. A: onWillDisappear');
  });

  it('should fire the push event set for the NestedStack container, its initial NestedHome screen, and the covered Home', async () => {
    await tapTopmostButton(PUSH_NESTED_STACK);

    await waitForRouteName('NestedHome');
    await dismissToast('6. NestedHome: onDidAppear');
    await dismissToast('5. NestedStack: onDidAppear');
    await dismissToast('4. Home: onDidDisappear');
    await dismissToast('3. Home: onWillDisappear');
    await dismissToast('2. NestedHome: onWillAppear');
    await dismissToast('1. NestedStack: onWillAppear');
  });

  it('should fire the inner push event set for NestedA and the covered NestedHome inside the nested stack', async () => {
    await tapTopmostButton(PUSH_NESTED_A);

    await waitForRouteName('NestedA');
    await dismissToast('4. NestedA: onDidAppear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedHome: onWillDisappear');
    await dismissToast('1. NestedA: onWillAppear');
  });

  it('should fire the inner pop event set when popping NestedA via the Pop button', async () => {
    await tapTopmostButton(POP);

    await waitForRouteName('NestedHome');
    await dismissToast('4. NestedHome: onDidAppear');
    await dismissToast('3. NestedHome: onWillAppear');
    await dismissToast('2. NestedA: onDidDisappear');
    await dismissToast('1. NestedA: onWillDisappear');
  });

  it('should fire the duplicated container pop event set when the Pop button on the nested root bubbles to a container pop', async () => {
    // NestedHome is the nested stack's only (root) screen, so calling pop()
    // here bubbles up to pop the whole NestedStack container instead of a
    // screen within it.
    await tapTopmostButton(POP);

    await waitForRouteName('Home');
    await dismissToast('6. Home: onDidAppear');
    await dismissToast('5. Home: onWillAppear');
    await dismissToast('4. NestedStack: onDidDisappear');
    await dismissToast('3. NestedHome: onDidDisappear');
    await dismissToast('2. NestedStack: onWillDisappear');
    await dismissToast('1. NestedHome: onWillDisappear');
  });
});
