// Detox cannot read a tint, so every "greyed out" expectation is asserted
// through the native `enabled` attribute — AppCompat mirrors
// `MenuItem.isEnabled()` onto the item view — plus **Last Event** staying put.
import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { AndroidElementAttributes, NativeMatcher } from 'detox/detox';
import {
  describeIfAndroid,
  getMatches,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_CHECK_BOX,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../../native-class-names';

const SCROLLVIEW_ID = 'toolbar-menu-disabled-scrollview';
const HEADER_TITLE = 'Toolbar Menu Disabled Test';

// Detox's idle sync does not cover popup window animations, so every wait that
// straddles a menu opening or dismissing has to be explicit.
const MENU_ANIMATION_TIMEOUT = 2000;

// Probes an already-settled popup rather than an animation — by the time it is
// used the menu is either up or was never opened.
const MENU_PRESENCE_TIMEOUT = 250;

type ElementId =
  | 'action-bar'
  | 'action-overflow'
  | 'opt-a'
  | 'opt-b'
  | 'submenu'
  | 'sub-item';

// Mirrors ITEM_LABELS on the test screen — the switch renders `${label}: ${value}`.
// @see apps/src/tests/single-feature-tests/stack-v5/test-stack-toolbar-menu-disabled-android/index.tsx
const SWITCH_LABELS: Record<ElementId, string> = {
  'action-bar': 'action-bar (toolbar button)',
  'action-overflow': 'action-overflow',
  'opt-a': 'opt-a (checkable, checked)',
  'opt-b': 'opt-b (checkable)',
  submenu: 'submenu',
  'sub-item': 'sub-item',
};

// Titles of the elements that live inside a popup. `action-bar` is absent on
// purpose — it is pinned to the toolbar via `showAsAction: 'always'`.
type RowTitle =
  | 'Action Overflow'
  | 'Option A'
  | 'Option B'
  | 'More'
  | 'Sub Item';

// Mirrors the screen's `lastEvent ?? '—'` placeholder.
const NO_EVENT = '—';

// `action-bar` is the only element pinned to the toolbar, so its item view is
// unambiguous — the overflow button is a different class.
const actionBarButton = by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW);

// The row, not the title `TextView` inside it: `View.setEnabled` does not
// propagate to children, so only the row reflects a disabled menu element.
function menuRow(title: RowTitle): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
    .withDescendant(by.text(title));
}

async function attributesOf(
  matcher: NativeMatcher,
): Promise<AndroidElementAttributes> {
  const matches = await getMatches(matcher);
  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one match, found ${matches.length}. ` +
        'The matcher is ambiguous or the view hierarchy changed.',
    );
  }
  return matches[0] as AndroidElementAttributes;
}

// Rewinds to the top first, so a target above the current offset is still
// reachable — `whileElement` only scrolls one way.
async function scrollIntoView(id: string) {
  await element(by.id(SCROLLVIEW_ID)).scrollTo('top');
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(SCROLLVIEW_ID))
    .scroll(300, 'down', Number.NaN, 0.85);
}

// Detox resolves matchers against a single window: while a popup holds focus
// nothing behind it is in the searched hierarchy, so an entry going away is not
// enough — the screen itself has to become addressable again.
async function waitForScreen() {
  await waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

// The same probe as `waitForScreen`, reported instead of thrown: with popups
// stacked the screen legitimately stays unreachable until the last one is gone.
async function isScreenAddressable(): Promise<boolean> {
  return waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT)
    .then(
      () => true,
      () => false,
    );
}

// Waits for the popup itself, not for any single row: bodies that tap a row as
// their first step would otherwise race the menu animating in.
async function openMenu() {
  await element(by.label('More options')).tap();
  await waitFor(element(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

async function waitForMenuRow(title: RowTitle) {
  await waitFor(element(menuRow(title)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

// The same race one level down, so opening the submenu is bracketed by waits
// too. Only for the cases where it is expected to open — a disabled **More**
// has to be tapped directly, since there is nothing to wait for.
async function openSubmenu() {
  await waitForMenuRow('More');
  await element(menuRow('More')).tap();
  await waitForMenuRow('Sub Item');
}

// The counterpart, for a **More** that must not react. A submenu would take
// focus and put its own rows in the searched window, so the parent's rows
// staying addressable is what proves none opened — and reading them forces a
// round trip long enough for a submenu that did open to have shown up. A bare
// `not.toExist()` on **Sub Item** would otherwise pass before the popup is up.
async function expectSubmenuStayedClosed() {
  await expectRowEnabled('More', false);
  await expect(element(menuRow('Sub Item'))).not.toExist();
}

async function isMenuOpen(): Promise<boolean> {
  return waitFor(element(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)))
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT)
    .then(
      () => true,
      () => false,
    );
}

// A submenu opens on top of the overflow menu, so at most two popups stack.
const MAX_STACKED_MENUS = 2;

// Presses Back only while a popup is actually up: a menu that never opened —
// or already closed itself — would otherwise take the Back press and pop the
// test screen. Submenus stack, hence the loop.
async function closeMenus() {
  for (let attempt = 0; attempt < MAX_STACKED_MENUS; attempt++) {
    if (!(await isMenuOpen())) {
      break;
    }
    await device.pressBack();

    // A dismissed popup lingers while it animates out, so re-probing it would
    // read the one just closed as a second stacked menu and Back into the
    // screen. Waiting for the screen instead settles that animation, and its
    // return means nothing is left to close.
    if (await isScreenAddressable()) {
      return;
    }
  }
  await waitForScreen();
}

/**
 * Runs `body` with the overflow menu open and closes the menu afterwards, even
 * when an assertion throws — this suite is stateful and a popup left covering
 * the screen would fail every later step.
 */
async function withMenu(body: () => Promise<void>) {
  await openMenu();

  try {
    await body();
  } catch (error) {
    // Swallowed here only: a failing cleanup must not replace the assertion
    // that actually failed. When `body` passes, the `closeMenus` below is
    // outside the `try` and its failure surfaces as the test's error.
    await closeMenus().catch(() => {});
    throw error;
  }

  await closeMenus();
}

async function expectRowEnabled(title: RowTitle, enabled: boolean) {
  await waitForMenuRow(title);
  jestExpect((await attributesOf(menuRow(title))).enabled).toBe(enabled);
}

// Checkable rows render an AppCompat checkbox whose `value` attribute carries
// the toggle state.
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

/**
 * Asserts that `action` emitted no `onPress` / `onSelectionChange` — the way a
 * disabled element is checked to have ignored a tap.
 *
 * The value that must stay put is whatever the preceding steps left behind, so
 * it is read here rather than written into the test: spelling it out couples an
 * `it` to the outcome of the one before it, and reordering or inserting a step
 * then fails an assertion that has nothing to do with the change.
 *
 * `action` has to leave the screen addressable when it returns — read either
 * side of it, **Last Event** is behind any popup the body opens.
 */
async function expectLastEventUnchanged(action: () => Promise<void>) {
  const before = await readLastEvent();
  await action();
  await expectLastEvent(before);
}

// The group payload is `JSON.stringify`d, so its order is an implementation
// detail of the native selection callback — compare it as a set.
async function expectLastSelection(groupId: string, ids: string[]) {
  const text = await readLastEvent();
  const prefix = `${groupId}: `;

  // Compared as a slice rather than through `startsWith`, so a mismatch reports
  // the line that was actually on screen instead of `false is not true`.
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

type CmdDisabled = 'no change' | 'true' | 'false' | 'undefined';

async function sendCommand(options: {
  target: ElementId;
  disabled: CmdDisabled;
}) {
  await selectOption('cmd-target-picker', 'target id', options.target);
  await selectOption('cmd-disabled-picker', 'disabled', options.disabled);

  await scrollIntoView('send-command-button');
  await element(by.id('send-command-button')).tap();
}

describeIfAndroid('Stack Toolbar Menu Disabled', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-disabled-android',
    );
  });

  describe('baseline — initial render from props (step 1)', () => {
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

  describe('props — disabled action item, toolbar button (steps 2–4)', () => {
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

  describe('props — disabled action item, overflow (steps 5–7)', () => {
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

  describe('props — disabled checkable items (steps 8–11)', () => {
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

    it('disables opt-b, keeps it unchecked, and leaves Last Event unchanged when tapped', async () => {
      await setDisabledViaProps('opt-b', true);
      await expectLastEventUnchanged(async () => {
        await withMenu(async () => {
          await expectRowEnabled('Option B', false);
          await expectRowChecked('Option B', false);
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

    it('sets Last Event to the "options" selection holding opt-a and opt-b when the re-enabled opt-b is checked', async () => {
      await withMenu(async () => {
        await waitForMenuRow('Option B');
        await element(menuRow('Option B')).tap();
      });
      await expectLastSelection('options', ['opt-a', 'opt-b']);
    });

    it('drops opt-a from the selection when the re-enabled opt-a is unchecked', async () => {
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

  describe('props — disabled submenu (steps 12–14)', () => {
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

  describe('props — disabled item inside a submenu (steps 15–17)', () => {
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

  describe('commands — disable via updateToolbarMenuElements (steps 18–20)', () => {
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

  describe('commands — re-enable via updateToolbarMenuElements (step 21)', () => {
    it('sets Last Event to "Pressed: action-bar" when the command-re-enabled toolbar button is tapped', async () => {
      await sendCommand({ target: 'action-bar', disabled: 'false' });
      await expectActionBarEnabled(true);

      await element(actionBarButton).tap();
      await expectLastEvent('Pressed: action-bar');
    });
  });

  describe('commands — three-state reset via `undefined` (step 22)', () => {
    it('clears the disabled override and falls back to the default', async () => {
      await sendCommand({ target: 'submenu', disabled: 'undefined' });
      await withMenu(async () => {
        await expectRowEnabled('More', true);
        await openSubmenu();
      });
    });
  });
});
