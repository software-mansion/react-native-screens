import { device, expect, element, by } from 'detox';

describe('Test528', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should Test528 exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test528')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test528'))).toBeVisible();
    await element(by.id('root-screen-tests-Test528')).tap();
  });

  // Detox currently supports orientation only on iOS
  if (device.getPlatform() === 'ios') {
    it('displays headerRight button after orientation change on Screen1', async () => {
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
      await device.setOrientation('landscape');
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
      await device.setOrientation('portrait');
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
    });

    it('displays headerRight button on Screen1 after orientation change on Screen2', async () => {
      await element(by.text('Go to Screen 2')).tap();
      await device.setOrientation('landscape');
      await element(by.id('BackButton')).tap();
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
      await device.setOrientation('portrait');
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
    });
  }
});
