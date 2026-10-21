import { device, element, by } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { tapBarBackButton } from '@e2e/framework/back-button';
import { expectHeaderViewShown } from '@e2e/framework/header-items-ios';

describe('Test432', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test432 should exist', async () => {
    await selectIssueTestScreen('Test432');
  });

  it('headerRight element should be fully visible', async () => {
    await expectHeaderViewShown(by.id('home-headerRight'), 100);
  });

  it('headerRight elements should toggle and stay fully visible', async () => {
    await element(by.id('home-button-go-to-details')).tap();
    await expectHeaderViewShown(by.id('details-headerRight-red'), 100);

    await element(by.id('details-button-toggle-subviews')).tap();
    // On Android, we need to wait for some elements (e.g. at first, this square is only 25% visible)
    waitFor(element(by.id('details-headerRight-green'))).toBeVisible(100);

    await element(by.id('details-button-toggle-subviews')).tap();
    await expectHeaderViewShown(by.id('details-headerRight-red'), 100);

    if (device.getPlatform() === 'ios') {
      await tapBarBackButton();
    } else {
      await device.pressBack();
    }

    await expectHeaderViewShown(by.id('home-headerRight'), 100);
  });

  it('headerLeft and headerRight elements should toggle and stay fully visible', async () => {
    await element(by.id('home-button-go-to-info')).tap();
    await expectHeaderViewShown(by.id('info-headerRight-green-1'), 100);

    await element(by.id('info-button-toggle-subviews')).tap();
    waitFor(element(by.id('info-headerRight-green-1'))).toBeVisible(100);
    waitFor(element(by.id('info-headerRight-green-2'))).toBeVisible(100);
    waitFor(element(by.id('info-headerLeft-red'))).toBeVisible(100);

    await element(by.id('info-button-toggle-subviews')).tap();
    waitFor(element(by.id('info-headerRight-green-1'))).toBeVisible(100);

    if (device.getPlatform() === 'ios') {
      await tapBarBackButton();
    } else {
      await device.pressBack();
    }

    await expectHeaderViewShown(by.id('home-headerRight'), 100);
  });

  it('headerRight element on modal should be fully visible', async () => {
    await element(by.id('home-button-show-settings')).tap();
    await expectHeaderViewShown(by.id('settings-headerRight'), 100);

    if (device.getPlatform() === 'ios') {
      await element(by.id('settings-text')).swipe('down', 'fast');
    } else {
      await device.pressBack();
    }
    await expectHeaderViewShown(by.id('home-headerRight'), 100);
  });
});
