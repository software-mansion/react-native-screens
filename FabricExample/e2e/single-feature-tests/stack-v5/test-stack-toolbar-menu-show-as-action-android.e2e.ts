import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { ElementAttributeFrame } from 'detox/detox';
import {
  describeIfAndroid,
  getElementAttributes,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../../native-class-names';

// Icon identity, icon tinting and the fact that overflow rows never render an
// icon are not assertable through Detox — the popup row layout keeps a GONE
// `ImageView` in the hierarchy either way. See `scenario.md` next to the test
// screen for the manual-only steps.

const SCROLLVIEW_ID = 'toolbar-menu-show-as-action-scrollview';
const HEADER_TITLE = 'Show As Action Test';

// Detox's idle sync does not cover popup window animations, so every wait that
// straddles the overflow menu opening or dismissing has to be explicit.
const MENU_ANIMATION_TIMEOUT = 2000;

// Probes an already-settled popup rather than an animation — by the time it is
// used the menu is either up or was never opened.
const MENU_PRESENCE_TIMEOUT = 250;

// A `showAsAction` change re-inflates the action menu, and a rotation does it
// from a configuration change, so the toolbar can lag the assertion.
const TOOLBAR_UPDATE_TIMEOUT = 3000;

// Budget for the device to rotate and the app to lay out for the new
// orientation. Generous: an emulator rotation is slow and animated.
const ROTATION_TIMEOUT = 10000;

// Every title this scenario can put into the menu. Menu assertions check the
// full set — expected titles present, all others absent — so an item that fails
// to move between the toolbar and the overflow menu fails the test.
const ALL_TITLES = ['I1', 'Item 2', 'Item Number Three'] as const;

type MenuTitle = (typeof ALL_TITLES)[number];

const toolbar = by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR);
const popup = by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW);

const overflowRow = (title: MenuTitle) => by.text(title).withAncestor(popup);

// An action item shows its title as text only while no icon is set, or while
// the WITH_TEXT modifier is in effect (landscape only).
const actionItemText = (title: MenuTitle) =>
  by.text(title).withAncestor(toolbar);

// `ActionMenuItemView` falls back to the item's title as its content
// description exactly when it renders icon-only, so this is what distinguishes
// an icon action button from a text one.
// @see StackHeaderToolbarMenuApplicator.applyMenuElementOptions
const actionItemLabel = (title: MenuTitle) =>
  by.label(title).withAncestor(toolbar);

// Mirrors the option `testID` that `SettingsPicker` derives from its `label`.
// @see apps/src/shared/SettingsPicker.tsx
function optionId(pickerLabel: string, option: string): string {
  return `${pickerLabel.split(' ').join('-')}-${option}`.toLowerCase();
}

async function frameOf(id: string): Promise<ElementAttributeFrame> {
  const attributes = await getElementAttributes({ by: 'id', value: id });
  return attributes.frame;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Detox's scroll gestures fling, and the momentum keeps the content gliding
// after the action itself has resolved. Detox computes a tap's coordinates from
// the element's position and dispatches the touch a moment later, so a tap into
// a still-moving list lands on whatever has slid under those coordinates — which
// is how a tap meant for one slot's option row selects another slot's, or misses
// the content entirely and hits the system navigation bar. Nothing is tapped
// until its frame has stopped changing.
const SETTLE_TIMEOUT = 5000;
const SETTLE_POLL_INTERVAL = 50;

async function waitUntilStill(id: string) {
  const deadline = Date.now() + SETTLE_TIMEOUT;
  let previous: ElementAttributeFrame | null = null;

  for (;;) {
    const frame = await frameOf(id);

    if (previous && isSameFrame(previous, frame)) {
      return;
    }

    if (Date.now() > deadline) {
      throw new Error(`${id} was still moving after ${SETTLE_TIMEOUT} ms.`);
    }

    previous = frame;
    await sleep(SETTLE_POLL_INTERVAL);
  }
}

// The scroll view runs edge to edge — its frame ends at the bottom of the screen
// — so a row can be drawn behind the system navigation bar. That bar is a
// separate window and does not clip the row, so Espresso still reports it as
// fully visible and `toBeVisible()` happily settles there, leaving a tap at the
// row's center to land on Home. Everything below this fraction of the viewport
// is treated as the navigation bar's; it covers the 3-button bar and the gesture
// bar alike.
const NAV_BAR_VIEWPORT_FRACTION = 0.08;

async function clearsNavigationBar(id: string): Promise<boolean> {
  const viewport = await frameOf(SCROLLVIEW_ID);
  const target = await frameOf(id);
  const navigationBarTop =
    viewport.y + viewport.height * (1 - NAV_BAR_VIEWPORT_FRACTION);

  // Frames are in screen coordinates and both are read in the same units, so no
  // dp/px conversion is needed.
  return target.y + target.height <= navigationBarTop;
}

// Rewinds to the top first, so a target above the current offset is still
// reachable — `whileElement` only scrolls one way. Returns with the target
// stationary and clear of the navigation bar, ready to be tapped.
async function scrollIntoView(id: string) {
  await element(by.id(SCROLLVIEW_ID)).scrollTo('top');
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(SCROLLVIEW_ID))
    .scroll(300, 'down', Number.NaN, 0.85);

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

// Closing the picker again matters: its option rows stay in the hierarchy and
// would collide with the `by.text` matchers used for the menu items.
async function selectOption(
  pickerId: string,
  pickerLabel: string,
  option: string,
) {
  await scrollIntoView(pickerId);
  await element(by.id(pickerId)).tap();

  const rowId = optionId(pickerLabel, option);
  await scrollIntoView(rowId);
  await element(by.id(rowId)).tap();

  await scrollIntoView(pickerId);
  await element(by.id(pickerId)).tap();

  await expect(element(by.id(pickerId))).toHaveText(
    `${pickerLabel}: ${option}`,
  );
}

type ShowAsAction =
  | 'undefined'
  | 'never'
  | 'always'
  | 'alwaysWithText'
  | 'ifRoom'
  | 'ifRoomWithText';
type Icon = 'undefined' | 'searchIcon';

type Slot = 1 | 2 | 3;

async function setSlotShowAsAction(slot: Slot, value: ShowAsAction) {
  await selectOption(
    `slot-${slot}-show-as-action-picker`,
    `slot ${slot} showAsAction`,
    value,
  );
}

async function setSlotIcon(slot: Slot, value: Icon) {
  await selectOption(`slot-${slot}-icon-picker`, `slot ${slot} icon`, value);
}

async function sendCommand(options: {
  target: 'item-1' | 'item-2' | 'item-3';
  icon: Icon | 'no change';
  showAsAction: ShowAsAction | 'no change';
}) {
  await selectOption('cmd-target-picker', 'target id', options.target);
  await selectOption('cmd-icon-picker', 'cmd icon', options.icon);
  await selectOption(
    'cmd-show-as-action-picker',
    'cmd showAsAction',
    options.showAsAction,
  );

  await scrollIntoView('send-command-button');
  await element(by.id('send-command-button')).tap();
}

async function openMenu() {
  await element(by.label('More options')).tap();
}

async function waitForMenuItem(title: MenuTitle) {
  await waitFor(element(overflowRow(title)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

// Detox resolves matchers against a single window: while the popup holds focus
// nothing behind it is in the searched hierarchy, so the entry going away is
// not enough — the screen itself has to become addressable again.
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

// Presses Back only when the popup is actually up: a menu that never opened
// would otherwise take the Back press itself and pop the test screen.
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

// Rows are stacked vertically, so their on-screen positions carry the order the
// menu was built in. Only callable while the menu is open.
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

// Asserts the exact overflow menu contents, then closes it. `expectedVisible`
// is a non-empty subset of ALL_TITLES — a title outside that set would go
// unasserted, and the first entry gates the open animation. With `checkOrder`,
// the entries must also appear top to bottom in the order given.
async function expectMenuItems(
  expectedVisible: [MenuTitle, ...MenuTitle[]],
  { checkOrder = false }: { checkOrder?: boolean } = {},
): Promise<void> {
  await openMenu();

  let assertionFailed = false;

  try {
    // Populated in a single layout pass, so once the first expected entry is up
    // the `not.toExist()` checks below cannot pass prematurely.
    await waitForMenuItem(expectedVisible[0]);

    for (const title of expectedVisible) {
      await expect(element(overflowRow(title))).toBeVisible();
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
    // Closed here so a failed assertion does not leave the popup covering the
    // screen — this suite is stateful and every later step would then fail.
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

/** Promoted to the toolbar, rendering its icon in place of its title. */
async function expectIconActionItem(title: MenuTitle) {
  await waitFor(element(actionItemLabel(title)))
    .toBeVisible()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
  await expect(element(actionItemText(title))).not.toExist();
}

/**
 * Promoted to the toolbar with its title rendered as text — either because no
 * icon is set, or because the WITH_TEXT modifier put the title beside the icon.
 * Whether an icon sits next to the text is not assertable through Detox.
 */
async function expectTextActionItem(title: MenuTitle) {
  await waitFor(element(actionItemText(title)))
    .toBeVisible()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
}

/** Not promoted: neither the text nor the icon form is in the toolbar. */
async function expectNoActionItem(title: MenuTitle) {
  await waitFor(element(actionItemText(title)))
    .not.toExist()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT);
  await expect(element(actionItemLabel(title))).not.toExist();
}

async function expectNoActionItems() {
  for (const title of ALL_TITLES) {
    await expectNoActionItem(title);
  }
}

async function expectLastClicked(id: string) {
  await scrollIntoView('last-clicked-text');
  await expect(element(by.id('last-clicked-text'))).toHaveText(
    `Last clicked: ${id}`,
  );
}

// The WITH_TEXT modifier only takes effect where the platform allows text
// alongside an action icon, which on a phone is landscape only.
//
// The rotation is asynchronous and nothing on the screen appears or disappears
// with it — the header title, the scroll view and every control stay visible
// throughout — so there is no matcher-based settle signal. The scroll view's
// frame is one: wait until its aspect matches the new orientation. Returning
// early leaves the next interaction tapping coordinates from the previous
// layout, which is how a picker row tap ends up on the navigation bar.
async function setOrientation(orientation: 'portrait' | 'landscape') {
  await device.setOrientation(orientation);

  const deadline = Date.now() + ROTATION_TIMEOUT;
  let previous: ElementAttributeFrame | null = null;

  for (;;) {
    const frame = await frameOf(SCROLLVIEW_ID);
    const hasNewAspect =
      orientation === 'landscape'
        ? frame.width > frame.height
        : frame.height > frame.width;

    // Two identical readings, so the rotation animation is over rather than
    // merely past the point where the new layout was applied.
    if (hasNewAspect && previous && isSameFrame(previous, frame)) {
      return;
    }

    if (Date.now() > deadline) {
      throw new Error(
        `The screen did not settle into ${orientation} within ${ROTATION_TIMEOUT} ms.`,
      );
    }

    previous = frame;
    await sleep(SETTLE_POLL_INTERVAL);
  }
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

  // A test failing mid-rotation would otherwise leave every later test in
  // landscape, where promotion rules differ.
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
      await element(actionItemLabel('I1')).tap();

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
    // Only slot 1 is promoted here: with all three requesting ifRoom the
    // number that fits is width-dependent, which `scenario.md` covers manually.
    it('promotes item-1 as a text action button when there is room', async () => {
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
    it('renders icon-only in portrait', async () => {
      await setSlotIcon(1, 'searchIcon');
      await setSlotShowAsAction(1, 'ifRoomWithText');
      await setSlotIcon(2, 'searchIcon');
      await setSlotShowAsAction(2, 'ifRoomWithText');
      await setSlotIcon(3, 'searchIcon');
      await setSlotShowAsAction(3, 'ifRoomWithText');

      await expectIconActionItem('I1');
      await expectIconActionItem('Item 2');
      await expectMenuItems(['Item Number Three']);
    });

    it('puts the title beside the icon in landscape', async () => {
      await setOrientation('landscape');

      await expectTextActionItem('I1');
      await expectTextActionItem('Item 2');
    });

    it('demotes item-1 back to the overflow menu once the props are reset', async () => {
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
