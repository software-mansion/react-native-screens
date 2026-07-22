import { device, expect, element, by, waitFor } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
import isVersionEqualOrHigherThan from '../../helpers/isVersionEqualOrHigherThan';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_CELL,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
} from '../../native-class-names';

const {
  getIOSVersionNumber,
} = require('../../../../scripts/e2e/ios-devices.js');

/**
 * The iOS 26 toolbar overflow ("More") button only appears once the header
 * runs out of room for trailing items. Scenario steps 5-8 are scoped to
 * iPhone (iOS 26) and don't apply on iOS 18.
 */
const isIOS26OrLater =
  device.getPlatform() === 'ios' &&
  isVersionEqualOrHigherThan(getIOSVersionNumber(), '26.0');

const describeIfIOS26 = isIOS26OrLater ? describe : describe.skip;

/** A title-only trailing header button item, addressed by its visible title.
 * With or without an attached `menu`, this resolves to `_UIButtonBarButton`. */
function headerItem(title: string) {
  return element(by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).and(by.label(title)));
}

/**
 * A selectable row inside a presented native UIMenu (a header-item menu, or on
 * iOS 26 the toolbar overflow menu and its submenus), addressed by its title.
 * The `_UIContextMenuCell` ancestor excludes a submenu's pinned title/back row,
 * which shares the label of the submenu's first entry when that item also has
 * an `onPress`.
 */
function menuRow(title: string) {
  return element(
    by
      .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
      .and(by.label(title))
      .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL)),
  );
}

const overflowButton = element(by.id('OverflowBarButtonItem'));

/**
 * Dismisses any presented native UIMenu (header-item, or on iOS 26 the overflow
 * menu and its submenus) by tapping UIKit's full-screen "Dismiss context menu"
 * element, which every context menu exposes regardless of its anchor - so no
 * off-menu coordinate has to be computed.
 */
async function dismissMenu() {
  await element(by.label('Dismiss context menu')).tap();
}

/**
 * Dismisses a toast by message, tolerating the `1. ` index prefix that
 * `ToastProvider` prepends (see `apps/src/shared/Toast.tsx`). Each interaction
 * dismisses its toast before the next, so only one is ever stacked.
 */
async function dismissToast(message: string) {
  const label = `1. ${message}`;
  await waitFor(element(by.label(label)))
    .toBeVisible()
    .withTimeout(2000);
  await element(by.label(label)).tap();
}

async function toggleItemsCount() {
  await element(by.id('toggle-items-count-button')).tap();
}

describeIfiOS('Stack Header Subview onPress (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-subview-onpress-ios',
    );
  });

  it('should display the header with both trailing items initially', async () => {
    await expect(headerItem('Menu 1')).toBeVisible();
    await expect(headerItem('Item 0')).toBeVisible();
  });

  it('should fire the onPress toast when tapping Item 0 (it has both onPress and a menu)', async () => {
    await headerItem('Item 0').tap();
    await dismissToast('onPress Item 0');
  });

  it('should open a native menu with two actions on a single tap of Menu 1, which has no onPress', async () => {
    await headerItem('Menu 1').tap();

    await expect(menuRow('Action 1-1')).toBeVisible();
    await expect(menuRow('Action 1-2')).toBeVisible();

    await dismissMenu();
  });

  it("should require a long press (not a tap) to open Item 0's own menu, since a tap fires onPress instead", async () => {
    await headerItem('Item 0').longPress();

    await expect(menuRow('Action 0-1')).toBeVisible();
    await expect(menuRow('Action 0-2')).toBeVisible();
    await expect(element(by.label('1. onPress Item 0'))).not.toExist();

    await dismissMenu();
  });

  describeIfIOS26('iOS 26 toolbar overflow ("More") menu', () => {
    it('should move Item 0 and Menu 1 into the overflow button once 5 items are configured', async () => {
      await toggleItemsCount(); // 2 -> 3
      await toggleItemsCount(); // 3 -> 4
      await toggleItemsCount(); // 4 -> 5

      await expect(headerItem('Item 0')).not.toExist();
      await expect(headerItem('Menu 1')).not.toExist();
      await expect(headerItem('Item 2')).toBeVisible();
      await expect(headerItem('Menu 3')).toBeVisible();
      await expect(headerItem('Item 4')).toBeVisible();
      await expect(overflowButton).toBeVisible();
    });

    it('should list Item 0 and Menu 1 as entries when opening the overflow menu', async () => {
      await overflowButton.tap();

      await expect(menuRow('Item 0')).toBeVisible();
      await expect(menuRow('Menu 1')).toBeVisible();
    });

    it("should open a 3-row submenu (Item 0, Action 0-1, Action 0-2) for the overflow's Item 0 entry, and fire the onPress toast when tapping its own row", async () => {
      await menuRow('Item 0').tap();

      await expect(menuRow('Item 0')).toBeVisible();
      await expect(menuRow('Action 0-1')).toBeVisible();
      await expect(menuRow('Action 0-2')).toBeVisible();

      await menuRow('Item 0').tap();
      await dismissToast('onPress Item 0');
    });

    it("should open a 2-row submenu (Action 1-1, Action 1-2) for the overflow's Menu 1 entry, which has no onPress", async () => {
      await overflowButton.tap();
      await menuRow('Menu 1').tap();

      await expect(menuRow('Action 1-1')).toBeVisible();
      await expect(menuRow('Action 1-2')).toBeVisible();

      await dismissMenu();
    });
  });
});
