import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  rewindAndScrollUntilVisible,
} from '../../e2e-utils';
import { selectSingleFeatureTestsScreen } from '../../elements/test-screen-navigation';
import { selectPickerOption } from '../../elements/settings-controls';
import {
  closeOverflowMenu,
  OVERFLOW_MENU_LABEL,
  textInMenu,
  withOverflowMenu,
} from '../../elements/toolbar-menu-android';
import { CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW } from '../../native-class-names';
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

const HEADER_TITLE: HeaderTitle = 'Title / Condensed / Tooltip';
const ITEM_1_TITLE: ItemTitle = 'First Item';
const ITEM_2_TITLE: ItemTitle = 'Second Item Title';
const ITEM_3_TITLE: ItemTitle = 'Third Item Long Title';

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

/** Every control lives on the one scrollable settings screen. */
const SETTINGS_CONTROL = { scrollViewId: SCROLL_VIEW };

const SLOT_NUMBER = {
  'item-1': 1,
  'item-2': 2,
  'item-3': 3,
} as const satisfies Record<IdOption, number>;

/**
 * A slot's picker is labelled `Slot <n> <prop>` and carries the same string,
 * lowercased, as its `testID` — so the prop name alone gives both.
 */
async function selectItemProp<Prop extends keyof ItemProps>(
  id: IdOption,
  prop: Prop,
  value: ItemProps[Prop],
) {
  const slot = SLOT_NUMBER[id];
  await selectPickerOption(
    {
      pickerId: `slot-${slot}-${prop.toLowerCase()}-picker`,
      label: `Slot ${slot} ${prop}`,
      option: value,
    },
    SETTINGS_CONTROL,
  );
}

/**
 * The command pickers name themselves less regularly, so both halves are
 * spelled out. `label` must match the screen's prop exactly — the option
 * `testID`s are derived from it.
 */
const COMMAND_PICKERS = {
  targetId: { pickerId: 'cmd-target-id-picker', label: 'cmd target id' },
  title: { pickerId: 'cmd-title-picker', label: 'cmd title' },
  titleCondensed: {
    pickerId: 'cmd-titlecondensed-picker',
    label: 'cmd titleCondensed',
  },
} as const satisfies Record<
  keyof CommandProps,
  { pickerId: string; label: string }
>;

async function selectCommandProp<Prop extends keyof CommandProps>(
  prop: Prop,
  value: CommandProps[Prop],
) {
  await selectPickerOption(
    { ...COMMAND_PICKERS[prop], option: value },
    SETTINGS_CONTROL,
  );
}

async function sendCommand() {
  await rewindAndScrollUntilVisible(SEND_COMMAND_BUTTON, SCROLL_VIEW);
  await element(by.id(SEND_COMMAND_BUTTON)).tap();
}

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
  afterEach(() => closeOverflowMenu(SCROLL_VIEW));

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
      await expect(element(by.label(OVERFLOW_MENU_LABEL))).toBeVisible();
      await expect(element(toolbarButtonByText('Cond'))).not.toExist();
    });

    it('should show the full title, not titleCondensed, in the overflow menu', async () => {
      await withOverflowMenu(SCROLL_VIEW, async () => {
        await expect(element(textInMenu(ITEM_3_TITLE))).toBeVisible();
        await expect(element(textInMenu('Short'))).not.toExist();
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

      await withOverflowMenu(SCROLL_VIEW, async () => {
        await expect(element(textInMenu(ITEM_1_TITLE))).toBeVisible();
        await expect(element(textInMenu('Cond'))).not.toExist();
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
