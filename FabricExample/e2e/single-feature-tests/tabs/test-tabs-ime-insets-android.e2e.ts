import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { AndroidElementAttributes } from 'detox/detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

const {
  getCommandLineResponse,
} = require('../../../../scripts/e2e/command-line-helpers');

function readKeyboardTopAndroid(): number | null {
  const dump = getCommandLineResponse(
    `adb -s ${device.id} shell dumpsys window`,
  ) as string;
  const match = dump.match(
    /type=ime frame=\[\d+,(\d+)\]\[\d+,\d+\][^\n]*\bvisible=true\b/,
  );
  return match ? Number(match[1]) : null;
}

async function getKeyboardTopAndroid(): Promise<number> {
  let last: number | null = null;
  for (let i = 0; i < 20; i++) {
    const top = readKeyboardTopAndroid();
    if (top !== null && top === last) return top;
    last = top;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Soft keyboard did not become visible on Android');
}

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
    const kbTop = await getKeyboardTopAndroid();

    jestExpect(yTabAfter).toEqual(yTabBefore);
    jestExpect(yTextAfter).toEqual(yTextBefore);
    jestExpect(
      yTabAfter + (await getTabBarItemAttrs()).frame.height,
    ).toBeGreaterThan(kbTop);
    jestExpect(
      yTextAfter + (await getTextAttrs()).frame.height,
    ).toBeGreaterThan(kbTop);

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
    const kbTop = await getKeyboardTopAndroid();

    jestExpect(yTabAfter).toBeLessThan(yTabBefore);
    jestExpect(yTextAfter).toBeLessThan(yTextBefore);
    jestExpect(yTextAfter).toBeLessThan(yTabAfter);
    jestExpect(
      yTabAfter + (await getTabBarItemAttrs()).frame.height,
    ).toBeLessThanOrEqual(kbTop);
    jestExpect(
      yTextAfter + (await getTextAttrs()).frame.height,
    ).toBeLessThanOrEqual(kbTop);

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
    const kbTop = await getKeyboardTopAndroid();

    jestExpect(
      yTabAfter + (await getTabBarItemAttrs()).frame.height,
    ).toBeLessThanOrEqual(kbTop);
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
    const kbTop = await getKeyboardTopAndroid();

    jestExpect(yTabAfter).toEqual(yTabBefore);
    jestExpect(yTextAfter).toEqual(yTextBefore);
    jestExpect(
      yTabAfter + (await getTabBarItemAttrs()).frame.height,
    ).toBeGreaterThan(kbTop);
    jestExpect(
      yTextAfter + (await getTextAttrs()).frame.height,
    ).toBeGreaterThan(kbTop);

    await device.pressBack();
  });
});
