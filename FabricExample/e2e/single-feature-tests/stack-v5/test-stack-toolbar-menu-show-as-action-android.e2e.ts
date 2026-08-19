import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { ElementAttributeFrame } from 'detox/detox';
import {
  describeIfAndroid,
  getElementAttributes,
  getTopmostMatch,
  pickerOptionId,
  rewindAndScrollUntilVisible,
  selectSingleFeatureTestsScreen,
  waitUntil,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../../native-class-names';
// Typed from the screen, so a rename there fails type-checking here.
import type {
  CmdIconOption,
  CmdShowAsActionOption,
  HeaderTitle,
  IconOption,
  IdOption,
  ShowAsActionOption,
} from '@apps/tests/single-feature-tests/stack-v5/test-stack-toolbar-menu-show-as-action-android';

// Icon identity and tinting are not assertable through Detox. See `scenario.md`
// for the manual-only steps.

const SCROLLVIEW_ID = 'toolbar-menu-show-as-action-scrollview';
const HEADER_TITLE: HeaderTitle = 'Show As Action Test';

// 300px steps: large enough to move past a whole slot block per swipe, small
// enough not to carry a short picker option row past the viewport.
const SCROLL_STEP = { pixels: 300 };

// Detox's idle sync does not cover popup animations, so waits that straddle the
// menu opening or dismissing must be explicit.
const MENU_ANIMATION_TIMEOUT = 2000;

// Probes an already-settled popup: by then it is either up or was never opened.
const MENU_PRESENCE_TIMEOUT = 250;

// A `showAsAction` change re-inflates the action menu, and a rotation does it
// from a configuration change, so the toolbar can lag the assertion.
const TOOLBAR_UPDATE_TIMEOUT = 3000;

// Budget for the device to rotate and the app to lay out for the new
// orientation. Generous: an emulator rotation is slow and animated.
const ROTATION_TIMEOUT = 10000;

// Every title this scenario can put into the menu. Assertions check the full
// set — expected present, all others absent — so an item that fails to move
// between toolbar and overflow fails the test.
const ALL_TITLES = ['I1', 'Item 2', 'Item Number Three'] as const;

type MenuTitle = (typeof ALL_TITLES)[number];

const popup = by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW);

const overflowRow = (title: MenuTitle) => by.text(title).withAncestor(popup);

// A row's `group_divider` and `submenuarrow` share this class but are GONE here,
// and `by.type` matches visible views only — so a match is an icon.
const overflowRowImage = (title: MenuTitle) =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
    .withAncestor(
      by
        .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
        .withDescendant(by.text(title)),
    );

// `by.label` matches the action button in both its forms — icon-only (title as
// content description) and text (title as text) — so the form is told apart by
// the rendered text: AppCompat clears an icon-only button's text (`setText(null)`)
// and shows the title only while no icon is set or WITH_TEXT is in effect.
// @see androidx.appcompat.view.menu.ActionMenuItemView.updateTextButtonVisibility
const actionItem = (title: MenuTitle) =>
  element(
    by.label(title).and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW)),
  );

async function frameOf(id: string): Promise<ElementAttributeFrame> {
  const attributes = await getElementAttributes({ by: 'id', value: id });
  return attributes.frame;
}

// Detox's scroll gestures fling and the content keeps gliding after the call
// resolves, while a tap's coordinates are computed a moment before the touch
// lands — so a tap into a still-moving list hits whatever slid under it (another
// slot's option row, or the navigation bar). Nothing is tapped until its frame
// has stopped changing.
const SETTLE_TIMEOUT = 5000;
const SETTLE_POLL_INTERVAL = 50;

async function waitUntilStill(id: string) {
  let previous: ElementAttributeFrame | null = null;

  await waitUntil(
    async () => {
      const frame = await frameOf(id);
      const isStill = previous !== null && isSameFrame(previous, frame);
      previous = frame;
      return isStill;
    },
    {
      timeout: SETTLE_TIMEOUT,
      interval: SETTLE_POLL_INTERVAL,
      message: `${id} to stop moving`,
    },
  );
}

// The scroll view runs edge to edge, so a row can sit behind the system
// navigation bar. That bar is a separate window and does not clip the row, so
// `toBeVisible()` passes there and a tap at the row's center lands on Home.
// Everything below this fraction of the viewport counts as the bar. Measured on
// the reference emulator (API 36, 1080x2400 @ 420dpi, 3-button nav): the bar is
// 126px (48dp) and the portrait viewport under the header is ~2100px, so 8% is
// ~170px — clears the bar with ~16dp to spare, and the gesture bar is shorter.
const NAV_BAR_VIEWPORT_FRACTION = 0.08;

async function clearsNavigationBar(id: string): Promise<boolean> {
  const viewport = await frameOf(SCROLLVIEW_ID);
  const target = await frameOf(id);
  const navigationBarTop =
    viewport.y + viewport.height * (1 - NAV_BAR_VIEWPORT_FRACTION);

  // Both frames are in screen coordinates — no dp/px conversion needed.
  return target.y + target.height <= navigationBarTop;
}

// Returns with the target stationary and clear of the navigation bar, ready to
// be tapped.
async function scrollIntoView(id: string) {
  await rewindAndScrollUntilVisible(id, SCROLLVIEW_ID, SCROLL_STEP);

  for (let attempt = 0; attempt < 3; attempt++) {
    await waitUntilStill(id);

    if (await clearsNavigationBar(id)) {
      return;
    }

    try {
      await element(by.id(SCROLLVIEW_ID)).scroll(200, 'down', Number.NaN, 0.5);
    } catch {
      // At the content edge: the row is already as high as it can get.
      break;
    }
  }

  await waitUntilStill(id);
}

async function scrollToAndTap(id: string) {
  await scrollIntoView(id);
  await element(by.id(id)).tap();
}

type PickerSelection = {
  pickerId: string;
  /** The picker's `label` prop — option `testID`s are derived from it. */
  label: string;
  option: string;
};

// Same contract as e2e-utils' `selectPickerOption`, but every tap goes through
// this spec's `scrollIntoView` (settle + navigation-bar guards). Returns early
// when the picker already shows `option`. Closes the picker again: its option
// rows would otherwise collide with the `by.text` menu matchers.
async function selectOption({ pickerId, label, option }: PickerSelection) {
  const expected = `${label}: ${option}`;

  if ((await getTopmostMatch(by.id(pickerId))).text === expected) {
    return;
  }

  await scrollToAndTap(pickerId);
  await scrollToAndTap(pickerOptionId(label, option));
  await scrollToAndTap(pickerId);

  await expect(element(by.id(pickerId))).toHaveText(expected);
}

type Slot = 1 | 2 | 3;

async function setSlotShowAsAction(slot: Slot, option: ShowAsActionOption) {
  await selectOption({
    pickerId: `slot-${slot}-show-as-action-picker`,
    label: `slot ${slot} showAsAction`,
    option,
  });
}

async function setSlotIcon(slot: Slot, option: IconOption) {
  await selectOption({
    pickerId: `slot-${slot}-icon-picker`,
    label: `slot ${slot} icon`,
    option,
  });
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

/** The pickers keep their last value; `selectOption` skips ones already set. */
async function sendCommand(options: {
  target: IdOption;
  icon: CmdIconOption;
  showAsAction: CmdShowAsActionOption;
}) {
  await selectOption({ ...COMMAND_PICKERS.target, option: options.target });
  await selectOption({ ...COMMAND_PICKERS.icon, option: options.icon });
  await selectOption({
    ...COMMAND_PICKERS.showAsAction,
    option: options.showAsAction,
  });

  await scrollToAndTap('send-command-button');
}

async function openMenu() {
  await element(by.label('More options')).tap();
}

async function waitForMenuItem(title: MenuTitle) {
  await waitFor(element(overflowRow(title)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

// Detox searches one window: while the popup holds focus nothing behind it is
// in the hierarchy, so the screen itself has to become addressable again.
async function waitForScreen() {
  await waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

async function tapMenuItem(title: MenuTitle) {
  await waitForMenuItem(title);
  await element(overflowRow(title)).tap();
  await waitFor(element(overflowRow(title)))
    .not.toExist()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
  await waitForScreen();
}

// Back only when the popup is up: otherwise the activity takes it and pops the
// test screen.
async function closeMenuIfOpen() {
  const isOpen = await waitFor(element(popup))
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT)
    .then(
      () => true,
      () => false,
    );

  if (!isOpen) {
    return;
  }

  await device.pressBack();
  await waitForScreen();
}

// Rows are stacked vertically, so their y positions carry the menu order. Only
// callable while the menu is open.
async function expectMenuOrder(titles: readonly MenuTitle[]): Promise<void> {
  const rows: { title: MenuTitle; top: number }[] = [];

  for (const title of titles) {
    const attributes = await element(overflowRow(title)).getAttributes();

    if ('elements' in attributes) {
      throw new Error(`Expected a single menu row titled "${title}".`);
    }

    rows.push({ title, top: attributes.frame.y });
  }

  const topToBottom = [...rows].sort((a, b) => a.top - b.top).map(r => r.title);
  jestExpect(topToBottom).toEqual([...titles]);
}

// Asserts the exact overflow menu contents — every expected row present and
// icon-less, all other titles absent — then closes it. `expectedVisible` is a
// non-empty subset of ALL_TITLES (anything else would go unasserted); its first
// entry gates the open animation. `checkOrder` also asserts top-to-bottom order.
async function expectMenuItems(
  expectedVisible: [MenuTitle, ...MenuTitle[]],
  { checkOrder = false }: { checkOrder?: boolean } = {},
): Promise<void> {
  await openMenu();

  let assertionFailed = false;

  try {
    // Rows populate in one layout pass, so once the first is up the
    // `not.toExist()` checks below cannot pass prematurely.
    await waitForMenuItem(expectedVisible[0]);

    for (const title of expectedVisible) {
      await expect(element(overflowRow(title))).toBeVisible();
      // Icons never render in the overflow menu, whatever the `icon` prop.
      await expect(element(overflowRowImage(title))).not.toExist();
    }

    if (checkOrder) {
      await expectMenuOrder(expectedVisible);
    }

    for (const title of ALL_TITLES) {
      if (!expectedVisible.includes(title)) {
        await expect(element(overflowRow(title))).not.toExist();
      }
    }
  } catch (error) {
    assertionFailed = true;
    throw error;
  } finally {
    // A leaked popup would fail every later step of this stateful suite.
    try {
      await closeMenuIfOpen();
    } catch (cleanupError) {
      // A throw from `finally` would replace the error that actually failed.
      if (!assertionFailed) {
        throw cleanupError;
      }
    }
  }
}

/**
 * Promoted to the toolbar, rendering its icon in place of its title. Asserted
 * positively through the cleared text — on Android a negated matcher passes on
 * a missing view. Which icon it is stays manual (see the header comment).
 */
async function expectIconActionItem(title: MenuTitle) {
  await waitFor(actionItem(title))
    .toBeVisible()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
  await waitFor(actionItem(title))
    .toHaveText('')
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
}

/**
 * Promoted to the toolbar with its title as text — no icon set, or WITH_TEXT
 * put the title beside the icon. Whether an icon sits next to the text is not
 * assertable: it is a compound drawable of the same `TextView`, not a view.
 */
async function expectTextActionItem(title: MenuTitle) {
  await waitFor(actionItem(title))
    .toBeVisible()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
  await waitFor(actionItem(title))
    .toHaveText(title)
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
}

/** Not promoted: the button is in neither form in the toolbar. */
async function expectNoActionItem(title: MenuTitle) {
  await waitFor(actionItem(title))
    .not.toExist()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
}

async function expectNoActionItems() {
  for (const title of ALL_TITLES) {
    await expectNoActionItem(title);
  }
}

async function expectLastClicked(id: IdOption) {
  await scrollIntoView('last-clicked-text');
  await expect(element(by.id('last-clicked-text'))).toHaveText(
    `Last clicked: ${id}`,
  );
}

// WITH_TEXT only applies where the platform allows text beside an action icon —
// on a phone, landscape only.
//
// Rotation is asynchronous and no element appears or disappears with it, so
// there is no matcher to wait on; the scroll view's aspect ratio is the settle
// signal. Returning early would leave the next tap using coordinates from the
// old layout.
async function setOrientation(orientation: 'portrait' | 'landscape') {
  await device.setOrientation(orientation);

  let previous: ElementAttributeFrame | null = null;

  await waitUntil(
    async () => {
      const frame = await frameOf(SCROLLVIEW_ID);
      const hasNewAspect =
        orientation === 'landscape'
          ? frame.width > frame.height
          : frame.height > frame.width;

      // Two identical readings: the rotation animation is over, not merely
      // past the point where the new layout was applied.
      const isSettled =
        hasNewAspect && previous !== null && isSameFrame(previous, frame);
      previous = frame;
      return isSettled;
    },
    {
      timeout: ROTATION_TIMEOUT,
      interval: SETTLE_POLL_INTERVAL,
      message: `the screen to settle into ${orientation}`,
    },
  );
}

function isSameFrame(
  a: ElementAttributeFrame,
  b: ElementAttributeFrame,
): boolean {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  );
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

  describe('baseline — the default is equivalent to never', () => {
    it('keeps every item in the overflow menu when showAsAction is omitted', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();
      await expectNoActionItems();
      await expectMenuItems(['I1', 'Item 2', 'Item Number Three'], {
        checkOrder: true,
      });
    });

    it('reports item-1 when tapping "I1" in the overflow menu', async () => {
      await openMenu();
      await tapMenuItem('I1');

      await expectLastClicked('item-1');
    });

    it('reports item-3 when tapping "Item Number Three"', async () => {
      await openMenu();
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
      await setOrientation('landscape');

      await expectTextActionItem('I1');
    });

    it('returns to icon-only back in portrait', async () => {
      await setOrientation('portrait');

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
    });

    it('puts the title beside the icon in landscape', async () => {
      await setOrientation('landscape');

      await expectTextActionItem('I1');
      await expectTextActionItem('Item 2');
      await expectTextActionItem('Item Number Three');
    });

    it('demotes every item back to the overflow menu once the props are reset', async () => {
      await setOrientation('portrait');
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
