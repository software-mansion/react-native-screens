import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  rewindAndScrollUntilVisible,
} from '../../e2e-utils';
import { selectSingleFeatureTestsScreen } from '../../elements/test-screen-navigation';
import { selectPickerOption } from '../../elements/settings-controls';
import {
  closingMenuAfter,
  expectLastClicked as expectLastClickedOn,
  MENU_ANIMATION_TIMEOUT,
  openOverflowMenu,
  textInMenu,
  waitForMenuItem,
  waitForScreen,
} from '../../elements/toolbar-menu-android';

const SCROLLVIEW_ID = 'toolbar-menu-commands-scrollview';
const HEADER_TITLE = 'Toolbar Menu Commands Test';

// Every title this scenario can put into the menu. Assertions check the full
// set — expected titles visible, all others absent — so a leaked entry fails.
const ALL_TITLES = [
  'Title A',
  'Title B',
  'Title C',
  'Changed',
  'Long Title',
] as const;

type MenuTitle = (typeof ALL_TITLES)[number];

// Small steps — a larger one can scroll a short picker row past the viewport.
const SCROLL_STEP = 300;

async function scrollIntoView(id: string) {
  await rewindAndScrollUntilVisible(id, SCROLLVIEW_ID, { pixels: SCROLL_STEP });
}

async function selectOption(
  pickerId: string,
  pickerLabel: string,
  option: string,
) {
  await selectPickerOption(
    { pickerId, label: pickerLabel, option },
    { scrollViewId: SCROLLVIEW_ID, pixels: SCROLL_STEP },
  );
}

type CmdTitle =
  | 'no change'
  | 'Title A'
  | 'Title B'
  | 'Title C'
  | 'Long Title'
  | 'Changed'
  | 'undefined';
type CmdHidden = 'no change' | 'true' | 'false' | 'undefined';

async function sendCommand(options: {
  target: 'item-1' | 'item-2' | 'item-3';
  title: CmdTitle;
  hidden: CmdHidden;
}) {
  await selectOption('cmd-target-picker', 'target id', options.target);
  await selectOption('cmd-title-picker', 'cmd title', options.title);
  await selectOption('cmd-hidden-picker', 'cmd hidden', options.hidden);

  await scrollIntoView('send-command-button');
  await element(by.id('send-command-button')).tap();
}

async function setSlotTitle(slot: number, title: string) {
  await selectOption(`slot-${slot}-title-picker`, `slot ${slot} title`, title);
}

// The switch only toggles, so `include` is the state expected afterwards — a
// swallowed tap fails here instead of as a wrong-menu assertion steps later.
async function setSlotInclude(slot: number, include: boolean) {
  const switchId = `slot-${slot}-include-switch`;
  await scrollIntoView(switchId);
  await element(by.id(switchId)).tap();

  await expect(
    element(by.text(`slot ${slot} include: ${include}`)),
  ).toBeVisible();
}

/** Taps a leaf item and waits for the whole menu to come down. */
async function tapMenuItemAndWaitForClose(title: MenuTitle) {
  await waitForMenuItem(title);
  await element(textInMenu(title)).tap();
  await waitFor(element(textInMenu(title)))
    .not.toExist()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
  await waitForScreen(SCROLLVIEW_ID);
}

// Rows are stacked vertically, so their on-screen positions carry the order the
// menu was built in. Only callable while the menu is open.
async function expectMenuOrder(titles: readonly MenuTitle[]): Promise<void> {
  const rows: { title: MenuTitle; top: number }[] = [];

  for (const title of titles) {
    const attributes = await element(textInMenu(title)).getAttributes();

    if ('elements' in attributes) {
      throw new Error(`Expected a single menu row titled "${title}".`);
    }

    rows.push({ title, top: attributes.frame.y });
  }

  const topToBottom = [...rows].sort((a, b) => a.top - b.top).map(r => r.title);
  jestExpect(topToBottom).toEqual([...titles]);
}

// Asserts the exact menu contents, then closes it. `expectedVisible` is a
// non-empty subset of ALL_TITLES — a title outside that set would go unasserted,
// and the first entry gates the open animation. With `checkOrder`, the entries
// must also appear top to bottom in the order given.
async function expectMenuItems(
  expectedVisible: [MenuTitle, ...MenuTitle[]],
  { checkOrder = false }: { checkOrder?: boolean } = {},
): Promise<void> {
  await openOverflowMenu();

  // Closed by `closingMenuAfter` even when an assertion fails: this suite is
  // stateful and a leaked popup would take every later step down with it.
  await closingMenuAfter(SCROLLVIEW_ID, async () => {
    // Populated in a single layout pass, so once the first expected entry is up
    // the `not.toExist()` checks below cannot pass prematurely.
    await waitForMenuItem(expectedVisible[0]);

    for (const title of expectedVisible) {
      await expect(element(textInMenu(title))).toBeVisible();
    }

    if (checkOrder) {
      await expectMenuOrder(expectedVisible);
    }

    for (const title of ALL_TITLES) {
      if (!expectedVisible.includes(title)) {
        await expect(element(textInMenu(title))).not.toExist();
      }
    }
  });
}

async function expectLastClicked(id: string) {
  await expectLastClickedOn(id, SCROLLVIEW_ID, { pixels: SCROLL_STEP });
}

describeIfAndroid('Stack Toolbar Menu Commands', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-commands-android',
    );
  });

  describe('baseline — initial render from props', () => {
    it('renders the header title and the three prop-configured menu items in order', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();
      await expectMenuItems(['Title A', 'Title B', 'Title C'], {
        checkOrder: true,
      });
    });

    it('closes the menu and reports item-1 when tapping "Title A"', async () => {
      await openOverflowMenu();
      await tapMenuItemAndWaitForClose('Title A');

      await expect(element(by.text('Title B'))).not.toExist();
      await expect(element(by.text('Title C'))).not.toExist();
      await expectLastClicked('item-1');
    });

    it('reports item-3 when tapping "Title C"', async () => {
      await openOverflowMenu();
      await tapMenuItemAndWaitForClose('Title C');

      await expect(element(by.text('Title A'))).not.toExist();
      await expectLastClicked('item-3');
    });
  });

  describe('imperative command — "no change" is a no-op', () => {
    it('leaves the menu untouched when every field is "no change"', async () => {
      await sendCommand({
        target: 'item-1',
        title: 'no change',
        hidden: 'no change',
      });

      await expectMenuItems(['Title A', 'Title B', 'Title C']);
      await expectLastClicked('item-3');
    });
  });

  describe('imperative command — change title only', () => {
    it('retitles item-2 to "Changed" and leaves items 1 and 3 alone', async () => {
      await sendCommand({
        target: 'item-2',
        title: 'Changed',
        hidden: 'no change',
      });

      await expectMenuItems(['Title A', 'Changed', 'Title C']);
    });

    it('keeps the id stable across a title change — "Changed" still reports item-2', async () => {
      await openOverflowMenu();
      await tapMenuItemAndWaitForClose('Changed');

      await expect(element(by.text('Title A'))).not.toExist();
      await expectLastClicked('item-2');
    });
  });

  describe('imperative command — change hidden only', () => {
    it('hides item-2 when hidden = true', async () => {
      await sendCommand({
        target: 'item-2',
        title: 'no change',
        hidden: 'true',
      });

      await expectMenuItems(['Title A', 'Title C']);
    });

    it('restores item-2 with its command-applied title when hidden = false', async () => {
      await sendCommand({
        target: 'item-2',
        title: 'no change',
        hidden: 'false',
      });
      await expectMenuItems(['Title A', 'Changed', 'Title C']);
    });
  });

  describe('imperative command — reset hidden to its regular default', () => {
    it('hides item-1 when hidden = true', async () => {
      await sendCommand({
        target: 'item-1',
        title: 'no change',
        hidden: 'true',
      });

      await expectMenuItems(['Changed', 'Title C']);
    });

    it('clears the hidden override and falls back to the default when hidden = undefined', async () => {
      await sendCommand({
        target: 'item-1',
        title: 'no change',
        hidden: 'undefined',
      });

      await expectMenuItems(['Title A', 'Changed', 'Title C']);
    });
  });

  describe('props update — replaces command state across ALL items', () => {
    it('retitles item-1 to "Long Title" while item-2 keeps "Changed"', async () => {
      await sendCommand({
        target: 'item-1',
        title: 'Long Title',
        hidden: 'no change',
      });

      await expectMenuItems(['Long Title', 'Changed', 'Title C']);
    });

    it('drops every command override once a single slot prop changes', async () => {
      await setSlotTitle(3, 'Long Title');
      await expectMenuItems(['Title A', 'Title B', 'Long Title']);
    });

    it('reverts slot 3 to "Title C" while items 1 and 2 stay props-configured', async () => {
      await setSlotTitle(3, 'Title C');

      await expectMenuItems(['Title A', 'Title B', 'Title C']);
    });
  });

  describe('excluded / unknown id — safe targeting', () => {
    it('removes item-3 from the menu when slot 3 include = false', async () => {
      await setSlotInclude(3, false);

      await expectMenuItems(['Title A', 'Title B']);
    });

    it('does not crash or leak when commanding an id that is not in the menu', async () => {
      await sendCommand({
        target: 'item-3',
        title: 'Changed',
        hidden: 'false',
      });

      await expectMenuItems(['Title A', 'Title B']);
    });

    it('re-includes slot 3 with its props title, not the command title', async () => {
      await setSlotInclude(3, true);
      await expectMenuItems(['Title A', 'Title B', 'Title C']);
    });
  });
});
