import { device, expect, element, by } from 'detox';
import { describeIfiOS, scrollUntilVisible } from '../../e2e-utils';
import { selectSingleFeatureTestsScreen } from '../../elements/test-screen-navigation';
import { dismissToast } from '../../elements/toast';
import {
  checkmarkFor,
  contextMenu,
  dismissMenu,
  iconFor,
} from '../../elements/context-menu-ios';
import {
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_CELL,
} from '../../native-class-names';
import { IosElementAttributes } from 'detox/detox';

const SCROLLVIEW_ID = 'header-menu-scrollview';

const menuOneBarButton = element(
  by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON).and(by.label('Menu 1')),
);

const headerTitle = element(
  by.type(CLASS_NAME_UI_LABEL).and(by.text('Header Menu')),
);

async function scrollTo(matcher: Detox.NativeMatcher) {
  await scrollUntilVisible(matcher, SCROLLVIEW_ID, { pixels: 200 });
}

/**
 * Opens the picker, taps the option, closes it again. Option ids
 * (`<label>-<option>`) repeat across both sections, so only one picker may be
 * open at a time.
 *
 * Deliberately not `selectPickerOption` from `elements/settings-controls`: it
 * rewinds the
 * scroll view to the top before each step, which on this screen would resolve a
 * repeated option id against the *first* section rather than the one being
 * driven. The forward-only scroll here is what keeps the two sections apart.
 */
async function selectOption(pickerId: string, optionId: string) {
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
 * Opens the title menu. The control UIKit wraps the title in fails Detox's
 * visibility threshold, so the title label is tapped by coordinates.
 */
async function openTitleMenu() {
  const titleAttributes =
    (await headerTitle.getAttributes()) as IosElementAttributes;
  const { x, y, width, height } = titleAttributes.frame;
  await device.tap({ x: x + width / 2, y: y + height / 2 });
  await waitFor(contextMenu).toBeVisible().withTimeout(2000);
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

      await dismissMenu();
    });

    it('should dismiss the menu and emit toast after tapping the action item "Action 1-1"', async () => {
      await openMenuOne();
      await element(by.text('Action 1-1')).tap();
      await dismissToast('1. Clicked Action 1-1');

      await expect(contextMenu).not.toExist();
    });
  });

  describe('toggle item selection persists across reopening the menu', () => {
    it('should show a checkmark next to Toggle 1-1 after selecting it and reopening the menu', async () => {
      await menuOneBarButton.tap();
      await element(by.text('Toggle 1-1')).tap();
      await dismissToast('1. Selected "toggle-1-1"');

      await expect(contextMenu).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
    });

    it('should show checkmarks next to both Toggle 1-1 and Toggle 1-3 after selecting Toggle 1-3 too', async () => {
      await element(by.text('Toggle 1-3')).tap();
      await dismissToast('1. Selected "toggle-1-1", "toggle-1-3"');

      await expect(contextMenu).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();

      await expect(checkmarkFor('Toggle 1-1')).toBeVisible();
      await expect(checkmarkFor('Toggle 1-3')).toBeVisible();
    });

    it('should remove the checkmark next to Toggle 1-1 after tapping it again, leaving only Toggle 1-3 checked', async () => {
      await element(by.text('Toggle 1-1')).tap();
      await dismissToast('1. Selected "toggle-1-3"');

      await expect(contextMenu).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();

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
      await expect(contextMenu).not.toExist();

      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).toBeVisible();
    });

    it('should select Radio 1-2 in the nested SubSubMenu, dismiss the whole menu chain, and clear Radio 1-1', async () => {
      await element(by.text('SubSubMenu with Radio')).tap();
      await element(by.text('Radio 1-2')).tap();
      await dismissToast('1. Selected unique "radio-1-2"');

      await expect(contextMenu).not.toExist();
      await waitFor(menuOneBarButton).toBeVisible().withTimeout(2000);
      await menuOneBarButton.tap();
      await element(by.text('Submenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-1')).not.toExist();

      await element(by.text('SubSubMenu with Radio')).tap();

      await expect(checkmarkFor('Radio 1-2')).toBeVisible();
    });
  });

  describe('title menu', () => {
    it('should open a menu with both title actions when the header title is tapped', async () => {
      await dismissMenu();

      await openTitleMenu();

      await expect(element(by.text('Title Action 1'))).toBeVisible();
      await expect(element(by.text('Title Action 2'))).toBeVisible();
    });

    it('should dismiss the title menu and emit a toast after tapping "Title Action 1"', async () => {
      await element(by.text('Title Action 1')).tap();
      await dismissToast('1. Clicked "Title Action 1"');

      await expect(contextMenu).not.toExist();
    });

    it('should dismiss the title menu and emit a toast after tapping "Title Action 2"', async () => {
      await openTitleMenu();
      await element(by.text('Title Action 2')).tap();
      await dismissToast('1. Clicked "Title Action 2"');

      await expect(contextMenu).not.toExist();
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
      await selectOption('menu-item-options-title-picker', 'title-new title');
      await tapSendButton('send-menu-item-options-button');

      await openMenuOne();

      await expect(element(by.text('New Title'))).toBeVisible();
      await expect(element(by.text('Action 1-1'))).not.toExist();
    });

    it('should add an icon to the renamed item while keeping its title', async () => {
      await expect(iconFor('star.fill', 'New Title')).not.toExist();
      await dismissMenu();

      await selectOption('menu-item-options-title-picker', 'title-no change');
      await selectOption('menu-item-options-icon-picker', 'icon-star.fill');
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

    it('should check Toggle 1-1 and emit a selection toast when toggleState is set to true', async () => {
      await dismissMenu();

      await selectOption(
        'menu-item-options-target-id-picker',
        'target-id-toggle-1-1',
      );
      await selectOption(
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

      await selectOption(
        'menu-item-options-target-id-picker',
        'target-id-radio-1-1',
      );
      await selectOption(
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

      await selectOption(
        'menu-item-options-target-id-picker',
        'target-id-radio-1-2',
      );
      await selectOption(
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

  it('should rename the targeted submenu', async () => {
    await selectOption('menu-options-title-picker', 'title-new title');
    await tapSendButton('send-menu-options-button');

    await openMenuOne();

    await expect(element(by.text('New Title'))).toBeVisible();
    await expect(element(by.text('Submenu with Radio'))).not.toExist();
  });

  it('should add an icon to the renamed submenu while keeping its title', async () => {
    await expect(iconFor('bell.fill', 'New Title')).not.toExist();
    await dismissMenu();

    await selectOption('menu-options-title-picker', 'title-no change');
    await selectOption('menu-options-icon-picker', 'icon-bell.fill');
    await tapSendButton('send-menu-options-button');

    await openMenuOne();

    await expect(element(by.text('New Title'))).toBeVisible();
    await expect(iconFor('bell.fill', 'New Title')).toBeVisible();

    await dismissMenu();
  });
});
