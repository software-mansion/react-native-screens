import { device, expect, element, by } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should have root screen', async () => {
    await expect(element(by.id('root-screen-examples-header'))).toBeVisible();
  });
});
