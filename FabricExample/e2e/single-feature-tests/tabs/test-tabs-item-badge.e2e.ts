import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { getSingleMatch } from '@e2e/framework/matchers';
import {
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_TAB_BAR_BADGE_VIEW_IOS26,
  CLASS_NAME_UI_TAB_BAR_BADGE_VIEW_LEGACY,
} from '@e2e/framework/native-classes-ios';
import {
  describeIfBelowIOS27,
  describeIfIOS,
  describeIfIOS27,
  isIOSVersionAtLeast,
} from '@e2e/framework/platform';

const tabBarBadgeViewType = isIOSVersionAtLeast('26.0')
  ? CLASS_NAME_UI_TAB_BAR_BADGE_VIEW_IOS26
  : CLASS_NAME_UI_TAB_BAR_BADGE_VIEW_LEGACY;

/** Each tab bar item's `testID`, paired with the `badgeValue` it renders. */
const TAB_BADGES = [
  { testID: 'tab-badge-item-1', badgeValue: '1' },
  { testID: 'tab-badge-item-2', badgeValue: '1234567890' },
  { testID: 'tab-badge-item-3', badgeValue: 'NEW!' },
  { testID: 'tab-badge-item-4', badgeValue: '⚠️' },
];

/**
 * Asserts the tab bar item `testID` carries `badgeValue` - on iOS 27 the only
 * per-item binding left, since the badge view itself is no longer nested in the
 * item. UIKit folds the badge into the item's accessibility value, localized
 * and pluralized ("1 item", "1.234.567.890 items"), so a numeric badge is
 * compared on its digits alone rather than on the grouped, suffixed string.
 */
async function expectItemBadgeValue(testID: string, badgeValue: string) {
  const value = String(
    (await getSingleMatch(by.id(testID), `id "${testID}"`)).value ?? '',
  );

  if (/^\d+$/.test(badgeValue)) {
    jestExpect(value.replace(/\D/g, '')).toBe(badgeValue);
  } else {
    jestExpect(value).toContain(badgeValue);
  }
}

describeIfIOS('Tab Bar Item Badge', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-item-badge');
  });

  it('should display all four tab bar items', async () => {
    for (const { testID } of TAB_BADGES) {
      await expect(element(by.id(testID))).toExist();
    }
  });

  describeIfBelowIOS27('badge nested in its tab bar item', () => {
    it('should render each badge value inside its own tab bar item', async () => {
      for (const { testID, badgeValue } of TAB_BADGES) {
        await expect(
          element(by.type(tabBarBadgeViewType).withAncestor(by.id(testID))),
        ).toHaveText(badgeValue);
      }
    });
  });

  describeIfIOS27('badge detached from its tab bar item', () => {
    it("should expose each badge on its own tab bar item's accessibility value", async () => {
      for (const { testID, badgeValue } of TAB_BADGES) {
        await expectItemBadgeValue(testID, badgeValue);
      }
    });

    it("should render each badge value in the badge view's label", async () => {
      for (const { badgeValue } of TAB_BADGES) {
        await expect(
          element(
            by
              .type(CLASS_NAME_UI_LABEL)
              .withAncestor(
                by.type(tabBarBadgeViewType).and(by.label(badgeValue)),
              ),
          ),
        ).toHaveText(badgeValue);
      }
    });
  });
});
