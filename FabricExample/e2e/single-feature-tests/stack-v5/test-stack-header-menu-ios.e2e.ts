import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
import {
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW,
  CLASS_NAME_UI_LIST_CONTENT_IMAGE_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_CELL,
  CLASS_NAME_UI_IMAGE_VIEW,
} from '../../native-class-names';
import { dismissToast } from '../../e2e-utils';

const SCROLLVIEW_ID = 'header-menu-scrollview';

const menuOneBarButton = element(
  by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON).and(by.label('Menu 1')),
);

const contextMenu = element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW));

function menuCell(itemLabel: string) {
  return by
    .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
    .and(by.label(itemLabel));
}

function checkmarkFor(itemLabel: string) {
  return element(by.id('checkmark').withAncestor(menuCell(itemLabel)));
}

/**
 * The leading image of a menu row. A row carries at most one such image, so
 * this doubles as the assertion that an SF Symbol was applied by a view
 * command. Selected toggle/radio rows render their checkmark separately (it is
 * matched by the `checkmark` identifier above), so the two never overlap.
 */
function iconFor(iconId: string, itemLabel: string) {
  return element(
    by
      .type(CLASS_NAME_UI_IMAGE_VIEW)
      .and(by.id(iconId))
      .withAncestor(menuCell(itemLabel)),
  );
}

async function scrollTo(matcher: Detox.NativeMatcher) {
  await waitFor(element(matcher))
    .toBeVisible()
    .whileElement(by.id(SCROLLVIEW_ID))
    .scroll(200, 'down');
}

/**
 * Opens the picker, taps the option, and closes the picker again. Option rows
 * of every picker share a `<label>-<option>` identifier, so leaving a picker
 * open would make the next selection ambiguous.
 */
async function selectPickerOption(pickerId: string, optionId: string) {
  await scrollTo(by.id(pickerId));
  await element(by.id(pickerId)).tap();
  await scrollTo(by.id(optionId));
  await element(by.id(optionId)).tap();
  await element(by.id(pickerId)).tap();
}

async function tapSendButton(buttonId: string) {
  await scrollTo(by.id(buttonId));
  await element(by.id(buttonId)).tap();
}

async function openMenuOne() {
  await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
  await menuOneBarButton.tap();
  await waitFor(contextMenu).toBeVisible().withTimeout(2000);
}

/**
 * Dismisses the presented menu by tapping the dimming layer. The menu is
 * anchored to the trailing bar button, so the lower-left corner of the screen
 * is never covered by it.
 */
async function dismissMenu() {
  await device.tap({ x: 20, y: 500 });
  await waitFor(contextMenu).not.toExist().withTimeout(2000);
}

describeIfiOS('Stack Header Menu (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-menu-ios',
    );
  });

  it('should display the header with a trailing item exposing a real menu (Step 1)', async () => {
    await expect(
      element(by.type(CLASS_NAME_UI_LABEL).and(by.text('Header Menu'))),
    ).toExist();
    await expect(menuOneBarButton).toBeVisible();
  });

  describe('opening Menu 1', () => {
    it('should open the native menu on tap and show its action, toggle, and submenu items (Step 2)', async () => {
      await menuOneBarButton.tap();

      await expect(element(by.text('Action 1-1'))).toBeVisible();
      await expect(element(by.text('Toggle 1-1'))).toBeVisible();
      await expect(element(by.text('Toggle 1-2'))).toBeVisible();
      await expect(element(by.text('Toggle 1-3'))).toBeVisible();
      await expect(element(by.text('Submenu with Radio'))).toBeVisible();
    });

    it('should dismiss the menu and emmit toast after tapping the action item "Action 1-1"', async () => {
      await element(by.text('Action 1-1')).tap();
      await dismissToast('1. Clicked Action 1-1');

      await expect(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW)),
      ).not.toExist();
    });
  });

  describe('toggle item selection persists across reopening the menu (Steps 4-6)', () => {
    it('should show a checkmark next to Toggle 1-1 after selecting it and reopening the menu (Step 4)', async () => {
      await menuOneBarButton.tap();
      await element(by.text('Toggle 1-1')).tap();
      await dismissToast('1. Selected "toggle-1-1"');

      await expect(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW)),
      ).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
    });

    it('should show checkmarks next to both Toggle 1-1 and Toggle 1-3 after selecting Toggle 1-3 too', async () => {
      await element(by.text('Toggle 1-3')).tap();
      await dismissToast('1. Selected "toggle-1-1", "toggle-1-3"');

      await expect(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW)),
      ).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
      await expect(checkmarkFor('Toggle 1-3')).toBeVisible();
    });

    it('should remove the checkmark next to Toggle 1-1 after tapping it again, leaving only Toggle 1-3 checked', async () => {
      await element(by.text('Toggle 1-1')).tap();
      await dismissToast('1. Selected "toggle-1-3"');

      await expect(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW)),
      ).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();

      await expect(checkmarkFor('Toggle 1-1')).not.toExist();
      await expect(checkmarkFor('Toggle 1-3')).toBeVisible();
    });
  });

  describe('"Submenu with Radio" nested singleSelection menu (Steps 7-9)', () => {
    it('should select Radio 1-1 by default when opening the submenu', async () => {
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).toBeVisible();
    });

    it('should keep Radio 1-1 selected after tapping it again', async () => {
      await element(by.text('Radio 1-1')).tap();
      await waitFor(
        element(by.label('1. Selected unique "radio-1-1"')),
      ).not.toBeVisible();
      await expect(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW)),
      ).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).toBeVisible();
    });

    it('should select Radio 1-2 in the nested SubSubMenu, dismiss the whole menu chain, and clear Radio 1-1', async () => {
      await element(by.text('SubSubMenu with Radio')).tap();
      await element(by.text('Radio 1-2')).tap();
      await dismissToast('1. Selected unique "radio-1-2"');

      await expect(
        element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW)),
      ).not.toExist();
      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).not.toExist();

      await element(by.text('SubSubMenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-2')).toBeVisible();
    });
  });
});

describeIfiOS(
  'Stack Header Menu (iOS): setMenuItemOptions view command',
  () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Stackv5',
        'test-stack-header-menu-ios',
      );
    });

    it('should rename the targeted menu item', async () => {
      await selectPickerOption(
        'menu-item-options-title-picker',
        'title-new title',
      );
      await tapSendButton('send-menu-item-options-button');

      await openMenuOne();

      await expect(element(by.text('New Title'))).toBeVisible();
      await expect(element(by.text('Action 1-1'))).not.toExist();
    });

    it('should add an icon to the renamed item while keeping its title', async () => {
      await expect(iconFor('star.fill', 'New Title')).not.toExist();
      await dismissMenu();

      await selectPickerOption(
        'menu-item-options-title-picker',
        'title-no change',
      );
      await selectPickerOption(
        'menu-item-options-icon-picker',
        'icon-star.fill',
      );
      await tapSendButton('send-menu-item-options-button');

      await openMenuOne();

      await expect(
        element(
          by
            .label('New Title')
            .and(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW))
            .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL)),
        ),
      ).toBeVisible();
      await expect(iconFor('star.fill', 'New Title')).toBeVisible();
    });

    it('should check Toggle 1-1 and emit a selection toast when toggleState is set to true ', async () => {
      await dismissMenu();

      await selectPickerOption(
        'menu-item-options-target-id-picker',
        'target-id-toggle-1-1',
      );
      await selectPickerOption(
        'menu-item-options-toggle-state-picker',
        'togglestate-true',
      );
      await tapSendButton('send-menu-item-options-button');

      await dismissToast('1. Selected "toggle-1-1"');

      await openMenuOne();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
    });

    it('should keep Radio 1-1 selected when deselecting it in a singleSelection submenu', async () => {
      await dismissMenu();

      await selectPickerOption(
        'menu-item-options-target-id-picker',
        'target-id-radio-1-1',
      );
      await selectPickerOption(
        'menu-item-options-toggle-state-picker',
        'togglestate-false',
      );
      await tapSendButton('send-menu-item-options-button');

      await openMenuOne();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).toBeVisible();
    });

    it('should move the singleSelection checkmark from Radio 1-1 to Radio 1-2', async () => {
      await dismissMenu();

      await selectPickerOption(
        'menu-item-options-target-id-picker',
        'target-id-radio-1-2',
      );
      await selectPickerOption(
        'menu-item-options-toggle-state-picker',
        'togglestate-true',
      );
      await tapSendButton('send-menu-item-options-button');

      await dismissToast('1. Selected unique "radio-1-2"');

      await openMenuOne();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).not.toExist();

      await element(by.text('SubSubMenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-2')).toBeVisible();
    });
  },
);

describeIfiOS('Stack Header Menu (iOS): setMenuOptions view command', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-menu-ios',
    );
  });

  it('should rename the targeted submenu (Step 2)', async () => {
    await selectPickerOption('menu-options-title-picker', 'title-new title');
    await tapSendButton('send-menu-options-button');

    await openMenuOne();

    await expect(element(by.text('New Title'))).toBeVisible();
    await expect(element(by.text('Submenu with Radio'))).not.toExist();
  });

  it('should add an icon to the renamed submenu while keeping its title', async () => {
    await expect(iconFor('bell.fill', 'New Title')).not.toExist();
    await dismissMenu();

    await selectPickerOption('menu-options-title-picker', 'title-no change');
    await selectPickerOption('menu-options-icon-picker', 'icon-bell.fill');
    await tapSendButton('send-menu-options-button');

    await openMenuOne();

    await expect(element(by.text('New Title'))).toBeVisible();
    await expect(iconFor('bell.fill', 'New Title')).toBeVisible();

    await dismissMenu();
  });
});
