import { expect as jestExpect } from '@jest/globals';
import { device, element, by } from 'detox';
import type { IosElementAttributes, NativeMatcher } from 'detox/detox';
import { forceTapByLabeliOS } from './gestures';
import { getMatches } from './matchers';
import {
  CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY,
  CLASS_NAME_UI_TAB_BAR,
} from './native-classes-ios';

export async function forceSelectTabByLabel(label: string) {
  if (device.getPlatform() === 'ios') {
    await forceTapByLabeliOS(label);
  } else {
    await element(by.label(label)).tap();
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
