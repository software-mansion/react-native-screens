import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  getSingleMatch,
  scrollUntilVisible,
} from '../../e2e-utils';
import { selectSingleFeatureTestsScreen } from '../../elements/test-screen-navigation';
import { selectPickerOption } from '../../elements/settings-controls';

const SCROLLVIEW_ID = 'tab-bar-layout-direction-scrollview';

// Small steps — a larger one can scroll a short picker row past the viewport.
const SCROLL_STEP = 100;

async function scrollTo(id: string) {
  await scrollUntilVisible(id, SCROLLVIEW_ID, { pixels: SCROLL_STEP });
}

async function selectDirection(direction: 'inherit' | 'rtl' | 'ltr') {
  await selectPickerOption(
    {
      pickerId: 'tab-bar-layout-direction-picker',
      label: 'direction',
      option: direction,
    },
    { scrollViewId: SCROLLVIEW_ID, pixels: SCROLL_STEP },
  );
}

async function expectTab1ToBeLeftOfTab2(shouldBeLeft: boolean) {
  const t1 = await getSingleMatch(by.label('tab-bar-item-1-label'));
  const t2 = await getSingleMatch(by.label('tab-bar-item-2-label'));
  if (shouldBeLeft) {
    jestExpect(t2.frame.x).toBeGreaterThan(t1.frame.x);
  } else {
    jestExpect(t1.frame.x).toBeGreaterThan(t2.frame.x);
  }
}

async function launchAppWithAttributes(launchArgs?: Record<string, any>) {
  await device.launchApp({
    newInstance: true,
    ...(launchArgs && { launchArgs }),
  });
}

describe('Tab Bar Layout Direction - system/RN settings: LTR', () => {
  beforeAll(async () => {
    await launchAppWithAttributes();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-layout-direction',
    );
  });

  it('displays default options and renders Tab1 at the visually leftmost position (LTR)', async () => {
    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();

    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == false',
    );

    await scrollTo('tab-bar-layout-direction-picker');
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: ltr',
    );

    await expectTab1ToBeLeftOfTab2(true);
  });

  it('follows system/RN LTR settings when direction is set to inherit', async () => {
    await selectDirection('inherit');
    await expectTab1ToBeLeftOfTab2(true);
  });

  it('overrides system/RN LTR settings and renders the tab bar in rtl order', async () => {
    await selectDirection('rtl');
    await expectTab1ToBeLeftOfTab2(false);
  });

  it('renders the tab bar in ltr order when direction is explicitly set to ltr', async () => {
    await selectDirection('ltr');
    await expectTab1ToBeLeftOfTab2(true);
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

describe('Tab Bar Layout Direction - system/RN settings: RTL', () => {
  beforeAll(async () => {
    if (device.getPlatform() === 'ios') {
      await launchAppWithAttributes({
        NSForceRightToLeftWritingDirection: 'YES',
      });
    } else {
      await launchAppWithAttributes();
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
      await element(by.id('react-force-rtl-picker')).tap();
      await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
        'forceRTL: true',
      );
      await device.reloadReactNative();
    }
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-layout-direction',
    );
  });

  afterAll(async () => {
    if (device.getPlatform() === 'ios') {
      await launchAppWithAttributes({
        NSForceRightToLeftWritingDirection: 'NO',
      });
    } else {
      await launchAppWithAttributes();
    }
  });

  it('displays default options and renders Tab2 at the visually leftmost position (RTL)', async () => {
    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();

    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == true',
    );

    await scrollTo('tab-bar-layout-direction-picker');
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: rtl',
    );

    await expectTab1ToBeLeftOfTab2(false);
  });

  it('follows system/RN RTL settings when direction is set to inherit', async () => {
    await selectDirection('inherit');
    await expectTab1ToBeLeftOfTab2(false);
  });

  it('overrides system RTL settings and renders the tab bar in ltr order', async () => {
    await selectDirection('ltr');
    await expectTab1ToBeLeftOfTab2(true);
  });

  it('renders the tab bar in rtl order when direction is explicitly set to rtl', async () => {
    await selectDirection('rtl');
    await expectTab1ToBeLeftOfTab2(false);
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

describeIfiOS(
  'iOS only: Tab Bar Layout Direction - system settings: RTL and RN settings: LTR',
  () => {
    beforeAll(async () => {
      await launchAppWithAttributes({
        NSForceRightToLeftWritingDirection: 'YES',
      });
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
      await element(by.id('react-allow-rtl-picker')).tap();
      await expect(element(by.id('react-allow-rtl-picker'))).toHaveLabel(
        'allowRTL: false',
      );

      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
    });

    afterAll(async () => {
      await launchAppWithAttributes({
        NSForceRightToLeftWritingDirection: 'NO',
      });
    });

    it('displays default options and renders Tab1 at the visually leftmost position (LTR)', async () => {
      await expect(
        element(by.id('tab-bar-layout-direction-scrollview')),
      ).toBeVisible();

      await expect(element(by.id('is-rtl-information'))).toHaveText(
        'I18nManager.isRTL == false',
      );

      await scrollTo('tab-bar-layout-direction-picker');
      await expect(
        element(by.id('tab-bar-layout-direction-picker')),
      ).toHaveLabel('direction: ltr');

      await expectTab1ToBeLeftOfTab2(true);
    });

    it('follows system RTL settings when direction is set to inherit', async () => {
      await selectDirection('inherit');
      await expectTab1ToBeLeftOfTab2(false);
    });

    it('overrides system RTL settings and renders the tab bar in ltr order', async () => {
      await selectDirection('ltr');
      await expectTab1ToBeLeftOfTab2(true);
    });

    it('renders the tab bar in rtl order when direction is explicitly set to rtl', async () => {
      await selectDirection('rtl');
      await expectTab1ToBeLeftOfTab2(false);
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
  },
);

describeIfiOS(
  'iOS only: Tab Bar Layout Direction - system settings: LTR and RN settings: RTL',
  () => {
    beforeAll(async () => {
      await launchAppWithAttributes();
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
      await element(by.id('react-force-rtl-picker')).tap();
      await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
        'forceRTL: true',
      );
      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
    });

    afterAll(async () => {
      await launchAppWithAttributes();
    });

    it('displays default options and renders Tab2 at the visually leftmost position (RTL)', async () => {
      await expect(
        element(by.id('tab-bar-layout-direction-scrollview')),
      ).toBeVisible();

      await expect(element(by.id('is-rtl-information'))).toHaveText(
        'I18nManager.isRTL == true',
      );

      await scrollTo('tab-bar-layout-direction-picker');
      await expect(
        element(by.id('tab-bar-layout-direction-picker')),
      ).toHaveLabel('direction: rtl');

      await expectTab1ToBeLeftOfTab2(false);
    });

    it('follows system LTR settings when direction is set to inherit', async () => {
      await selectDirection('inherit');
      await expectTab1ToBeLeftOfTab2(true);
    });

    it('overrides system LTR settings and renders the tab bar in rtl order', async () => {
      await selectDirection('rtl');
      await expectTab1ToBeLeftOfTab2(false);
    });

    it('renders the tab bar in ltr order when direction is explicitly set to ltr', async () => {
      await selectDirection('ltr');
      await expectTab1ToBeLeftOfTab2(true);
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
  },
);
