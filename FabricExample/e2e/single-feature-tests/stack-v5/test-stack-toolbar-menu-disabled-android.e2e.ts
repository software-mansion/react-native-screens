// Detox cannot read a tint, so every "greyed out" expectation is asserted
// through the native `enabled` attribute — AppCompat mirrors
// `MenuItem.isEnabled()` onto the item view — plus **Last Event** staying put.
import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { AndroidElementAttributes, NativeMatcher } from 'detox/detox';
import {
  describeIfAndroid,
  getMatches,
  rewindAndScrollUntilVisible,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_CHECK_BOX,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../../native-class-names';
// Typed from the screen, so a rename there fails type-checking here.
import type {
  AllIds as ElementId,
  CmdDisabledOption as CmdDisabled,
  ElementTitles,
  HeaderTitle,
  ItemLabels,
  NoEvent,
} from '@apps/tests/single-feature-tests/stack-v5/test-stack-toolbar-menu-disabled-android';

const SCROLLVIEW_ID = 'toolbar-menu-disabled-scrollview';
const HEADER_TITLE: HeaderTitle = 'Toolbar Menu Disabled Test';

// Detox's idle sync does not cover popup animations, so waits that straddle a
// menu opening or dismissing must be explicit. An upper bound — only
// `isScreenAddressable`, which is expected to time out, pays it in full.
const MENU_ANIMATION_TIMEOUT_MS = 5000;

// Probes a settled popup, not an animation: it is either up or never opened.
const MENU_PRESENCE_TIMEOUT_MS = 250;

// Rendered as `${label}: ${value}`. `ItemLabels` checks keys and exact strings.
const SWITCH_LABELS: ItemLabels = {
  'action-bar': 'action-bar (toolbar button)',
  'action-overflow': 'action-overflow',
  'opt-a': 'opt-a (checkable, checked)',
  'opt-b': 'opt-b (checkable)',
  submenu: 'submenu',
  'sub-item': 'sub-item',
};

// Popup rows only — `action-bar` is pinned to the toolbar (`showAsAction: 'always'`).
type RowTitle = ElementTitles[Exclude<ElementId, 'action-bar'>];

const NO_EVENT: NoEvent = '—';

// Unambiguous: the overflow button is a different class.
const actionBarButton = by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW);

// The row, not its title `TextView`: `View.setEnabled` does not propagate to
// children, so only the row reflects a disabled element.
function menuRow(title: RowTitle): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
    .withDescendant(by.text(title));
}

// Zero matches already throws inside `getMatches`, so only ambiguity is left.
async function attributesOf(
  matcher: NativeMatcher,
): Promise<AndroidElementAttributes> {
  const matches = await getMatches(matcher);
  if (matches.length > 1) {
    throw new Error(
      `Matcher resolved to ${matches.length} elements, expected exactly one. ` +
        'Narrow the matcher, or the view hierarchy changed.',
    );
  }
  return matches[0] as AndroidElementAttributes;
}

// Targets sit either side of the current offset, hence the rewind; the small
// step keeps short switch rows from being scrolled past.
async function scrollIntoView(id: string) {
  await rewindAndScrollUntilVisible(id, SCROLLVIEW_ID, { pixels: 300 });
}

// Detox searches one window: while a popup holds focus nothing behind it is in
// the hierarchy, so the screen itself has to become addressable again.
async function waitForScreen() {
  await waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

// `waitForScreen` reported rather than thrown — stacked popups keep it false.
async function isScreenAddressable(): Promise<boolean> {
  return waitForScreen().then(
    () => true,
    () => false,
  );
}

// Waits for the popup, not a row: bodies that tap first would race the animation.
async function openMenu() {
  await element(by.label('More options')).tap();
  await waitFor(element(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

async function waitForMenuRow(title: RowTitle) {
  await waitFor(element(menuRow(title)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

// Only where it is expected to open; a disabled **More** has nothing to wait for.
async function openSubmenu() {
  await waitForMenuRow('More');
  await element(menuRow('More')).tap();
  await waitForMenuRow('Sub Item');
}

// A submenu would take focus and put its rows in the searched window, so the
// parent's rows staying addressable proves none opened. `expectRowEnabled` runs
// first on purpose — it forces a round trip, without which `not.toExist()`
// would pass before a submenu that did open is up.
async function expectSubmenuStayedClosed() {
  await expectRowEnabled('More', false);
  await expect(element(menuRow('Sub Item'))).not.toExist();
}

async function isMenuOpen(): Promise<boolean> {
  return waitFor(element(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)))
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT_MS)
    .then(
      () => true,
      () => false,
    );
}

// A submenu opens on top of the overflow menu, so at most two popups stack.
const MAX_STACKED_MENUS = 2;

// Presses Back only while a popup is up, or the press pops the test screen.
// Submenus stack, hence the loop.
async function closeMenus() {
  for (let attempt = 0; attempt < MAX_STACKED_MENUS; attempt++) {
    if (!(await isMenuOpen())) {
      break;
    }
    await device.pressBack();

    // A dismissed popup lingers while animating out, so re-probing would read it
    // as a second stacked menu. Waiting for the screen settles that instead.
    if (await isScreenAddressable()) {
      return;
    }
  }
  await waitForScreen();
}

// Runs `body` with the menu open, closing it afterwards even when an assertion
// throws — a popup left covering the screen would fail every later step.
async function withMenu(body: () => Promise<void>) {
  await openMenu();

  try {
    await body();
  } catch (error) {
    // Swallowed only here, so a failing cleanup cannot replace the assertion
    // that failed. Logged, because it leaves the popup up and the *next* test
    // then fails with no trace in its own output.
    await closeMenus().catch(cleanupError => {
      console.warn(
        'closeMenus failed while cleaning up after a failed assertion:',
        cleanupError,
      );
    });
    throw error;
  }

  await closeMenus();
}

async function expectRowEnabled(title: RowTitle, enabled: boolean) {
  await waitForMenuRow(title);
  jestExpect((await attributesOf(menuRow(title))).enabled).toBe(enabled);
}

// The checkbox AppCompat inflates carries the toggle state in `value`.
async function expectRowChecked(title: RowTitle, checked: boolean) {
  await waitForMenuRow(title);
  const attributes = await attributesOf(
    by.type(CLASS_NAME_ANDROID_CHECK_BOX).withAncestor(menuRow(title)),
  );
  jestExpect(attributes.value).toBe(checked);
}

async function expectActionBarEnabled(enabled: boolean) {
  jestExpect((await attributesOf(actionBarButton)).enabled).toBe(enabled);
}

async function readLastEvent(): Promise<string> {
  await scrollIntoView('last-event-text');
  return (await attributesOf(by.id('last-event-text'))).text ?? '';
}

async function expectLastEvent(expected: string) {
  await scrollIntoView('last-event-text');
  await expect(element(by.id('last-event-text'))).toHaveText(expected);
}

// Asserts `action` emitted no `onPress` / `onSelectionChange`. The baseline is
// read rather than written into the test, so an `it` is not coupled to the
// outcome of the one before it. `action` must leave the screen addressable —
// **Last Event** sits behind any popup it opens.
async function expectLastEventUnchanged(action: () => Promise<void>) {
  const before = await readLastEvent();
  await action();
  await expectLastEvent(before);
}

// Payload order is an implementation detail of the native callback — compare
// it as a set.
async function expectLastSelection(groupId: string, ids: string[]) {
  const text = await readLastEvent();
  const prefix = `${groupId}: `;

  // Sliced rather than `startsWith`, so a mismatch reports the actual line.
  jestExpect(text.slice(0, prefix.length)).toBe(prefix);

  const selected: unknown = JSON.parse(text.slice(prefix.length));
  if (!Array.isArray(selected)) {
    throw new Error(`Expected a JSON array of ids, got: ${text}`);
  }

  jestExpect([...selected].sort()).toEqual([...ids].sort());
}

// The switch only toggles, so `disabled` is the state expected afterwards — a
// swallowed tap fails here instead of as a wrong-menu assertion steps later.
async function setDisabledViaProps(id: ElementId, disabled: boolean) {
  const switchId = `disable-${id}-switch`;
  await scrollIntoView(switchId);
  await element(by.id(switchId)).tap();

  await expect(
    element(by.text(`disable ${SWITCH_LABELS[id]}: ${disabled}`)),
  ).toBeVisible();
}

// Mirrors the option `testID` that `SettingsPicker` derives from its `label`.
// @see apps/src/shared/SettingsPicker.tsx
function optionId(pickerLabel: string, option: string): string {
  return `${pickerLabel.split(' ').join('-')}-${option}`.toLowerCase();
}

// Closing the picker again matters: its option rows stay in the hierarchy and
// would collide with the `by.text` matchers used for the toolbar menu items.
async function selectOption(
  pickerId: string,
  pickerLabel: string,
  option: string,
) {
  const expected = `${pickerLabel}: ${option}`;
  await scrollIntoView(pickerId);

  // Pickers keep their value, so re-picking one costs three taps and three
  // scroll rewinds for nothing. Reading the closed label avoids a probe that
  // would have to time out.
  if ((await attributesOf(by.id(pickerId))).text === expected) {
    return;
  }

  await element(by.id(pickerId)).tap();

  const rowId = optionId(pickerLabel, option);
  await scrollIntoView(rowId);
  await element(by.id(rowId)).tap();

  await scrollIntoView(pickerId);
  await element(by.id(pickerId)).tap();

  await expect(element(by.id(pickerId))).toHaveText(expected);
}

async function sendCommand(options: {
  target: ElementId;
  disabled: CmdDisabled;
}) {
  await selectOption('cmd-target-picker', 'target id', options.target);
  await selectOption('cmd-disabled-picker', 'disabled', options.disabled);

  await scrollIntoView('send-command-button');
  await element(by.id('send-command-button')).tap();
}

// One ordered script: each `describe` starts from the state the previous left,
// with no reset between them.
//
// That is load-bearing for the command steps. Step 21 re-enables the
// `action-bar` step 18 disabled and step 22 clears the `submenu` override step
// 19 applied; command state does not survive a reload, so resetting would leave
// both acting on an already-enabled element and passing without testing
// anything. The props blocks (2–17) each toggle their own switch back off.
describeIfAndroid('Stack Toolbar Menu Disabled', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-disabled-android',
    );
  });

  describe('baseline — initial render from props', () => {
    it('renders the header title and an enabled toolbar action button', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();
      await expect(element(actionBarButton)).toBeVisible();
      await expectActionBarEnabled(true);
      await expectLastEvent(NO_EVENT);
    });

    it('lists every overflow element as enabled, with opt-a checked', async () => {
      await withMenu(async () => {
        await expectRowEnabled('Action Overflow', true);
        await expectRowEnabled('Option A', true);
        await expectRowEnabled('Option B', true);
        await expectRowEnabled('More', true);

        await expectRowChecked('Option A', true);
        await expectRowChecked('Option B', false);
      });
    });
  });

  describe('props — disabled action item, toolbar button', () => {
    it('marks the toolbar button disabled', async () => {
      await setDisabledViaProps('action-bar', true);
      await expectActionBarEnabled(false);
    });

    it('leaves Last Event unchanged when the disabled toolbar button is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await element(actionBarButton).tap();
      });
    });

    it('sets Last Event to "Pressed: action-bar" when the re-enabled toolbar button is tapped', async () => {
      await setDisabledViaProps('action-bar', false);
      await expectActionBarEnabled(true);

      await element(actionBarButton).tap();
      await expectLastEvent('Pressed: action-bar');
    });
  });

  describe('props — disabled action item, overflow', () => {
    it('marks the overflow row disabled', async () => {
      await setDisabledViaProps('action-overflow', true);
      await withMenu(async () => {
        await expectRowEnabled('Action Overflow', false);
      });
    });

    it('leaves Last Event unchanged when the disabled overflow row is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withMenu(async () => {
          await waitForMenuRow('Action Overflow');
          await element(menuRow('Action Overflow')).tap();
        });
      });
    });

    it('sets Last Event to "Pressed: action-overflow" when the re-enabled overflow row is tapped', async () => {
      await setDisabledViaProps('action-overflow', false);
      await withMenu(async () => {
        await expectRowEnabled('Action Overflow', true);
        await element(menuRow('Action Overflow')).tap();
      });
      await expectLastEvent('Pressed: action-overflow');
    });
  });

  describe('props — disabled checkable items', () => {
    it('disables opt-a while keeping its initial checked state', async () => {
      await setDisabledViaProps('opt-a', true);
      await withMenu(async () => {
        await expectRowEnabled('Option A', false);
        await expectRowChecked('Option A', true);
      });
    });

    it('leaves Last Event unchanged when the disabled checked item is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withMenu(async () => {
          await waitForMenuRow('Option A');
          await element(menuRow('Option A')).tap();
          await expectRowChecked('Option A', true);
        });
      });
    });

    it('disables opt-b while keeping its initial unchecked state', async () => {
      await setDisabledViaProps('opt-b', true);
      await withMenu(async () => {
        await expectRowEnabled('Option B', false);
        await expectRowChecked('Option B', false);
      });
    });

    it('leaves Last Event unchanged when the disabled unchecked item is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withMenu(async () => {
          await waitForMenuRow('Option B');
          await element(menuRow('Option B')).tap();
          await expectRowChecked('Option B', false);
        });
      });
    });

    it('restores both items with their initial toggle states once re-enabled', async () => {
      await setDisabledViaProps('opt-a', false);
      await setDisabledViaProps('opt-b', false);

      await withMenu(async () => {
        await expectRowEnabled('Option A', true);
        await expectRowEnabled('Option B', true);
        await expectRowChecked('Option A', true);
        await expectRowChecked('Option B', false);
      });
    });

    it('reports both opt-a and opt-b in the "options" selection when opt-b is checked', async () => {
      await withMenu(async () => {
        await waitForMenuRow('Option B');
        await element(menuRow('Option B')).tap();
      });
      await expectLastSelection('options', ['opt-a', 'opt-b']);
    });

    it('drops opt-a from the selection when opt-a is unchecked', async () => {
      await withMenu(async () => {
        await waitForMenuRow('Option A');
        await element(menuRow('Option A')).tap();
      });
      await expectLastSelection('options', ['opt-b']);
    });

    it('resets the toggle states when a props update rebuilds the menu', async () => {
      // Toggled twice so only the rebuild, not the disabled state, is left over.
      await setDisabledViaProps('action-bar', true);
      await setDisabledViaProps('action-bar', false);

      await withMenu(async () => {
        await expectRowChecked('Option A', true);
        await expectRowChecked('Option B', false);
      });
    });
  });

  describe('props — disabled submenu', () => {
    it('disables the submenu row and does not open it when tapped', async () => {
      await setDisabledViaProps('submenu', true);
      await withMenu(async () => {
        await expectRowEnabled('More', false);
        await element(menuRow('More')).tap();
        await expectSubmenuStayedClosed();
      });
    });

    it('opens the submenu once it is re-enabled', async () => {
      await setDisabledViaProps('submenu', false);
      await withMenu(async () => {
        await expectRowEnabled('More', true);
        await openSubmenu();
      });
    });
  });

  describe('props — disabled item inside a submenu', () => {
    it('disables the sub item', async () => {
      await setDisabledViaProps('sub-item', true);
      await withMenu(async () => {
        await openSubmenu();
        await expectRowEnabled('Sub Item', false);
      });
    });

    it('leaves Last Event unchanged when the disabled sub item is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withMenu(async () => {
          await openSubmenu();
          await element(menuRow('Sub Item')).tap();
        });
      });
    });

    it('sets Last Event to "Pressed: sub-item" when the re-enabled sub item is tapped', async () => {
      await setDisabledViaProps('sub-item', false);
      await withMenu(async () => {
        await openSubmenu();
        await expectRowEnabled('Sub Item', true);
        await element(menuRow('Sub Item')).tap();
      });
      await expectLastEvent('Pressed: sub-item');
    });
  });

  describe('commands — disable via updateToolbarMenuElements', () => {
    it('disables the toolbar button, leaving Last Event unchanged when it is tapped', async () => {
      await sendCommand({ target: 'action-bar', disabled: 'true' });
      await expectActionBarEnabled(false);

      await expectLastEventUnchanged(async () => {
        await element(actionBarButton).tap();
      });
    });

    it('disables the submenu so it can no longer be opened', async () => {
      await sendCommand({ target: 'submenu', disabled: 'true' });
      await withMenu(async () => {
        await expectRowEnabled('More', false);
        await element(menuRow('More')).tap();
        await expectSubmenuStayedClosed();
      });
    });

    it('disables a checked item without clearing its check or updating Last Event', async () => {
      await sendCommand({ target: 'opt-a', disabled: 'true' });
      await expectLastEventUnchanged(async () => {
        await withMenu(async () => {
          await expectRowEnabled('Option A', false);
          await expectRowChecked('Option A', true);
          await element(menuRow('Option A')).tap();
          await expectRowChecked('Option A', true);
        });
      });
    });
  });

  describe('commands — re-enable via updateToolbarMenuElements', () => {
    it('sets Last Event to "Pressed: action-bar" when the re-enabled toolbar button is tapped', async () => {
      await sendCommand({ target: 'action-bar', disabled: 'false' });
      await expectActionBarEnabled(true);

      await element(actionBarButton).tap();
      await expectLastEvent('Pressed: action-bar');
    });
  });

  describe('commands — three-state reset via `undefined`', () => {
    it('clears the disabled override and falls back to the default', async () => {
      await sendCommand({ target: 'submenu', disabled: 'undefined' });
      await withMenu(async () => {
        await expectRowEnabled('More', true);
        await openSubmenu();
      });
    });
  });
});
