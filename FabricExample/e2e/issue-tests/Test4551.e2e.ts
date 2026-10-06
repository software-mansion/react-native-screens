import { by, device, element, expect, waitFor } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { describeIfAndroid } from '@e2e/framework/platform';

describeIfAndroid('Test4551', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectIssueTestScreen('Test4551');
  });

  it('refreshes covered screens after repeated orientation round trips', async () => {
    const counter = element(by.id('orientation-counter'));
    await counter.tap({ x: 20, y: 10 });
    await expect(element(by.id('orientation-restored'))).toHaveText(
      'Layout restored: true',
    );
    await element(by.id('push-covered')).tap();
    await element(by.id('push-landscape')).tap();
    await element(by.id('return-portrait')).tap();
    await element(by.id('return-home')).tap();
    await waitFor(counter).toBeVisible().withTimeout(5000);

    // A motionless tap can fire onPress despite stale shadow coordinates. A short swipe
    // adds the MOVE events of a normal finger tap while staying inside the press region.
    await counter.swipe('right', 'slow', 0.2, 0.5, 0.2);
    await expect(element(by.id('orientation-count'))).toHaveText(
      `Presses: 2`,
    );
    await expect(element(by.id('orientation-restored'))).toHaveText(
      'Layout restored: true',
    );
    await expect(element(by.id('orientation-inside'))).toHaveText(
      'Touch inside measured bounds: true',
    );

  });
});
