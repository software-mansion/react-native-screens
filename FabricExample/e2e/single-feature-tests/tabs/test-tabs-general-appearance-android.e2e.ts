import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

async function selectLabelVisibilityMode(
  mode: 'auto' | 'selected' | 'labeled' | 'unlabeled',
) {
  await element(
    by.id('general-appearance-android-label-visibility-picker'),
  ).tap();
  await element(by.id(`tabbaritemlabelvisibilitymode-${mode}`)).tap();
  await expect(
    element(by.id('general-appearance-android-label-visibility-picker')),
  ).toHaveLabel(`tabBarItemLabelVisibilityMode: ${mode}`);
  await element(
    by.id('general-appearance-android-label-visibility-picker'),
  ).tap();
}

describeIfAndroid(
  'Tab Bar General Appearance (Android) - tabBarItemLabelVisibilityMode',
  () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-general-appearance-android',
      );
      await element(by.id('general-appearance-android-tab-label')).tap();
    });

    it('auto mode shows label only on the selected tab', async () => {
      await expect(
        element(by.id('general-appearance-android-label-visibility-picker')),
      ).toHaveLabel('tabBarItemLabelVisibilityMode: auto');

      await expect(
        element(
          by
            .text('Label')
            .withAncestor(by.id('general-appearance-android-tab-label')),
        ),
      ).toBeVisible();
      await expect(
        element(
          by
            .text('Default')
            .withAncestor(by.id('general-appearance-android-tab-default')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Ripple')
            .withAncestor(by.id('general-appearance-android-tab-ripple')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Indicator')
            .withAncestor(by.id('general-appearance-android-tab-indicator')),
        ),
      ).not.toExist();
    });

    it('labeled mode makes all tab bar item titles visible', async () => {
      await selectLabelVisibilityMode('labeled');

      await expect(
        element(by.id('general-appearance-android-tab-default')),
      ).toBeVisible();
      await expect(
        element(by.id('general-appearance-android-tab-label')),
      ).toBeVisible();
      await expect(
        element(by.id('general-appearance-android-tab-ripple')),
      ).toBeVisible();
      await expect(
        element(by.id('general-appearance-android-tab-indicator')),
      ).toBeVisible();
    });

    it('should fallback to default auto mode and persist custom label mode settings across tab switches', async () => {
      await element(by.id('general-appearance-android-tab-default')).tap();

      await expect(
        element(
          by
            .text('Default')
            .withAncestor(by.id('general-appearance-android-tab-default')),
        ),
      ).toBeVisible();
      await expect(
        element(
          by
            .text('Label')
            .withAncestor(by.id('general-appearance-android-tab-label')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Ripple')
            .withAncestor(by.id('general-appearance-android-tab-ripple')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Indicator')
            .withAncestor(by.id('general-appearance-android-tab-indicator')),
        ),
      ).not.toExist();

      await element(by.id('general-appearance-android-tab-label')).tap();

      await expect(
        element(by.id('general-appearance-android-tab-default')),
      ).toBeVisible();
      await expect(
        element(by.id('general-appearance-android-tab-label')),
      ).toBeVisible();
      await expect(
        element(by.id('general-appearance-android-tab-ripple')),
      ).toBeVisible();
      await expect(
        element(by.id('general-appearance-android-tab-indicator')),
      ).toBeVisible();
    });

    it('unlabeled mode hides all tab bar item titles', async () => {
      await selectLabelVisibilityMode('unlabeled');

      await expect(
        element(
          by
            .text('Label')
            .withAncestor(by.id('general-appearance-android-tab-label')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Default')
            .withAncestor(by.id('general-appearance-android-tab-default')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Ripple')
            .withAncestor(by.id('general-appearance-android-tab-ripple')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Indicator')
            .withAncestor(by.id('general-appearance-android-tab-indicator')),
        ),
      ).not.toExist();
    });

    it('selected mode shows label only on the selected tab', async () => {
      await selectLabelVisibilityMode('selected');

      await expect(
        element(
          by
            .text('Label')
            .withAncestor(by.id('general-appearance-android-tab-label')),
        ),
      ).toBeVisible();

      await expect(
        element(
          by
            .text('Default')
            .withAncestor(by.id('general-appearance-android-tab-default')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Ripple')
            .withAncestor(by.id('general-appearance-android-tab-ripple')),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .text('Indicator')
            .withAncestor(by.id('general-appearance-android-tab-indicator')),
        ),
      ).not.toExist();
    });
  },
);
