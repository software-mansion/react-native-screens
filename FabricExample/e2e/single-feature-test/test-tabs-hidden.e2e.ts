import { device, expect, element, by } from 'detox';

describe('Test tab bar hidden', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should be hidden', async () => {
    await expect(
      element(by.id('root-screen-example-SimpleNativeStack')),
    ).toBeVisible();
    await element(by.id('root-screen-example-SimpleNativeStack')).tap();
    await expect(
      element(by.id('simple-native-stack-go-to-detail')),
    ).toBeVisible();
  });

  it('should be visible', async () => {
    await element(by.id('simple-native-stack-go-to-detail')).tap();
    await expect(
      element(by.id('simple-native-stack-detail-go-back')),
    ).toBeVisible();
  });
});
