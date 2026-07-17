import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  forceTapByLabeliOS,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import { expect as jestExpect } from '@jest/globals';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_HEADER_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW,
  CLASS_NAME_UI_IMAGE_VIEW,
  CLASS_NAME_UI_LABEL,
} from '../../native-class-names';
import { IosElementAttributes } from 'detox/detox';

const optionsMenuButton = element(
  by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).and(by.label('Options')),
);
const paletteMenuButton = element(
  by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).and(by.label('Palette')),
);

/** A row of a presented menu, matched by its visible label. */
function menuRow(itemLabel: string) {
  return element(
    by
      .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
      .and(by.label(itemLabel)),
  );
}

/**
 * The disclosure chevron on a menu row. Present only while the row is a
 * collapsed submenu: inlining a submenu's children removes its parent row,
 * chevron included.
 */
function chevronFor(itemLabel: string) {
  return element(
    by
      .id('chevron.forward')
      .withAncestor(
        by
          .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
          .and(by.label(itemLabel)),
      ),
  );
}

/**
 * The chevron on a palette's submenu title, which is its own class rather than
 * a regular menu row.
 */
const paletteTitleChevron = element(
  by
    .id('chevron.forward')
    .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW)),
);

/** A palette item rendered as an icon, matched by the testID on its image. */
function paletteIcon(iconId: string) {
  return element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id(iconId)));
}

/**
 * Top edge of a palette icon in screen coordinates. Smaller y means higher up,
 * so equal values mean two icons share a row.
 */
async function getPaletteIconTopY(iconId: string) {
  const attr = (await paletteIcon(
    iconId,
  ).getAttributes()) as IosElementAttributes;
  return attr.frame.y;
}

/**
 * Taps outside the presented context menu to dismiss it without selecting
 * any item, mirroring the tap-the-root-view dismissal pattern used for other
 * iOS overlays (see test-tabs-tab-bar-controller-mode-ios.e2e.ts).
 *
 * Each tap closes a single level, so `levels` must match how deeply the menu
 * is currently nested.
 */
async function dismissMenu(levels = 1) {
  for (let i = 0; i < levels; i++) {
    await forceTapByLabeliOS('text-display-inline');
  }
}

/** Taps a toggle and asserts the label it settles on. */
async function toggleAndExpectLabel(testID: string, expectedLabel: string) {
  await element(by.id(testID)).tap();
  await expect(element(by.id(testID))).toHaveLabel(expectedLabel);
}

describeIfiOS('Stack Header Menu Options (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-menu-options-ios',
    );
  });

  it('should display the header with Options and Palette trailing items', async () => {
    await expect(
      element(by.type(CLASS_NAME_UI_LABEL).and(by.text('Menu Options'))),
    ).toExist();
    await expect(optionsMenuButton).toBeVisible();
    await expect(paletteMenuButton).toBeVisible();
  });

  describe('Options menu: displayInline on nested submenus', () => {
    it('starts with both toggles set to false', async () => {
      await expect(element(by.id('toggle-display-inline-sort-by'))).toHaveLabel(
        'displayInline (Sort By): false',
      );
      await expect(element(by.id('toggle-display-inline-rating'))).toHaveLabel(
        'displayInline (Rating): false',
      );
    });

    it('shows Copy, Paste, Share, Sort By, Delete at the top level', async () => {
      await optionsMenuButton.tap();
      await expect(element(by.text('Copy'))).toBeVisible();
      await expect(element(by.text('Paste'))).toBeVisible();
      await expect(element(by.text('Share'))).toBeVisible();
      await expect(element(by.text('Sort By'))).toBeVisible();
      await expect(element(by.text('Delete'))).toBeVisible();
    });

    it('opens a nested submenu with Name, Date, Size, Rating when tapping Sort By', async () => {
      await menuRow('Sort By').tap();
      await expect(element(by.text('Name'))).toBeVisible();
      await expect(element(by.text('Date'))).toBeVisible();
      await expect(element(by.text('Size'))).toBeVisible();
      await expect(element(by.text('Rating'))).toBeVisible();
      await expect(chevronFor('Rating')).toBeVisible();
      // Rating's children are not yet inlined into this submenu.
      await expect(element(by.text('Best Reviews'))).not.toExist();
    });

    it('opens a nested submenu with Best Reviews, Most Reviews, Highest Rated when tapping Rating', async () => {
      await element(by.text('Rating')).tap();
      await expect(element(by.text('Best Reviews'))).toBeVisible();
      await expect(element(by.text('Most Reviews'))).toBeVisible();
      await expect(element(by.text('Highest Rated'))).toBeVisible();
    });

    it('dismisses the Sort By and Rating submenus without selecting an item', async () => {
      await dismissMenu(3);

      await expect(element(by.text('Copy'))).not.toExist();
      await waitFor(optionsMenuButton).toBeVisible().withTimeout(2000);
    });

    it('toggles displayInline (Rating) to true', async () => {
      await toggleAndExpectLabel(
        'toggle-display-inline-rating',
        'displayInline (Rating): true',
      );
    });

    it('still shows the same top-level items after inlining Rating', async () => {
      await optionsMenuButton.tap();
      await expect(element(by.text('Copy'))).toBeVisible();
      await expect(element(by.text('Paste'))).toBeVisible();
      await expect(element(by.text('Share'))).toBeVisible();
      await expect(element(by.text('Sort By'))).toBeVisible();
      await expect(element(by.text('Delete'))).toBeVisible();
    });

    it('inlines Best Reviews, Most Reviews, Highest Rated alongside Name, Date, Size under Sort By', async () => {
      await menuRow('Sort By').tap();
      await expect(element(by.text('Name'))).toBeVisible();
      await expect(element(by.text('Date'))).toBeVisible();
      await expect(element(by.text('Size'))).toBeVisible();
      await expect(element(by.text('Best Reviews'))).toBeVisible();
      await expect(element(by.text('Most Reviews'))).toBeVisible();
      await expect(element(by.text('Highest Rated'))).toBeVisible();
      // "Rating" no longer shows up as its own row once its children are
      // inlined directly into the Sort By submenu.
      await expect(chevronFor('Rating')).not.toExist();
    });

    it('dismisses the Sort By submenu with Rating inlined', async () => {
      await dismissMenu(2);

      await expect(element(by.text('Copy'))).not.toExist();
      await waitFor(optionsMenuButton).toBeVisible().withTimeout(2000);
    });

    it('toggles displayInline (Rating) back to false and displayInline (Sort By) to true', async () => {
      await toggleAndExpectLabel(
        'toggle-display-inline-rating',
        'displayInline (Rating): false',
      );
      await toggleAndExpectLabel(
        'toggle-display-inline-sort-by',
        'displayInline (Sort By): true',
      );
    });

    it('inlines Name, Date, Size, Rating alongside Copy, Paste, Share, Delete at the top level', async () => {
      await optionsMenuButton.tap();
      await expect(element(by.text('Copy'))).toBeVisible();
      await expect(element(by.text('Paste'))).toBeVisible();
      await expect(element(by.text('Share'))).toBeVisible();
      await expect(element(by.text('Name'))).toBeVisible();
      await expect(element(by.text('Date'))).toBeVisible();
      await expect(element(by.text('Size'))).toBeVisible();
      await expect(element(by.text('Rating'))).toBeVisible();
      await expect(element(by.text('Delete'))).toBeVisible();
      // Sort By is flattened away as a row, while Rating stays collapsed.
      await expect(chevronFor('Rating')).toExist();
      await expect(chevronFor('Sort By')).not.toExist();
    });

    it('still opens Rating as a collapsed nested submenu', async () => {
      await element(by.text('Rating')).tap();
      await expect(element(by.text('Best Reviews'))).toBeVisible();
      await expect(element(by.text('Most Reviews'))).toBeVisible();
      await expect(element(by.text('Highest Rated'))).toBeVisible();
    });

    it('dismisses the top-level menu with Sort By inlined', async () => {
      await dismissMenu(3);

      await expect(element(by.text('Copy'))).not.toExist();
      await waitFor(optionsMenuButton).toBeVisible().withTimeout(2000);
    });

    it('toggles displayInline (Rating) to true again', async () => {
      await toggleAndExpectLabel(
        'toggle-display-inline-rating',
        'displayInline (Rating): true',
      );
    });

    it('fully flattens every item into a single top-level list when both displayInline flags are true', async () => {
      await optionsMenuButton.tap();
      await expect(element(by.text('Copy'))).toBeVisible();
      await expect(element(by.text('Paste'))).toBeVisible();
      await expect(element(by.text('Share'))).toBeVisible();
      await expect(element(by.text('Name'))).toBeVisible();
      await expect(element(by.text('Date'))).toBeVisible();
      await expect(element(by.text('Size'))).toBeVisible();
      await expect(element(by.text('Best Reviews'))).toBeVisible();
      await expect(element(by.text('Most Reviews'))).toBeVisible();
      await expect(element(by.text('Highest Rated'))).toBeVisible();
      await expect(element(by.text('Delete'))).toBeVisible();

      // Neither submenu survives as a row: every item sits at the top level.
      await expect(chevronFor('Rating')).not.toExist();
      await expect(chevronFor('Sort By')).not.toExist();

      await dismissMenu();
    });
  });

  describe('Palette menu: displayAsPalette on the submenu', () => {
    it('starts with both palette toggles set to false', async () => {
      await expect(element(by.id('toggle-display-as-palette'))).toHaveLabel(
        'displayAsPalette (Text Style): false',
      );
      await expect(
        element(by.id('toggle-display-inline-text-style')),
      ).toHaveLabel('displayInline (Text Style): false');
    });

    it('shows Text Style and Reset Formatting at the top level', async () => {
      await paletteMenuButton.tap();
      await expect(element(by.text('Text Style'))).toBeVisible();
      await expect(chevronFor('Text Style')).toBeVisible();
      await expect(element(by.text('Reset Formatting'))).toBeVisible();
    });

    it('opens a regular vertical list with Bold, Italic, Underline, Strikethrough', async () => {
      await element(by.text('Text Style')).tap();
      await expect(element(by.text('Bold'))).toBeVisible();
      await expect(element(by.text('Italic'))).toBeVisible();
      await expect(element(by.text('Underline'))).toBeVisible();
      await expect(element(by.text('Strikethrough'))).toBeVisible();

      // Stacked vertically: Bold sits above Strikethrough.
      jestExpect(await getPaletteIconTopY('bold')).toBeLessThan(
        await getPaletteIconTopY('strikethrough'),
      );
    });

    it('dismisses the Text Style submenu', async () => {
      await dismissMenu();
      await waitFor(paletteMenuButton).toBeVisible().withTimeout(2000);
    });

    it('toggles displayAsPalette (Text Style) to true', async () => {
      await toggleAndExpectLabel(
        'toggle-display-as-palette',
        'displayAsPalette (Text Style): true',
      );
    });

    it('still shows Text Style as a collapsed submenu at the top level', async () => {
      await paletteMenuButton.tap();
      await expect(element(by.text('Text Style'))).toBeVisible();
      await expect(chevronFor('Text Style')).toBeVisible();
      await expect(element(by.text('Reset Formatting'))).toBeVisible();
    });

    it('renders Bold, Italic, Underline, Strikethrough as icons in a horizontal palette row', async () => {
      await element(by.text('Text Style')).tap();
      await expect(paletteTitleChevron).toBeVisible();

      // A palette drops the text labels and shows icons only.
      await expect(element(by.text('Bold'))).not.toBeVisible();
      await expect(element(by.text('Italic'))).not.toBeVisible();
      await expect(element(by.text('Underline'))).not.toBeVisible();
      await expect(element(by.text('Strikethrough'))).not.toBeVisible();

      await expect(paletteIcon('bold')).toBeVisible();
      await expect(paletteIcon('italic')).toBeVisible();
      await expect(paletteIcon('underline')).toBeVisible();
      await expect(paletteIcon('strikethrough')).toBeVisible();

      // Laid out horizontally: every icon shares a row.
      jestExpect(await getPaletteIconTopY('bold')).toBeCloseTo(
        await getPaletteIconTopY('strikethrough'),
        0,
      );
    });

    it('dismisses the palette submenu', async () => {
      await dismissMenu(2);

      await waitFor(paletteMenuButton).toBeVisible().withTimeout(2000);
    });

    it('toggles displayInline (Text Style) to true', async () => {
      await toggleAndExpectLabel(
        'toggle-display-inline-text-style',
        'displayInline (Text Style): true',
      );
    });

    it('inlines Bold, Italic, Underline, Strikethrough alongside Reset Formatting at the top level', async () => {
      await paletteMenuButton.tap();
      await expect(element(by.text('Bold'))).not.toBeVisible();
      await expect(element(by.text('Italic'))).not.toBeVisible();
      await expect(element(by.text('Underline'))).not.toBeVisible();
      await expect(element(by.text('Strikethrough'))).not.toBeVisible();

      await expect(paletteIcon('bold')).toBeVisible();
      await expect(paletteIcon('italic')).toBeVisible();
      await expect(paletteIcon('underline')).toBeVisible();
      await expect(paletteIcon('strikethrough')).toBeVisible();

      // The palette keeps its horizontal layout once inlined.
      jestExpect(await getPaletteIconTopY('bold')).toBeCloseTo(
        await getPaletteIconTopY('strikethrough'),
        0,
      );

      await expect(element(by.text('Reset Formatting'))).toBeVisible();
      // Text Style is promoted from a tappable row to a section header once its
      // palette is inlined into the top level.
      await expect(
        element(
          by
            .label('Text Style')
            .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_HEADER_VIEW)),
        ),
      ).toBeVisible();

      await dismissMenu();
    });
  });
});
