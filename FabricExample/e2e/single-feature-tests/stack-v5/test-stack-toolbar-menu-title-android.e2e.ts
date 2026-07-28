import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  scrollUntilVisible,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../../native-class-names';
// Type-only import: it is erased at compile time, so no screen code — and none
// of its React Native dependencies — is pulled into the Detox test bundle.
import type {
  CmdCondensedOption,
  CmdTitleOption,
  CmdTooltipOption,
  HeaderTitle,
  IconOption,
  IdOption,
  ItemTitle,
  ShowAsActionOption,
  TitleCondensedOption,
  TooltipOption,
} from '@apps/tests/single-feature-tests/stack-v5/test-stack-toolbar-menu-title-android';

// testIDs the screen assigns.
const SCROLL_VIEW = 'toolbar-menu-title-scrollview';
const SEND_COMMAND_BUTTON = 'send-command-button';

// Strings the screen — or Android itself — renders. The imported types tie
// these to the screen, so renaming a title there fails to compile here.
const HEADER_TITLE: HeaderTitle = 'Title / Condensed / Tooltip';
const ITEM_1_TITLE: ItemTitle = 'First Item';
const ITEM_2_TITLE: ItemTitle = 'Second Item Title';
const ITEM_3_TITLE: ItemTitle = 'Third Item Long Title';
const OVERFLOW_BUTTON = 'More options';

/** The props each menu item exposes as a picker, and the values it offers. */
interface ItemProps {
  icon: IconOption;
  showAsAction: ShowAsActionOption;
  titleCondensed: TitleCondensedOption;
  tooltipText: TooltipOption;
}

/** The props the "Send Command" section exposes, and the values it offers. */
interface CommandProps {
  targetId: IdOption;
  title: CmdTitleOption;
  titleCondensed: CmdCondensedOption;
  tooltipText: CmdTooltipOption;
}

/**
 * Every string a Toolbar button or an overflow row can display. `undefined` and
 * `no change` are picker sentinels for "unset" and "leave alone", so they are
 * never rendered and are excluded here.
 */
type MenuText = Exclude<
  ItemTitle | TitleCondensedOption | CmdTitleOption | TooltipOption,
  'undefined' | 'no change'
>;

/** Brings a control into view; the screen's settings list is scrollable. */
async function scrollToControl(id: string) {
  await element(by.id(SCROLL_VIEW)).scrollTo('top');
  await scrollUntilVisible(id, SCROLL_VIEW);
}

/**
 * Opens a picker, taps one of its options and closes it again. The picker is
 * left closed so that option rows never interfere with the `by.text` matchers
 * used to assert the Toolbar item labels.
 */
async function selectOption(pickerId: string, optionId: string) {
  await scrollToControl(pickerId);
  await element(by.id(pickerId)).tap();

  await scrollUntilVisible(optionId, SCROLL_VIEW);
  await element(by.id(optionId)).tap();

  await scrollToControl(pickerId);
  await element(by.id(pickerId)).tap();
}

/**
 * `SettingsPicker` derives the testID of its label and of every option row from
 * the `label` it is given, replacing spaces with dashes and lowercasing the
 * result. The screen labels its per-item pickers `Slot <n> <prop>` and its
 * command pickers `cmd <prop>`, so the two builders below are that same
 * derivation — renaming a label on the screen breaks the ids here.
 */
const pickerId = (label: string) => `${label}-picker`.toLowerCase();
const optionId = (label: string, value: string) =>
  `${label}-${value}`.toLowerCase();

/** The screen renders the three menu items as slots 1–3, in id order. */
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

/**
 * The label fragment each command picker uses. All but `targetId` are the prop
 * name itself; the screen spells that one "target id", which dashes to
 * `target-id`.
 */
const COMMAND_LABELS = {
  targetId: 'target-id',
  title: 'title',
  titleCondensed: 'titleCondensed',
  tooltipText: 'tooltipText',
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

/**
 * Opens the overflow menu, runs `assertions` against it and always dismisses it
 * afterwards — including when an assertion throws, so a failing test cannot
 * leak an open popup into the next one. Opening happens outside the `try` so
 * that a failure to open never triggers a dismissal that has nothing to close.
 *
 * `assertions` can only address views inside the popup: while it is open,
 * Espresso resolves matchers against the popup's window, so the Toolbar and the
 * settings list below are out of scope. Dismissal has to be a back press for
 * the same reason — there is no view outside the popup left to tap.
 */
async function withOverflowMenu(assertions: () => Promise<void>) {
  await openOverflowMenu();
  try {
    await assertions();
  } finally {
    await device.pressBack();
  }
}

/**
 * A row of the Toolbar's overflow menu popup, addressed by its title. Scoping
 * to the popup's list keeps the matcher from resolving a Toolbar action button
 * — or the settings controls below it — that happens to carry the same text.
 */
const overflowRow = (title: MenuText): Detox.NativeMatcher =>
  by
    .text(title)
    .withAncestor(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW));

/**
 * A Toolbar action button addressed by its content description, which is what
 * an icon-only button exposes (it falls back to the item's full `title`).
 */
const toolbarButtonByLabel = (label: MenuText): Detox.NativeMatcher =>
  by.label(label).and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW));

/**
 * A Toolbar action button addressed by the text it renders — `titleCondensed`
 * when set, the full `title` otherwise. A button only carries text when it has
 * no icon, or when there is room to show both.
 */
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
      // Once the text label shows, the button drops the content description it
      // fell back to while it was icon-only.
      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).not.toExist();
    });

    it('should hide the label again after rotating back to portrait', async () => {
      await device.setOrientation('portrait');

      await expect(element(toolbarButtonByLabel(ITEM_1_TITLE))).toBeVisible();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();
    });
  });

  describe('setting tooltipText does not affect overflow rows', () => {
    it('should render the overflow row with the full title', async () => {
      await selectItemProp('item-2', 'showAsAction', 'never');
      await selectItemProp('item-2', 'tooltipText', 'Tooltip text');

      await withOverflowMenu(async () => {
        await expect(element(overflowRow(ITEM_2_TITLE))).toBeVisible();
        await expect(element(overflowRow('Tooltip text'))).not.toExist();
      });
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
