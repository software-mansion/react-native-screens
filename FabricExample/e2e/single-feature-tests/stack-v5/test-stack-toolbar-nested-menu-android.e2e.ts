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

// Detox's idle sync does not cover popup window animations, so every wait that
// straddles a menu opening or dismissing has to be explicit.
const MENU_ANIMATION_TIMEOUT = 2000;

// Probes an already-settled popup rather than an animation — by the time it is
// used the menu is either up or was never opened.
const MENU_PRESENCE_TIMEOUT = 250;

// Every string this scenario can put into a menu popup, whether as a row or as
// a submenu header. Assertions check the full set — expected texts present with
// the expected multiplicity, all others absent — so a leaked entry fails.
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

/**
 * A row or header inside whichever menu popup currently holds focus. Espresso
 * only searches the focused window, so while a submenu is up this addresses the
 * submenu alone — the parent popup behind it is out of reach.
 */
const menuText = (text: MenuText): Detox.NativeMatcher =>
  by
    .text(text)
    .withAncestor(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW));

/**
 * The row carrying `text` in the focused popup. A submenu header is a plain
 * `FrameLayout`, not a row, so this addresses the item alone even where the two
 * show the same string.
 */
const menuItemRow = (text: MenuText): Detox.NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW).withDescendant(by.text(text));

/**
 * A row's `submenuarrow` — the caret marking an entry as a submenu.
 *
 * It shares its class with the row's `group_divider` and its icon slot, and
 * they differ only by resource id, which Detox cannot match. This screen builds
 * no item groups and sets no icons, so the caret is the only image a row here
 * can hold.
 */
const submenuArrow = (text: MenuText): Detox.NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
    .withAncestor(menuItemRow(text));

/**
 * Asserts whether the row for `text` shows a submenu indicator.
 *
 * Every row inflates the caret and only leaf items set it to `GONE`, so its
 * presence in the hierarchy proves nothing — `visibility` is what separates a
 * submenu from an item. A text that names only a submenu header matches no row
 * and so has no caret, which is what `present: false` asserts for it.
 */
async function expectSubmenuArrow(text: MenuText, present: boolean) {
  // Throws when nothing matches, which for a leaf item is the expected state.
  const matches = (await getMatches(submenuArrow(text)).catch(
    () => [],
  )) as AndroidElementAttributes[];

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

// Rewinds to the top first, so a target above the current offset is still
// reachable — `whileElement` only scrolls one way.
async function scrollIntoView(id: string) {
  await element(by.id(SCROLLVIEW_ID)).scrollTo('top');
  await scrollUntilVisible(id, SCROLLVIEW_ID);
}

/**
 * Sets a picker to `option`, then closes it again: its option rows stay in the
 * hierarchy while open and would collide with the `by.text` matchers used for
 * the menu popups.
 *
 * Selecting a value the picker already holds is skipped — this suite drives
 * four command pickers per step and re-picking each one costs several taps and
 * two full scroll passes.
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

  // The rows open directly below the picker, so the lower ones can start off
  // screen.
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

/**
 * The pickers keep their value between commands, so every field is set on every
 * call — an omitted one means "no change", not "leave whatever the previous
 * command used".
 */
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
// swallowed tap fails here instead of as a wrong-menu assertion steps later.
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

// Detox resolves matchers against a single window: while a popup holds focus
// nothing behind it is in the searched hierarchy, so a row going away is not
// enough — the screen itself has to become addressable again.
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
 * Presses Back until the screen is addressable again. Submenus stack: opening
 * `Submenu B > Deep` leaves three popups up and each Back closes one, so a
 * single press is not enough. Pressing Back with no popup up would pop the test
 * screen itself, hence the check before every press.
 *
 * A left-over popup is never a local failure — every later matcher would
 * resolve against the popup window instead of the activity, so the whole rest
 * of the suite fails on views that are plainly there.
 */
async function closeMenus() {
  // One press per popup the deepest path in this scenario can open (overflow,
  // submenu, nested submenu), plus one to notice an unexpected extra level.
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
 * Waits until exactly `count` elements in the focused popup show `text`.
 *
 * Counting rather than probing for presence is what makes this usable as a
 * gate on a submenu opening: the text a step waits for is often on screen in
 * the parent popup too, and only the number of matches tells the two popups
 * apart. Polled by hand because `waitFor` has no count assertion.
 */
async function waitForMenuTextCount(text: MenuText, count: number) {
  const deadline = Date.now() + MENU_ANIMATION_TIMEOUT;

  for (;;) {
    // Throws when nothing matches, which is a legitimate intermediate state
    // here — the popup being waited for may not be up yet.
    const matches = await countMatches(menuText(text)).catch(() => 0);

    if (matches === count) {
      return;
    }

    if (Date.now() >= deadline) {
      jestExpect({ text, count: matches }).toEqual({ text, count });
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function openOverflowMenu() {
  await element(by.label(OVERFLOW_BUTTON)).tap();
  // "Top Item" is the one entry no step of this scenario ever renames or
  // hides, so it gates the open animation for every menu assertion.
  await waitForMenuTextCount('Top Item', 1);
}

/**
 * Opens the overflow menu and walks into the submenus named by `path`, tapping
 * each row by its visible text. `gate` is a text the destination popup shows,
 * and `gateCount` how many times — together they tell the destination apart
 * from the popup the last tap started in.
 */
async function openMenu(
  path: readonly MenuText[],
  gate: MenuText,
  gateCount: number,
) {
  await openOverflowMenu();

  for (let i = 0; i < path.length; i++) {
    await element(menuText(path[i])).tap();

    // Each hop is gated by the row the next tap needs, so a tap can never land
    // on the popup the previous one was supposed to leave.
    const isLastHop = i === path.length - 1;
    await waitForMenuTextCount(
      isLastHop ? gate : path[i + 1],
      isLastHop ? gateCount : 1,
    );
  }
}

/**
 * Asserts the exact contents of the menu reached through `path`, then closes
 * every popup it opened.
 *
 * `expected` lists every text the popup must show; repeating a text asserts it
 * appears that many times — a submenu falling back to its `title` for the
 * header renders the same string twice when a child carries it as well.
 *
 * `submenus` names the entries of `expected` that must carry a submenu
 * indicator; every other one is asserted not to. Defaulting it to none makes
 * the caret assertion total — a caret appearing on a plain item fails just as
 * a missing one does.
 */
async function expectMenu(
  path: readonly MenuText[],
  expected: [MenuText, ...MenuText[]],
  submenus: readonly MenuText[] = [],
) {
  const expectedCounts = new Map<MenuText, number>();
  for (const text of expected) {
    expectedCounts.set(text, (expectedCounts.get(text) ?? 0) + 1);
  }

  // Waiting on the text of the row that was just tapped would prove nothing —
  // the popup it lives in still shows it. Any other expected text is a gate
  // that only the destination popup can satisfy.
  const tappedRow = path[path.length - 1];
  const gate = expected.find(text => text !== tappedRow) ?? expected[0];

  await openMenu(path, gate, expectedCounts.get(gate) as number);

  let assertionFailed = false;

  try {
    for (const text of ALL_MENU_TEXTS) {
      const expectedCount = expectedCounts.get(text) ?? 0;

      if (expectedCount === 0) {
        await expect(element(menuText(text))).not.toExist();
        continue;
      }

      jestExpect({
        text,
        count: await countMatches(menuText(text)),
      }).toEqual({ text, count: expectedCount });

      for (let i = 0; i < expectedCount; i++) {
        await expect(element(menuText(text)).atIndex(i)).toBeVisible();
      }

      await expectSubmenuArrow(text, submenus.includes(text));
    }
  } catch (error) {
    assertionFailed = true;
    throw error;
  } finally {
    // Closed here so a failed assertion does not leave a popup covering the
    // screen — this suite is stateful and every later step would then fail.
    try {
      await closeMenus();
    } catch (cleanupError) {
      // A throw from `finally` would replace the error that actually failed.
      if (!assertionFailed) {
        throw cleanupError;
      }
    }
  }
}

/**
 * Taps `item` in the menu reached through `path`, dismissing the whole chain.
 * `item` must be the only match in its popup, so the tap cannot be ambiguous.
 */
async function tapMenuItem(path: readonly MenuText[], item: MenuText) {
  await openMenu(path, item, 1);
  await element(menuText(item)).tap();

  // Selecting an item dismisses every popup in the chain, not just the one it
  // lives in.
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

    it('opens submenu-1 with its menuTitle as the header', async () => {
      await expectMenu(['Submenu A'], ['Header A', 'Sub A.1', 'Sub A.2']);
    });

    it('falls back to the title for the header of a submenu without menuTitle', async () => {
      await expectMenu(
        ['Submenu B'],
        ['Submenu B', 'Sub B.1', 'Deep'],
        ['Deep'],
      );
    });

    it('opens the submenu nested inside submenu-2', async () => {
      await expectMenu(['Submenu B', 'Deep'], ['Deep', 'Deep.1']);
    });
  });

  describe('click handling — items at all nesting levels', () => {
    it('reports item-top for the top-level item', async () => {
      await tapMenuItem([], 'Top Item');

      await expectLastClicked('item-top');
    });

    it('reports sub-1-1 for the first item of submenu-1', async () => {
      await tapMenuItem(['Submenu A'], 'Sub A.1');

      await expectLastClicked('sub-1-1');
    });

    it('reports sub-1-2 for the second item of submenu-1', async () => {
      await tapMenuItem(['Submenu A'], 'Sub A.2');

      await expectLastClicked('sub-1-2');
    });

    it('reports sub-2-1 for the item of submenu-2', async () => {
      await tapMenuItem(['Submenu B'], 'Sub B.1');

      await expectLastClicked('sub-2-1');
    });

    it('reports deep-1 for the item of the doubly nested submenu', async () => {
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
    });
  });

  describe('imperative command — menuTitle', () => {
    it('replaces the submenu header', async () => {
      await sendCommand({ target: 'submenu-1', menuTitle: 'Header X' });

      await expectMenu(['Title X'], ['Header X', 'Title X', 'Sub A.2']);
    });

    it('falls back to the title once menuTitle is cleared', async () => {
      await sendCommand({ target: 'submenu-1', menuTitle: 'undefined' });

      // Twice: once as the header falling back to the submenu's title, once as
      // the row of sub-1-1, which still carries its commanded title.
      await expectMenu(['Title X'], ['Title X', 'Title X', 'Sub A.2']);
    });

    it('leaves the submenu entry without a title once both are cleared', async () => {
      await sendCommand({ target: 'submenu-1', title: 'undefined' });

      // The untitled submenu is still there, it just has no text to match, so
      // only its absence from the labelled entries is asserted here. That it
      // then opens without any header at all is checked manually
      // (see step 19 of `scenario.md`).
      await expectMenu([], ['Top Item', 'Submenu B'], ['Submenu B']);
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

    it('replaces the submenu header', async () => {
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

      // As in the command case above, only the missing entry is asserted — the
      // headerless submenu itself is checked manually (step 27 of
      // `scenario.md`).
      await expectMenu([], ['Top Item', 'Submenu B'], ['Submenu B']);
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
