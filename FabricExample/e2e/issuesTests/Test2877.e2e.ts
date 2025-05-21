import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectTestScreen } from '../e2e-utils';

// issue fixed only on iOS at the moment
describeIfiOS('Test2877', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2877 should exist', async () => {
    await selectTestScreen('Test2877');
  });

  it('formSheet should open without hidden content', async () => {
    await element(by.id('home-button-open-formsheet')).tap();

    await expect(element(by.text('Like this.'))).not.toBeVisible();
  });

  it('formSheet should adapt height to appearing content, making it visible after 1 second', async () => {
    await waitFor(element(by.text('Like this.')))
      .toBeVisible(100)
      .withTimeout(1200);
  });

  it('additional content in the formSheet should hide after 1 second', async () => {
    await waitFor(element(by.text('Like this.')))
      .not.toBeVisible(100)
      .withTimeout(1200);
  });
});
