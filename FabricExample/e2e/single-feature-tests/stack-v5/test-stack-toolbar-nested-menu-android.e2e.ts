import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { AndroidElementAttributes } from 'detox/detox';
import {
  countMatches,
  describeIfAndroid,
  getElementAttributes,
  getMatches,
  scrollUntilVisible,
  selectSingleFeatureTestsScreen,
  waitUntil,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../../native-class-names';
import type {
  AllIds,
  CmdHiddenOption,
  CmdMenuTitleOption,
  CmdTitleOption,
  Submenu1MenuTitleOption,
  Submenu1TitleOption,
} from '@apps/tests/single-feature-tests/stack-v5/test-stack-toolbar-nested-menu-android';

const SCROLLVIEW_ID = 'toolbar-nested-menu-scrollview';
const HEADER_TITLE = 'Toolbar Nested Menu Test';
const OVERFLOW_BUTTON = 'More options';

// Detox's idle sync does not cover popup animations, so menu waits are explicit.
const MENU_ANIMATION_TIMEOUT = 2000;

// Probes an already-settled popup, not an animation.
const MENU_PRESENCE_TIMEOUT = 250;

// Every text this scenario can put into a popup. Assertions cover the full set,
// so a leaked entry fails.
const ALL_MENU_TEXTS = [
  'Top Item',
  'Submenu A',
  'Submenu B',
  'Sub A.1',
  'Sub A.2',
  'Sub A.3',
  'Sub B.1',
  'Deep',
  'Deep.1',
  'Title X',
  'Header A',
  'Header X',
  'Changed',
  'Changed Header',
] as const;

type MenuText = (typeof ALL_MENU_TEXTS)[number];

// Espresso only searches the focused window, so parent popups behind a submenu
// are out of reach of anything anchored here.
const focusedPopup = by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW);

// A row or header in the focused popup.
const menuText = (text: MenuText): Detox.NativeMatcher =>
  by.text(text).withAncestor(focusedPopup);

// A submenu header is a `FrameLayout`, not a row, so this matches the item alone
// even where both show the same string.
const menuItemRow = (text: MenuText): Detox.NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW).withDescendant(by.text(text));

// Any row of the focused popup — the only handle on an entry with no title.
// Built per call, never hoisted to a const: Detox's `atIndex` rewrites the
// matcher it is given, so a shared one would stay pinned to the index it was
// last tapped at.
const menuRow = (): Detox.NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW).withAncestor(focusedPopup);

// The caret marking an entry as a submenu. It shares its class with the row's
// `group_divider` and icon slot, which differ only by resource id (unmatchable
// in Detox) — but this screen sets neither, so the caret is a row's only image.
const submenuArrow = (text: MenuText): Detox.NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
    .withAncestor(menuItemRow(text));

// Every row inflates the caret and leaf items merely set it to `GONE`, so only
// `visibility` separates a submenu from an item.
async function expectSubmenuArrow(text: MenuText, present: boolean) {
  // Nothing matches for a leaf item, the expected state here.
  const matches = (await getMatches(submenuArrow(text), {
    orEmpty: true,
  })) as AndroidElementAttributes[];
  jestExpect({
    text,
    arrows: matches.filter(match => match.visibility === 'visible').length,
  }).toEqual({ text, arrows: present ? 1 : 0 });
}

// Mirrors the option `testID` that `SettingsPicker` derives from its `label`.
// @see apps/src/shared/SettingsPicker.tsx
function optionId(pickerLabel: string, option: string): string {
  return `${pickerLabel.split(' ').join('-')}-${option}`.toLowerCase();
}

// Rewinds first — `whileElement` only scrolls one way.
async function scrollIntoView(id: string) {
  await element(by.id(SCROLLVIEW_ID)).scrollTo('top');
  await scrollUntilVisible(id, SCROLLVIEW_ID);
}

/**
 * Sets a picker to `option`, then closes it: open option rows stay in the
 * hierarchy and would collide with the `by.text` menu matchers. Re-picking the
 * current value is skipped — it costs several taps and two scroll passes.
 */
async function selectOption(
  pickerId: string,
  pickerLabel: string,
  option: string,
) {
  const expectedText = `${pickerLabel}: ${option}`;

  await scrollIntoView(pickerId);
  const attributes = (await getElementAttributes({
    by: 'id',
    value: pickerId,
  })) as AndroidElementAttributes;

  if (attributes.text === expectedText) {
    return;
  }

  await element(by.id(pickerId)).tap();

  // Rows open below the picker, so the lower ones can start off screen.
  const rowId = optionId(pickerLabel, option);
  await scrollIntoView(rowId);
  await element(by.id(rowId)).tap();

  await scrollIntoView(pickerId);
  await element(by.id(pickerId)).tap();

  await expect(element(by.id(pickerId))).toHaveText(expectedText);
}

interface Command {
  target: AllIds;
  title?: CmdTitleOption;
  hidden?: CmdHiddenOption;
  menuTitle?: CmdMenuTitleOption;
}

// Pickers keep their value between commands, so every field is set on every
// call — an omitted one means "no change", not "keep the previous command's".
async function sendCommand({
  target,
  title = 'no change',
  hidden = 'no change',
  menuTitle = 'no change',
}: Command) {
  await selectOption('cmd-target-picker', 'target id', target);
  await selectOption('cmd-title-picker', 'title', title);
  await selectOption('cmd-hidden-picker', 'hidden', hidden);
  await selectOption('cmd-menutitle-picker', 'menuTitle', menuTitle);

  await scrollIntoView('send-command-button');
  await element(by.id('send-command-button')).tap();
}

async function setSubmenu1Title(title: Submenu1TitleOption) {
  await selectOption('submenu-1-title-picker', 'submenu-1 title', title);
}

async function setSubmenu1MenuTitle(menuTitle: Submenu1MenuTitleOption) {
  await selectOption(
    'submenu-1-menutitle-picker',
    'submenu-1 menuTitle',
    menuTitle,
  );
}

// The switch only toggles, so `value` is the state expected afterwards — a
// swallowed tap fails here, not as a wrong-menu assertion steps later.
async function setSwitch(switchId: string, label: string, value: boolean) {
  await scrollIntoView(switchId);
  await element(by.id(switchId)).tap();

  await expect(element(by.text(`${label}: ${value}`))).toBeVisible();
}

const setIncludeSubmenu1 = (value: boolean) =>
  setSwitch('include-submenu-1-switch', 'include submenu-1', value);

const setIncludeSubmenu2 = (value: boolean) =>
  setSwitch('include-submenu-2-switch', 'include submenu-2', value);

const setAddExtraItem = (value: boolean) =>
  setSwitch('add-extra-item-switch', 'add extra item to submenu-1', value);

// A row going away is not enough — with a popup focused nothing behind it is
// searched, so the screen itself has to become addressable again.
async function waitForScreen() {
  await waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

async function isScreenReachable(): Promise<boolean> {
  return waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_PRESENCE_TIMEOUT)
    .then(
      () => true,
      () => false,
    );
}

/**
 * Presses Back until the screen is addressable again. Submenus stack and each
 * Back closes one; the check before every press keeps a press with no popup up
 * from popping the test screen itself. A left-over popup is never a local
 * failure — every later matcher would resolve against the popup window.
 */
async function closeMenus() {
  // One press per popup of the deepest path (overflow, submenu, nested
  // submenu), plus one to notice an unexpected extra level.
  const MAX_POPUP_DEPTH = 4;

  for (let i = 0; i < MAX_POPUP_DEPTH; i++) {
    if (await isScreenReachable()) {
      return;
    }
    await device.pressBack();
  }

  await waitForScreen();
}

/**
 * Waits until exactly `count` elements in the focused popup show `text`. The
 * awaited text is often up in the parent popup too, so only the match count
 * tells the two apart — hence `waitUntil`, as `waitFor` cannot assert a count.
 */
async function waitForMenuTextCount(text: MenuText, count: number) {
  let matches = 0;

  await waitUntil(
    async () => {
      // Resolves to 0 mid-animation, a legitimate intermediate state here.
      matches = await countMatches(menuText(text), { orEmpty: true });
      return matches === count;
    },
    {
      timeout: MENU_ANIMATION_TIMEOUT,
      message: () =>
        `expected ${count} element(s) reading "${text}" in the focused popup, saw ${matches}`,
    },
  );
}

async function openOverflowMenu() {
  await element(by.label(OVERFLOW_BUTTON)).tap();
  // No step ever renames or hides "Top Item", so it gates the open animation.
  await waitForMenuTextCount('Top Item', 1);
}

/**
 * Opens the overflow menu and walks into the submenus named by `path`, tapping
 * each row by its visible text. `gate` plus `gateCount` describe a text of the
 * destination popup, telling it apart from the one the last tap started in.
 */
async function openMenu(
  path: readonly MenuText[],
  gate: MenuText,
  gateCount: number,
) {
  await openOverflowMenu();

  for (let i = 0; i < path.length; i++) {
    await element(menuText(path[i])).tap();

    // Gating each hop on the row the next tap needs keeps a tap from landing on
    // the popup the previous one was supposed to leave.
    const isLastHop = i === path.length - 1;
    await waitForMenuTextCount(
      isLastHop ? gate : path[i + 1],
      isLastHop ? gateCount : 1,
    );
  }
}

const countOf = (texts: readonly MenuText[], text: MenuText): number =>
  texts.filter(candidate => candidate === text).length;

/**
 * Asserts the exact contents of the focused popup. `expected` lists every text
 * it must show, repeated once per occurrence. `submenus` names the entries that
 * must carry a caret; every other one is asserted not to, so a stray caret
 * fails too. Leaves the popups open — the caller closes them.
 */
async function expectMenuContents(
  expected: [MenuText, ...MenuText[]],
  submenus: readonly MenuText[] = [],
) {
  for (const text of ALL_MENU_TEXTS) {
    const expectedCount = countOf(expected, text);

    if (expectedCount === 0) {
      await expect(element(menuText(text))).not.toExist();
      continue;
    }

    jestExpect({
      text,
      count: await countMatches(menuText(text), { orEmpty: true }),
    }).toEqual({ text, count: expectedCount });

    for (let i = 0; i < expectedCount; i++) {
      await expect(element(menuText(text)).atIndex(i)).toBeVisible();
    }

    await expectSubmenuArrow(text, submenus.includes(text));
  }
}

/**
 * Runs `assertions`, then closes every open popup. A left-over popup would make
 * every later matcher in this stateful suite resolve against the popup window.
 */
async function withMenusClosedAfter(assertions: () => Promise<void>) {
  let assertionFailed = false;

  try {
    await assertions();
  } catch (error) {
    assertionFailed = true;
    throw error;
  } finally {
    try {
      await closeMenus();
    } catch (cleanupError) {
      // A throw from `finally` would replace the real failure.
      if (!assertionFailed) {
        throw cleanupError;
      }
    }
  }
}

/**
 * Asserts the exact contents of the menu reached through `path`, then closes
 * every popup it opened. See `expectMenuContents` for `expected` and `submenus`.
 */
async function expectMenu(
  path: readonly MenuText[],
  expected: [MenuText, ...MenuText[]],
  submenus: readonly MenuText[] = [],
) {
  // The just-tapped row still shows in the popup it lives in, so any other
  // expected text is the only gate the destination popup alone can satisfy.
  const tappedRow = path[path.length - 1];
  const gate = expected.find(text => text !== tappedRow) ?? expected[0];

  await openMenu(path, gate, countOf(expected, gate));

  await withMenusClosedAfter(() => expectMenuContents(expected, submenus));
}

// `submenu-1` sits between `item-top` and `submenu-2`, the only handle on it
// once it loses its title.
const UNTITLED_SUBMENU_ROW_INDEX = 1;

/**
 * Asserts the overflow menu holds `rowCount` rows, then opens the untitled
 * `submenu-1` among them and asserts its contents. `expected[0]` gates the
 * submenu popup, so it must be a text the overflow menu itself does not show.
 */
async function expectUntitledSubmenu(
  rowCount: number,
  expected: [MenuText, ...MenuText[]],
) {
  await openOverflowMenu();

  await withMenusClosedAfter(async () => {
    jestExpect(await countMatches(menuRow(), { orEmpty: true })).toBe(rowCount);

    await element(menuRow()).atIndex(UNTITLED_SUBMENU_ROW_INDEX).tap();

    const gate = expected[0];
    await waitForMenuTextCount(gate, countOf(expected, gate));

    await expectMenuContents(expected);
  });
}

// Taps `item` in the menu reached through `path`. `item` must be the only match
// in its popup, so the tap cannot be ambiguous.
async function tapMenuItem(path: readonly MenuText[], item: MenuText) {
  await openMenu(path, item, 1);
  await element(menuText(item)).tap();

  // Selecting an item dismisses every popup in the chain.
  await waitForScreen();
}

async function expectLastClicked(id: AllIds) {
  await scrollIntoView('last-clicked-text');
  await expect(element(by.id('last-clicked-text'))).toHaveText(
    `Last clicked: ${id}`,
  );
}

describeIfAndroid('Stack Toolbar Nested Menu', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-nested-menu-android',
    );
  });
  afterEach(closeMenus);

  describe('baseline — initial render and submenu structure', () => {
    it('renders the header title and the prop-configured top-level menu', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();

      await expectMenu(
        [],
        ['Top Item', 'Submenu A', 'Submenu B'],
        ['Submenu A', 'Submenu B'],
      );
    });

    it('opens "Submenu A" with its "Header A" as the header', async () => {
      await expectMenu(['Submenu A'], ['Header A', 'Sub A.1', 'Sub A.2']);
    });

    it('falls back to the title "Submenu B" for the header of a submenu without menuTitle', async () => {
      await expectMenu(
        ['Submenu B'],
        ['Submenu B', 'Sub B.1', 'Deep'],
        ['Deep'],
      );
    });

    it('opens the submenu nested inside "Submenu B"', async () => {
      await expectMenu(['Submenu B', 'Deep'], ['Deep', 'Deep.1']);
    });
  });

  describe('click handling — items at all nesting levels', () => {
    it('reports item-top as last clicked', async () => {
      await tapMenuItem([], 'Top Item');

      await expectLastClicked('item-top');
    });

    it('reports sub-1-1 for the first item of submenu-1 as last clicked', async () => {
      await tapMenuItem(['Submenu A'], 'Sub A.1');

      await expectLastClicked('sub-1-1');
    });

    it('reports sub-1-2 for the second item of submenu-1 as last clicked', async () => {
      await tapMenuItem(['Submenu A'], 'Sub A.2');

      await expectLastClicked('sub-1-2');
    });

    it('reports sub-2-1 for the item of submenu-2 as last clicked', async () => {
      await tapMenuItem(['Submenu B'], 'Sub B.1');

      await expectLastClicked('sub-2-1');
    });

    it('reports deep-1 for the item of the doubly nested submenu as last clicked', async () => {
      await tapMenuItem(['Submenu B', 'Deep'], 'Deep.1');

      await expectLastClicked('deep-1');
    });
  });

  describe('imperative command — leaf item inside a submenu', () => {
    it('retitles sub-1-1 and leaves its sibling alone', async () => {
      await sendCommand({ target: 'sub-1-1', title: 'Title X' });

      await expectMenu(['Submenu A'], ['Header A', 'Title X', 'Sub A.2']);
    });

    it('keeps the id stable across the title change', async () => {
      await tapMenuItem(['Submenu A'], 'Title X');

      await expectLastClicked('sub-1-1');
    });

    it('hides sub-1-2 when hidden = true', async () => {
      await sendCommand({ target: 'sub-1-2', hidden: 'true' });

      await expectMenu(['Submenu A'], ['Header A', 'Title X']);
    });

    it('restores sub-1-2 when hidden = false', async () => {
      await sendCommand({ target: 'sub-1-2', hidden: 'false' });

      await expectMenu(['Submenu A'], ['Header A', 'Title X', 'Sub A.2']);
    });
  });

  describe('imperative command — submenu container', () => {
    it('retitles the submenu without touching its children', async () => {
      await sendCommand({ target: 'submenu-1', title: 'Title X' });

      await expectMenu(
        [],
        ['Top Item', 'Title X', 'Submenu B'],
        ['Title X', 'Submenu B'],
      );
      await expectMenu(['Title X'], ['Title X', 'Title X', 'Sub A.2']);
    });

    it('hides the whole submenu when hidden = true', async () => {
      await sendCommand({ target: 'submenu-1', hidden: 'true' });

      await expectMenu([], ['Top Item', 'Submenu B'], ['Submenu B']);
    });

    it('restores the submenu with its command-applied title when hidden = false', async () => {
      await sendCommand({ target: 'submenu-1', hidden: 'false' });

      await expectMenu(
        [],
        ['Top Item', 'Title X', 'Submenu B'],
        ['Title X', 'Submenu B'],
      );
      await expectMenu(['Title X'], ['Title X', 'Title X', 'Sub A.2']);
    });
  });

  describe('imperative command — menuTitle', () => {
    it('replaces the submenu header', async () => {
      await sendCommand({ target: 'submenu-1', menuTitle: 'Header X' });

      await expectMenu(['Title X'], ['Header X', 'Title X', 'Sub A.2']);
    });

    it('falls back to the title once menuTitle is cleared', async () => {
      await sendCommand({ target: 'submenu-1', menuTitle: 'undefined' });

      // Twice: the header falling back to the title, and sub-1-1's own row.
      await expectMenu(['Title X'], ['Title X', 'Title X', 'Sub A.2']);
    });

    it('leaves the submenu entry without a title once both are cleared', async () => {
      // Both fields go in one command: the header is only re-derived while
      // handling `menuTitle`, so clearing the title alone leaves it reading
      // whatever it fell back to one step earlier.
      await sendCommand({
        target: 'submenu-1',
        title: 'undefined',
        menuTitle: 'undefined',
      });

      // The untitled submenu is still there, it just has no text to match.
      await expectMenu([], ['Top Item', 'Submenu B'], ['Submenu B']);

      // No header is left to render, and the children keep their command titles.
      await expectUntitledSubmenu(3, ['Title X', 'Sub A.2']);
    });
  });

  describe('props update — drops all command state', () => {
    it('rebuilds the whole tree from props when a single prop changes', async () => {
      await setAddExtraItem(true);

      await expectMenu(
        [],
        ['Top Item', 'Submenu A', 'Submenu B'],
        ['Submenu A', 'Submenu B'],
      );
      await expectMenu(
        ['Submenu A'],
        ['Header A', 'Sub A.1', 'Sub A.2', 'Sub A.3'],
      );
    });

    it('removes the extra item again', async () => {
      await setAddExtraItem(false);

      await expectMenu(['Submenu A'], ['Header A', 'Sub A.1', 'Sub A.2']);
    });
  });

  describe('props update — submenu title and menuTitle', () => {
    it('retitles the submenu without touching its children', async () => {
      await setSubmenu1Title('Changed');

      await expectMenu(
        [],
        ['Top Item', 'Changed', 'Submenu B'],
        ['Changed', 'Submenu B'],
      );
      await expectMenu(['Changed'], ['Header A', 'Sub A.1', 'Sub A.2']);
    });

    it('restores the original title', async () => {
      await setSubmenu1Title('Submenu A');

      await expectMenu(
        [],
        ['Top Item', 'Submenu A', 'Submenu B'],
        ['Submenu A', 'Submenu B'],
      );
    });

    it('replaces the submenu header with menuTitle', async () => {
      await setSubmenu1MenuTitle('Changed Header');

      await expectMenu(['Submenu A'], ['Changed Header', 'Sub A.1', 'Sub A.2']);
    });

    it('restores the original header', async () => {
      await setSubmenu1MenuTitle('Header A');

      await expectMenu(['Submenu A'], ['Header A', 'Sub A.1', 'Sub A.2']);
    });

    it('falls back to the title when menuTitle is undefined', async () => {
      await setSubmenu1MenuTitle('undefined');

      await expectMenu(['Submenu A'], ['Submenu A', 'Sub A.1', 'Sub A.2']);
    });

    it('leaves the submenu entry without a title when both are undefined', async () => {
      await setSubmenu1Title('undefined');

      // The untitled submenu is still there, it just has no text to match.
      await expectMenu([], ['Top Item', 'Submenu B'], ['Submenu B']);

      // Rebuilt from props, so no header and the children are back to their
      // prop-configured titles.
      await expectUntitledSubmenu(3, ['Sub A.1', 'Sub A.2']);
    });

    it('restores both the title and the header', async () => {
      await setSubmenu1Title('Submenu A');
      await setSubmenu1MenuTitle('Header A');

      await expectMenu(
        [],
        ['Top Item', 'Submenu A', 'Submenu B'],
        ['Submenu A', 'Submenu B'],
      );
      await expectMenu(['Submenu A'], ['Header A', 'Sub A.1', 'Sub A.2']);
    });
  });

  describe('props update — including and excluding submenus', () => {
    it('drops submenu-1 from the menu', async () => {
      await setIncludeSubmenu1(false);

      await expectMenu([], ['Top Item', 'Submenu B'], ['Submenu B']);
    });

    it('brings submenu-1 back with its default children', async () => {
      await setIncludeSubmenu1(true);

      await expectMenu(
        [],
        ['Top Item', 'Submenu A', 'Submenu B'],
        ['Submenu A', 'Submenu B'],
      );
      await expectMenu(['Submenu A'], ['Header A', 'Sub A.1', 'Sub A.2']);
    });

    it('drops submenu-2 from the menu', async () => {
      await setIncludeSubmenu2(false);

      await expectMenu([], ['Top Item', 'Submenu A'], ['Submenu A']);
    });

    it('brings submenu-2 back with its nested submenu', async () => {
      await setIncludeSubmenu2(true);

      await expectMenu(
        [],
        ['Top Item', 'Submenu A', 'Submenu B'],
        ['Submenu A', 'Submenu B'],
      );
      await expectMenu(
        ['Submenu B'],
        ['Submenu B', 'Sub B.1', 'Deep'],
        ['Deep'],
      );
      await expectMenu(['Submenu B', 'Deep'], ['Deep', 'Deep.1']);
    });
  });

  describe('imperative command — deeply nested submenu', () => {
    it('retitles an item two levels down', async () => {
      await sendCommand({ target: 'deep-1', title: 'Title X' });

      await expectMenu(['Submenu B', 'Deep'], ['Deep', 'Title X']);
    });

    it('keeps the id of the deeply nested item stable', async () => {
      await tapMenuItem(['Submenu B', 'Deep'], 'Title X');

      await expectLastClicked('deep-1');
    });

    it('retitles the nested submenu container itself', async () => {
      await sendCommand({ target: 'deep-menu', title: 'Title X' });

      await expectMenu(
        ['Submenu B'],
        ['Submenu B', 'Sub B.1', 'Title X'],
        ['Title X'],
      );
      // Header (title fallback) plus the item retitled two steps earlier.
      await expectMenu(['Submenu B', 'Title X'], ['Title X', 'Title X']);
    });

    it('replaces the header of the nested submenu', async () => {
      await sendCommand({ target: 'deep-menu', menuTitle: 'Header X' });

      await expectMenu(['Submenu B', 'Title X'], ['Header X', 'Title X']);
    });

    it('drops the command state at every level once props change', async () => {
      await setIncludeSubmenu2(false);
      await setIncludeSubmenu2(true);

      await expectMenu(
        ['Submenu B'],
        ['Submenu B', 'Sub B.1', 'Deep'],
        ['Deep'],
      );
      await expectMenu(['Submenu B', 'Deep'], ['Deep', 'Deep.1']);
    });
  });
});
