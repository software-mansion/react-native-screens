import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
import {
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW,
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
} from '../../native-class-names';

// Number of rows in the header item menu that render an icon:
// Toggle 1, Toggle 2, Toggle 3 and Submenu.
const MENU_ROW_COUNT = 4;

// The icon of the header bar button item, addressed by its icon id (SF Symbol
// name or asset path).
const barButtonIcon = (iconId: string) =>
  element(by.id(iconId).withAncestor(by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON)));

// `imageSource` and `templateSource` ids are the bundled paths of the `require`d
// asset files — renaming or moving those assets requires updating them here.
const ICON_IDS = {
  sfSymbol: 'star.fill',
  xcasset: 'custom-icon-fill',
  imageSource: 'assets/_apps/assets/search_black.png',
  templateSource: 'assets/_apps/assets/variableIcons/icon@3x.png',
} as const;

// The icon of a single menu row, addressed by its icon id and its position in
// the menu.
const menuRowIcon = (iconId: string, index: number) =>
  element(
    by
      .id(iconId)
      .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)),
  ).atIndex(index);

// Asserts that every menu row renders the icon carrying `iconId`.
const expectAllMenuRowIconsToBeVisible = async (
  iconId: string,
  rowCount: number = MENU_ROW_COUNT,
) => {
  for (let index = 0; index < rowCount; index++) {
    await expect(menuRowIcon(iconId, index)).toBeVisible();
  }
};

// Titles of the rows inside the nested submenu.
const SUBMENU_ROWS = ['Sub Toggle 1', 'Sub Toggle 2', 'Sub Toggle 3'] as const;

// The icon of a single submenu row, addressed by its icon id and the row's own
// title rather than by position: the parent menu's cells use the same class and
// stay in the hierarchy while the submenu is open, so an index-based matcher
// would happily match a parent row instead.
const submenuRowIcon = (iconId: string, rowTitle: string) =>
  element(
    by
      .id(iconId)
      .withAncestor(
        by
          .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
          .and(by.label(rowTitle)),
      ),
  );

// Asserts that every submenu row renders the icon carrying `iconId`.
const expectAllSubmenuRowIconsToBeVisible = async (iconId: string) => {
  for (const rowTitle of SUBMENU_ROWS) {
    await expect(submenuRowIcon(iconId, rowTitle)).toBeVisible();
  }
};

describeIfiOS('Stack Header Icon (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-icon-ios',
    );
  });

  it('should display the header with a star sfSymbol icon on the trailing item', async () => {
    await expect(
      element(by.type(CLASS_NAME_UI_LABEL).and(by.text('Header Icons'))),
    ).toExist();
    await expect(barButtonIcon(ICON_IDS.sfSymbol)).toBeVisible();
  });

  describe('cycling the bar button item icon', () => {
    it('should cycle the item icon through xcasset, imageSource, templateSource and back to sfSymbol', async () => {
      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('xcasset'))),
      ).toBeVisible();
      await expect(barButtonIcon(ICON_IDS.sfSymbol)).not.toExist();
      await expect(barButtonIcon(ICON_IDS.xcasset)).toBeVisible();

      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('imageSource'))),
      ).toBeVisible();
      await expect(barButtonIcon(ICON_IDS.imageSource)).toBeVisible();
      await expect(barButtonIcon(ICON_IDS.xcasset)).not.toExist();

      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('templateSource'))),
      ).toBeVisible();
      await expect(barButtonIcon(ICON_IDS.templateSource)).toBeVisible();
      await expect(barButtonIcon(ICON_IDS.imageSource)).not.toExist();

      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('sfSymbol'))),
      ).toBeVisible();
      await expect(barButtonIcon(ICON_IDS.sfSymbol)).toBeVisible();
      await expect(barButtonIcon(ICON_IDS.templateSource)).not.toExist();
    });
  });

  describe('the header item menu', () => {
    it('should open the menu on long press and show its items with the star icon', async () => {
      await element(by.label('Actions')).atIndex(0).longPress();

      await expect(element(by.text('Toggle 1'))).toBeVisible();
      await expect(element(by.text('Toggle 2'))).toBeVisible();
      await expect(element(by.text('Toggle 3'))).toBeVisible();
      await expect(element(by.text('Submenu'))).toBeVisible();

      await expect(element(by.text('Cycle icons (sfSymbol)'))).toBeVisible();
      await expectAllMenuRowIconsToBeVisible(ICON_IDS.sfSymbol);

      await element(by.text('Submenu')).tap();
      await expectAllSubmenuRowIconsToBeVisible(ICON_IDS.sfSymbol);

      // Tapping the submenu title acts as "back", returning to the parent menu
      // so the next test starts with the menu still open.
      await element(
        by.type(CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW),
      ).tap();
    });

    it('should cycle the menu icon variant when repeatedly tapping "Cycle icons" inside the menu', async () => {
      await element(by.text('Cycle icons (sfSymbol)')).tap();
      await expect(element(by.text('Cycle icons (xcasset)'))).toBeVisible();
      await expectAllMenuRowIconsToBeVisible(ICON_IDS.xcasset);

      await element(by.text('Cycle icons (xcasset)')).tap();
      await expect(element(by.text('Cycle icons (imageSource)'))).toBeVisible();
      await expectAllMenuRowIconsToBeVisible(ICON_IDS.imageSource);

      await element(by.text('Cycle icons (imageSource)')).tap();
      await expect(
        element(by.text('Cycle icons (templateSource)')),
      ).toBeVisible();
      await expectAllMenuRowIconsToBeVisible(ICON_IDS.templateSource);

      await element(by.text('Cycle icons (templateSource)')).tap();
      await expect(element(by.text('Cycle icons (sfSymbol)'))).toBeVisible();
      await expectAllMenuRowIconsToBeVisible(ICON_IDS.sfSymbol);
    });
  });
});
