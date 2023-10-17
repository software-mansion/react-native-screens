import { device, expect, element, by } from 'detox';

describe('Simple Native Stack', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should go to main screen', async () => {
    await expect(
      element(by.id('root-screen-example-SimpleNativeStack'))
    ).toBeVisible();
    await element(by.id('root-screen-example-SimpleNativeStack')).tap();
    await expect(
      element(by.id('simple-native-stack-go-to-detail'))
    ).toBeVisible();
  });

  it('should go to detail screen', async () => {
    await element(by.id('simple-native-stack-go-to-detail')).tap();
    await expect(
      element(by.id('simple-native-stack-detail-go-back'))
    ).toBeVisible();
  });

  it('should go back to main screen', async () => {
    await element(by.id('simple-native-stack-detail-go-back')).tap();
    await expect(
      element(by.id('simple-native-stack-go-to-detail'))
    ).toBeVisible();
  });
});
