import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';

// headerLargeTitle is supported only on iOS
describeIfiOS('Test645', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test645 should exist', async () => {
    await selectIssueTestScreen('Test645');
  });

  it('header large title "Main" should be fully visible', async () => {
    await expect(
      element(
        by.text('Main').withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('large title should collapse after scrolling down', async () => {
    await element(by.id('main-scrollview')).scroll(200, 'down', NaN, 0.85);
    await expect(
      element(
        by.text('Main').withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).not.toBeVisible();
  });

  it('large title should reappear after scrolling to top', async () => {
    await element(by.id('main-scrollview')).scroll(250, 'up', NaN, 0.85);
    await expect(
      element(
        by.text('Main').withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('header large title "Details" should be fully visible', async () => {
    await element(by.id('home-button-go-to-details')).tap();
    await expect(
      element(
        by
          .text('Details')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('header large title "Settings" should be fully visible', async () => {
    await element(by.id('details-button-go-to-settings')).tap();
    await expect(
      element(
        by
          .text('Settings')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('header large title "Main" should be fully visible after coming back from Settings', async () => {
    await element(by.id('settings-button-go-to-home')).tap();
    await expect(
      element(
        by.text('Main').withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('header large title "Main" should be fully visible on Second tab screen', async () => {
    await element(by.id('home-button-go-to-second')).tap();
    await expect(
      element(
        by.text('Main').withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('header large title "Main" should be fully visible after coming back from Second tab screen', async () => {
    await element(by.id('second-button-go-back')).tap();
    await expect(
      element(
        by.text('Main').withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });
});
