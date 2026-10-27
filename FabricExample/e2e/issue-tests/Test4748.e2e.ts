import { by, device, element, expect, waitFor } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import { describeIfIOS26 } from '@e2e/framework/platform';

describeIfIOS26('Test4748', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectIssueTestScreen('Test4748');
  });

  it('exposes tabBarItemTestID after a delayed Tabs.Host mount', async () => {
    await element(by.id('mount-delayed')).tap();
    await waitFor(element(by.id('content-home')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id('tab-cards')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('tab-cards')).tap();
    await expect(element(by.id('content-cards'))).toBeVisible();
  });

  it('updates and clears a tabBarItemTestID after the controls exist', async () => {
    await element(by.id('mount-immediate')).tap();
    await waitFor(element(by.id('content-home')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('rename-cards-id')).tap();
    await waitFor(element(by.id('tab-cards-next')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('tab-cards'))).not.toExist();

    await element(by.id('clear-cards-id')).tap();
    await waitFor(element(by.id('tab-cards-next')))
      .not.toExist()
      .withTimeout(5000);
  });

  it('exposes tabBarItemTestID when Tabs.Host mounts immediately', async () => {
    await element(by.id('mount-immediate')).tap();
    await waitFor(element(by.id('content-home')))
      .toBeVisible()
      .withTimeout(5000);
    // The selected tab is covered by the iOS 26 selection lens, so query another tab.
    await waitFor(element(by.id('tab-cards')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('tab-cards')).tap();
    await expect(element(by.id('content-cards'))).toBeVisible();
  });

  it('re-exposes tabBarItemTestID after Tabs.Host reattaches to a window', async () => {
    await element(by.id('mount-modal')).tap();
    await waitFor(element(by.id('tab-cards')))
      .toBeVisible()
      .withTimeout(5000);

    for (let cycle = 0; cycle < 2; cycle += 1) {
      await element(by.id('detach-tabs')).tap();
      await waitFor(element(by.id('tabs-detached')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('tab-cards'))).not.toExist();

      await element(by.id('reattach-tabs')).tap();
      await waitFor(element(by.id('tab-cards')))
        .toBeVisible()
        .withTimeout(5000);
    }

    await element(by.id('tab-cards')).tap();
    await expect(element(by.id('content-cards'))).toBeVisible();
  });
});
