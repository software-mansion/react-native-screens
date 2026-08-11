import { device, expect, element, by } from 'detox';
import { NativeMatcher } from 'detox/detox';
import {
  describeIfAndroid,
  dismissNextToast,
  expectNoToast,
  rewindAndScrollUntilVisible,
  selectPickerOption,
  selectSingleFeatureTestsScreen,
  toggleSettingsSwitch,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
  CLASS_NAME_ANDROID_CHECK_BOX,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
  CLASS_NAME_ANDROID_RADIO_BUTTON,
} from '../../native-class-names';

// The cases follow `scenario.md` as one continuous flow: each starts from the
// state the previous one left.

const SCROLLVIEW_ID = 'toolbar-menu-groups-scrollview';
const OVERFLOW_MENU_LABEL = 'More options';

/** Detox's idle sync misses popup animations, so these waits are explicit. */
const MENU_ANIMATION_TIMEOUT_MS = 5000;

/** Probes a settled popup: by now the menu is either up or was never opened. */
const MENU_PRESENCE_TIMEOUT_MS = 250;

/**
 * One Back press per popup window. A submenu replaces its parent on phones and
 * stacks on it on tablets, so at most two are ever up.
 */
const MAX_MENU_DEPTH = 3;

/**
 * A multi-toggle group renders check boxes and a single-selection one radio
 * buttons, so the class asserts the group type.
 */
type ToggleWidget =
  | typeof CLASS_NAME_ANDROID_CHECK_BOX
  | typeof CLASS_NAME_ANDROID_RADIO_BUTTON;

function menuItemRow(title: string): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
    .withDescendant(by.text(title));
}

function menuItemToggle(title: string, widget: ToggleWidget): NativeMatcher {
  return by.type(widget).withAncestor(menuItemRow(title));
}

/** Anchors blocks made only of `not.toExist`, which a closed menu would satisfy. */
async function expectMenuItemRow(title: string) {
  await expect(element(menuItemRow(title))).toBeVisible();
}

async function expectCheckBox(title: string, checked: boolean) {
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_RADIO_BUTTON)),
  ).not.toExist();
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_CHECK_BOX)),
  ).toHaveToggleValue(checked);
}

async function expectRadioButton(title: string, checked: boolean) {
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_CHECK_BOX)),
  ).not.toExist();
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_RADIO_BUTTON)),
  ).toHaveToggleValue(checked);
}

async function expectNoCheckmark(title: string) {
  await expectMenuItemRow(title);
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_CHECK_BOX)),
  ).not.toExist();
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_RADIO_BUTTON)),
  ).not.toExist();
}

/**
 * `group_divider` and `submenuarrow` share this class and differ only by
 * resource id, which Detox cannot match — so a row is asserted to hold at most
 * one visible image view at a time.
 */
function menuItemImage(title: string): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
    .withAncestor(menuItemRow(title));
}

/** `by.type` matches visible views only, so `not.toExist` means "not visible". */
async function expectGroupDivider(title: string, visible: boolean) {
  const divider = element(menuItemImage(title));
  if (visible) {
    await expect(divider).toBeVisible();
  } else {
    await expectMenuItemRow(title);
    await expect(divider).not.toExist();
  }
}

/** `More` follows `Share` in the same group, so it never also shows a divider. */
async function expectSubmenuArrow(title: string) {
  await expect(element(menuItemImage(title))).toBeVisible();
}

/** Small steps — a larger one can scroll a short picker item past the viewport. */
const SCROLL_STEP_PX = 120;

const SETTINGS_CONTROL = {
  scrollViewId: SCROLLVIEW_ID,
  pixels: SCROLL_STEP_PX,
};

async function tapById(id: string) {
  await rewindAndScrollUntilVisible(id, SCROLLVIEW_ID, {
    pixels: SCROLL_STEP_PX,
  });
  await element(by.id(id)).tap();
}

const SWITCHES = {
  singleSelection: {
    id: 'single-selection-switch',
    label: 'singleSelection on colors',
  },
  includeBlue: { id: 'include-blue-switch', label: 'include Blue' },
  divider: { id: 'divider-switch', label: 'divider enabled' },
} as const;

async function toggleSwitch(
  { id, label }: (typeof SWITCHES)[keyof typeof SWITCHES],
  to: boolean,
) {
  await toggleSettingsSwitch({ switchId: id, label, to }, SETTINGS_CONTROL);
}

/** The ids the screen's `target id` picker exposes. */
type MenuElementId =
  | 'red'
  | 'green'
  | 'blue'
  | 'small'
  | 'medium'
  | 'large'
  | 'share'
  | 'light'
  | 'dark'
  | 'info';

type CommandSpec = {
  id: MenuElementId;
  checked?: 'true' | 'false';
  title?: 'Changed' | 'undefined';
  hidden?: 'true' | 'false' | 'undefined';
};

/** Keyed by the `label` the option `testID`s are derived from. */
const COMMAND_PICKERS = {
  target: { pickerId: 'cmd-target-picker', label: 'target id' },
  checked: { pickerId: 'cmd-checked-picker', label: 'checked' },
  title: { pickerId: 'cmd-title-picker', label: 'title' },
  hidden: { pickerId: 'cmd-hidden-picker', label: 'hidden' },
} as const;

async function selectCommandOption(
  picker: (typeof COMMAND_PICKERS)[keyof typeof COMMAND_PICKERS],
  option: string,
) {
  await selectPickerOption({ ...picker, option }, SETTINGS_CONTROL);
}

/** All four pickers keep their last value, so unset fields are reset explicitly. */
async function sendCommand({ id, checked, title, hidden }: CommandSpec) {
  await selectCommandOption(COMMAND_PICKERS.target, id);
  await selectCommandOption(COMMAND_PICKERS.checked, checked ?? 'no change');
  await selectCommandOption(COMMAND_PICKERS.title, title ?? 'no change');
  await selectCommandOption(COMMAND_PICKERS.hidden, hidden ?? 'no change');
  await tapById('send-command-button');
}

const overflowMenu = () =>
  element(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW));

/** Nothing behind a focused popup is in the hierarchy Detox searches. */
async function waitForScreen() {
  await waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

/** Resolves instead of throwing, so it can be used as a condition. */
async function isMenuOpen(): Promise<boolean> {
  return waitFor(overflowMenu())
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT_MS)
    .then(
      () => true,
      () => false,
    );
}

/** Waits here, so a menu that never opened fails before any `try` below. */
async function openOverflowMenu() {
  await element(by.label(OVERFLOW_MENU_LABEL)).tap();
  await waitFor(overflowMenu())
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

/**
 * Back only ever goes to an open popup: with no menu up the activity takes it
 * and pops the test screen, failing every later case in this stateful suite.
 */
async function closeMenuIfOpen() {
  let pressCount = 0;

  while (await isMenuOpen()) {
    if (pressCount === MAX_MENU_DEPTH) {
      throw new Error(
        `The overflow menu was still open after ${MAX_MENU_DEPTH} Back presses.`,
      );
    }
    await device.pressBack();
    pressCount++;
  }

  if (pressCount > 0) {
    await waitForScreen();
  }
}

async function tapMenuItem(title: string) {
  await element(by.text(title)).tap();
}

/** The only submenu row no case hides or renames. */
const SUBMENU_ANCHOR_TITLE = 'Info';

async function openSubmenu() {
  await tapMenuItem('More');
  await waitFor(element(menuItemRow(SUBMENU_ANCHOR_TITLE)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

/** A leaf tap dismisses the menu; the toast it emits is on the screen behind. */
async function tapLeafItem(title: string) {
  await tapMenuItem(title);
  await waitForScreen();
}

async function tapOverflowItem(title: string) {
  await openOverflowMenu();
  await tapLeafItem(title);
}

async function tapSubmenuItem(title: string) {
  await openOverflowMenu();
  await openSubmenu();
  await tapLeafItem(title);
}

/** Closes the menu even on failure; a leaked popup would fail every later case. */
async function closingMenuAfter(assertions: () => Promise<void>) {
  let assertionFailed = false;

  try {
    await assertions();
  } catch (error) {
    assertionFailed = true;
    throw error;
  } finally {
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

async function withOverflowMenu(assertions: () => Promise<void>) {
  await openOverflowMenu();
  await closingMenuAfter(assertions);
}

/**
 * Opening the submenu is inside the cleanup scope: it is a tap that can fail
 * with the parent menu already up, and that popup still has to come down.
 */
async function withSubmenu(assertions: () => Promise<void>) {
  await openOverflowMenu();
  await closingMenuAfter(async () => {
    await openSubmenu();
    await assertions();
  });
}

describeIfAndroid('Stack Toolbar Menu Groups', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-groups-android',
    );
  });

  // Covers the taps made outside a `with*` block: a case that fails mid-menu
  // must not leave the popup up and take every following one down with it.
  afterEach(closeMenuIfOpen);

  it('should render the whole menu with both groups', async () => {
    await expect(element(by.text('Toolbar Menu Groups Test'))).toBeVisible();

    await withOverflowMenu(async () => {
      for (const title of [
        'Red',
        'Green',
        'Blue',
        'Small',
        'Medium',
        'Large',
        'Share',
        'More',
      ]) {
        await expect(element(by.text(title))).toBeVisible();
      }

      await expectCheckBox('Red', true);
      await expectCheckBox('Green', false);
      await expectCheckBox('Blue', false);

      await expectRadioButton('Small', false);
      await expectRadioButton('Medium', true);
      await expectRadioButton('Large', false);

      await expectNoCheckmark('Share');
      await expectNoCheckmark('More');
      await expectSubmenuArrow('More');
    });
  });

  it('should render the submenu with its own group', async () => {
    await withSubmenu(async () => {
      await expectRadioButton('Light', true);
      await expectRadioButton('Dark', false);
      await expectNoCheckmark('Info');
    });
  });

  it('should toggle items independently in a multi-toggle group', async () => {
    await tapOverflowItem('Green');
    await dismissNextToast('colors: ["red","green"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', true);
    });

    await tapOverflowItem('Red');
    await dismissNextToast('colors: ["green"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', false);
      await expectCheckBox('Green', true);
    });

    await tapOverflowItem('Green');
    await dismissNextToast('colors: []');
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', false);
      await expectCheckBox('Green', false);
      await expectCheckBox('Blue', false);
    });

    await tapOverflowItem('Blue');
    await dismissNextToast('colors: ["blue"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Blue', true);
    });
  });

  it('should keep a single selection in a single-selection group', async () => {
    await tapOverflowItem('Small');
    await dismissNextToast('size: ["small"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Small', true);
      await expectRadioButton('Medium', false);
    });

    await tapOverflowItem('Large');
    await dismissNextToast('size: ["large"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Large', true);
      await expectRadioButton('Small', false);
    });
  });

  it('should not emit when re-selecting the checked single-selection item', async () => {
    await tapOverflowItem('Large');
    await expectNoToast();

    await withOverflowMenu(async () => {
      await expectRadioButton('Large', true);
    });
  });

  it('should emit a press for an action item without toggling it', async () => {
    await tapOverflowItem('Share');
    await dismissNextToast('Pressed: share');

    await withOverflowMenu(async () => {
      await expectNoCheckmark('Share');
    });
  });

  it('should handle groups and action items inside a submenu', async () => {
    await tapSubmenuItem('Dark');
    await dismissNextToast('theme: ["dark"]');
    await withSubmenu(async () => {
      await expectRadioButton('Dark', true);
      await expectRadioButton('Light', false);
    });

    await tapSubmenuItem('Light');
    await dismissNextToast('theme: ["light"]');
    await withSubmenu(async () => {
      await expectRadioButton('Light', true);
      await expectRadioButton('Dark', false);
    });

    await tapSubmenuItem('Info');
    await dismissNextToast('Pressed: info');
    await withSubmenu(async () => {
      await expectNoCheckmark('Info');
    });
  });

  it('should draw a divider on every group boundary only while enabled', async () => {
    await toggleSwitch(SWITCHES.divider, true);
    await withOverflowMenu(async () => {
      await expectGroupDivider('Red', false);
      await expectGroupDivider('Green', false);
      await expectGroupDivider('Blue', false);

      await expectGroupDivider('Small', true);
      await expectGroupDivider('Medium', false);
      await expectGroupDivider('Large', false);

      await expectGroupDivider('Share', true);
    });

    await toggleSwitch(SWITCHES.divider, false);
    await withOverflowMenu(async () => {
      await expectGroupDivider('Small', false);
      await expectGroupDivider('Share', false);
    });
  });

  it('should switch the colors group between multi-toggle and single-selection', async () => {
    await toggleSwitch(SWITCHES.singleSelection, true);
    // Rebuilt: check boxes became radio buttons, `initialToggleState` restored.
    await withOverflowMenu(async () => {
      await expectRadioButton('Red', true);
      await expectRadioButton('Green', false);
      await expectRadioButton('Blue', false);
    });

    await tapOverflowItem('Green');
    await dismissNextToast('colors: ["green"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Green', true);
      await expectRadioButton('Red', false);
    });

    await toggleSwitch(SWITCHES.singleSelection, false);
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', false);
      await expectCheckBox('Blue', false);
    });
  });

  it('should add and remove group items on a props update', async () => {
    await toggleSwitch(SWITCHES.includeBlue, false);
    await withOverflowMenu(async () => {
      await expect(element(by.text('Blue'))).not.toExist();
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', false);
    });

    await toggleSwitch(SWITCHES.includeBlue, true);
    await withOverflowMenu(async () => {
      // `blue` comes back unchecked — it has no initialToggleState.
      await expectCheckBox('Blue', false);
      await expectCheckBox('Red', true);
    });
  });

  it('should set checked via command in a multi-toggle group', async () => {
    await sendCommand({ id: 'green', checked: 'true' });
    await dismissNextToast('colors: ["red","green"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Green', true);
      await expectCheckBox('Red', true);
    });

    await sendCommand({ id: 'green', checked: 'false' });
    await dismissNextToast('colors: ["red"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Green', false);
      await expectCheckBox('Red', true);
    });
  });

  it('should auto-uncheck the sibling when setting checked via command in a single-selection group', async () => {
    await sendCommand({ id: 'large', checked: 'true' });
    await dismissNextToast('size: ["large"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Large', true);
      await expectRadioButton('Medium', false);
    });

    await sendCommand({ id: 'small', checked: 'true' });
    await dismissNextToast('size: ["small"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Small', true);
      await expectRadioButton('Large', false);
    });
  });

  it('should ignore checked=false on a single-selection group item', async () => {
    // The step's precondition — the previous case leaves `small` selected.
    await sendCommand({ id: 'medium', checked: 'true' });
    await dismissNextToast('size: ["medium"]');

    await sendCommand({ id: 'medium', checked: 'false' });
    await expectNoToast();
    await withOverflowMenu(async () => {
      await expectRadioButton('Medium', true);
    });
  });

  it('should update the title of a grouped item without losing its state', async () => {
    await sendCommand({ id: 'red', title: 'Changed' });
    await withOverflowMenu(async () => {
      await expect(element(by.text('Red'))).not.toExist();
      await expectCheckBox('Changed', true);
    });
  });

  it('should hide and show a grouped item', async () => {
    await sendCommand({ id: 'green', hidden: 'true' });
    await withOverflowMenu(async () => {
      await expect(element(by.text('Green'))).not.toExist();
      await expectCheckBox('Changed', true);
    });

    await sendCommand({ id: 'green', hidden: 'false' });
    await withOverflowMenu(async () => {
      await expect(element(by.text('Green'))).toBeVisible();
      await expectCheckBox('Green', false);
    });
  });

  it('should keep a hidden item selected in the reported selection', async () => {
    await sendCommand({ id: 'green', checked: 'true' });
    await dismissNextToast('colors: ["red","green"]');

    await sendCommand({ id: 'green', hidden: 'true' });
    await withOverflowMenu(async () => {
      await expectMenuItemRow('Blue');
      await expect(element(by.text('Green'))).not.toExist();
    });

    // `green` is still reported as selected despite being hidden.
    await tapOverflowItem('Blue');
    await dismissNextToast('colors: ["red","green","blue"]');

    await sendCommand({ id: 'green', hidden: 'false' });
    await withOverflowMenu(async () => {
      await expectCheckBox('Green', true);
    });
  });

  it('should discard command state on a props rebuild', async () => {
    await toggleSwitch(SWITCHES.includeBlue, false);
    await toggleSwitch(SWITCHES.includeBlue, true);

    await withOverflowMenu(async () => {
      await expect(element(by.text('Changed'))).not.toExist();
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', false);
      await expectCheckBox('Blue', false);
      await expectRadioButton('Medium', true);
    });
  });

  it('should set checked via command in a submenu group', async () => {
    await sendCommand({ id: 'dark', checked: 'true' });
    await dismissNextToast('theme: ["dark"]');
    await withSubmenu(async () => {
      await expectRadioButton('Dark', true);
      await expectRadioButton('Light', false);
    });

    await sendCommand({ id: 'light', checked: 'true' });
    await dismissNextToast('theme: ["light"]');
    await withSubmenu(async () => {
      await expectRadioButton('Light', true);
      await expectRadioButton('Dark', false);
    });
  });
});
