import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { AndroidElementAttributes } from 'detox/detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

/**
 * Retrieves the frame attributes for the tab bar Config item.
 * Used to measure the tab bar's Y position before and after the keyboard appears,
 * so we can assert whether the tab bar shifted above the keyboard or stayed at the bottom.
 */
async function getConfigTabItemFrame(): Promise<
  AndroidElementAttributes['frame']
> {
  const attrs = (await element(
    by.id('ime-insets-config-tab-item'),
  ).getAttributes()) as AndroidElementAttributes;
  return attrs.frame;
}

/**
 * Taps the TextInput to bring up the soft keyboard (IME).
 * Detox synchronization waits for layout changes to settle before
 * the call returns, so subsequent frame reads reflect the post-keyboard layout.
 */
async function openKeyboard() {
  await element(by.id('ime-insets-text-input')).tap();
}

/**
 * Dismisses the soft keyboard by pressing the Android back button.
 */
async function dismissKeyboard() {
  await device.pressBack();
}

describeIfAndroid('Tabs IME insets (Android)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-ime-insets-android',
    );
  });

  // ---------------------------------------------------------------------------
  // Baseline
  // ---------------------------------------------------------------------------

  it('should display the Config tab with correct default switch states', async () => {
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toBeVisible();
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toBeVisible();
    await expect(element(by.id('ime-insets-text-input'))).toBeVisible();

    // Default: safeAreaViewBottomEdgeEnabled=true, tabBarRespectsIMEInsets=false
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: true',
    );
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: false');
  });

  it('should show "TabsScreen bottom" text at the bottom of the layout', async () => {
    await expect(element(by.id('tabs-screen-bottom-text'))).toBeVisible();
    await expect(element(by.id('tabs-screen-bottom-text'))).toHaveText(
      'TabsScreen bottom',
    );
  });

  // ---------------------------------------------------------------------------
  // tabBarRespectsIMEInsets: false, safeAreaViewBottomEdgeEnabled: true
  // ---------------------------------------------------------------------------

  it('should keep the tab bar at the bottom when keyboard opens and tabBarRespectsIMEInsets is false', async () => {
    // Baseline tab bar position before keyboard
    const frameBeforeKeyboard = await getConfigTabItemFrame();

    await openKeyboard();

    // With tabBarRespectsIMEInsets=false, the tab bar stays anchored at the
    // bottom of the window. The tab bar item Y position should remain unchanged
    // (the native view does not shift up to accommodate the keyboard).
    const frameWithKeyboard = await getConfigTabItemFrame();

    jestExpect(
      Math.abs(frameWithKeyboard.y - frameBeforeKeyboard.y),
    ).toBeLessThan(5);

    await dismissKeyboard();
  });

  // ---------------------------------------------------------------------------
  // tabBarRespectsIMEInsets: true, safeAreaViewBottomEdgeEnabled: true
  // ---------------------------------------------------------------------------

  it('should toggle tabBarRespectsIMEInsets to true', async () => {
    await element(by.id('tab-bar-respects-ime-insets-switch')).tap();
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: true');
  });

  it('should shift the tab bar above the keyboard when tabBarRespectsIMEInsets is true', async () => {
    // Baseline tab bar position before keyboard
    const frameBeforeKeyboard = await getConfigTabItemFrame();

    await openKeyboard();

    // With tabBarRespectsIMEInsets=true, the BottomNavigationView shifts upward
    // to sit on top of the IME. The tab bar item's Y coordinate should be
    // significantly smaller (higher on screen) than the pre-keyboard baseline.
    const frameWithKeyboard = await getConfigTabItemFrame();

    jestExpect(frameWithKeyboard.y).toBeLessThan(frameBeforeKeyboard.y);

    await dismissKeyboard();
  });

  it('should restore the tab bar to its original position after dismissing the keyboard (tabBarRespectsIMEInsets: true)', async () => {
    const frameBeforeKeyboard = await getConfigTabItemFrame();

    await openKeyboard();
    await dismissKeyboard();

    const frameAfterDismiss = await getConfigTabItemFrame();

    // After dismissal the tab bar should return to its original bottom position.
    jestExpect(
      Math.abs(frameAfterDismiss.y - frameBeforeKeyboard.y),
    ).toBeLessThan(5);
  });

  // ---------------------------------------------------------------------------
  // tabBarRespectsIMEInsets: true, safeAreaViewBottomEdgeEnabled: false
  // ---------------------------------------------------------------------------

  it('should toggle safeAreaViewBottomEdgeEnabled to false', async () => {
    await element(by.id('safe-area-bottom-edge-switch')).tap();
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: false',
    );
  });

  it('should still shift the tab bar above the keyboard when tabBarRespectsIMEInsets is true and safeAreaViewBottomEdgeEnabled is false', async () => {
    const frameBeforeKeyboard = await getConfigTabItemFrame();

    await openKeyboard();

    const frameWithKeyboard = await getConfigTabItemFrame();

    // tabBarRespectsIMEInsets=true still controls tab bar elevation regardless
    // of the safe-area edge setting.
    jestExpect(frameWithKeyboard.y).toBeLessThan(frameBeforeKeyboard.y);

    await dismissKeyboard();
  });

  // ---------------------------------------------------------------------------
  // tabBarRespectsIMEInsets: false, safeAreaViewBottomEdgeEnabled: false
  // ---------------------------------------------------------------------------

  it('should toggle tabBarRespectsIMEInsets back to false', async () => {
    await element(by.id('tab-bar-respects-ime-insets-switch')).tap();
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: false');
  });

  it('should keep the tab bar at the bottom when keyboard opens and both props are in their "off" state', async () => {
    const frameBeforeKeyboard = await getConfigTabItemFrame();

    await openKeyboard();

    const frameWithKeyboard = await getConfigTabItemFrame();

    // tabBarRespectsIMEInsets=false, safeAreaViewBottomEdgeEnabled=false:
    // the tab bar stays anchored at the bottom, not shifting for the keyboard.
    jestExpect(
      Math.abs(frameWithKeyboard.y - frameBeforeKeyboard.y),
    ).toBeLessThan(5);

    await dismissKeyboard();
  });
});
