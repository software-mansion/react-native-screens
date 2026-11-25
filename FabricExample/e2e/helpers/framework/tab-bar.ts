import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import type { IosElementAttributes, NativeMatcher } from 'detox/detox';
import { forceTapByLabelIOS } from './gestures';
import { getMatches } from './matchers';
import {
  CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY,
  CLASS_NAME_UI_TAB_BAR,
  CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26,
  CLASS_NAME_UI_TAB_BAR_BUTTON_LEGACY,
} from './native-classes-ios';
import { isIOSVersionAtLeast } from './platform';

/** The tab bar button class on the device's iOS version (renamed in iOS 26). */
export const CLASS_NAME_UI_TAB_BAR_BUTTON = isIOSVersionAtLeast('26.0')
  ? CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26
  : CLASS_NAME_UI_TAB_BAR_BUTTON_LEGACY;

/** The iOS tab bar button labelled `label` (a tab's title, or its icon name). */
export const tabBarButtonIOS = (label: string): NativeMatcher =>
  by.label(label).and(by.type(CLASS_NAME_UI_TAB_BAR_BUTTON));

export async function forceSelectTabByLabel(label: string) {
  if (device.getPlatform() === 'ios') {
    await forceTapByLabelIOS(label);
  } else {
    await element(by.label(label)).tap();
  }
}

/**
 * Asserts the tab bar item carrying `label` (`tabBarItemAccessibilityLabel`)
 * is in the tab bar. Existence only on iOS: the selected button fails Detox's
 * visibility threshold on iOS 26.
 */
export async function expectTabBarItemByLabel(label: string) {
  const item = element(by.label(label));
  if (device.getPlatform() === 'ios') {
    await expect(item).toExist();
  } else {
    await expect(item).toBeVisible();
  }
}

/**
 * The first match — UIKit can keep more than one host view / tab bar in the
 * hierarchy (an accessory mid-transition, a sidebar and tab bar pair on iPad).
 */
async function getFirstMatch(matcher: NativeMatcher) {
  return (await getMatches(matcher))[0] as IosElementAttributes;
}

/** The accessory host view. */
export const getBottomAccessoryAttributes = () =>
  getFirstMatch(by.type(CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY));

/**
 * A view inside the accessory, addressed by its `testID`. The first match, for
 * the same reason as {@link getFirstMatch}: a second accessory can be attached
 * mid-transition, and both carry the same `testID`.
 */
export const bottomAccessoryElement = (testID: string) =>
  element(
    by.id(testID).withAncestor(by.type(CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY)),
  ).atIndex(0);

/** The `UITabBar`. */
export const getTabBarAttributes = () =>
  getFirstMatch(by.type(CLASS_NAME_UI_TAB_BAR));

/** Asserts the accessory sits above the tab bar (iPhone "extended" layout). */
export async function expectBottomAccessoryAboveTabBar() {
  const bottomAccessory = await getBottomAccessoryAttributes();
  const tabBar = await getTabBarAttributes();
  jestExpect(tabBar.frame.y).toBeGreaterThan(
    bottomAccessory.frame.y + bottomAccessory.frame.height,
  );
}
