import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { AndroidElementAttributes } from 'detox/detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

async function getTabBarItemAttrs(): Promise<AndroidElementAttributes> {
  const attrs = (await element(
    by.id('ime-insets-config-tab-item'),
  ).getAttributes()) as AndroidElementAttributes;
  return attrs;
}
async function getTextAttrs(): Promise<AndroidElementAttributes> {
  const attrs = (await element(
    by.id('tabs-screen-bottom-text'),
  ).getAttributes()) as AndroidElementAttributes;
  return attrs;
}

describeIfAndroid('Tabs: tabBarRespectsIMEInsets', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-ime-insets-android',
    );
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

    const yTabBefore = (await getTabBarItemAttrs()).frame.y;
    const yTextBefore = (await getTextAttrs()).frame.y;

    await element(by.id('ime-insets-text-input')).tap();

    const yTabAfter = (await getTabBarItemAttrs()).frame.y;
    const yTextAfter = (await getTextAttrs()).frame.y;

    jestExpect(yTabAfter).toEqual(yTabBefore);
    jestExpect(yTextAfter).toEqual(yTextBefore);

    await device.pressBack();
  });

  it('tabBarRespectsIMEInsets: true — tab bar shifts above keyboard when keyboard opens', async () => {
    await element(by.id('tab-bar-respects-ime-insets-switch')).tap();
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: true');

    const yTabBefore = (await getTabBarItemAttrs()).frame.y;
    const yTextBefore = (await getTextAttrs()).frame.y;

    await element(by.id('ime-insets-text-input')).tap();

    const yTabAfter = (await getTabBarItemAttrs()).frame.y;
    const yTextAfter = (await getTextAttrs()).frame.y;

    jestExpect(yTabAfter).toBeLessThan(yTabBefore);
    jestExpect(yTextAfter).toBeLessThan(yTextBefore);
    jestExpect(yTextAfter).toBeLessThan(yTabAfter);

    await device.pressBack();

    const yTabRestored = (await getTabBarItemAttrs()).frame.y;

    jestExpect(yTabRestored).toEqual(yTabBefore);
  });

  it('safeAreaViewBottomEdgeEnabled: false + tabBarRespectsIMEInsets: true — tab bar still shifts above keyboard', async () => {
    await element(by.id('safe-area-bottom-edge-switch')).tap();
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: false',
    );
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: true');

    const yTabBefore = (await getTabBarItemAttrs()).frame.y;
    const yTextBefore = (await getTextAttrs()).frame.y;

    jestExpect(yTextBefore).toBeGreaterThan(yTabBefore);

    await element(by.id('ime-insets-text-input')).tap();

    const yTabAfter = (await getTabBarItemAttrs()).frame.y;
    const yTextAfter = (await getTextAttrs()).frame.y;

    jestExpect(yTabAfter).toBeLessThan(yTabBefore);
    jestExpect(yTextAfter).toEqual(yTextBefore);

    await device.pressBack();
  });

  it('both props false — tab bar stays at bottom when keyboard opens', async () => {
    await element(by.id('tab-bar-respects-ime-insets-switch')).tap();
    await expect(element(by.id('safe-area-bottom-edge-switch'))).toHaveLabel(
      'safeAreaViewBottomEdgeEnabled: false',
    );
    await expect(
      element(by.id('tab-bar-respects-ime-insets-switch')),
    ).toHaveLabel('tabBarRespectsIMEInsets: false');

    const yTabBefore = (await getTabBarItemAttrs()).frame.y;
    const yTextBefore = (await getTextAttrs()).frame.y;
    jestExpect(yTextBefore).toBeGreaterThan(yTabBefore);

    await element(by.id('ime-insets-text-input')).tap();

    const yTabAfter = (await getTabBarItemAttrs()).frame.y;
    const yTextAfter = (await getTextAttrs()).frame.y;

    jestExpect(yTabAfter).toEqual(yTabBefore);
    jestExpect(yTextAfter).toEqual(yTextBefore);

    await device.pressBack();
  });
});
