import { device, expect, element, by, waitFor } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import type { IosElementAttributes } from 'detox/detox';
import {
  describeIfiOS,
  getElementAttributes,
  getMatches,
  selectSingleFeatureTestsScreen,
  toggleSettingsSwitch,
} from '../../e2e-utils';
import {
  CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY,
  CLASS_NAME_UI_TAB_BAR,
  CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26,
} from '../../native-class-names';

/**
 * Covers the end state of every `scenario.md` step: after each `hidden` /
 * `rendered` toggle (and their combinations) the bottom accessory is either
 * present with its content and laid out above the tab bar, or gone.
 *
 * Both toggles remove the accessory from the native view hierarchy -
 * `bottomAccessoryHidden` through `setBottomAccessory:nil`, `rendered` by
 * unmounting it - so presence is read the same way for both, and cross-checked
 * against the tab bar: the `UITabBar` itself stays full-width, but on iOS 26
 * the tab item pill (`_UITabButton`) is laid out to the accessory's width while
 * one is attached and shrinks back to its intrinsic width once it is gone. The
 * screen has a single tab, so that pill *is* the visible tab bar.
 *
 * What stays manual is the *animation* `hidden` drives: that the accessory
 * slides out/in smoothly with its content visible throughout and no blank
 * frame. Detox samples the settled hierarchy, not animation frames.
 */

const SCROLL_VIEW = 'bottom-accessory-visibility-scrollview';
const RENDERED_SWITCH = 'rendered-switch';
const HIDDEN_SWITCH = 'hidden-switch';
const ACCESSORY_TEXT = 'bottom-accessory-text';
const ACCESSORY_CONTENT = 'Bottom Accessory';

// Detox syncs with UIKit animations, but the accessory is attached/detached by
// `setBottomAccessory:animated:`, so give the transition a bounded grace period
// rather than asserting the hierarchy on the very next sample.
const TRANSITION_TIMEOUT_MS = 3000;

const SETTINGS_CONTROL = { scrollViewId: SCROLL_VIEW };

const bottomAccessory = by.type(CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY);

/**
 * Width of the tab item pill while the accessory is attached, read once on the
 * baseline step. Every later step compares against it: narrower means the
 * accessory is gone, back to this width means it is attached again. A relative
 * check, so no system layout constant is hardcoded.
 */
let tabButtonWidthWithAccessory: number;

// The single tab button resolves twice (same frame) even under `atIndex`, so
// read the match set and take the first entry.
async function getTabButtonWidth(): Promise<number> {
  const [tabButton] = (await getMatches(
    by.type(CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26),
  )) as IosElementAttributes[];
  return tabButton.frame.width;
}

// RN mounts the text twice under the same `testID` (the paragraph view and its
// accessibility proxy); `atIndex(0)` pins the matcher to one of them.
const bottomAccessoryText = () =>
  element(by.id(ACCESSORY_TEXT).withAncestor(bottomAccessory)).atIndex(0);

const setHidden = (to: boolean) =>
  toggleSettingsSwitch(
    { switchId: HIDDEN_SWITCH, label: 'hidden', to },
    SETTINGS_CONTROL,
  );

const setRendered = (to: boolean) =>
  toggleSettingsSwitch(
    { switchId: RENDERED_SWITCH, label: 'rendered', to },
    SETTINGS_CONTROL,
  );

async function expectSwitchState(
  switchId: string,
  label: string,
  value: boolean,
) {
  await expect(element(by.id(switchId))).toHaveLabel(`${label}: ${value}`);
}

/** The accessory is in the hierarchy, shows its content, and sits above the tab bar. */
async function expectBottomAccessoryShown() {
  await waitFor(element(bottomAccessory))
    .toExist()
    .withTimeout(TRANSITION_TIMEOUT_MS);
  await expect(element(bottomAccessory)).toBeVisible();
  await expect(bottomAccessoryText()).toExist();
  await expect(bottomAccessoryText()).toHaveText(ACCESSORY_CONTENT);

  const accessory = (await getElementAttributes({
    by: 'type',
    value: CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY,
  })) as IosElementAttributes;
  const tabBar = (await getElementAttributes({
    by: 'type',
    value: CLASS_NAME_UI_TAB_BAR,
    index: 0,
  })) as IosElementAttributes;

  jestExpect(tabBar.frame.y).toBeGreaterThan(
    accessory.frame.y + accessory.frame.height,
  );

  // Frames are integral points here; `toBeCloseTo(…, 0)` only tolerates
  // sub-pixel drift, not a narrower pill.
  jestExpect(await getTabButtonWidth()).toBeCloseTo(
    tabButtonWidthWithAccessory,
    0,
  );
}

/**
 * Neither the accessory view nor its content is left in the hierarchy, and the
 * tab item pill has shrunk back from the accessory's width.
 */
async function expectBottomAccessoryAbsent() {
  await waitFor(element(bottomAccessory))
    .not.toExist()
    .withTimeout(TRANSITION_TIMEOUT_MS);
  await expect(element(by.id(ACCESSORY_TEXT))).not.toExist();

  jestExpect(await getTabButtonWidth()).toBeLessThan(
    tabButtonWidthWithAccessory,
  );
}

/** The screen is still interactive - its controls are on screen and readable. */
async function expectConfigScreenResponsive() {
  await expect(element(by.id(SCROLL_VIEW))).toBeVisible();
  await expect(element(by.id(RENDERED_SWITCH))).toBeVisible();
  await expect(element(by.id(HIDDEN_SWITCH))).toBeVisible();
}

describeIfiOS('Tabs: bottomAccessoryHidden (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-bottom-accessory-visibility-ios',
    );
  });

  // ---------------------------------------------------------------------------
  // Baseline
  // ---------------------------------------------------------------------------

  it('should show the bottom accessory above the tab bar on load', async () => {
    await expectConfigScreenResponsive();
    await expectSwitchState(RENDERED_SWITCH, 'rendered', true);
    await expectSwitchState(HIDDEN_SWITCH, 'hidden', false);

    await waitFor(element(bottomAccessory))
      .toExist()
      .withTimeout(TRANSITION_TIMEOUT_MS);
    tabButtonWidthWithAccessory = await getTabButtonWidth();

    await expectBottomAccessoryShown();
  });

  // ---------------------------------------------------------------------------
  // Hidden prop
  // ---------------------------------------------------------------------------

  it('should remove the bottom accessory when hidden is toggled on', async () => {
    await setHidden(true);

    await expectBottomAccessoryAbsent();
  });

  it('should bring the bottom accessory back with its content when hidden is toggled off', async () => {
    await setHidden(false);

    await expectBottomAccessoryShown();
  });

  // ---------------------------------------------------------------------------
  // Rendered prop
  // ---------------------------------------------------------------------------

  it('should remove the bottom accessory when rendered is toggled off', async () => {
    await setRendered(false);

    await expectBottomAccessoryAbsent();
  });

  it('should bring the bottom accessory back with its content when rendered is toggled on', async () => {
    await setRendered(true);

    await expectBottomAccessoryShown();
  });

  // ---------------------------------------------------------------------------
  // Combined
  // ---------------------------------------------------------------------------

  it('should keep the bottom accessory absent when hidden is toggled on and then rendered off', async () => {
    await setHidden(true);
    await expectBottomAccessoryAbsent();

    await setRendered(false);

    await expectConfigScreenResponsive();
    await expectBottomAccessoryAbsent();
  });

  it('should keep the bottom accessory absent when rendered is toggled on while still hidden', async () => {
    await expectSwitchState(HIDDEN_SWITCH, 'hidden', true);
    await setRendered(true);

    await expectBottomAccessoryAbsent();
  });

  it('should show the bottom accessory with its content when hidden is toggled off', async () => {
    await expectSwitchState(RENDERED_SWITCH, 'rendered', true);
    await setHidden(false);

    await expectBottomAccessoryShown();
  });
});
