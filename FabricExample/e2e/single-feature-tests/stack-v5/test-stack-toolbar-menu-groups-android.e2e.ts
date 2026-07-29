import { device, expect, element, by } from 'detox';
import { NativeMatcher } from 'detox/detox';
import {
  describeIfAndroid,
  dismissToast,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

/**
 * The cases below follow `scenario.md` as one continuous flow, exactly like a
 * manual run: each one starts from the state the previous one left behind, and
 * the menu is only rebuilt where the scenario itself flips a props switch.
 */

const SCROLLVIEW_ID = 'toolbar-menu-groups-scrollview';
const OVERFLOW_MENU_LABEL = 'More options';

/**
 * A row of an AppCompat popup menu. Each one holds a `title` text view plus the
 * lazily inserted widgets below, so it is the anchor for addressing an item's
 * decorations by its title.
 */
const LIST_MENU_ITEM_VIEW = 'androidx.appcompat.view.menu.ListMenuItemView';

/**
 * `setGroupCheckable(group, true, exclusive)` renders a multi-toggle group with
 * check boxes and a single-selection group with radio buttons, so the widget
 * class is itself an assertion about the group type. `by.type` matches
 * subclasses, which covers the `AppCompat*` variants actually inflated, and
 * only matches effectively visible views — an item that is not checkable never
 * inflates the widget, and a recycled row hides it.
 */
const CHECK_BOX = 'android.widget.CheckBox';
const RADIO_BUTTON = 'android.widget.RadioButton';
const IMAGE_VIEW = 'android.widget.ImageView';

type ToggleWidget = typeof CHECK_BOX | typeof RADIO_BUTTON;

function menuItemRow(title: string): NativeMatcher {
  return by.type(LIST_MENU_ITEM_VIEW).withDescendant(by.text(title));
}

function menuItemToggle(title: string, widget: ToggleWidget): NativeMatcher {
  return by.type(widget).withAncestor(menuItemRow(title));
}

/**
 * Anchors an assertion that is otherwise made only of `not.toExist` — without
 * it, a menu that failed to open satisfies every one of them.
 */
async function expectMenuItemRow(title: string) {
  await expect(element(menuItemRow(title))).toExist();
}

async function expectCheckBox(title: string, checked: boolean) {
  await expect(element(menuItemToggle(title, RADIO_BUTTON))).not.toExist();
  await expect(element(menuItemToggle(title, CHECK_BOX))).toHaveToggleValue(
    checked,
  );
}

async function expectRadioButton(title: string, checked: boolean) {
  await expect(element(menuItemToggle(title, CHECK_BOX))).not.toExist();
  await expect(element(menuItemToggle(title, RADIO_BUTTON))).toHaveToggleValue(
    checked,
  );
}

async function expectNoCheckmark(title: string) {
  await expectMenuItemRow(title);
  await expect(element(menuItemToggle(title, CHECK_BOX))).not.toExist();
  await expect(element(menuItemToggle(title, RADIO_BUTTON))).not.toExist();
}

/**
 * The `group_divider` of a row. Every row inflates one, so it is never removed —
 * only flipped between `VISIBLE` and `GONE`. `by.type` matches effectively
 * visible views only, which makes a `GONE` divider unmatchable, so `not.toExist`
 * here reads as "the divider is not visible".
 *
 * The divider is the only image view that can be visible in these rows — none
 * of the items carry an icon, and `submenuarrow` is hidden for everything but
 * `More`, which is therefore never passed here.
 */
async function expectGroupDivider(title: string, visible: boolean) {
  const divider = element(by.type(IMAGE_VIEW).withAncestor(menuItemRow(title)));
  if (visible) {
    await expect(divider).toBeVisible();
  } else {
    await expectMenuItemRow(title);
    await expect(divider).not.toExist();
  }
}

/**
 * `onSelectionChange` reports the full set of selected ids of a group and
 * toasts it, which is how the callback payload — as opposed to the rendered
 * checkmark — is verified.
 *
 * Each toast is dismissed as soon as it is asserted, so the queue is always
 * empty afterwards and the next one is always numbered `1.`.
 */
async function expectToast(message: string) {
  await dismissToast(`1. ${message}`);
}

/**
 * The scenario's "no toast is displayed" checks. Toasts are the only numbered
 * text on this screen, so nothing may match once the previous one was
 * dismissed. Matched the same way `dismissToast` matches them, so the assertion
 * is known to be capable of matching a toast rather than silently vacuous.
 *
 * Detox compares a regex against the *whole* string, hence the trailing `.*` —
 * shortening this to `/^\d+\. /` makes it match nothing and always pass.
 */
async function expectNoToast() {
  await expect(element(by.label(/\d+\. .*/))).not.toExist();
}

async function scrollToTop() {
  await element(by.id(SCROLLVIEW_ID)).scrollTo('top');
}

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

/**
 * `SettingsPicker` keeps its item list expanded after a selection, so it has to
 * be collapsed explicitly to keep the elements below it reachable.
 */
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

/**
 * Every picker is set on each call — the screen keeps the previously selected
 * values, so unspecified fields must be reset to `no change` explicitly.
 */
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

/**
 * The menu is closed even when an assertion throws. The cases share state, so
 * leaving a popup open turns one real failure into a cascade of unrelated ones
 * that point nowhere near the defect.
 */
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

  // Step 1.
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
    });
  });

  // Step 2.
  it('should render the submenu with its own group', async () => {
    await withSubmenu(async () => {
      await expectRadioButton('Light', true);
      await expectRadioButton('Dark', false);
      await expectNoCheckmark('Info');
    });
  });

  // Steps 3-6.
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

  // Steps 7-8.
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

  // Step 9.
  it('should not emit when re-selecting the checked single-selection item', async () => {
    await tapOverflowItem('Large');
    await expectNoToast();

    await withOverflowMenu(async () => {
      await expectRadioButton('Large', true);
    });
  });

  // Step 10.
  it('should emit a press for an action item without toggling it', async () => {
    await tapOverflowItem('Share');
    await expectToast('Pressed: share');

    await withOverflowMenu(async () => {
      await expectNoCheckmark('Share');
    });
  });

  // Steps 11-13.
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

  // Steps 14-15.
  it('should draw a divider on every group boundary only while enabled', async () => {
    await tapById('divider-switch');
    await withOverflowMenu(async () => {
      // A divider is drawn on the row that opens a new group, so `Red` never
      // gets one — nothing precedes it — and the rows that continue a group
      // keep theirs hidden.
      await expectGroupDivider('Red', false);
      await expectGroupDivider('Green', false);
      await expectGroupDivider('Blue', false);
      // colors -> size.
      await expectGroupDivider('Small', true);
      await expectGroupDivider('Medium', false);
      await expectGroupDivider('Large', false);
      // size -> the ungrouped items.
      await expectGroupDivider('Share', true);
    });

    await tapById('divider-switch');
    await withOverflowMenu(async () => {
      await expectGroupDivider('Small', false);
      await expectGroupDivider('Share', false);
    });
  });

  // Steps 16-18.
  it('should switch the colors group between multi-toggle and single-selection', async () => {
    await tapById('single-selection-switch');
    // The props update rebuilt the menu, so the check boxes became radio
    // buttons and `initialToggleState` is back in effect.
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

    await tapById('single-selection-switch');
    await withOverflowMenu(async () => {
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', false);
      await expectCheckBox('Blue', false);
    });
  });

  // Steps 19-20.
  it('should add and remove group items on a props update', async () => {
    await tapById('include-blue-switch');
    await withOverflowMenu(async () => {
      await expect(element(by.text('Blue'))).not.toExist();
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', false);
    });

    await tapById('include-blue-switch');
    await withOverflowMenu(async () => {
      // `blue` comes back unchecked — it has no initialToggleState.
      await expectCheckBox('Blue', false);
      await expectCheckBox('Red', true);
    });
  });

  // Steps 21-22.
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

  // Steps 23-24.
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

  // Step 25.
  it('should ignore checked=false on a single-selection group item', async () => {
    // The step's precondition — the previous one leaves `small` selected.
    await sendCommand({ id: 'medium', checked: 'true' });
    await expectToast('size: ["medium"]');

    await sendCommand({ id: 'medium', checked: 'false' });
    await expectNoToast();
    await withOverflowMenu(async () => {
      await expectRadioButton('Medium', true);
    });
  });

  // Step 26.
  it('should update the title of a grouped item without losing its state', async () => {
    await sendCommand({ id: 'red', title: 'Changed' });
    await withOverflowMenu(async () => {
      await expect(element(by.text('Red'))).not.toExist();
      await expectCheckBox('Changed', true);
    });
  });

  // Steps 27-28.
  it('should hide and show a grouped item', async () => {
    await sendCommand({ id: 'green', hidden: 'true' });
    await withOverflowMenu(async () => {
      await expect(element(by.text('Green'))).not.toExist();
      await expectCheckBox('Changed', true);
    });

    await sendCommand({ id: 'green', hidden: 'false' });
    await withOverflowMenu(async () => {
      await expectCheckBox('Green', false);
    });
  });

  // Steps 29-31.
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

  // Step 32.
  it('should discard command state on a props rebuild', async () => {
    await tapById('include-blue-switch');
    await tapById('include-blue-switch');

    await withOverflowMenu(async () => {
      await expect(element(by.text('Changed'))).not.toExist();
      await expectCheckBox('Red', true);
      await expectCheckBox('Green', false);
      await expectCheckBox('Blue', false);
      await expectRadioButton('Medium', true);
    });
  });

  // Steps 33-34.
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
