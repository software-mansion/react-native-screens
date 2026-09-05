import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  dismissToast,
  expectNoToast,
  expectTopmostButtons,
  expectTopmostVisible,
  readTopmostText,
  selectSingleFeatureTestsScreen,
  stackV5BackButton,
  tapTopmost,
  tapTopmostButton,
  waitForTopmostRoute,
} from '../../e2e-utils';

/**
 * Stack v5 `preventNativeDismiss` — single stack. See the scenario for what is
 * automated vs. manual, and for the direct-`App.tsx` launch Android needs.
 *
 * Interception survives software-mansion/react-native-screens-labs#1459:
 * `StackScreenFragment` registers its `PreventNativeDismissCallback` after the
 * outer navigator's, and `OnBackPressedDispatcher` runs enabled callbacks in
 * reverse order — so the chevron is swallowed here even though an unintercepted
 * back press would navigate out of the example app's own navigation.
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

  const readPreventInfo = () => readTopmostText('prevent-native-dismiss-info');

  /** Asserts B is still on top with its original key — the press was swallowed. */
  async function expectStillOnB(expectedKey: string): Promise<void> {
    jestExpect(await waitForTopmostRoute('B')).toBe(expectedKey);
  }

  /**
   * Dismisses `count` toasts newest-first — labels carry the 1-based position,
   * so clearing from the highest down keeps the remaining ones stable.
   */
  async function dismissToasts(count: number): Promise<void> {
    for (let position = count; position >= 1; position--) {
      await dismissToast(toastLabel(position));
    }
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
    await expect(element(stackV5BackButton())).not.toExist();
  });

  it('should push A with prevent native dismiss disabled', async () => {
    await tapTopmostButton(PUSH_A);

    aKey = await waitForTopmostRoute('A');
    jestExpect(aKey).not.toBe(homeKey);
    jestExpect(await readPreventInfo()).toBe(
      'Prevent native dismiss: Disabled',
    );
    await expectTopmostVisible(stackV5BackButton);
    await expectTopmostButtons([PUSH_A, PUSH_B, POP]);
  });

  it('should push B with prevent native dismiss enabled', async () => {
    await tapTopmostButton(PUSH_B);

    bKey = await waitForTopmostRoute('B');
    jestExpect(bKey).not.toBe(aKey);
    jestExpect(bKey).not.toBe(homeKey);
    jestExpect(await readPreventInfo()).toBe('Prevent native dismiss: Enabled');
    await expectTopmostVisible(stackV5BackButton);
    await expectTopmostButtons([PUSH_A, PUSH_B, POP, TOGGLE]);
  });

  it('should intercept the native header back button while prevent is enabled', async () => {
    await expectStillOnB(bKey);
    await tapTopmost(stackV5BackButton());

    // Asserts the toast fired, then clears it for the next step.
    await dismissToasts(1);
    await expectStillOnB(bKey);
  });

  it('should intercept every back press individually while prevent is enabled', async () => {
    await expectStillOnB(bKey);
    await tapTopmost(stackV5BackButton());
    await tapTopmost(stackV5BackButton());
    await tapTopmost(stackV5BackButton());

    // A new toast per press — three presses, three toasts, and B never popped.
    await dismissToasts(3);
    await expectStillOnB(bKey);
  });

  it('should pop with the on-screen Pop button even while prevent is enabled', async () => {
    jestExpect(await readPreventInfo()).toBe('Prevent native dismiss: Enabled');
    await tapTopmostButton(POP);

    jestExpect(await waitForTopmostRoute('A')).toBe(aKey);
    await expectNoToast(TOAST_MESSAGE);
    await tapTopmostButton(POP);

    jestExpect(await waitForTopmostRoute('Home')).toBe(homeKey);
    await expectNoToast(TOAST_MESSAGE);
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

    await tapTopmost(stackV5BackButton());

    await dismissToasts(1);
    await expectStillOnB(currentBKey);
  });
});
