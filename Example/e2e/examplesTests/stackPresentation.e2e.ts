import { device, expect, element, by } from 'detox';

describe('Simple Stack Presentation', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should go to main screen', async () => {
    await expect(
      element(by.id('root-screen-example-StackPresentation'))
    ).toBeVisible();
    await element(by.id('root-screen-example-StackPresentation')).tap();
    await expect(
      element(by.id('stack-presentation-root-scroll-view'))
    ).toBeVisible();
  });

  it('should push form screen', async () => {
    await element(by.id('stack-presentation-push-button')).tap();
    await expect(
      element(by.id('stack-presentation-form-screen-go-back-button'))
    ).toBeVisible();
    await element(by.id('stack-presentation-form-screen-go-back-button')).tap();
    await expect(
      element(by.id('stack-presentation-root-scroll-view'))
    ).toBeVisible();
  });

  it('should open modal', async () => {
    await element(by.id('stack-presentation-modal-button')).tap();
    await expect(
      element(by.id('stack-presentation-modal-screen-go-back-button'))
    ).toBeVisible();
    await element(
      by.id('stack-presentation-modal-screen-go-back-button')
    ).tap();
    await expect(
      element(by.id('stack-presentation-root-scroll-view'))
    ).toBeVisible();
  });
});
