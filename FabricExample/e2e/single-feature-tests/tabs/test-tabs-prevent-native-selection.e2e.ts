import { device, expect, element, by } from 'detox';
import {
  selectSingleFeatureTestsScreen,
  describeIfiPad,
} from '../../e2e-utils';
import {
  UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE,
  UI_BUTTON_TYPE,
  UI_TAB_SIDEBAR_CELL_TYPE,
} from '../../native-type-names';

describe('@smoke Tabs: preventNativeSelection', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-prevent-native-selection',
    );
  });

  it('should be set to false for First tab', async () => {
    await expect(
      element(by.id('tab-bar-prevent-native-selection-view')),
    ).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await expect(element(by.label('More'))).toExist();
    }
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
  });

  it('native selection of first tab should be blocked', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('Second')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('First')).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: First')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
  });

  it('programmatic navigation to first tab should not be blocked', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
    await element(by.id('first-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
  });

  it('native selection should be possible after disabling preventNativeSelection', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('Fourth')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
  });

  it('should work independently per tab', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.id('Third')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Third');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('Fourth')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('Third')).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: Third')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: Third')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
  });

  it('iOS only: for tabs hidden under More tab blocks native selection', async () => {
    if (device.getPlatform() !== 'ios') {
      return;
    }
    await element(by.id('fifth-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fifth');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );

    await element(by.id('sixth-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Sixth');
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );

    await element(by.id('first-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.label('More')).atIndex(0).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: Sixth')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: Sixth')).tap();
    await expect(element(by.label('Fifth'))).toBeVisible();
    await expect(element(by.label('Sixth'))).toBeVisible();

    await element(by.label('Fifth')).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: Fifth')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: Fifth')).tap();

    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.id('fifth-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fifth');
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );

    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fifth');
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();
  });
});

describeIfiPad(
  '@ipad Tabs: preventNativeSelection — iPad sidebar (tabSidebar mode)',
  () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-prevent-native-selection',
      );
    });

    it('should be set to false for First tab', async () => {
      await expect(
        element(by.id('tab-bar-prevent-native-selection-view')),
      ).toBeVisible();

      await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: false');
    });

    it('native selection of first tab should be blocked', async () => {
      await element(by.id('prevent-native-selection-button')).tap();
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: true');
      await element(
        by
          .id('Second')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: false');
      await element(
        by
          .id('First')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(
        element(by.label('1. onTabSelectionPrevented: First')),
      ).toBeVisible();
      await element(by.label('1. onTabSelectionPrevented: First')).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
    });

    it('programmatic navigation to first tab should not be blocked', async () => {
      await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
      await element(by.id('first-button')).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: true');
    });

    it('native selection should be possible after disabling preventNativeSelection', async () => {
      await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: true');
      await element(by.id('prevent-native-selection-button')).tap();
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: false');
      await element(
        by
          .id('Fourth')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
      await element(
        by
          .id('First')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: false');
    });

    it('should work independently per tab', async () => {
      await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
      await element(
        by
          .id('Third')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('Third');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: false');
      await element(by.id('prevent-native-selection-button')).tap();
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: true');
      await element(
        by
          .id('Fourth')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: false');
      await element(by.id('prevent-native-selection-button')).tap();
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: true');
      await element(
        by
          .id('Third')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(
        element(by.label('1. onTabSelectionPrevented: Third')),
      ).toBeVisible();
      await element(by.label('1. onTabSelectionPrevented: Third')).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
      await element(
        by
          .id('First')
          .withAncestor(by.type(UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE)),
      ).tap();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
      await expect(
        element(by.id('prevent-native-selection-state')),
      ).toHaveLabel('preventNativeSelection: false');
    });

    it('all six tabs are visible in the sidebar', async () => {
      await expect(
        element(by.id('tab-bar-prevent-native-selection-view')),
      ).toBeVisible();
      await expect(element(by.label('More'))).not.toExist();
      await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
      await element(
        by.label('Toggle sidebar').and(by.type(UI_BUTTON_TYPE)),
      ).tap();
      await expect(
        element(
          by.label('First').withAncestor(by.type(UI_TAB_SIDEBAR_CELL_TYPE)),
        ),
      ).toExist();
      await expect(
        element(
          by.label('Second').withAncestor(by.type(UI_TAB_SIDEBAR_CELL_TYPE)),
        ),
      ).toExist();
      await expect(
        element(
          by.label('Third').withAncestor(by.type(UI_TAB_SIDEBAR_CELL_TYPE)),
        ),
      ).toExist();
      await expect(
        element(
          by.label('Fourth').withAncestor(by.type(UI_TAB_SIDEBAR_CELL_TYPE)),
        ),
      ).toExist();
      await expect(
        element(
          by.label('Fifth').withAncestor(by.type(UI_TAB_SIDEBAR_CELL_TYPE)),
        ),
      ).toExist();
      await expect(
        element(
          by.label('Sixth').withAncestor(by.type(UI_TAB_SIDEBAR_CELL_TYPE)),
        ),
      ).toExist();
    });
  },
);
