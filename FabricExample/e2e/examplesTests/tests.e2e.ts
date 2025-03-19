import { device, expect, element, by } from 'detox';

describe('Test432', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should Test432 exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test432')))
    .toBeVisible()
    .whileElement(by.id('root-screen-examples-scrollview'))
    .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test432'))).toBeVisible();
    await element(by.id('root-screen-tests-Test432')).tap();
  });

  it('home-square should be fully visible', async () => {
    await expect(element(by.id('home-square'))).toBeVisible(100);
  });

  it('squares from details screen should be fully visible', async () => {
    await element(by.id('go-to-details')).tap();
    await expect(element(by.id('details-red-square'))).toBeVisible(100);

    await element(by.id('details-toggle-subviews')).tap();
    // On Android, we need to wait for some elements (e.g. at first, this square is only 25% visible)
    waitFor(element(by.id('details-green-square'))).toBeVisible(100);

    await element(by.id('details-toggle-subviews')).tap();
    await expect(element(by.id('details-red-square'))).toBeVisible(100);

    if (device.getPlatform() === 'ios') {
      await element(by.id('BackButton')).tap();
    } else {
      await device.pressBack();
    }

    await expect(element(by.id('home-square'))).toBeVisible(100);
  });

  it('squares from info screen should be fully visible', async () => {
    await element(by.id('go-to-info')).tap();
    await expect(element(by.id('info-green-square-1'))).toBeVisible(100);

    await element(by.id('info-toggle-subviews')).tap();
    waitFor(element(by.id('info-green-square-1'))).toBeVisible(100);
    waitFor(element(by.id('info-green-square-2'))).toBeVisible(100);
    waitFor(element(by.id('info-red-square'))).toBeVisible(100);

    await element(by.id('info-toggle-subviews')).tap();
    waitFor(element(by.id('info-green-square-1'))).toBeVisible(100);

    if (device.getPlatform() === 'ios') {
      await element(by.id('BackButton')).tap();
    } else {
      await device.pressBack();
    }

    await expect(element(by.id('home-square'))).toBeVisible(100);
  });

  it('squares from settings screen should be fully visible', async () => {
    await element(by.id('show-settings')).tap();
    await expect(element(by.id('settings-square'))).toBeVisible(100);

    if (device.getPlatform() === 'ios') {
      await element(by.id('settings-text')).swipe('down', 'fast');
    } else {
      await device.pressBack();
    }
    await expect(element(by.id('home-square'))).toBeVisible(100);
  });
});
