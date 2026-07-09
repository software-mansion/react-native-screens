import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';
import { tapBarBackButton } from '../elements/back-button';
import { CLASS_NAME_UI_SEARCH_BAR_TEXT_FIELD } from '../native-class-names';

// PR related to iOS search bar
describeIfiOS('Test2926', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2926 should exist', async () => {
    await selectIssueTestScreen('Test2926');
  });

  it('searchBar should be initially visible', async () => {
    await expect(
      element(by.type(CLASS_NAME_UI_SEARCH_BAR_TEXT_FIELD)),
    ).toBeVisible();
  });

  it('searchBar should hide after setting headerSearchBarOptions to undefined', async () => {
    await element(by.id('home-switch-search-enabled')).tap();
    await expect(
      element(by.type(CLASS_NAME_UI_SEARCH_BAR_TEXT_FIELD)),
    ).not.toBeVisible();
  });

  it('searchBar value should stay in text field after coming back from another screen', async () => {
    await element(by.id('home-switch-search-enabled')).tap();

    await element(by.type(CLASS_NAME_UI_SEARCH_BAR_TEXT_FIELD)).replaceText(
      'Item 2',
    );
    await element(by.id('home-button-open-second')).tap();

    await tapBarBackButton();

    await expect(
      element(by.type(CLASS_NAME_UI_SEARCH_BAR_TEXT_FIELD)),
    ).toBeVisible();
    await expect(
      element(by.type(CLASS_NAME_UI_SEARCH_BAR_TEXT_FIELD)),
    ).toHaveText('Item 2');
  });
});
