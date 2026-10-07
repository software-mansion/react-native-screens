import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { pickerOptionId } from '@e2e/app/settings-controls';
import {
  selectComponentIntegrationTestsScreen,
  STACK_TABS_SCENARIO_GROUP,
} from '@e2e/app/test-screen-navigation';
import { tapBarBackButton } from '@e2e/framework/back-button';
import { tapTopmostButton } from '@e2e/framework/gestures';
import { getSingleMatch } from '@e2e/framework/matchers';
import { CLASS_NAME_ANDROID_REACT_SCROLL_VIEW } from '@e2e/framework/native-classes-android';
import { describeIfAndroid } from '@e2e/framework/platform';
import {
  stackV5AppBar,
  stackV5BackButton,
  stackV5CollapsingHeaderTitle,
  stackV5CollapsingToolbar,
  stackV5HeaderTitle,
  stackV5Toolbar,
} from '@e2e/framework/stack-header-android';
import {
  selectTabByTitleAndroid,
  TAB_SWITCH_TIMEOUT_MS,
  tabBarItemAndroid,
} from '@e2e/framework/tab-bar';
import {
  createOverflowMenuHelpers,
  expectCheckBox,
  OVERFLOW_MENU_LABEL,
} from '@e2e/framework/toolbar-menu-android';
import { DEFAULT_TIMEOUT_MS, waitUntil } from '@e2e/framework/wait';

/** Stack in Tabs: header persistence (Android). All of `scenario.md` except
 * the drawn subtitle and the no-flash check; no test IDs, driven as shown. */

const SCENARIO_KEY = 'test-stack-tabs-stack-in-tabs-header-persistence';

const STACK_TAB = 'Stack';
const OTHER_TAB = 'Other';

const DETAILS_TITLE = 'Details';

// React Native's core `<Button>` uppercases its `title` on Android.
const PUSH_DETAILS = 'PUSH DETAILS';
const CHANGE_TITLE = 'CHANGE HOME TITLE (V1 → V2)';

const OTHER_TAB_HEADING = 'Header rebuild triggers';

/** `SettingsPicker` label prop; option `testID`s are derived from it. */
const TYPE_PICKER_LABEL = 'type';
/** `SettingsSwitch` label prop; its state renders as `hidden: <bool>`. */
const HIDDEN_SWITCH_LABEL = 'hidden';

const FILTER_A = 'Filter A';
const FILTER_B = 'Filter B';

const lastMenuSelectionText = (selection: string) =>
  `Last menu selection: ${selection}`;

/** Polled: Espresso's idle sync does not cover a header rebuild re-asserting
 * the collapsed state. */
const HEADER_SETTLE_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;

/** Enough to fully collapse a large header (152dp) and then some. */
const ONE_SCREEN_DP = 600;

/** Swipe starts, as fractions of the scroll view's height. Low starts land on
 * the tab bar (the view runs under it); high ones must clear the header. */
const DOWNWARD_SCROLL_START = 0.6;
const UPWARD_SCROLL_START = 0.35;

/** The Home screen's scroll view. A factory: `atIndex` mutates on Android. */
const homeScrollView = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_REACT_SCROLL_VIEW);

const overflowButton = () => by.label(OVERFLOW_MENU_LABEL);

const { withOverflowMenu, tapMenuItem } = createOverflowMenuHelpers({
  screenMatcher: homeScrollView,
});

// --- Header geometry ---

type HeaderGeometry = {
  /** Top edge of the app bar; drops below zero as the app bar collapses. */
  appBarTop: number;
  /** Bottom edge of the app bar — where the content starts. */
  appBarBottom: number;
  /** Bottom edge of the pinned toolbar row. */
  toolbarBottom: number;
};

async function readHeaderGeometry(): Promise<HeaderGeometry> {
  const { frame: appBar } = await getSingleMatch(
    stackV5AppBar(),
    'the Stack v5 app bar',
  );
  const { frame: toolbar } = await getSingleMatch(
    stackV5Toolbar(),
    'the Stack v5 toolbar',
  );
  return {
    appBarTop: appBar.y,
    appBarBottom: appBar.y + appBar.height,
    toolbarBottom: toolbar.y + toolbar.height,
  };
}

/** Polls the header geometry until `predicate` holds; a header mid-rebuild
 * can briefly resolve to two app bars, which is retried as transient. */
async function waitForHeaderGeometry(
  predicate: (geometry: HeaderGeometry) => boolean,
  expectation: string,
): Promise<HeaderGeometry> {
  let observed: HeaderGeometry | undefined;
  let lastError: unknown;

  await waitUntil(
    async () => {
      try {
        observed = await readHeaderGeometry();
      } catch (error) {
        lastError = error;
        return false;
      }
      return predicate(observed);
    },
    {
      timeout: HEADER_SETTLE_TIMEOUT_MS,
      message: () =>
        `${expectation}; last observed: ${
          observed ? JSON.stringify(observed) : String(lastError)
        }`,
    },
  );

  return observed!;
}

/** App bar top of a fully expanded header, from the fresh screen. Only the
 * behavior offset moves the app bar, so this top means zero offset. */
let expandedAppBarTop = Number.NaN;

const expectHeaderFullyExpanded = () =>
  waitForHeaderGeometry(
    ({ appBarTop }) => appBarTop === expandedAppBarTop,
    `expected the header to be fully expanded (app bar top ${expandedAppBarTop})`,
  );

const expectHeaderFullyCollapsed = () =>
  waitForHeaderGeometry(
    ({ appBarBottom, toolbarBottom }) => appBarBottom === toolbarBottom,
    'expected the header to be fully collapsed (app bar bottom at the toolbar bottom)',
  );

/** The expanded header's height, for comparing header types. */
async function readExpandedHeaderHeight(): Promise<number> {
  const { appBarTop, appBarBottom } = await expectHeaderFullyExpanded();
  return appBarBottom - appBarTop;
}

// --- Scrolling ---

async function scrollDownOneScreen() {
  await element(homeScrollView()).scroll(
    ONE_SCREEN_DP,
    'down',
    Number.NaN,
    DOWNWARD_SCROLL_START,
  );
}

/** `scrollTo('top')` can leave the app bar collapsed over an unscrolled view;
 * a swipe on a top row (the scroll view fails Detox visibility) expands it. */
async function scrollBackToTop() {
  await element(homeScrollView()).scrollTo(
    'top',
    Number.NaN,
    UPWARD_SCROLL_START,
  );
  await element(by.text(PUSH_DETAILS)).swipe('down', 'slow', 0.5);
}

// --- Tabs ---

async function switchToOtherTab() {
  await selectTabByTitleAndroid(OTHER_TAB);
  await waitFor(element(by.text(OTHER_TAB_HEADING)))
    .toBeVisible()
    .withTimeout(TAB_SWITCH_TIMEOUT_MS);
}

/** Waits for the Stack tab's content, which is up whatever the header state.
 * Not for a round trip with Details pushed. */
async function switchToStackTab() {
  await selectTabByTitleAndroid(STACK_TAB);
  await waitFor(element(homeScrollView()))
    .toBeVisible()
    .withTimeout(TAB_SWITCH_TIMEOUT_MS);
}

/** A round trip through the Other tab, optionally acting there. */
async function roundTripThroughOtherTab(whileAway?: () => Promise<void>) {
  await switchToOtherTab();
  await whileAway?.();
  await switchToStackTab();
}

// --- Other tab controls ---

/** Opens the picker, taps `option`, closes it again (an open picker's rows
 * would collide with later `by.text` matchers). */
async function setHeaderType(from: string, to: string) {
  await element(by.text(`${TYPE_PICKER_LABEL}: ${from}`)).tap();
  await element(by.id(pickerOptionId(TYPE_PICKER_LABEL, to))).tap();
  await element(by.text(`${TYPE_PICKER_LABEL}: ${to}`)).tap();
  await expect(
    element(by.id(pickerOptionId(TYPE_PICKER_LABEL, to))),
  ).not.toExist();
}

async function setHeaderHidden(to: boolean) {
  await element(by.text(`${HIDDEN_SWITCH_LABEL}: ${!to}`)).tap();
  await waitFor(element(by.text(`${HIDDEN_SWITCH_LABEL}: ${to}`)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
}

// --- Header presence ---

/** Asserts the Home header with `title`. The title host is mostly off-screen
 * when collapsed, so it is asserted by existence, visibility on the toolbar. */
async function expectHomeHeader(title: string) {
  await waitFor(element(stackV5CollapsingHeaderTitle(title)))
    .toExist()
    .withTimeout(DEFAULT_TIMEOUT_MS);
  await expect(element(stackV5Toolbar())).toBeVisible();
  await expect(element(overflowButton())).toBeVisible();
}

/** Asserts the `Last menu selection` readout by existence: the row is scrolled
 * away by the collapse steps, and `by.text` matches the whole string. */
async function expectLastMenuSelection(selection: string) {
  await expect(element(by.text(lastMenuSelectionText(selection)))).toExist();
}

/** Asserts the "Push Details" row is scrolled out of view. Existence first:
 * on Android a negated matcher also passes on a missing view. */
async function expectPushDetailsScrolledAway() {
  await expect(element(by.text(PUSH_DETAILS))).toExist();
  await expect(element(by.text(PUSH_DETAILS))).not.toBeVisible();
}

/** Screen position of the "Push Details" row, on or off screen. */
async function readPushDetailsTop(): Promise<number> {
  return (await getSingleMatch(by.text(PUSH_DETAILS), 'the Push Details row'))
    .frame.y;
}

/** A hidden header is removed from the hierarchy. The content is asserted
 * first, or a screen that never rendered would pass too. */
async function expectNoHomeHeader() {
  await expect(element(homeScrollView())).toBeVisible();
  await expect(element(stackV5AppBar())).not.toExist();
  await expect(element(stackV5CollapsingToolbar())).not.toExist();
  await expect(element(overflowButton())).not.toExist();
}

describeIfAndroid(
  'Stack in Tabs: header persistence across tab switches',
  () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectComponentIntegrationTestsScreen(
        STACK_TABS_SCENARIO_GROUP,
        SCENARIO_KEY,
      );
    });

    // Expanded heights per header type, captured as the suite progresses.
    let mediumHeaderHeight = Number.NaN;
    let largeHeaderHeight = Number.NaN;

    // The status bar inset: the expanded header offsets its toolbar by it.
    let statusBarInset = Number.NaN;

    describe('baseline', () => {
      it('should show the Stack tab with a collapsing "Home v1" header and an overflow button', async () => {
        await waitFor(element(homeScrollView()))
          .toBeVisible()
          .withTimeout(TAB_SWITCH_TIMEOUT_MS);
        for (const tab of [STACK_TAB, OTHER_TAB]) {
          await expect(element(tabBarItemAndroid(tab))).toBeVisible();
        }
        await expectHomeHeader('Home v1');

        // A fresh header is expanded by construction: this is the reference the
        // expanded-state assertions compare against from here on.
        const { appBarTop, appBarBottom, toolbarBottom } =
          await readHeaderGeometry();
        jestExpect(appBarBottom).toBeGreaterThan(toolbarBottom);
        expandedAppBarTop = appBarTop;
        mediumHeaderHeight = appBarBottom - appBarTop;
        statusBarInset = (
          await getSingleMatch(stackV5Toolbar(), 'the Stack v5 toolbar')
        ).frame.y;
        jestExpect(statusBarInset).toBeGreaterThan(0);
      });

      it('should collapse the header on the way down and expand it back at the top', async () => {
        await scrollDownOneScreen();
        await expectHeaderFullyCollapsed();

        await scrollBackToTop();
        await expectHeaderFullyExpanded();
      });
    });

    describe('header survives a tab round trip', () => {
      it('should keep the header, its title and the overflow button', async () => {
        await roundTripThroughOtherTab();
        await expectHomeHeader('Home v1');
      });

      it('should still collapse and expand with the scroll', async () => {
        await scrollDownOneScreen();
        await expectHeaderFullyCollapsed();

        await scrollBackToTop();
        await expectHeaderFullyExpanded();
      });

      it('should keep the header across 3 more round trips', async () => {
        for (let i = 0; i < 3; i++) {
          await roundTripThroughOtherTab();
          await expectHomeHeader('Home v1');
          await expectHeaderFullyExpanded();
        }
      });
    });

    describe('collapse state survives a tab round trip', () => {
      it('should leave only the toolbar row once fully collapsed', async () => {
        await scrollDownOneScreen();
        await expectHeaderFullyCollapsed();
      });

      it('should come back still fully collapsed', async () => {
        await roundTripThroughOtherTab();
        await expectHomeHeader('Home v1');
        await expectHeaderFullyCollapsed();
      });
    });

    describe('menu selection survives a tab round trip', () => {
      it('should open with Filter A checked and Filter B unchecked', async () => {
        await withOverflowMenu(async () => {
          await expectCheckBox(FILTER_A, true);
          await expectCheckBox(FILTER_B, false);
        });
      });

      it('should report both filters selected after tapping Filter B', async () => {
        await withOverflowMenu(async () => {
          await tapMenuItem(FILTER_B);
        });
        await expectLastMenuSelection('["filterA","filterB"]');
      });

      it('should keep both filters checked and the readout across a round trip', async () => {
        await roundTripThroughOtherTab();
        await withOverflowMenu(async () => {
          await expectCheckBox(FILTER_A, true);
          await expectCheckBox(FILTER_B, true);
        });
        await expectLastMenuSelection('["filterA","filterB"]');
      });
    });

    describe('configuration changed while the tab is away', () => {
      it('should apply a title change and stay collapsed', async () => {
        await scrollDownOneScreen();
        await expectHeaderFullyCollapsed();

        await roundTripThroughOtherTab(() => tapTopmostButton(CHANGE_TITLE));

        await expectHomeHeader('Home v2');
        await expectHeaderFullyCollapsed();
      });

      it('should stay collapsed after a rebuild to the large type', async () => {
        await roundTripThroughOtherTab(() => setHeaderType('medium', 'large'));

        await expectHomeHeader('Home v2');
        await expectHeaderFullyCollapsed();
      });

      it('should expand to a large header, taller than the medium one', async () => {
        await scrollBackToTop();
        largeHeaderHeight = await readExpandedHeaderHeight();
        jestExpect(largeHeaderHeight).toBeGreaterThan(mediumHeaderHeight);
      });

      it('should drop the header while hidden, with the content below the status bar', async () => {
        const { frame: contentWithHeader } = await getSingleMatch(
          homeScrollView(),
          'the Home scroll view',
        );

        await roundTripThroughOtherTab(() => setHeaderHidden(true));

        await expectNoHomeHeader();
        const { frame: content } = await getSingleMatch(
          homeScrollView(),
          'the Home scroll view',
        );
        jestExpect(content.y).toBeGreaterThanOrEqual(statusBarInset);
        jestExpect(content.y).toBeLessThan(contentWithHeader.y);
      });

      it('should bring the header back expanded once shown again', async () => {
        await roundTripThroughOtherTab(() => setHeaderHidden(false));

        await expectHomeHeader('Home v2');
        await expectHeaderFullyExpanded();
      });

      it('should collapse and expand with the scroll again', async () => {
        await scrollDownOneScreen();
        await expectHeaderFullyCollapsed();

        await scrollBackToTop();
        await expectHeaderFullyExpanded();
      });

      // Where the scrolled-away row sits under the collapsed header, so the
      // re-shown header can be proven not to have moved the content.
      let scrolledPushDetailsTop = Number.NaN;

      it('should drop the header while hidden with the content scrolled', async () => {
        await scrollDownOneScreen();
        await expectHeaderFullyCollapsed();
        await expectPushDetailsScrolledAway();
        scrolledPushDetailsTop = await readPushDetailsTop();

        await roundTripThroughOtherTab(() => setHeaderHidden(true));

        await expectNoHomeHeader();
        await expectPushDetailsScrolledAway();
      });

      it('should bring the header back fully collapsed without moving the content', async () => {
        await roundTripThroughOtherTab(() => setHeaderHidden(false));

        await expectHomeHeader('Home v2');
        await expectHeaderFullyCollapsed();
        await expectPushDetailsScrolledAway();
        jestExpect(await readPushDetailsTop()).toBe(scrolledPushDetailsTop);
      });

      it('should rebuild as a medium header, shorter than the large one', async () => {
        await scrollBackToTop();
        await expectHeaderFullyExpanded();

        await roundTripThroughOtherTab(() => setHeaderType('large', 'medium'));

        await expectHomeHeader('Home v2');
        const height = await readExpandedHeaderHeight();
        jestExpect(height).toBeLessThan(largeHeaderHeight);
        jestExpect(height).toBe(mediumHeaderHeight);
      });
    });

    describe('pushed screen', () => {
      it('should keep the Details header and its back button across a round trip', async () => {
        await tapTopmostButton(PUSH_DETAILS);
        await waitFor(element(stackV5HeaderTitle(DETAILS_TITLE)))
          .toBeVisible()
          .withTimeout(DEFAULT_TIMEOUT_MS);

        await switchToOtherTab();
        await selectTabByTitleAndroid(STACK_TAB);

        await waitFor(element(stackV5HeaderTitle(DETAILS_TITLE)))
          .toBeVisible()
          .withTimeout(TAB_SWITCH_TIMEOUT_MS);
        await expect(element(stackV5BackButton())).toBeVisible();
      });

      it('should pop Details back to Home titled "Home v2"', async () => {
        await tapBarBackButton();

        await waitFor(element(stackV5HeaderTitle(DETAILS_TITLE)))
          .not.toExist()
          .withTimeout(DEFAULT_TIMEOUT_MS);
        await expect(element(homeScrollView())).toBeVisible();
        await expectHomeHeader('Home v2');
      });
    });
  },
);
