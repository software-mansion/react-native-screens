import { device, expect, element, by } from 'detox';
import { NativeMatcher } from 'detox/detox';
import {
  describeIfAndroid,
  dismissToast,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
  CLASS_NAME_ANDROID_CHECK_BOX,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_RADIO_BUTTON,
} from '../../native-class-names';

// The cases follow `scenario.md` as one continuous flow: each starts from the
// state the previous one left.

const SCROLLVIEW_ID = 'toolbar-menu-groups-scrollview';
const OVERFLOW_MENU_LABEL = 'More options';

// A multi-toggle group renders check boxes and a single-selection one radio
// buttons, so the class asserts the group type.
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

/** Each toast is dismissed as it is asserted, so the next is always `1.`. */
async function expectToast(message: string) {
  await dismissToast(`1. ${message}`);
}

/**
 * Detox matches a regex against the *whole* string — without the trailing `.*`
 * this matches nothing and always passes.
 */
async function expectNoToast() {
  await expect(element(by.label(/\d+\. .*/))).not.toExist();
}

async function scrollToTop() {
  await element(by.id(SCROLLVIEW_ID)).scrollTo('top');
}

/** Small steps — a larger one can scroll a short picker item past the viewport. */
async function scrollToId(id: string) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(SCROLLVIEW_ID))
    .scroll(120, 'down');
}

async function tapById(id: string) {
  await scrollToId(id);
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

/** Confirms the new value — a missed tap would rebuild the wrong menu. */
async function toggleSwitch(
  { id, label }: (typeof SWITCHES)[keyof typeof SWITCHES],
  to: boolean,
) {
  await tapById(id);
  await expect(element(by.text(`${label}: ${to}`))).toBeVisible();
}

/** `SettingsPicker` stays expanded after a selection, so it is collapsed again. */
async function selectPickerValue(pickerId: string, itemId: string) {
  await scrollToTop();
  await tapById(pickerId);
  await tapById(itemId);
  await scrollToTop();
  await tapById(pickerId);
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

/** All four pickers keep their last value, so unset fields are reset explicitly. */
async function sendCommand({ id, checked, title, hidden }: CommandSpec) {
  await selectPickerValue('cmd-target-picker', `target-id-${id}`);
  await selectPickerValue(
    'cmd-checked-picker',
    `checked-${checked ?? 'no change'}`,
  );
  await selectPickerValue(
    'cmd-title-picker',
    `title-${(title ?? 'no change').toLowerCase()}`,
  );
  await selectPickerValue(
    'cmd-hidden-picker',
    `hidden-${hidden ?? 'no change'}`,
  );
  await tapById('send-command-button');
}

async function openOverflowMenu() {
  await element(by.label(OVERFLOW_MENU_LABEL)).tap();
}

async function closeMenu() {
  await device.pressBack();
}

async function tapMenuItem(title: string) {
  await element(by.text(title)).tap();
}

async function tapOverflowItem(title: string) {
  await openOverflowMenu();
  await tapMenuItem(title);
}

async function tapSubmenuItem(title: string) {
  await openOverflowMenu();
  await tapMenuItem('More');
  await tapMenuItem(title);
}

/** Closes the menu even on failure; a leaked popup would fail every later case. */
async function withOverflowMenu(assertions: () => Promise<void>) {
  await openOverflowMenu();
  try {
    await assertions();
  } finally {
    await closeMenu();
  }
}

async function withSubmenu(assertions: () => Promise<void>) {
  await openOverflowMenu();
  try {
    await tapMenuItem('More');
    await assertions();
  } finally {
    await closeMenu();
  }
}

describeIfAndroid('Stack Toolbar Menu Groups', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-groups-android',
    );
  });

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
    await expectToast('colors: ["red","green"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', true);
    });

    await tapOverflowItem('Red');
    await expectToast('colors: ["green"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', false);
      await expectCheckBox('Green', true);
    });

    await tapOverflowItem('Green');
    await expectToast('colors: []');
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', false);
      await expectCheckBox('Green', false);
      await expectCheckBox('Blue', false);
    });

    await tapOverflowItem('Blue');
    await expectToast('colors: ["blue"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Blue', true);
    });
  });

  it('should keep a single selection in a single-selection group', async () => {
    await tapOverflowItem('Small');
    await expectToast('size: ["small"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Small', true);
      await expectRadioButton('Medium', false);
    });

    await tapOverflowItem('Large');
    await expectToast('size: ["large"]');
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
    await expectToast('Pressed: share');

    await withOverflowMenu(async () => {
      await expectNoCheckmark('Share');
    });
  });

  it('should handle groups and action items inside a submenu', async () => {
    await tapSubmenuItem('Dark');
    await expectToast('theme: ["dark"]');
    await withSubmenu(async () => {
      await expectRadioButton('Dark', true);
      await expectRadioButton('Light', false);
    });

    await tapSubmenuItem('Light');
    await expectToast('theme: ["light"]');
    await withSubmenu(async () => {
      await expectRadioButton('Light', true);
      await expectRadioButton('Dark', false);
    });

    await tapSubmenuItem('Info');
    await expectToast('Pressed: info');
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
    await expectToast('colors: ["green"]');
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
    await expectToast('colors: ["red","green"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Green', true);
      await expectCheckBox('Red', true);
    });

    await sendCommand({ id: 'green', checked: 'false' });
    await expectToast('colors: ["red"]');
    await withOverflowMenu(async () => {
      await expectCheckBox('Green', false);
      await expectCheckBox('Red', true);
    });
  });

  it('should auto-uncheck the sibling when setting checked via command in a single-selection group', async () => {
    await sendCommand({ id: 'large', checked: 'true' });
    await expectToast('size: ["large"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Large', true);
      await expectRadioButton('Medium', false);
    });

    await sendCommand({ id: 'small', checked: 'true' });
    await expectToast('size: ["small"]');
    await withOverflowMenu(async () => {
      await expectRadioButton('Small', true);
      await expectRadioButton('Large', false);
    });
  });

  it('should ignore checked=false on a single-selection group item', async () => {
    // The step's precondition — the previous case leaves `small` selected.
    await sendCommand({ id: 'medium', checked: 'true' });
    await expectToast('size: ["medium"]');

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
    await expectToast('colors: ["red","green"]');

    await sendCommand({ id: 'green', hidden: 'true' });
    await withOverflowMenu(async () => {
      await expectMenuItemRow('Blue');
      await expect(element(by.text('Green'))).not.toExist();
    });

    // `green` is still reported as selected despite being hidden.
    await tapOverflowItem('Blue');
    await expectToast('colors: ["red","green","blue"]');

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
    await expectToast('theme: ["dark"]');
    await withSubmenu(async () => {
      await expectRadioButton('Dark', true);
      await expectRadioButton('Light', false);
    });

    await sendCommand({ id: 'light', checked: 'true' });
    await expectToast('theme: ["light"]');
    await withSubmenu(async () => {
      await expectRadioButton('Light', true);
      await expectRadioButton('Dark', false);
    });
  });
});
