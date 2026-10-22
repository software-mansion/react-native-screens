import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { dismissNextToast } from '@e2e/app/toast';
import {
  chevronFor,
  dismissContextMenu,
  menuRow,
  openHeaderItemMenu,
  openHeaderViewMenu,
  submenuTitleRow,
} from '@e2e/framework/context-menu-ios';
import {
  expectHeaderItemShown,
  expectHeaderViewShown,
  headerItem,
  tapHeaderItem,
} from '@e2e/framework/header-items-ios';
import { describeIfIOS, describeIfIOSAtLeast } from '@e2e/framework/platform';

/**
 * A selectable row of the presented menu. A submenu's pinned title/back row
 * shares the label of the submenu's first entry when that item also has an
 * `onPress`, so only action rows are matched here.
 */
const actionRow = (title: string) => menuRow(title, { actionsOnly: true });

/** UIKit's automatic identifier for the iOS 26 toolbar overflow ("More") item. */
const OVERFLOW_BUTTON = by.id('OverflowBarButtonItem');

async function toggleItemsCount() {
  await element(by.id('toggle-items-count-button')).tap();
}

describeIfIOS('Stack Header Subview onPress (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-subview-onpress-ios',
    );
  });

  it('should display the header with both trailing items initially', async () => {
    await expectHeaderItemShown('Menu 1');
    await expectHeaderItemShown('Item 0');
  });

  it('should fire the onPress toast when tapping Item 0 (it has both onPress and a menu)', async () => {
    await tapHeaderItem('Item 0');
    await dismissNextToast('onPress Item 0');
  });

  it('should open a native menu with two actions on a single tap of Menu 1, which has no onPress', async () => {
    await openHeaderItemMenu('Menu 1');

    await expect(actionRow('Action 1-1')).toBeVisible();
    await expect(actionRow('Action 1-2')).toBeVisible();

    await dismissContextMenu();
  });

  it("should require a long press (not a tap) to open Item 0's own menu, since a tap fires onPress instead", async () => {
    // The long press is made by coordinates, so - as for a real long press -
    // only the native menu appears and Item 0's `onPress` toast does not.
    await openHeaderItemMenu('Item 0', { gesture: 'longPress' });

    await expect(actionRow('Action 0-1')).toBeVisible();
    await expect(actionRow('Action 0-2')).toBeVisible();
    await dismissContextMenu();
  });

  describeIfIOSAtLeast('26.0')('iOS 26 toolbar overflow ("More") menu', () => {
    it('should move Item 0 and Menu 1 into the overflow button once 5 items are configured', async () => {
      await toggleItemsCount(); // 2 -> 3
      await toggleItemsCount(); // 3 -> 4
      await toggleItemsCount(); // 4 -> 5

      await expect(headerItem('Item 0')).not.toExist();
      await expect(headerItem('Menu 1')).not.toExist();
      await expectHeaderItemShown('Item 2');
      await expectHeaderItemShown('Menu 3');
      await expectHeaderItemShown('Item 4');
      await expectHeaderViewShown(OVERFLOW_BUTTON);
    });

    it('should list Item 0 and Menu 1 as entries when opening the overflow menu', async () => {
      await openHeaderViewMenu(OVERFLOW_BUTTON, 'the overflow button');

      await expect(actionRow('Item 0')).toBeVisible();
      await expect(actionRow('Menu 1')).toBeVisible();
      await expect(chevronFor('Item 0')).toBeVisible();
      await expect(chevronFor('Menu 1')).toBeVisible();
    });

    it("should open a 3-row submenu (Item 0, Action 0-1, Action 0-2) for the overflow's Item 0 entry, and fire the onPress toast when tapping its own row", async () => {
      await actionRow('Item 0').tap();

      await expect(actionRow('Item 0').atIndex(1)).toBeVisible();
      await expect(submenuTitleRow('Item 0')).toBeVisible();
      await expect(actionRow('Action 0-1')).toBeVisible();
      await expect(actionRow('Action 0-2')).toBeVisible();

      await actionRow('Item 0').atIndex(1).tap();
      await dismissNextToast('onPress Item 0');
    });

    it("should open a 2-row submenu (Action 1-1, Action 1-2) for the overflow's Menu 1 entry, which has no onPress", async () => {
      await openHeaderViewMenu(OVERFLOW_BUTTON, 'the overflow button');
      await actionRow('Menu 1').tap();

      await expect(actionRow('Action 1-1')).toBeVisible();
      await expect(actionRow('Action 1-2')).toBeVisible();

      await dismissContextMenu();
    });
  });
});
