import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';

// headerLargeTitle is supported only on iOS
describeIfiOS('Test649', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test649 should exist', async () => {
    await selectIssueTestScreen('Test649');
  });

  it('header large title "First" should be fully visible', async () => {
    await expect(
      element(
        by
          .text('First')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('header title "Second" should not be a large title', async () => {
    await element(by.id('first-button-go-to-second')).tap();
    await expect(
      element(
        by
          .text('Second')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).not.toBeVisible(100);
  });

  it('header large title "First" should be fully visible after coming back from Second', async () => {
    await element(by.id('second-button-go-to-first')).tap();
    await expect(
      element(
        by
          .text('First')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });
});
