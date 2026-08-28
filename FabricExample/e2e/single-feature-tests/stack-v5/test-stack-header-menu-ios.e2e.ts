import { device, expect, element, by } from 'detox';
import {
  checkmarkFor,
  CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
  contextMenu,
  describeIfiOS,
  dismissContextMenu,
  dismissToast,
  forceTapByLabeliOS,
  headerItem,
  menuRow,
  menuRowIcon,
  openContextMenu,
  scrollToAndTap,
  selectPickerOption,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import { CLASS_NAME_UI_LABEL } from '../../native-class-names';

const SCROLLVIEW_ID = 'header-menu-scrollview';

const menuOneBarButton = headerItem('Menu 1', { control: true });

const HEADER_TITLE = 'Header Menu';

const headerTitle = element(
  by.type(CLASS_NAME_UI_LABEL).and(by.text(HEADER_TITLE)),
);

// Small steps keep a short picker row from being scrolled past; the Detox
// default start point is kept.
const SCROLL = {
  scrollViewId: SCROLLVIEW_ID,
  pixels: 200,
  startPercentage: NaN,
};

/**
 * Option ids (`<label>-<option>`) repeat across both sections, so only one
 * picker may be open at a time — `selectPickerOption` closes it again.
 */
async function setPicker(pickerId: string, label: string, option: string) {
  await selectPickerOption({ pickerId, label, option }, SCROLL);
}

async function tapSendButton(buttonId: string) {
  await scrollToAndTap(buttonId, SCROLL);
}

async function openMenuOne() {
  await openContextMenu(menuOneBarButton);
}

/**
 * Opens the title menu. The control UIKit wraps the title in fails Detox's
 * visibility threshold, so the title label is tapped by coordinates.
 */
async function openTitleMenu() {
  await forceTapByLabeliOS(HEADER_TITLE);
  await waitFor(contextMenu())
    .toBeVisible()
    .withTimeout(CONTEXT_MENU_ANIMATION_TIMEOUT_MS);
}

describeIfiOS('Stack Header Menu (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-menu-ios',
    );
  });

  it('should display the header with a trailing item exposing a real menu', async () => {
    await expect(headerTitle).toExist();
    await expect(menuOneBarButton).toBeVisible();
  });

  describe('opening Menu 1', () => {
    it('should open the native menu on tap and show its action, toggle, and submenu items', async () => {
      await openMenuOne();

      await expect(element(by.text('Action 1-1'))).toBeVisible();
      await expect(element(by.text('Toggle 1-1'))).toBeVisible();
      await expect(element(by.text('Toggle 1-2'))).toBeVisible();
      await expect(element(by.text('Toggle 1-3'))).toBeVisible();
      await expect(element(by.text('Submenu with Radio'))).toBeVisible();

      await dismissContextMenu();
    });

    it('should dismiss the menu and emit toast after tapping the action item "Action 1-1"', async () => {
      await openMenuOne();
      await element(by.text('Action 1-1')).tap();
      await dismissToast('1. Clicked Action 1-1');

      await expect(contextMenu()).not.toExist();
    });
  });

  describe('toggle item selection persists across reopening the menu', () => {
    it('should show a checkmark next to Toggle 1-1 after selecting it and reopening the menu', async () => {
      await menuOneBarButton.tap();
      await element(by.text('Toggle 1-1')).tap();
      await dismissToast('1. Selected "toggle-1-1"');

      await expect(contextMenu()).not.toExist();

      await openMenuOne();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
    });

    it('should show checkmarks next to both Toggle 1-1 and Toggle 1-3 after selecting Toggle 1-3 too', async () => {
      await element(by.text('Toggle 1-3')).tap();
      await dismissToast('1. Selected "toggle-1-1", "toggle-1-3"');

      await expect(contextMenu()).not.toExist();

      await openMenuOne();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
      await expect(checkmarkFor('Toggle 1-3')).toBeVisible();
    });

    it('should remove the checkmark next to Toggle 1-1 after tapping it again, leaving only Toggle 1-3 checked', async () => {
      await element(by.text('Toggle 1-1')).tap();
      await dismissToast('1. Selected "toggle-1-3"');

      await expect(contextMenu()).not.toExist();

      await openMenuOne();

      await expect(checkmarkFor('Toggle 1-1')).not.toExist();
      await expect(checkmarkFor('Toggle 1-3')).toBeVisible();
    });
  });

  describe('"Submenu with Radio" nested singleSelection menu', () => {
    it('should select Radio 1-1 by default when opening the submenu', async () => {
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).toBeVisible();
    });

    it('should keep Radio 1-1 selected after tapping it again', async () => {
      await element(by.text('Radio 1-1')).tap();
      await waitFor(
        element(by.label('1. Selected unique "radio-1-1"')),
      ).not.toBeVisible();
      await expect(contextMenu()).not.toExist();

      await openMenuOne();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).toBeVisible();
    });

    it('should select Radio 1-2 in the nested SubSubMenu, dismiss the whole menu chain, and clear Radio 1-1', async () => {
      await element(by.text('SubSubMenu with Radio')).tap();
      await element(by.text('Radio 1-2')).tap();
      await dismissToast('1. Selected unique "radio-1-2"');

      await expect(contextMenu()).not.toExist();
      await openMenuOne();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).not.toExist();

      await element(by.text('SubSubMenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-2')).toBeVisible();
    });
  });

  describe('title menu', () => {
    it('should open a menu with both title actions when the header title is tapped', async () => {
      await dismissContextMenu();

      await openTitleMenu();

      await expect(element(by.text('Title Action 1'))).toBeVisible();
      await expect(element(by.text('Title Action 2'))).toBeVisible();
    });

    it('should dismiss the title menu and emit a toast after tapping "Title Action 1"', async () => {
      await element(by.text('Title Action 1')).tap();
      await dismissToast('1. Clicked "Title Action 1"');

      await expect(contextMenu()).not.toExist();
    });

    it('should dismiss the title menu and emit a toast after tapping "Title Action 2"', async () => {
      await openTitleMenu();
      await element(by.text('Title Action 2')).tap();
      await dismissToast('1. Clicked "Title Action 2"');

      await expect(contextMenu()).not.toExist();
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
      await setPicker('menu-item-options-title-picker', 'title', 'New Title');
      await tapSendButton('send-menu-item-options-button');

      await openMenuOne();

      await expect(element(by.text('New Title'))).toBeVisible();
      await expect(element(by.text('Action 1-1'))).not.toExist();
    });

    it('should add an icon to the renamed item while keeping its title', async () => {
      await expect(menuRowIcon('star.fill', 'New Title')).not.toExist();
      await dismissContextMenu();

      await setPicker('menu-item-options-title-picker', 'title', 'no change');
      await setPicker('menu-item-options-icon-picker', 'icon', 'star.fill');
      await tapSendButton('send-menu-item-options-button');

      await openMenuOne();

      await expect(menuRow('New Title', { actionsOnly: true })).toBeVisible();
      await expect(menuRowIcon('star.fill', 'New Title')).toBeVisible();
    });

    it('should check Toggle 1-1 and emit a selection toast when toggleState is set to true', async () => {
      await dismissContextMenu();

      await setPicker(
        'menu-item-options-target-id-picker',
        'target id',
        'toggle-1-1',
      );
      await setPicker(
        'menu-item-options-toggle-state-picker',
        'toggleState',
        'true',
      );
      await tapSendButton('send-menu-item-options-button');

      await dismissToast('1. Selected "toggle-1-1"');

      await openMenuOne();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
    });

    it('should keep Radio 1-1 selected when deselecting it in a singleSelection submenu', async () => {
      await dismissContextMenu();

      await setPicker(
        'menu-item-options-target-id-picker',
        'target id',
        'radio-1-1',
      );
      await setPicker(
        'menu-item-options-toggle-state-picker',
        'toggleState',
        'false',
      );
      await tapSendButton('send-menu-item-options-button');

      await openMenuOne();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).toBeVisible();
    });

    it('should move the singleSelection checkmark from Radio 1-1 to Radio 1-2', async () => {
      await dismissContextMenu();

      await setPicker(
        'menu-item-options-target-id-picker',
        'target id',
        'radio-1-2',
      );
      await setPicker(
        'menu-item-options-toggle-state-picker',
        'toggleState',
        'true',
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

  it('should rename the targeted submenu', async () => {
    await setPicker('menu-options-title-picker', 'title', 'New Title');
    await tapSendButton('send-menu-options-button');

    await openMenuOne();

    await expect(element(by.text('New Title'))).toBeVisible();
    await expect(element(by.text('Submenu with Radio'))).not.toExist();
  });

  it('should add an icon to the renamed submenu while keeping its title', async () => {
    await expect(menuRowIcon('bell.fill', 'New Title')).not.toExist();
    await dismissContextMenu();

    await setPicker('menu-options-title-picker', 'title', 'no change');
    await setPicker('menu-options-icon-picker', 'icon', 'bell.fill');
    await tapSendButton('send-menu-options-button');

    await openMenuOne();

    await expect(element(by.text('New Title'))).toBeVisible();
    await expect(menuRowIcon('bell.fill', 'New Title')).toBeVisible();

    await dismissContextMenu();
  });
});
