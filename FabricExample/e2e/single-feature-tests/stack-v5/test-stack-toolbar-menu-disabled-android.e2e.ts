// Detox cannot read a tint, so every "greyed out" expectation is asserted
// through the native `enabled` attribute — AppCompat mirrors
// `MenuItem.isEnabled()` onto the item view — plus **Last Event** staying put.
import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { AndroidElementAttributes, NativeMatcher } from 'detox/detox';
import {
  createOverflowMenuHelpers,
  describeIfAndroid,
  getMatches,
  menuItemRow,
  MENU_ANIMATION_TIMEOUT_MS,
  rewindAndScrollUntilVisible,
  selectPickerOption,
  selectSingleFeatureTestsScreen,
  toggleSettingsSwitch,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_CHECK_BOX,
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

// Small steps keep short switch rows from being scrolled past.
const SETTINGS_CONTROL = { scrollViewId: SCROLLVIEW_ID, pixels: 300 };

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
const menuRow = (title: RowTitle): NativeMatcher => menuItemRow(title);

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

// Targets sit either side of the current offset, hence the rewind.
async function scrollIntoView(id: string) {
  await rewindAndScrollUntilVisible(id, SCROLLVIEW_ID, SETTINGS_CONTROL);
}

// A submenu opens on top of the overflow menu, so at most two popups stack.
const { withOverflowMenu } = createOverflowMenuHelpers({
  scrollViewId: SCROLLVIEW_ID,
  maxMenuDepth: 2,
});

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
  await toggleSettingsSwitch(
    {
      switchId: `disable-${id}-switch`,
      label: `disable ${SWITCH_LABELS[id]}`,
      to: disabled,
    },
    SETTINGS_CONTROL,
  );
}

// Closing the picker again matters: its option rows stay in the hierarchy and
// would collide with the `by.text` matchers used for the toolbar menu items.
async function selectOption(pickerId: string, label: string, option: string) {
  await selectPickerOption({ pickerId, label, option }, SETTINGS_CONTROL);
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
      await withOverflowMenu(async () => {
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
      await withOverflowMenu(async () => {
        await expectRowEnabled('Action Overflow', false);
      });
    });

    it('leaves Last Event unchanged when the disabled overflow row is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withOverflowMenu(async () => {
          await waitForMenuRow('Action Overflow');
          await element(menuRow('Action Overflow')).tap();
        });
      });
    });

    it('sets Last Event to "Pressed: action-overflow" when the re-enabled overflow row is tapped', async () => {
      await setDisabledViaProps('action-overflow', false);
      await withOverflowMenu(async () => {
        await expectRowEnabled('Action Overflow', true);
        await element(menuRow('Action Overflow')).tap();
      });
      await expectLastEvent('Pressed: action-overflow');
    });
  });

  describe('props — disabled checkable items', () => {
    it('disables opt-a while keeping its initial checked state', async () => {
      await setDisabledViaProps('opt-a', true);
      await withOverflowMenu(async () => {
        await expectRowEnabled('Option A', false);
        await expectRowChecked('Option A', true);
      });
    });

    it('leaves Last Event unchanged when the disabled checked item is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withOverflowMenu(async () => {
          await waitForMenuRow('Option A');
          await element(menuRow('Option A')).tap();
          await expectRowChecked('Option A', true);
        });
      });
    });

    it('disables opt-b while keeping its initial unchecked state', async () => {
      await setDisabledViaProps('opt-b', true);
      await withOverflowMenu(async () => {
        await expectRowEnabled('Option B', false);
        await expectRowChecked('Option B', false);
      });
    });

    it('leaves Last Event unchanged when the disabled unchecked item is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withOverflowMenu(async () => {
          await waitForMenuRow('Option B');
          await element(menuRow('Option B')).tap();
          await expectRowChecked('Option B', false);
        });
      });
    });

    it('restores both items with their initial toggle states once re-enabled', async () => {
      await setDisabledViaProps('opt-a', false);
      await setDisabledViaProps('opt-b', false);

      await withOverflowMenu(async () => {
        await expectRowEnabled('Option A', true);
        await expectRowEnabled('Option B', true);
        await expectRowChecked('Option A', true);
        await expectRowChecked('Option B', false);
      });
    });

    it('reports both opt-a and opt-b in the "options" selection when opt-b is checked', async () => {
      await withOverflowMenu(async () => {
        await waitForMenuRow('Option B');
        await element(menuRow('Option B')).tap();
      });
      await expectLastSelection('options', ['opt-a', 'opt-b']);
    });

    it('drops opt-a from the selection when opt-a is unchecked', async () => {
      await withOverflowMenu(async () => {
        await waitForMenuRow('Option A');
        await element(menuRow('Option A')).tap();
      });
      await expectLastSelection('options', ['opt-b']);
    });

    it('resets the toggle states when a props update rebuilds the menu', async () => {
      // Toggled twice so only the rebuild, not the disabled state, is left over.
      await setDisabledViaProps('action-bar', true);
      await setDisabledViaProps('action-bar', false);

      await withOverflowMenu(async () => {
        await expectRowChecked('Option A', true);
        await expectRowChecked('Option B', false);
      });
    });
  });

  describe('props — disabled submenu', () => {
    it('disables the submenu row and does not open it when tapped', async () => {
      await setDisabledViaProps('submenu', true);
      await withOverflowMenu(async () => {
        await expectRowEnabled('More', false);
        await element(menuRow('More')).tap();
        await expectSubmenuStayedClosed();
      });
    });

    it('opens the submenu once it is re-enabled', async () => {
      await setDisabledViaProps('submenu', false);
      await withOverflowMenu(async () => {
        await expectRowEnabled('More', true);
        await openSubmenu();
      });
    });
  });

  describe('props — disabled item inside a submenu', () => {
    it('disables the sub item', async () => {
      await setDisabledViaProps('sub-item', true);
      await withOverflowMenu(async () => {
        await openSubmenu();
        await expectRowEnabled('Sub Item', false);
      });
    });

    it('leaves Last Event unchanged when the disabled sub item is tapped', async () => {
      await expectLastEventUnchanged(async () => {
        await withOverflowMenu(async () => {
          await openSubmenu();
          await element(menuRow('Sub Item')).tap();
        });
      });
    });

    it('sets Last Event to "Pressed: sub-item" when the re-enabled sub item is tapped', async () => {
      await setDisabledViaProps('sub-item', false);
      await withOverflowMenu(async () => {
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
      await withOverflowMenu(async () => {
        await expectRowEnabled('More', false);
        await element(menuRow('More')).tap();
        await expectSubmenuStayedClosed();
      });
    });

    it('disables a checked item without clearing its check or updating Last Event', async () => {
      await sendCommand({ target: 'opt-a', disabled: 'true' });
      await expectLastEventUnchanged(async () => {
        await withOverflowMenu(async () => {
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
      await withOverflowMenu(async () => {
        await expectRowEnabled('More', true);
        await openSubmenu();
      });
    });
  });
});
