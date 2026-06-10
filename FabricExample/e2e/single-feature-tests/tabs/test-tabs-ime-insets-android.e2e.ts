import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { AndroidElementAttributes } from 'detox/detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

async function getTabBarItemY(): Promise<number> {
  const attrs = (await element(
    by.id('ime-insets-config-tab-item'),
  ).getAttributes()) as AndroidElementAttributes;
  return attrs.frame.y;
}
async function getTextY(): Promise<number> {
  const attrs = (await element(
    by.id('tabs-screen-bottom-text'),
  ).getAttributes()) as AndroidElementAttributes;
  return attrs.frame.y;
}

async function navigateToScreen() {
  await device.reloadReactNative();
  await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-ime-insets-android');
}

describeIfAndroid('Tabs: tabBarRespectsIMEInsets', () => {
  beforeEach(async () => {
    await navigateToScreen();
  });

  it('should display default switch states and bottom text on load', async () => {
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toBeVisible();
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toBeVisible();
    await expect(element(by.id('ime-insets-text-input'))).toBeVisible();

    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: true',
    );
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: false');

    await expect(element(by.id('tabs-screen-bottom-text'))).toBeVisible();
  });

  it('tabBarRespectsIMEInsets: false — tab bar Y stays constant when keyboard opens', async () => {
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: false');

    const yBefore = await getTabBarItemY();
    const yTextBefore = await getTabBarItemY();
    await element(by.id('ime-insets-text-input')).tap();
    const yAfter = await getTabBarItemY();
    const yTextAfter = await getTabBarItemY();

    jestExpect(Math.abs(yAfter - yBefore)).toBeLessThan(5);
    jestExpect(Math.abs(yTextAfter - yTextBefore)).toBeLessThan(5);

    await device.pressBack();
  });

  it('tabBarRespectsIMEInsets: true — tab bar shifts above keyboard when keyboard opens', async () => {
    await element(by.id('tab-bar-respects-ime-insets-switch')).tap();
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: true');

    const yBefore = await getTabBarItemY();
    const yTextBefore = await getTabBarItemY();
    await element(by.id('ime-insets-text-input')).tap();
    const yAfter = await getTabBarItemY();
    const yTextAfter = await getTabBarItemY();

    jestExpect(yAfter).toBeLessThan(yBefore);
    jestExpect(yTextAfter).toBeLessThan(yTextBefore);

    await device.pressBack();
    const yRestored = await getTabBarItemY();
    jestExpect(Math.abs(yRestored - yBefore)).toBeLessThan(5);
  });

  it('safeAreaViewBottomEdgeEnabled: false + tabBarRespectsIMEInsets: true — tab bar still shifts above keyboard', async () => {
    await element(by.id('safe-area-bottom-edge-switch')).tap();
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: false',
    );

    await element(by.id('tab-bar-respects-ime-insets-switch')).tap();
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: true');

    const yBefore = await getTabBarItemY();
    const yText = await getTextY();
    jestExpect(yText).toBeGreaterThan(yBefore);

    await element(by.id('ime-insets-text-input')).tap();
    const yAfter = await getTabBarItemY();

    jestExpect(yAfter).toBeLessThan(yBefore);

    await device.pressBack();
  });

  it('both props false — tab bar stays at bottom when keyboard opens', async () => {
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: true',
    );
    await element(by.id('safe-area-bottom-edge-switch')).tap();
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: false',
    );

    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: false');

    const yBefore = await getTabBarItemY();
    const yText = await getTextY();
    jestExpect(yText).toBeGreaterThan(yBefore);

    await element(by.id('ime-insets-text-input')).tap();
    const yAfter = await getTabBarItemY();

    jestExpect(Math.abs(yAfter - yBefore)).toBeLessThan(5);

    await device.pressBack();
  });
});
