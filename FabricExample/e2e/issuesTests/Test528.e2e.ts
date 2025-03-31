import { device, expect, element, by } from 'detox';

describe('Test528', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test528 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test528')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test528'))).toBeVisible();
    await element(by.id('root-screen-tests-Test528')).tap();
  });

  // Detox currently supports orientation only on iOS
  if (device.getPlatform() === 'ios') {
    it('headerRight button should be visible after orientation change', async () => {
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
      await device.setOrientation('landscape');
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
      await device.setOrientation('portrait');
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
    });

    it('headerRight button should be visible after coming back from horizontal screen', async () => {
      await element(by.text('Go to Screen 2')).tap();
      await device.setOrientation('landscape');
      await element(by.id('BackButton')).tap();
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
      await device.setOrientation('portrait');
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
    });
  }
});
