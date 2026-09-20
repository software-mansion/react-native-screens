import { by, device, element, expect } from 'detox';
import {
  contextMenu,
  CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
  countMatches,
  describeIfiOS,
  dismissContextMenu,
  getFrame,
  headerItem,
  openContextMenu,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW,
} from '../../native-class-names';

const openMenu = () => openContextMenu(headerItem('Actions'));
const notificationsCheckmark = () =>
  element(
    by
      .id('checkmark')
      .withAncestor(
        by
          .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
          .withDescendant(by.text('Notifications')),
      ),
  );

async function tapDisabledItem(title: string) {
  const { x, y, width, height } = await getFrame(by.text(title));
  await device.tap({ x: x + width / 2, y: y + height / 2 });
  // UIKit may keep a disabled row's menu presented; reopen from a closed menu.
  if (
    await countMatches(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW), {
      orEmpty: true,
    })
  ) {
    await dismissContextMenu();
  }
}

describeIfiOS('Stack Header Menu Presentation (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-menu-presentation-ios',
    );
  });

  it('blocks disabled actions and toggles, and composes destructive with keepsMenuPresented', async () => {
    await openMenu();
    await expect(element(by.text('Select a document first'))).toBeVisible();
    await expect(element(by.text('Cannot be undone'))).toBeVisible();
    await expect(element(by.text('Managed by policy'))).toBeVisible();
    await expect(notificationsCheckmark()).toBeVisible();
    await tapDisabledItem('Open document');
    await openMenu();
    await tapDisabledItem('Notifications');
    await expect(element(by.id('press-count'))).toHaveText('Presses: 0');
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 0; IDs: none',
    );
    await openMenu();
    await element(by.text('Delete document')).tap();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 1');
    await expect(contextMenu()).toBeVisible();
    await dismissContextMenu();
  });

  it('preserves presentation properties during an imperative title update', async () => {
    await element(by.id('rename-menu-item')).tap();
    await openMenu();
    await expect(element(by.text('Remove document'))).toBeVisible();
    await expect(element(by.text('Cannot be undone'))).toBeVisible();
    await element(by.text('Remove document')).tap();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 2');
    await expect(contextMenu()).toBeVisible();
    await dismissContextMenu();
  });

  it('resets omitted properties and keeps toggle callbacks separate from presses', async () => {
    await element(by.id('toggle-presentation')).tap();
    await openMenu();
    await expect(element(by.text('Select a document first'))).not.toExist();
    await expect(element(by.text('Cannot be undone'))).not.toExist();
    await expect(element(by.text('Managed by policy'))).not.toExist();
    await element(by.text('Open document')).tap();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 3');
    await openMenu();
    await element(by.text('Notifications')).tap();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 3');
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 1; IDs: none',
    );
    await element(by.id('rename-menu-item')).tap();
    await openMenu();
    await expect(notificationsCheckmark()).not.toExist();
    await dismissContextMenu();
    await element(by.id('rebuild-menu')).tap();
    await openMenu();
    await expect(notificationsCheckmark()).toBeVisible();
    await dismissContextMenu();
  });

  it('allows commands on disabled toggles and restores presentation after removal', async () => {
    await element(by.id('toggle-presentation')).tap();
    await element(by.id('set-toggle-state')).tap();
    await openMenu();
    await expect(notificationsCheckmark()).not.toExist();
    await expect(element(by.text('Managed by policy'))).toBeVisible();
    await tapDisabledItem('Notifications');
    await openMenu();
    await expect(notificationsCheckmark()).not.toExist();
    await expect(element(by.id('press-count'))).toHaveText('Presses: 3');
    await expect(element(by.id('selection-status'))).toHaveText(
      'Selections: 2; IDs: none',
    );
    await dismissContextMenu();
    await element(by.id('rebuild-menu')).tap();
    await openMenu();
    await expect(notificationsCheckmark()).toBeVisible();
    await expect(element(by.text('Managed by policy'))).toBeVisible();
    await dismissContextMenu();
    await element(by.id('toggle-menu')).tap();
    await headerItem('Actions').tap();
    // A negative waitFor returns immediately while presentation is still pending.
    await new Promise(resolve =>
      setTimeout(resolve, CONTEXT_MENU_ANIMATION_TIMEOUT_MS),
    );
    await expect(contextMenu()).not.toExist();
    await element(by.id('toggle-menu')).tap();
    await openMenu();
    await expect(element(by.text('Select a document first'))).toBeVisible();
    await expect(element(by.text('Cannot be undone'))).toBeVisible();
    await dismissContextMenu();
  });
});
