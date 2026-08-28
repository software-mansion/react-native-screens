import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  describeIfiOS26,
  dismissToast,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  chevronFor,
  dismissContextMenu,
  menuRow as anyMenuRow,
  openContextMenu,
  submenuTitleRow,
} from '../../e2e-utils';
import { headerItem } from '../../e2e-utils';

/**
 * A selectable row of the presented menu. A submenu's pinned title/back row
 * shares the label of the submenu's first entry when that item also has an
 * `onPress`, so only action rows are matched here.
 */
const menuRow = (title: string) => anyMenuRow(title, { actionsOnly: true });

/** UIKit's automatic identifier for the iOS 26 toolbar overflow ("More") item. */
const overflowButton = element(by.id('OverflowBarButtonItem'));

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
    await dismissToast('1. onPress Item 0');
  });

  it('should open a native menu with two actions on a single tap of Menu 1, which has no onPress', async () => {
    await openContextMenu(headerItem('Menu 1'));

    await expect(menuRow('Action 1-1')).toBeVisible();
    await expect(menuRow('Action 1-2')).toBeVisible();

    await dismissContextMenu();
  });

  it("should require a long press (not a tap) to open Item 0's own menu, since a tap fires onPress instead", async () => {
    // Detox limitation: `longPress` is implemented as a tap that is then held,
    // so the initial touch-down still fires Item 0's `onPress` and surfaces its
    // toast. The scenario expects only the native menu to appear on a real long
    // press, so we assert the menu opened and dismiss it (rather than the toast)
    // to leave a clean state for the following tests.
    await openContextMenu(headerItem('Item 0'), { gesture: 'longPress' });

    await expect(menuRow('Action 0-1')).toBeVisible();
    await expect(menuRow('Action 0-2')).toBeVisible();
    await dismissContextMenu();
  });

  describeIfiOS26('iOS 26 toolbar overflow ("More") menu', () => {
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
      await openContextMenu(overflowButton);

      await expect(menuRow('Item 0')).toBeVisible();
      await expect(menuRow('Menu 1')).toBeVisible();
      await expect(chevronFor('Item 0')).toBeVisible();
      await expect(chevronFor('Menu 1')).toBeVisible();
    });

    it("should open a 3-row submenu (Item 0, Action 0-1, Action 0-2) for the overflow's Item 0 entry, and fire the onPress toast when tapping its own row", async () => {
      await menuRow('Item 0').tap();

      await expect(menuRow('Item 0').atIndex(1)).toBeVisible();
      await expect(submenuTitleRow('Item 0')).toBeVisible();
      await expect(menuRow('Action 0-1')).toBeVisible();
      await expect(menuRow('Action 0-2')).toBeVisible();

      await menuRow('Item 0').atIndex(1).tap();
      await dismissToast('1. onPress Item 0');
    });

    it("should open a 2-row submenu (Action 1-1, Action 1-2) for the overflow's Menu 1 entry, which has no onPress", async () => {
      await openContextMenu(overflowButton);
      await menuRow('Menu 1').tap();

      await expect(menuRow('Action 1-1')).toBeVisible();
      await expect(menuRow('Action 1-2')).toBeVisible();

      await dismissContextMenu();
    });
  });
});
