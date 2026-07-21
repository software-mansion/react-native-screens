import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  getElementAttributes,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import { expect as jestExpect } from '@jest/globals';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_HEADER_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_VIEW,
  CLASS_NAME_UI_IMAGE_VIEW,
  CLASS_NAME_UI_LABEL,
} from '../../native-class-names';
import { IosElementAttributes } from 'detox/detox';

/**
 * UIKit exposes no way to query a presented menu, so structure and layout are
 * checked indirectly: `by.id(...)` on an image matches the SF Symbol name;
 * a row's chevron tells a collapsed submenu from an inlined one; and icon
 * frames tell a horizontal palette from a vertical list.
 */

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
 * UIKit's disclosure indicator, drawn only on rows that open a submenu. Its
 * absence marks an inlined submenu; the title alone cannot, since an inlined
 * submenu may keep its title as a section header (see Text Style).
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

/** The palette submenu title's chevron — its own class, not a menu row. */
const paletteTitleChevron = element(
  by
    .id('chevron.forward')
    .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW)),
);

/** A palette item rendered as an icon, matched by its SF Symbol name. */
function paletteIcon(iconId: string) {
  return element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id(iconId)));
}

/** Top edge of a palette icon in screen coordinates; smaller y is higher up. */
async function getPaletteIconTopY(iconId: string) {
  const attrs = await paletteIcon(iconId).getAttributes();
  return (attrs as IosElementAttributes).frame.y;
}

/**
 * Dismisses the presented context menu without selecting any item.
 *
 * The platter is anchored under the header's trailing items, so it covers the
 * centre of this full-width text: a centre tap hits the menu and only pops one
 * submenu level, while a tap near the leading edge is clear of it and closes
 * the menu at any depth. The label is just body text underneath, used to locate
 * that point — it has nothing to do with the displayInline prop.
 */
async function dismissMenu() {
  const { frame } = await getElementAttributes({
    by: 'id',
    value: 'text-display-inline',
  });
  await device.tap({
    x: frame.x + frame.width / 10,
    y: frame.y + frame.height / 2,
  });
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
      await dismissMenu();
      await waitFor(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_VIEW)),
      ).not.toBeVisible();
      await expect(
        element(by.id('toggle-display-inline-rating')),
      ).toBeVisible();
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
      // Rating is gone as a row once its children are inlined.
      await expect(chevronFor('Rating')).not.toExist();
    });

    it('dismisses the Sort By submenu with Rating inlined', async () => {
      await dismissMenu();
      await waitFor(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_VIEW)),
      ).not.toBeVisible();
      await expect(
        element(by.id('toggle-display-inline-rating')),
      ).toBeVisible();
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
      await dismissMenu();
      await waitFor(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_VIEW)),
      ).not.toBeVisible();
      await expect(
        element(by.id('toggle-display-inline-rating')),
      ).toBeVisible();
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
      await waitFor(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_VIEW)),
      ).not.toBeVisible();
      await expect(element(by.id('toggle-display-as-palette'))).toBeVisible();
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

      // Horizontal: first and last icon share a row. Precision 0 allows ±0.5pt,
      // as the top edges differ by a fraction of a point.
      jestExpect(await getPaletteIconTopY('bold')).toBeCloseTo(
        await getPaletteIconTopY('strikethrough'),
        0,
      );
    });

    it('dismisses the palette submenu', async () => {
      await dismissMenu();
      await waitFor(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_VIEW)),
      ).not.toBeVisible();
      await expect(element(by.id('toggle-display-as-palette'))).toBeVisible();
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

      // The palette keeps its horizontal layout once inlined (±0.5pt, as above).
      jestExpect(await getPaletteIconTopY('bold')).toBeCloseTo(
        await getPaletteIconTopY('strikethrough'),
        0,
      );

      await expect(element(by.text('Reset Formatting'))).toBeVisible();
      // Text Style is promoted from a row to a section header once inlined.
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
