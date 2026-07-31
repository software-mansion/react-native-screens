import { device, expect, element, by, waitFor } from 'detox';
import {
  describeIfAndroid,
  scrollUntilVisible,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../../native-class-names';
import type {
  CmdCondensedOption,
  CmdTitleOption,
  HeaderTitle,
  IconOption,
  IdOption,
  ItemTitle,
  ShowAsActionOption,
  TitleCondensedOption,
} from '@apps/tests/single-feature-tests/stack-v5/test-stack-toolbar-menu-title-android';

const SCROLL_VIEW = 'toolbar-menu-title-scrollview';
const SEND_COMMAND_BUTTON = 'send-command-button';

// Detox's idle sync does not cover popup window animations, so every wait that
// straddles the overflow menu opening or dismissing has to be explicit.
const MENU_ANIMATION_TIMEOUT_MS = 5000;

// Probes an already-settled popup rather than an animation — by the time it is
// used the menu is either up or was never opened.
const MENU_PRESENCE_TIMEOUT_MS = 250;

const HEADER_TITLE: HeaderTitle = 'Title / Condensed / Tooltip';
const ITEM_1_TITLE: ItemTitle = 'First Item';
const ITEM_2_TITLE: ItemTitle = 'Second Item Title';
const ITEM_3_TITLE: ItemTitle = 'Third Item Long Title';
const OVERFLOW_BUTTON = 'More options';

// Only the props the test drives are listed; the screen's tooltip pickers are
// exercised manually (see `scenario.md`), so they have no entry here.
interface ItemProps {
  icon: IconOption;
  showAsAction: ShowAsActionOption;
  titleCondensed: TitleCondensedOption;
}

interface CommandProps {
  targetId: IdOption;
  title: CmdTitleOption;
  titleCondensed: CmdCondensedOption;
}

/** Every string a Toolbar button or overflow row can display. */
type MenuText = Exclude<
  ItemTitle | TitleCondensedOption | CmdTitleOption,
  'undefined' | 'no change'
>;

// Rewinds to the top first, so a target above the current offset is still
// reachable — `scrollUntilVisible` only scrolls one way.
async function scrollToControl(id: string) {
  await element(by.id(SCROLL_VIEW)).scrollTo('top');
  await scrollUntilVisible(id, SCROLL_VIEW);
}

/** Opens a picker, taps an option and closes the picker again. */
async function selectOption(pickerId: string, optionId: string) {
  await scrollToControl(pickerId);
  await element(by.id(pickerId)).tap();

  // The rows open directly below the picker, so the lower ones can start off
  // screen.
  await scrollUntilVisible(optionId, SCROLL_VIEW);
  await element(by.id(optionId)).tap();

  await scrollToControl(pickerId);
  await element(by.id(pickerId)).tap();
}

// `SettingsPicker` derives its testIDs from the label it is given, replacing
// spaces with dashes and lowercasing; renaming a label on the screen breaks the
// ids built below.
const pickerId = (label: string) => `${label}-picker`.toLowerCase();
const optionId = (label: string, value: string) =>
  `${label}-${value}`.toLowerCase();

const SLOT_NUMBER = {
  'item-1': 1,
  'item-2': 2,
  'item-3': 3,
} as const satisfies Record<IdOption, number>;

async function selectItemProp<Prop extends keyof ItemProps>(
  id: IdOption,
  prop: Prop,
  value: ItemProps[Prop],
) {
  const label = `slot-${SLOT_NUMBER[id]}-${prop}`;
  await selectOption(pickerId(label), optionId(label, value));
}

const COMMAND_LABELS = {
  targetId: 'target-id',
  title: 'title',
  titleCondensed: 'titleCondensed',
} as const satisfies Record<keyof CommandProps, string>;

async function selectCommandProp<Prop extends keyof CommandProps>(
  prop: Prop,
  value: CommandProps[Prop],
) {
  const label = `cmd-${COMMAND_LABELS[prop]}`;
  await selectOption(pickerId(label), optionId(label, value));
}

async function sendCommand() {
  await scrollToControl(SEND_COMMAND_BUTTON);
  await element(by.id(SEND_COMMAND_BUTTON)).tap();
}

const openOverflowMenu = () => element(by.label(OVERFLOW_BUTTON)).tap();

const overflowMenu = () =>
  element(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW));

// Detox resolves matchers against a single window: while the popup holds focus
// nothing behind it is in the searched hierarchy, so the popup going away is
// not enough — the screen itself has to become addressable again.
async function waitForScreen() {
  await waitFor(element(by.id(SCROLL_VIEW)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

/**
 * Presses Back only when the popup is actually up: a menu that never opened
 * would otherwise take the Back press itself and pop the test screen. A
 * left-over popup is not a local failure either — every later matcher would
 * resolve against the popup window instead of the activity, so the whole rest
 * of the suite fails on views that are plainly there.
 */
async function closeOverflowMenuIfOpen() {
  const isOpen = await waitFor(overflowMenu())
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT_MS)
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

/**
 * While the menu is open, Espresso resolves matchers against its window, so
 * `assertions` can only address rows inside it.
 */
async function withOverflowMenu(assertions: () => Promise<void>) {
  await openOverflowMenu();

  let assertionFailed = false;

  try {
    await assertions();
  } catch (error) {
    assertionFailed = true;
    throw error;
  } finally {
    try {
      await closeOverflowMenuIfOpen();
    } catch (cleanupError) {
      // A throw from `finally` would replace the error that actually failed.
      if (!assertionFailed) {
        throw cleanupError;
      }
    }
  }
}

const overflowRow = (title: MenuText): Detox.NativeMatcher =>
  by
    .text(title)
    .withAncestor(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW));

// An action button exposes its full title as content description while it is
// icon-only, and renders text — `titleCondensed` when set — instead once there
// is room for a label. It never has both.
const toolbarButtonByLabel = (label: MenuText): Detox.NativeMatcher =>
  by.label(label).and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW));

const toolbarButtonByText = (text: MenuText): Detox.NativeMatcher =>
  by.text(text).and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW));

describeIfAndroid('Stack Toolbar Menu Title (Android)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-title-android',
    );
  });

  // Safety net: a test that fails mid-menu must not leave the popup up and
  // take every following test down with it.
  afterEach(closeOverflowMenuIfOpen);

  afterAll(async () => {
    await device.setOrientation('portrait');
  });

  describe('baseline', () => {
    it('should render both action items as icon-only buttons in portrait', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();

      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).toBeVisible();
      await expect(element(toolbarButtonByText(ITEM_1_TITLE))).not.toExist();
      await expect(element(toolbarButtonByLabel(ITEM_2_TITLE))).toBeVisible();
      await expect(element(toolbarButtonByText(ITEM_2_TITLE))).not.toExist();
      await expect(element(by.label(OVERFLOW_BUTTON))).toBeVisible();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();
    });

    it('should show the full title, not titleCondensed, in the overflow menu', async () => {
      await withOverflowMenu(async () => {
        await expect(element(overflowRow(ITEM_3_TITLE))).toBeVisible();
        await expect(element(overflowRow('Short'))).not.toExist();
      });
    });
  });

  describe('titleCondensed on a Toolbar button without an icon', () => {
    it('should label the text button with titleCondensed', async () => {
      await selectItemProp('item-1', 'icon', 'undefined');

      await expect(element(toolbarButtonByText('Cond'))).toBeVisible();
      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).not.toExist();
    });

    it('should fall back to the full title when titleCondensed is unset', async () => {
      await selectItemProp('item-1', 'titleCondensed', 'undefined');

      await expect(element(toolbarButtonByText(ITEM_1_TITLE))).toBeVisible();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();
    });

    it('should use the full title in the overflow menu, not titleCondensed', async () => {
      await selectItemProp('item-1', 'titleCondensed', 'Cond');
      await selectItemProp('item-1', 'showAsAction', 'never');
      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).not.toExist();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();

      await withOverflowMenu(async () => {
        await expect(element(overflowRow(ITEM_1_TITLE))).toBeVisible();
        await expect(element(overflowRow('Cond'))).not.toExist();
      });
    });
  });

  describe('titleCondensed next to an icon depends on the available room', () => {
    it('should hide the label next to the icon in portrait', async () => {
      await selectItemProp('item-1', 'icon', 'searchIcon');
      await selectItemProp('item-1', 'showAsAction', 'alwaysWithText');
      await selectItemProp('item-1', 'titleCondensed', 'Cond');

      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).toBeVisible();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();
    });

    it('should show the label next to the icon in landscape', async () => {
      await device.setOrientation('landscape');

      await expect(element(toolbarButtonByText('Cond'))).toBeVisible();
      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).not.toExist();
    });

    it('should hide the label again after rotating back to portrait', async () => {
      await device.setOrientation('portrait');

      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).toBeVisible();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();
    });
  });

  describe('updateToolbarMenuElements command', () => {
    beforeAll(async () => {
      await selectItemProp('item-1', 'icon', 'undefined');
      await selectItemProp('item-1', 'showAsAction', 'alwaysWithText');
      await selectItemProp('item-1', 'titleCondensed', 'Cond');
    });

    it('should update titleCondensed of the Toolbar button', async () => {
      await expect(element(toolbarButtonByText('Cond'))).toBeVisible();

      await selectCommandProp('targetId', 'item-1');
      await selectCommandProp('titleCondensed', 'Short');
      await sendCommand();

      await expect(element(toolbarButtonByText('Short'))).toBeVisible();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();
    });

    it('should fall back to the full title when titleCondensed is reset', async () => {
      await selectCommandProp('titleCondensed', 'undefined');
      await sendCommand();

      await expect(element(toolbarButtonByText(ITEM_1_TITLE))).toBeVisible();
      await expect(element(toolbarButtonByText('Short'))).not.toExist();
    });

    it('should update the title used by the button when no titleCondensed is set', async () => {
      await selectCommandProp('titleCondensed', 'no change');
      await selectCommandProp('title', 'Cmd Title');
      await sendCommand();

      await expect(element(toolbarButtonByText('Cmd Title'))).toBeVisible();
      await expect(element(toolbarButtonByText(ITEM_1_TITLE))).not.toExist();
    });
  });
});
