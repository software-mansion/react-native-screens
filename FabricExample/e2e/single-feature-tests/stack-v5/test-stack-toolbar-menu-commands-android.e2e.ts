import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import { CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW } from '../../native-class-names';

const SCROLLVIEW_ID = 'toolbar-menu-commands-scrollview';
const HEADER_TITLE = 'Toolbar Menu Commands Test';

/**
 * Budget for the overflow popup's open / dismiss animation. Detox's idle sync
 * does not cover popup window animations, so every assertion that straddles one
 * has to wait it out explicitly instead of asserting on the spot.
 */
const MENU_ANIMATION_TIMEOUT = 2000;

/**
 * Every title this scenario can ever put into the toolbar menu. Each assertion
 * checks the full set — the expected titles must be visible and every other one
 * must not exist — so a stale/leaked menu entry fails the test instead of
 * slipping through an "only check what I expect" assertion.
 */
const ALL_TITLES = [
  'Title A',
  'Title B',
  'Title C',
  'Changed',
  'Long Title',
] as const;

type MenuTitle = (typeof ALL_TITLES)[number];

/**
 * Mirrors the option `testID` that `SettingsPicker` derives from its `label`.
 * @see apps/src/shared/SettingsPicker.tsx
 */
function optionId(pickerLabel: string, option: string): string {
  return `${pickerLabel.split(' ').join('-')}-${option}`.toLowerCase();
}

/**
 * Rewinds to the top before scrolling down, so a target that sits *above* the
 * current offset is still reachable (`whileElement` only scrolls one way).
 */
async function scrollIntoView(id: string) {
  await element(by.id(SCROLLVIEW_ID)).scrollTo('top');
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(SCROLLVIEW_ID))
    .scroll(300, 'down', Number.NaN, 0.85);
}

/**
 * Opens the picker, taps an option, closes it again. Closing matters: an open
 * picker leaves its option rows in the hierarchy, where they would collide with
 * the `by.text` matchers used for the toolbar menu items.
 */
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

/**
 * Flips a slot's `include` switch and verifies the resulting state. The switch
 * only toggles, so `include` is what the caller expects to see afterwards — a
 * swallowed tap fails here instead of surfacing as a confusing wrong-menu
 * assertion several steps later.
 */
async function setSlotInclude(slot: number, include: boolean) {
  const switchId = `slot-${slot}-include-switch`;
  await scrollIntoView(switchId);
  await element(by.id(switchId)).tap();

  await expect(
    element(by.text(`slot ${slot} include: ${include}`)),
  ).toBeVisible();
}

/**
 * Taps the overflow button. The popup animates in, so the caller must wait for
 * an entry it expects before asserting anything.
 */
async function openMenu() {
  await element(by.label('More options')).tap();
}

/** Waits out the popup's open animation by gating on an entry it must contain. */
async function waitForMenuItem(title: MenuTitle) {
  await waitFor(
    element(
      by
        .text(title)
        .withAncestor(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)),
    ),
  )
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

/**
 * Waits until the popup window is gone and the screen behind it is addressable
 * again. Espresso resolves matchers against a single window — while the popup
 * holds focus, nothing in the screen below it is in the searched hierarchy, so
 * the menu entry disappearing is not enough: the next action against the screen
 * would fail with "No views in hierarchy found". Gating on the scroll view
 * retries until the root switches back.
 */
async function waitForScreen() {
  await waitFor(element(by.id(SCROLLVIEW_ID)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

/** Taps a menu entry and waits for the popup to finish dismissing. */
async function tapMenuItem(title: MenuTitle) {
  await waitForMenuItem(title);
  await element(
    by
      .text(title)
      .withAncestor(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)),
  ).tap();
  await waitFor(
    element(
      by
        .text(title)
        .withAncestor(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)),
    ),
  )
    .not.toExist()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
  await waitForScreen();
}

/**
 * Asserts the exact contents of the overflow menu, then closes it. Every
 * expected title is checked for visibility and every other known title for
 * absence, so neither a missing entry nor a leaked one can slip through.
 *
 * `expectedVisible` is a non-empty list of `ALL_TITLES` members: a title
 * outside that set would otherwise go unasserted, and the first entry gates the
 * open animation.
 */
async function expectMenuItems(
  expectedVisible: [MenuTitle, ...MenuTitle[]],
): Promise<void> {
  await openMenu();

  try {
    // The menu is populated in a single layout pass, so once the first expected
    // entry is up the `not.toExist()` checks below cannot pass prematurely.
    await waitForMenuItem(expectedVisible[0]);

    for (const title of expectedVisible) {
      await expect(
        element(
          by
            .text(title)
            .withAncestor(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW)),
        ),
      ).toBeVisible();
    }

    for (const title of ALL_TITLES) {
      if (!expectedVisible.includes(title)) {
        await expect(
          element(
            by
              .text(title)
              .withAncestor(
                by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW),
              ),
          ),
        ).not.toExist();
      }
    }
  } finally {
    // Closed in `finally` so a failed assertion — including the gate above —
    // does not leave the popup covering the screen. This suite is stateful, so
    // every later step would otherwise fail on an unrelated error.
    await device.pressBack();
    await waitForScreen();
  }
}

async function expectLastClicked(id: string) {
  await scrollIntoView('last-clicked-text');
  await expect(element(by.id('last-clicked-text'))).toHaveText(
    `Last clicked: ${id}`,
  );
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
    it('renders the header title and the three prop-configured menu items', async () => {
      await expect(element(by.text(HEADER_TITLE))).toBeVisible();
      await expectMenuItems(['Title A', 'Title B', 'Title C']);
    });

    it('closes the menu and reports item-1 when tapping "Title A"', async () => {
      await openMenu();
      await tapMenuItem('Title A');

      await expect(element(by.text('Title B'))).not.toExist();
      await expect(element(by.text('Title C'))).not.toExist();
      await expectLastClicked('item-1');
    });

    it('reports item-3 when tapping "Title C"', async () => {
      await openMenu();
      await tapMenuItem('Title C');

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
      await openMenu();
      await tapMenuItem('Changed');

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
