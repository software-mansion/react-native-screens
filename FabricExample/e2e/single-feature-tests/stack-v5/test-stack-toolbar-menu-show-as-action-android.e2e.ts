import { device, expect, element, by, waitFor } from 'detox';
import {
  actionMenuItem,
  createOverflowMenuHelpers,
  describeIfAndroid,
  expectIconActionItem,
  expectLastClicked as expectLastClickedText,
  expectNoActionItem,
  expectOverflowMenuOrder,
  expectTextActionItem,
  menuItemImage,
  openOverflowMenu,
  OVERFLOW_MENU_LABEL,
  overflowMenuText,
  scrollToAndTap,
  selectPickerOption,
  selectSingleFeatureTestsScreen,
  TOOLBAR_UPDATE_TIMEOUT_MS,
} from '../../e2e-utils';
// Typed from the screen, so a rename there fails type-checking here.
import type {
  CmdIconOption,
  CmdShowAsActionOption,
  HeaderTitle,
  IconOption,
  IdOption,
  ItemTitle as MenuTitle,
  ShowAsActionOption,
} from '@apps/tests/single-feature-tests/stack-v5/test-stack-toolbar-menu-show-as-action-android';

// Icon identity and tinting are not assertable through Detox. See `scenario.md`
// for the manual-only steps.

const SCROLLVIEW_ID = 'toolbar-menu-show-as-action-scrollview';
const HEADER_TITLE: HeaderTitle = 'Show As Action Test';

// 300px steps: large enough to move past a whole slot block per swipe, small
// enough not to carry a short picker option row past the viewport.
const SCROLL_STEP = { pixels: 300 };

// Every title this scenario can put into the menu. Assertions check the full
// set — expected present, all others absent — so an item that fails to move
// between toolbar and overflow fails the test. `Record<MenuTitle, …>` makes a
// missing or unknown title a type error.
const ALL_TITLES = Object.keys({
  I1: true,
  'Item 2': true,
  'Item Number Three': true,
} satisfies Record<MenuTitle, true>) as MenuTitle[];

const overflowRow = (title: MenuTitle) => overflowMenuText(title);

// A row's `group_divider` and `submenuarrow` are GONE here, so a match is an
// icon.
const overflowRowImage = (title: MenuTitle) => menuItemImage(title);

const actionItem = (title: MenuTitle) => element(actionMenuItem(title));

const SCROLL = { scrollViewId: SCROLLVIEW_ID, ...SCROLL_STEP };

type Slot = 1 | 2 | 3;

async function setSlotShowAsAction(slot: Slot, option: ShowAsActionOption) {
  await selectPickerOption(
    {
      pickerId: `slot-${slot}-show-as-action-picker`,
      label: `slot ${slot} showAsAction`,
      option,
    },
    SCROLL,
  );
}

async function setSlotIcon(slot: Slot, option: IconOption) {
  await selectPickerOption(
    {
      pickerId: `slot-${slot}-icon-picker`,
      label: `slot ${slot} icon`,
      option,
    },
    SCROLL,
  );
}

/** Keyed by the `label` the option `testID`s are derived from. */
const COMMAND_PICKERS = {
  target: { pickerId: 'cmd-target-picker', label: 'target id' },
  icon: { pickerId: 'cmd-icon-picker', label: 'cmd icon' },
  showAsAction: {
    pickerId: 'cmd-show-as-action-picker',
    label: 'cmd showAsAction',
  },
} as const;

/** The pickers keep their last value; `selectPickerOption` skips ones already set. */
async function sendCommand(options: {
  target: IdOption;
  icon: CmdIconOption;
  showAsAction: CmdShowAsActionOption;
}) {
  await selectPickerOption(
    { ...COMMAND_PICKERS.target, option: options.target },
    SCROLL,
  );
  await selectPickerOption(
    { ...COMMAND_PICKERS.icon, option: options.icon },
    SCROLL,
  );
  await selectPickerOption(
    { ...COMMAND_PICKERS.showAsAction, option: options.showAsAction },
    SCROLL,
  );

  await scrollToAndTap('send-command-button', SCROLL);
}

const overflowButton = () => element(by.label(OVERFLOW_MENU_LABEL));

/**
 * With every item promoted nothing is left to overflow, so AppCompat drops the
 * overflow button altogether. Waited for, since the toolbar re-inflates.
 */
async function expectNoOverflowMenu() {
  await waitFor(overflowButton())
    .not.toExist()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT_MS);
}

const { closeMenuIfOpen, withOverflowMenu, waitForMenuItem, tapMenuItem } =
  createOverflowMenuHelpers({ scrollViewId: SCROLLVIEW_ID });

// Asserts the exact overflow menu contents — the given titles top to bottom in
// that order, each row icon-less, all other titles absent — then closes it.
// `expectedVisible` is a non-empty subset of ALL_TITLES (anything else would go
// unasserted); its first entry gates the open animation.
async function expectMenuItems(
  expectedVisible: [MenuTitle, ...MenuTitle[]],
): Promise<void> {
  // A leaked popup would fail every later step of this stateful suite;
  // `withOverflowMenu` closes it even when an assertion throws.
  await withOverflowMenu(async () => {
    // Rows populate in one layout pass, so once the first is up the
    // `not.toExist()` checks below cannot pass prematurely.
    await waitForMenuItem(expectedVisible[0]);

    for (const title of expectedVisible) {
      await expect(element(overflowRow(title))).toBeVisible();
      // Icons never render in the overflow menu, whatever the `icon` prop.
      await expect(element(overflowRowImage(title))).not.toExist();
    }

    await expectOverflowMenuOrder(expectedVisible);

    for (const title of ALL_TITLES) {
      if (!expectedVisible.includes(title)) {
        await expect(element(overflowRow(title))).not.toExist();
      }
    }
  });
}

// Which icon renders stays manual (see the header comment).
async function expectNoActionItems() {
  for (const title of ALL_TITLES) {
    await expectNoActionItem(title);
  }
}

async function expectLastClicked(id: IdOption) {
  await expectLastClickedText(id, SCROLL);
}

describeIfAndroid('Stack Toolbar Menu Show As Action', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-show-as-action-android',
    );
  });

  // A failure mid-rotation would otherwise leave later tests in landscape,
  // where promotion rules differ.
  afterAll(async () => {
    await device.setOrientation('portrait');
  });

  // The direct `openMenu()` cases close the menu via `tapMenuItem`; if a step
  // fails in between, the popup would otherwise leak into every later case.
  afterEach(closeMenuIfOpen);

  describe('baseline — the default is equivalent to never', () => {
    it('keeps every item in the overflow menu when showAsAction is omitted', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();
      await expectNoActionItems();
      await expectMenuItems(['I1', 'Item 2', 'Item Number Three']);
    });

    it('reports item-1 when tapping "I1" in the overflow menu', async () => {
      await openOverflowMenu();
      await tapMenuItem('I1');

      await expectLastClicked('item-1');
    });

    it('reports item-3 when tapping "Item Number Three"', async () => {
      await openOverflowMenu();
      await tapMenuItem('Item Number Three');

      await expectLastClicked('item-3');
    });
  });

  describe('props — explicit never', () => {
    it('leaves item-1 in the overflow menu, same as the default', async () => {
      await setSlotShowAsAction(1, 'never');

      await expectNoActionItems();
      await expectMenuItems(['I1', 'Item 2', 'Item Number Three']);
    });

    it('keeps item-1 in the overflow menu once an icon is set', async () => {
      await setSlotIcon(1, 'searchIcon');

      await expectNoActionItems();
      await expectMenuItems(['I1', 'Item 2', 'Item Number Three']);
    });
  });

  describe('props — always', () => {
    it('promotes item-1 to the toolbar as an icon action button', async () => {
      await setSlotShowAsAction(1, 'always');

      await expectIconActionItem('I1');
      await expectMenuItems(['Item 2', 'Item Number Three']);
    });

    it('reports item-1 when tapping the action button', async () => {
      await actionItem('I1').tap();

      await expectLastClicked('item-1');
    });
  });

  describe('props — alwaysWithText', () => {
    it('renders icon-only in portrait, like always', async () => {
      await setSlotShowAsAction(1, 'alwaysWithText');

      await expectIconActionItem('I1');
      await expectMenuItems(['Item 2', 'Item Number Three']);
    });

    it('puts the title beside the icon in landscape', async () => {
      await device.setOrientation('landscape');

      await expectTextActionItem('I1');
    });

    it('returns to icon-only back in portrait', async () => {
      await device.setOrientation('portrait');

      await expectIconActionItem('I1');
    });
  });

  describe('props — ifRoom', () => {
    // With all three requesting ifRoom, how many fit is width-dependent: two
    // text buttons on the reference emulator. `scenario.md` covers other widths.
    it('promotes the two items that fit as text action buttons', async () => {
      await setSlotIcon(1, 'undefined');
      await setSlotShowAsAction(1, 'ifRoom');
      await setSlotIcon(2, 'undefined');
      await setSlotShowAsAction(2, 'ifRoom');
      await setSlotIcon(3, 'undefined');
      await setSlotShowAsAction(3, 'ifRoom');

      await expectTextActionItem('I1');
      await expectTextActionItem('Item 2');
      await expectMenuItems(['Item Number Three']);
    });
  });

  describe('props — ifRoomWithText', () => {
    // Icon-only buttons are narrower than text ones, so all three fit here.
    it('renders icon-only in portrait', async () => {
      await setSlotIcon(1, 'searchIcon');
      await setSlotShowAsAction(1, 'ifRoomWithText');
      await setSlotIcon(2, 'searchIcon');
      await setSlotShowAsAction(2, 'ifRoomWithText');
      await setSlotIcon(3, 'searchIcon');
      await setSlotShowAsAction(3, 'ifRoomWithText');

      await expectIconActionItem('I1');
      await expectIconActionItem('Item 2');
      await expectIconActionItem('Item Number Three');
      await expectNoOverflowMenu();
    });

    it('puts the title beside the icon in landscape', async () => {
      await device.setOrientation('landscape');

      await expectTextActionItem('I1');
      await expectTextActionItem('Item 2');
      await expectTextActionItem('Item Number Three');
    });

    it('demotes every item back to the overflow menu once the props are reset', async () => {
      await device.setOrientation('portrait');
      await setSlotIcon(1, 'undefined');
      await setSlotShowAsAction(1, 'undefined');
      await setSlotIcon(2, 'undefined');
      await setSlotShowAsAction(2, 'undefined');
      await setSlotIcon(3, 'undefined');
      await setSlotShowAsAction(3, 'undefined');

      await expectNoActionItems();
      await expectMenuItems(['I1', 'Item 2', 'Item Number Three']);
    });
  });

  describe('imperative command — never → always', () => {
    it('promotes item-1 to the toolbar without any props change', async () => {
      await sendCommand({
        target: 'item-1',
        icon: 'no change',
        showAsAction: 'always',
      });

      await expectTextActionItem('I1');
      await expectMenuItems(['Item 2', 'Item Number Three']);
    });

    it('keeps the showAsAction override while a later command sets the icon', async () => {
      await sendCommand({
        target: 'item-1',
        icon: 'searchIcon',
        showAsAction: 'no change',
      });

      await expectIconActionItem('I1');
      await expectMenuItems(['Item 2', 'Item Number Three']);
    });
  });

  describe('imperative command — always → never', () => {
    it('demotes item-1 back to the overflow menu', async () => {
      await sendCommand({
        target: 'item-1',
        icon: 'no change',
        showAsAction: 'never',
      });

      await expectNoActionItems();
      await expectMenuItems(['I1', 'Item 2', 'Item Number Three']);
    });
  });

  describe('imperative command — reset showAsAction to its regular default', () => {
    it('promotes item-2 when showAsAction = always', async () => {
      await sendCommand({
        target: 'item-2',
        icon: 'no change',
        showAsAction: 'always',
      });

      await expectTextActionItem('Item 2');
      await expectMenuItems(['I1', 'Item Number Three']);
    });

    it('demotes item-2 again when showAsAction = undefined', async () => {
      await sendCommand({
        target: 'item-2',
        icon: 'no change',
        showAsAction: 'undefined',
      });

      await expectNoActionItems();
      await expectMenuItems(['I1', 'Item 2', 'Item Number Three']);
    });
  });
});
