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

async function getConfigYFrame(optionId: string) {
  const attr = (await element(
    by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id(optionId)),
  ).getAttributes()) as IosElementAttributes;
  const yFrame = attr.frame.y;
  return yFrame as number;
}

/**
 * Taps outside the presented context menu to dismiss it without selecting
 * any item, mirroring the tap-the-root-view dismissal pattern used for other
 * iOS overlays (see test-tabs-tab-bar-controller-mode-ios.e2e.ts).
 */
async function dismissMenu() {
  await forceTapByLabeliOS('text-display-inline');
}

async function toggleAndExpectLabel(testID: string, expectedLabel: string) {
  await element(by.id(testID)).tap();
  await expect(element(by.id(testID))).toHaveLabel(expectedLabel);
}
function checkmarkFor(itemLabel: string) {
  return element(
    by
      .id('checkmark')
      .withAncestor(
        by
          .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
          .and(by.label(itemLabel)),
      ),
  );
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
      await element(
        by
          .label('Sort By')
          .and(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)),
      ).tap();
      await expect(element(by.text('Name'))).toBeVisible();
      await expect(element(by.text('Date'))).toBeVisible();
      await expect(element(by.text('Size'))).toBeVisible();
      await expect(element(by.text('Rating'))).toBeVisible();
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by.type('_UIContextMenuCellContentView').and(by.label('Rating')),
            ),
        ),
      ).toBeVisible();
      // Rating's children are not yet inlined into this submenu.
      await expect(element(by.text('Best Reviews'))).not.toExist();
    });

    it('opens a nested submenu with Best Reviews, Most Reviews, Highest Rated when tapping Rating', async () => {
      await element(by.text('Rating')).tap();
      await expect(element(by.text('Best Reviews'))).toBeVisible();
      await expect(element(by.text('Most Reviews'))).toBeVisible();
      await expect(element(by.text('Highest Rated'))).toBeVisible();
    });

    it('dismisses the menu without selecting an item', async () => {
      await dismissMenu();
      await dismissMenu();
      await dismissMenu();

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
      await element(
        by
          .label('Sort By')
          .and(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)),
      ).tap();
      await expect(element(by.text('Name'))).toBeVisible();
      await expect(element(by.text('Date'))).toBeVisible();
      await expect(element(by.text('Size'))).toBeVisible();
      await expect(element(by.text('Best Reviews'))).toBeVisible();
      await expect(element(by.text('Most Reviews'))).toBeVisible();
      await expect(element(by.text('Highest Rated'))).toBeVisible();
      // "Rating" no longer shows up as its own row once its children are
      // inlined directly into the Sort By submenu.
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by.type('_UIContextMenuCellContentView').and(by.label('Rating')),
            ),
        ),
      ).not.toExist();
    });

    it('dismisses the menu (Step 9)', async () => {
      await dismissMenu();
      await dismissMenu();

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
      // "Sort By" no longer shows up as its own row once it is flattened.
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by.type('_UIContextMenuCellContentView').and(by.label('Rating')),
            ),
        ),
      ).toExist();
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by.type('_UIContextMenuCellContentView').and(by.label('Sort By')),
            ),
        ),
      ).not.toExist();
    });

    it('still opens Rating as a collapsed nested submenu (Step 12)', async () => {
      await element(by.text('Rating')).tap();
      await expect(element(by.text('Best Reviews'))).toBeVisible();
      await expect(element(by.text('Most Reviews'))).toBeVisible();
      await expect(element(by.text('Highest Rated'))).toBeVisible();
    });

    it('dismisses the menu', async () => {
      await dismissMenu();
      await dismissMenu();
      await dismissMenu();

      await expect(element(by.text('Copy'))).not.toExist();
      await waitFor(optionsMenuButton).toBeVisible().withTimeout(2000);
    });

    it('toggles displayInline (Rating) to true again', async () => {
      await toggleAndExpectLabel(
        'toggle-display-inline-rating',
        'displayInline (Rating): true',
      );
    });

    it('fully flattens every item into a single top-level list when both displayInline flags are true (Step 15)', async () => {
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

      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by.type('_UIContextMenuCellContentView').and(by.label('Rating')),
            ),
        ),
      ).not.toExist();
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by.type('_UIContextMenuCellContentView').and(by.label('Sort By')),
            ),
        ),
      ).not.toExist();

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
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by
                .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
                .and(by.label('Text Style')),
            ),
        ),
      ).toBeVisible();
      await expect(element(by.text('Reset Formatting'))).toBeVisible();
    });

    it('opens a regular list with Bold, Italic, Underline, Strikethrough (Step 3)', async () => {
      await element(by.text('Text Style')).tap();
      await expect(element(by.text('Bold'))).toBeVisible();
      await expect(element(by.text('Italic'))).toBeVisible();
      await expect(element(by.text('Underline'))).toBeVisible();
      await expect(element(by.text('Strikethrough'))).toBeVisible();

      jestExpect(await getConfigYFrame('bold')).toBeLessThan(
        await getConfigYFrame('strikethrough'),
      );
    });

    it('dismisses the menu', async () => {
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
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by
                .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
                .and(by.label('Text Style')),
            ),
        ),
      ).toBeVisible();
      await expect(element(by.text('Reset Formatting'))).toBeVisible();
    });

    it('keeps Bold, Italic, Underline, Strikethrough present once rendered as a palette', async () => {
      await element(by.text('Text Style')).tap();
      await expect(
        element(
          by
            .id('chevron.forward')
            .withAncestor(
              by.type(CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW),
            ),
        ),
      ).toBeVisible();

      await expect(element(by.text('Bold'))).not.toBeVisible();
      await expect(element(by.text('Italic'))).not.toBeVisible();
      await expect(element(by.text('Underline'))).not.toBeVisible();
      await expect(element(by.text('Strikethrough'))).not.toBeVisible();

      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('bold'))),
      ).toBeVisible();
      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('italic'))),
      ).toBeVisible();
      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('underline'))),
      ).toBeVisible();
      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('strikethrough'))),
      ).toBeVisible();

      jestExpect(await getConfigYFrame('bold')).toBeCloseTo(
        await getConfigYFrame('strikethrough'),
        0,
      );
    });

    it('dismisses the menu', async () => {
      await dismissMenu();
      await dismissMenu();

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

      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('bold'))),
      ).toBeVisible();
      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('italic'))),
      ).toBeVisible();
      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('underline'))),
      ).toBeVisible();
      await expect(
        element(by.type(CLASS_NAME_UI_IMAGE_VIEW).and(by.id('strikethrough'))),
      ).toBeVisible();

      jestExpect(await getConfigYFrame('bold')).toBeCloseTo(
        await getConfigYFrame('strikethrough'),
        0,
      );

      await expect(element(by.text('Reset Formatting'))).toBeVisible();
      // "Text Style" no longer shows up as its own row once it is flattened.
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
