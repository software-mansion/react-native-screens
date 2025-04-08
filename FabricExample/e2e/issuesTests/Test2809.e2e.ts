import { device, expect, element, by } from 'detox';
import { describeIfiOS } from '../e2e-utils';


describeIfiOS('Test2809', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2809 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test2809')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test2809'))).toBeVisible();
    await element(by.id('root-screen-tests-Test2809')).tap();
  });

  it('backButtonDisplayMode: default works for name prop', async () => {
    await element(by.text('DefaultHeader')).tap();
    await element(by.text('Open screen')).tap();
    // Check if default title is visible properly considering the backButtonDisplayMode
    await expect(element(by.text('Back'))).toBeVisible();
    await expect(element(by.text('LongLongLongLongLong'))).not.toBeVisible();
    // Check if backButtonMenu works
    await element(by.text('Back')).longPressAndDrag(700, NaN, NaN, element(by.text('VOID')), NaN, NaN, "fast", 0); // open
    await expect(element(by.text('LongLongLongLongLong'))).toBeVisible();
    await element(by.text('VOID')).tap(); // close
    await waitFor(element(by.text('LongLongLongLongLong'))).not.toBeVisible().withTimeout(1000);
    // Go back
    await element(by.text('Pop to top')).tap();
  });

  it('backButtonDisplayMode: default works for custom back title', async () => {
    await element(by.text('CustomBackLongTitle')).tap();
    await element(by.text('Open screen')).tap();
    // Check if default title is visible properly considering the backButtonDisplayMode
    await expect(element(by.text('Back'))).toBeVisible();
    await expect(element(by.text('CustomLongLongTitle'))).not.toBeVisible();
    // Check if backButtonMenu works
    await element(by.text('Back')).longPressAndDrag(700, NaN, NaN, element(by.text('VOID')), NaN, NaN, "fast", 0); // open
    await expect(element(by.text('CustomLongLongTitle'))).toBeVisible();
    await element(by.text('VOID')).tap(); // close
    await waitFor(element(by.text('CustomLongLongTitle'))).not.toBeVisible().withTimeout(1000);
    // Go back
    await element(by.text('Pop to top')).tap();
  });

  it('headerBackTitle props works', async () => {
   await element(by.text('CustomBackTitle')).tap();
   await element(by.text('Open screen')).tap();
   await expect(element(by.text('CustomTitle'))).toBeVisible();
    // Go back
    await element(by.text('Pop to top')).tap();
 });
});
