import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { AndroidElementAttributes, IosElementAttributes } from 'detox/detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

async function getElementAttributes(
  testLabel: string,
): Promise<ElementAttributes> {
  const attrs = await element(by.label(testLabel)).getAttributes();
  return attrs as ElementAttributes;
}

async function scrollTo(selector: { id: string } | { text: string }) {
  const el =
    'text' in selector
      ? element(by.text(selector.text))
      : element(by.id(selector.id));

  await waitFor(el)
    .toBeVisible()
    .whileElement(by.id('tab-bar-layout-direction-scrollview'))
    .scroll(100, 'down');
}

async function selectDirection(direction: 'inherit' | 'rtl' | 'ltr') {
  await scrollTo({ id: 'tab-bar-layout-direction-picker' });
  await element(by.id('tab-bar-layout-direction-picker')).tap();
  await scrollTo({ text: direction });
  await element(by.text(direction)).tap();
  await element(by.id('tab-bar-layout-direction-picker')).tap();
  await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
    `direction: ${direction}`,
  );
}
const expectTab1ToBeLeftOfTab2 = async (shouldBeLeft: boolean) => {
  const t1 = await getElementAttributes('tab-bar-item-1-label');
  const t2 = await getElementAttributes('tab-bar-item-2-label');
  if (shouldBeLeft) {
    jestExpect(t2.frame.x).toBeGreaterThan(t1.frame.x);
  } else {
    jestExpect(t1.frame.x).toBeGreaterThan(t2.frame.x);
  }
};

describe('Tab Bar Layout Direction - system settings: LTR', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-layout-direction',
    );
  });

  it('displays default options and renders Tab1 at the visually leftmost position (LTR)', async () => {
    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();
    await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
      'forceRTL: false',
    );
    await expect(element(by.id('react-allow-rtl-picker'))).toHaveLabel(
      'allowRTL: true',
    );
    await scrollTo({ id: 'tab-bar-layout-direction-picker' });
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );
    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == false',
    );
  });

  it('follows system LTR settings when direction is set to inherit', async () => {
    await selectDirection('inherit');

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab2attrs.frame.x).toBeGreaterThan(tab1attrs.frame.x);
  });

  it('overrides system LTR settings and renders the tab bar in RTL order', async () => {
    await selectDirection('rtl');

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab1attrs.frame.x).toBeGreaterThan(tab2attrs.frame.x);
  });

  it('remains in LTR order when direction is explicitly set to ltr', async () => {
    await selectDirection('ltr');

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab2attrs.frame.x).toBeGreaterThan(tab1attrs.frame.x);
  });

  it('cycle through inherit → rtl → ltr → rtl → inherit renders the tab bar in correct order', async () => {
    await selectDirection('inherit');
    await expectTab1ToBeLeftOfTab2(true);
    await selectDirection('rtl');
    await expectTab1ToBeLeftOfTab2(false);

    await selectDirection('ltr');
    await expectTab1ToBeLeftOfTab2(true);

    await selectDirection('rtl');
    await expectTab1ToBeLeftOfTab2(false);

    await selectDirection('inherit');
    await expectTab1ToBeLeftOfTab2(true);
  });
});

describe('Tab Bar Layout Direction - system settings: RTL', () => {
  beforeAll(async () => {
    if (device.getPlatform() === 'ios') {
      await device.launchApp({
        newInstance: true,
        launchArgs: {
          AppleTextDirection: 'YES',
          NSForceRightToLeftWritingDirection: 'YES',
          I18NIsRTL: 'YES',
        },
      });
    } else {
      await device.launchApp({ newInstance: true });
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
      await element(by.id('react-force-rtl-picker')).tap();
      await device.reloadReactNative();
    }
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-layout-direction',
    );
  });

  afterAll(async () => {
    if (device.getPlatform() === 'ios') {
      await device.launchApp({
        newInstance: true,
        launchArgs: {
          AppleTextDirection: 'NO',
          NSForceRightToLeftWritingDirection: 'NO',
          I18NIsRTL: 'NO',
        },
      });
    } else {
      await device.launchApp({ newInstance: true });
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
      await element(by.id('react-force-rtl-picker')).multiTap(2);
      await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
        'forceRTL: false',
      );
      await device.reloadReactNative();
    }
  });

  it('displays default options and renders Tab2 at the visually leftmost position (RTL)', async () => {
    await selectDirection('inherit');

    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();
    await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
      'forceRTL: false',
    );
    await expect(element(by.id('react-allow-rtl-picker'))).toHaveLabel(
      'allowRTL: true',
    );
    await scrollTo({ id: 'tab-bar-layout-direction-picker' });
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );
    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == true',
    );
  });

  it('follows system RTL settings when direction is set to inherit', async () => {
    await selectDirection('inherit');

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab1attrs.frame.x).toBeGreaterThan(tab2attrs.frame.x);
  });

  it('remains in RTL order when direction is explicitly set to rtl', async () => {
    await selectDirection('rtl');

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab1attrs.frame.x).toBeGreaterThan(tab2attrs.frame.x);
  });

  it('overrides system RTL settings and renders the tab bar in LTR order', async () => {
    await selectDirection('ltr');

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab2attrs.frame.x).toBeGreaterThan(tab1attrs.frame.x);
  });

  it('cycle through inherit → ltr → rtl → ltr → inherit renders the tab bar in correct order', async () => {
    await selectDirection('inherit');
    await expectTab1ToBeLeftOfTab2(false);

    await selectDirection('ltr');
    await expectTab1ToBeLeftOfTab2(true);

    await selectDirection('rtl');
    await expectTab1ToBeLeftOfTab2(false);

    await selectDirection('ltr');
    await expectTab1ToBeLeftOfTab2(true);

    await selectDirection('inherit');
    await expectTab1ToBeLeftOfTab2(false);
  });
});
