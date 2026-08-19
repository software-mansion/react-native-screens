import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { NativeMatcher } from 'detox/detox';
import {
  describeIfAndroid,
  dismissNextToast,
  expectNoToast,
  expectTopmostVisible,
  getTopmostMatch,
  selectSingleFeatureTestsScreen,
  tapTopmost,
  waitUntil,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
} from '../../native-class-names';

/**
 * Stack v5 `preventNativeDismiss` — a nested stack inside another stack. See
 * the scenario for what is automated vs. manual, and for the direct-`App.tsx`
 * launch Android needs.
 *
 * Interception survives software-mansion/react-native-screens-labs#1459:
 * `StackScreenFragment` registers its `PreventNativeDismissCallback` after the
 * outer navigator's, and `OnBackPressedDispatcher` runs enabled callbacks in
 * reverse order — so the chevron is swallowed here even though an unintercepted
 * back press would navigate out of the example app's own navigation.
 */

// Matchers are built fresh on each call, never shared: on Android `atIndex`
// rewrites a matcher in place (see `tapTopmost`).

/**
 * The Stack v5 header's toolbar. Scoped to `MaterialToolbar` so it never
 * matches the example app's own v4 header, a `CustomToolbar` — which extends
 * `Toolbar` but not `MaterialToolbar`.
 */
const stackV5ToolbarMatcher = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR);

/**
 * The header's back chevron. A covered screen keeps its toolbar but loses its
 * navigation icon, so while a headered screen is on top this resolves to that
 * screen's chevron alone. Absence is not reliable: under a headerless top
 * screen the covered screen's chevron is still there and still reads visible.
 */
const stackV5BackButtonMatcher = (): NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
    .withAncestor(stackV5ToolbarMatcher());

/** A native header title, which renders as a `MaterialToolbar` child. */
const stackV5HeaderTitleMatcher = (title: string): NativeMatcher =>
  by.text(title).withAncestor(stackV5ToolbarMatcher());

/** Taps the back chevron of the topmost headered screen. */
async function tapStackV5BackButton(): Promise<void> {
  await tapTopmost(stackV5BackButtonMatcher());
}

// Covered screens stay attached on Android, so the widget matchers below
// resolve to one element per stacked screen. Every read is normalized to the
// last match: the topmost screen of the innermost stack.

/** @see apps/src/tests/shared/components/stack-v5/StackRouteInformation.tsx */
const ROUTE_KEY_TEST_ID = 'stack-route-key';

/** Rendered by the `preventNativeDismiss` test screens' own info label. */
const PREVENT_NATIVE_DISMISS_TEST_ID = 'prevent-native-dismiss-info';

const PREVENT_NATIVE_DISMISS_ENABLED = 'Prevent native dismiss: Enabled';
const PREVENT_NATIVE_DISMISS_DISABLED = 'Prevent native dismiss: Disabled';

/**
 * React Native's core `<Button>` uppercases its `title` on Android
 * (`title.toUpperCase()`), so its buttons are matched by their rendered text.
 */
const buttonLabel = (title: string) => title.toUpperCase();

/** @see apps/src/tests/shared/components/stack-v5/StackNavigationButtons.tsx */
const pushButtonLabel = (routeName: string) => buttonLabel(`Push ${routeName}`);

const POP_BUTTON_LABEL = buttonLabel('Pop');

/** Rendered by the `preventNativeDismiss` test screens. */
const TOGGLE_PREVENT_NATIVE_DISMISS_LABEL = buttonLabel(
  'Toggle Prevent Native Dismiss',
);

async function readTopmostText(testID: string): Promise<string> {
  const top = await getTopmostMatch(by.id(testID));
  return (top.text ?? top.label ?? '').trim();
}

/** The `Key: ...` label of the topmost screen. */
const readTopmostRouteKey = () => readTopmostText(ROUTE_KEY_TEST_ID);

/** The `Prevent native dismiss: ...` label of the topmost screen. */
const readTopmostPreventNativeDismissInfo = () =>
  readTopmostText(PREVENT_NATIVE_DISMISS_TEST_ID);

/**
 * Matches the route key label of any screen on `routeName`. Keys are minted as
 * `r-<routeName>-<id>` with an increasing id (`generateRouteKeyForRouteName`),
 * so this pins the route, not the instance.
 */
const routeKeyPattern = (routeName: string) =>
  new RegExp(`^Key: r-${routeName}-\\d+$`);

/**
 * Waits until the topmost screen is `routeName` and returns its route key. The
 * key identifies the route *and* the instance, so one read settles continuity
 * (same key) or a push (new key). Polled rather than `waitFor(...)`, which
 * passes at once on a buried screen and so would not gate a pop.
 */
async function waitForTopmostRoute(routeName: string): Promise<string> {
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

/** Taps a Push/Pop/Toggle button on the topmost stacked screen. */
async function tapTopmostStackButton(label: string): Promise<void> {
  await tapTopmost(by.text(label));
}

/** Asserts the Push/Pop/Toggle buttons present on the topmost screen. */
async function expectTopmostStackButtons(labels: string[]): Promise<void> {
  for (const label of labels) {
    await expectTopmostVisible(() => by.text(label));
  }
}

// Each preventing route pushes its own toast text, so the label identifies
// which screen intercepted — the point of the layered-prevention steps.
const TOAST_FROM_B = 'Native dismiss prevented - B';
const TOAST_FROM_NESTED_B = 'Native dismiss prevented - NestedB';

describeIfAndroid('Stack v5: prevent native dismiss - nested stack', () => {
  const PUSH_A = pushButtonLabel('A');
  const PUSH_B = pushButtonLabel('B');
  const PUSH_NESTED_STACK = pushButtonLabel('NestedStack');
  const PUSH_NESTED_A = pushButtonLabel('NestedA');
  const PUSH_NESTED_B = pushButtonLabel('NestedB');
  const POP = POP_BUTTON_LABEL;
  const TOGGLE = TOGGLE_PREVENT_NATIVE_DISMISS_LABEL;

  /** Asserts `routeName` is still on top under its original key — nothing moved. */
  async function expectStillOn(
    routeName: string,
    expectedKey: string,
  ): Promise<void> {
    jestExpect(await waitForTopmostRoute(routeName)).toBe(expectedKey);
  }

  /** Asserts the topmost screen's flag label reads Enabled / Disabled. */
  async function expectPreventNativeDismiss(
    expectedLabel: string,
  ): Promise<void> {
    jestExpect(await readTopmostPreventNativeDismissInfo()).toBe(expectedLabel);
  }

  /**
   * Asserts one toast fired and that `message` is the screen that pushed it.
   * Clearing it renumbers any toast behind it to `1.`, so the follow-up
   * `expectNoToast` also rules out a second, ancestor-fired interception.
   */
  async function expectSoleToast(message: string): Promise<void> {
    await dismissNextToast(message);
    await expectNoToast();
  }

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-prevent-native-dismiss-nested-stack',
    );
  });

  // Captured as the suite progresses, so later steps can assert that a
  // preserved screen keeps its key and every push produces a strictly new one.
  let homeKey = '';
  let aKey = '';
  let bKey = '';
  let nestedHomeKey = '';
  let nestedAKey = '';
  let nestedBKey = '';

  it('should show Home as the root screen with no back chevron or Pop button', async () => {
    homeKey = await waitForTopmostRoute('Home');
    await expectTopmostStackButtons([PUSH_A, PUSH_B, PUSH_NESTED_STACK]);
    await expect(element(by.text(POP))).not.toExist();
    await expect(element(stackV5BackButtonMatcher())).not.toExist();
  });

  it('should push A with prevent native dismiss disabled', async () => {
    await tapTopmostStackButton(PUSH_A);

    aKey = await waitForTopmostRoute('A');
    jestExpect(aKey).not.toBe(homeKey);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_DISABLED);
    await expectTopmostVisible(stackV5BackButtonMatcher);
    await expectTopmostStackButtons([PUSH_A, PUSH_B, PUSH_NESTED_STACK, POP]);
    // Neither Home nor A carries a Toggle, so absence is unambiguous here.
    await expect(element(by.text(TOGGLE))).not.toExist();
  });

  it('should push B with prevent native dismiss enabled', async () => {
    await tapTopmostStackButton(PUSH_B);

    bKey = await waitForTopmostRoute('B');
    jestExpect(bKey).not.toBe(aKey);
    jestExpect(bKey).not.toBe(homeKey);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);
    await expectTopmostVisible(stackV5BackButtonMatcher);
    await expectTopmostStackButtons([
      PUSH_A,
      PUSH_B,
      PUSH_NESTED_STACK,
      POP,
      TOGGLE,
    ]);
  });

  it('should intercept the native header back button on B while prevent is enabled', async () => {
    await expectStillOn('B', bKey);
    await tapStackV5BackButton();

    await expectSoleToast(TOAST_FROM_B);
    await expectStillOn('B', bKey);
  });

  it('should pop B with the on-screen Pop button even while prevent is enabled', async () => {
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);
    await tapTopmostStackButton(POP);

    await expectStillOn('A', aKey);
    await expectNoToast();
  });

  it('should mount the nested stack showing its headerless root', async () => {
    await tapTopmostStackButton(PUSH_NESTED_STACK);

    nestedHomeKey = await waitForTopmostRoute('NestedHome');
    jestExpect(nestedHomeKey).not.toBe(aKey);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);
    await expectTopmostStackButtons([
      PUSH_NESTED_A,
      PUSH_NESTED_B,
      POP,
      TOGGLE,
    ]);
    // Neither the nested root nor the `NestedStack` host route configures a
    // header, so no toolbar carries NestedHome's title. That the nested root
    // shows *no* header at all cannot be asserted here — see
    // `stackV5BackButtonMatcher` — and stays a manual, visual check.
    await expect(
      element(stackV5HeaderTitleMatcher('NestedHome')),
    ).not.toExist();
  });

  it('should flip the label to Disabled when toggling it on the nested root', async () => {
    await tapTopmostStackButton(TOGGLE);

    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_DISABLED);
    // Left Disabled on purpose: the next-but-one step asserts a *fresh*
    // NestedHome comes back Enabled, i.e. the default is restored per instance
    // rather than carried over. The pop this Disabled state pairs with in the
    // scenario is native-back-driven and stays manual.
  });

  it('should exit the nested stack with the Pop button from its sole attached route', async () => {
    await tapTopmostStackButton(POP);

    await expectStillOn('A', aKey);
    await expectNoToast();
  });

  it('should restore the default flag on a fresh nested root instance', async () => {
    await tapTopmostStackButton(PUSH_NESTED_STACK);

    const freshNestedHomeKey = await waitForTopmostRoute('NestedHome');
    jestExpect(freshNestedHomeKey).not.toBe(nestedHomeKey);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);

    nestedHomeKey = freshNestedHomeKey;
  });

  it('should push NestedA inside the nested stack with prevent disabled', async () => {
    await tapTopmostStackButton(PUSH_NESTED_A);

    nestedAKey = await waitForTopmostRoute('NestedA');
    jestExpect(nestedAKey).not.toBe(nestedHomeKey);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_DISABLED);
    await expectTopmostStackButtons([PUSH_NESTED_A, PUSH_NESTED_B, POP]);
    // Unlike its root, a nested non-root screen renders the nested stack's own
    // header — titled and with a back chevron.
    await expect(element(stackV5HeaderTitleMatcher('NestedA'))).toBeVisible();
    await expectTopmostVisible(stackV5BackButtonMatcher);
  });

  it('should pop NestedA back to the preserved nested root with the Pop button', async () => {
    await tapTopmostStackButton(POP);

    await expectStillOn('NestedHome', nestedHomeKey);
    await expectNoToast();
  });

  it('should push NestedB with prevent native dismiss enabled', async () => {
    await tapTopmostStackButton(PUSH_NESTED_B);

    nestedBKey = await waitForTopmostRoute('NestedB');
    jestExpect(nestedBKey).not.toBe(nestedHomeKey);
    jestExpect(nestedBKey).not.toBe(nestedAKey);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);
    await expect(element(stackV5HeaderTitleMatcher('NestedB'))).toBeVisible();
    await expectTopmostVisible(stackV5BackButtonMatcher);
    await expectTopmostStackButtons([
      PUSH_NESTED_A,
      PUSH_NESTED_B,
      POP,
      TOGGLE,
    ]);
  });

  it('should intercept the native header back button on NestedB while prevent is enabled', async () => {
    await expectStillOn('NestedB', nestedBKey);
    await tapStackV5BackButton();

    await expectSoleToast(TOAST_FROM_NESTED_B);
    await expectStillOn('NestedB', nestedBKey);
  });

  it('should intercept every back press on NestedB individually', async () => {
    await tapStackV5BackButton();
    await tapStackV5BackButton();
    await tapStackV5BackButton();

    // A new toast per press — three presses, three toasts, and NestedB never
    // popped. Each dismissal renumbers the queue, so the head is always `1.`.
    await dismissNextToast(TOAST_FROM_NESTED_B);
    await dismissNextToast(TOAST_FROM_NESTED_B);
    await expectSoleToast(TOAST_FROM_NESTED_B);
    await expectStillOn('NestedB', nestedBKey);
  });

  it('should honor the latest flag value when toggled on NestedB', async () => {
    // Off, then straight back on — the press must see the latest value.
    await tapTopmostStackButton(TOGGLE);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_DISABLED);
    await tapTopmostStackButton(TOGGLE);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);

    await tapStackV5BackButton();

    await expectSoleToast(TOAST_FROM_NESTED_B);
    await expectStillOn('NestedB', nestedBKey);
  });

  it('should pop out of the nested stack with the Pop button, one route at a time', async () => {
    await tapTopmostStackButton(POP);

    await expectStillOn('NestedHome', nestedHomeKey);
    await expectNoToast();

    await tapTopmostStackButton(POP);

    await expectStillOn('A', aKey);
    await expectNoToast();
  });

  it('should push a preventing nested screen on top of a preventing outer screen', async () => {
    await tapTopmostStackButton(PUSH_B);
    bKey = await waitForTopmostRoute('B');
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);

    await tapTopmostStackButton(PUSH_NESTED_STACK);
    nestedHomeKey = await waitForTopmostRoute('NestedHome');
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);
    jestExpect(nestedHomeKey).not.toBe(bKey);
    await tapTopmostStackButton(PUSH_NESTED_B);
    nestedBKey = await waitForTopmostRoute('NestedB');
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_ENABLED);
  });

  it('should let only the topmost screen intercept while ancestors also prevent', async () => {
    await tapStackV5BackButton();

    // B and NestedHome both prevent as well, but sit below NestedB — exactly
    // one toast fires and it is NestedB's.
    await expectSoleToast(TOAST_FROM_NESTED_B);
    await expectStillOn('NestedB', nestedBKey);
  });

  it('should return to B, not A, when the nested stack is popped', async () => {
    await tapTopmostStackButton(POP);

    await expectStillOn('NestedHome', nestedHomeKey);
    await expectNoToast();

    await tapTopmostStackButton(TOGGLE);
    await expectPreventNativeDismiss(PREVENT_NATIVE_DISMISS_DISABLED);

    await tapTopmostStackButton(POP);

    await expectStillOn('B', bKey);
    await expectNoToast();
  });

  it('should resume intercepting on B once it is the topmost screen again', async () => {
    await tapStackV5BackButton();

    await expectSoleToast(TOAST_FROM_B);
    await expectStillOn('B', bKey);
  });

  it('should pop B back to A with the Pop button', async () => {
    await tapTopmostStackButton(POP);

    await expectStillOn('A', aKey);
    await expectNoToast();
  });
});
