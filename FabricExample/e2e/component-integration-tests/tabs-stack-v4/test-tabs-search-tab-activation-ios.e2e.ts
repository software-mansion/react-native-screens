import { device, expect, element, by } from 'detox';
import type { IosElementAttributes } from 'detox/detox';
import { selectComponentIntegrationTestsScreen } from '@e2e/app/test-screen-navigation';
import { toggleSettingsSwitch } from '@e2e/app/settings-controls';
import { tapWithinFrame } from '@e2e/framework/gestures';
import { getMatches } from '@e2e/framework/matchers';
import { CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26 } from '@e2e/framework/native-classes-ios';
import { describeIfIOS } from '@e2e/framework/platform';

// Once the search tab has been activated, UIKit lets a mount transaction run
// between `shouldSelectTab:` and `didSelectTab:` on every later selection of
// it (observed on iOS 27), so a single round trip is not enough.
const SELECTION_ROUNDS = 5;

/**
 * With the search active, UIKit shows the other tabs as a single collapsed
 * button. It has no `testID` (the regular, hidden button keeps it) and is
 * told apart by its accessibility value.
 */
async function tapCollapsedTabButton(label: string) {
  const buttons = (await getMatches(
    by.label(label).and(by.type(CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26)),
  )) as IosElementAttributes[];
  const collapsedButton = buttons.find(button => button.value === 'Collapsed');
  if (collapsedButton === undefined) {
    throw new Error(`No collapsed tab button labeled "${label}"`);
  }
  await tapWithinFrame(collapsedButton.frame);
}

describeIfIOS('Stack v4 & Tabs: search tab activation', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectComponentIntegrationTestsScreen(
      'Stack V4 & Native Tabs Integration Tests',
      'test-tabs-search-tab-activation-ios',
    );
  });

  it('should keep the JS selection in sync when returning through the collapsed tab bar', async () => {
    await toggleSettingsSwitch({
      switchId: 'automatically-activates-search-switch',
      label: 'automaticallyActivatesSearch',
      to: true,
    });

    for (let round = 0; round < SELECTION_ROUNDS; round++) {
      await element(by.id('search-tab-item')).tap();
      await expect(
        element(by.id('search-list-selected-in-js-label')),
      ).toHaveLabel('Selected in JS: yes');

      // The activated search field brings up the keyboard, which covers the
      // collapsed tab bar.
      await element(by.id('search-list-scrollview')).swipe('down', 'slow', 0.3);
      await tapCollapsedTabButton('Config');
      await expect(element(by.text('Search Tab Activation'))).toBeVisible();
    }
  });
});
