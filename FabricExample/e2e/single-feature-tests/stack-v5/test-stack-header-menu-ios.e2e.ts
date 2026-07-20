import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  dismissToast,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW,
} from '../../native-class-names';

const menuOneBarButton = element(
  by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON).and(by.label('Menu 1')),
);

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

    it('should dismiss the menu and emit toast after tapping the action item "Action 1-1"', async () => {
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
