import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { AndroidElementAttributes } from 'detox/detox';
import {
  countMatches,
  describeIfAndroid,
  getFrame,
  getSingleMatch,
  scrollUntilVisible,
  selectSingleFeatureTestsScreen,
  stackV5AppBar,
  stackV5Toolbar,
  waitUntil,
} from '../../e2e-utils';
import type { TriState } from '@apps/tests/single-feature-tests/stack-v5/test-stack-lift-on-scroll-android';

/**
 * Covers the assertable half of `scenario.md`: that the app bar is attached and
 * detached as `hidden` / `headerConfig enabled` are toggled, that the `small`
 * header stays pinned while the content scrolls, that a transparent header
 * overlays the content, and that the app bar's *lifted state* follows the scroll
 * position.
 *
 * The lifted state is read through the app bar's `elevation`, which Material's
 * app bar state list animator drives off `state_lifted` — the same state that
 * paints the tonal `liftOnScrollColor`. So this asserts *that* the app bar lifts
 * and unlifts, never how it looks: the tonal/color shift itself, and any
 * flicker or header rebuild flash while it animates, stay manual-only (see
 * `scenario.md`).
 */

const SCROLL_VIEW = 'lift-on-scroll-scrollview';
const BOTTOM_MARKER = 'lift-on-scroll-bottom-marker';
const TOP_HEADING = 'Header config';
const HEADER_TITLE = 'Lift on scroll';
const LIFT_PICKER = 'liftonscroll-picker';

// Espresso's idle sync does not cover the app bar's elevation animation, so the
// lifted state has to be polled rather than read once.
const LIFT_TIMEOUT_MS = 3000;

const appBarAttributes = () =>
  getSingleMatch(
    stackV5AppBar(),
    'the Stack v5 app bar',
  ) as Promise<AndroidElementAttributes>;

const contentFrame = () => getFrame(by.id(SCROLL_VIEW), SCROLL_VIEW);

async function appBarElevation(): Promise<number> {
  return (await appBarAttributes()).elevation;
}

async function waitForAppBarElevation(
  predicate: (elevation: number) => boolean,
  expectation: string,
) {
  let observed = Number.NaN;

  await waitUntil(
    async () => {
      observed = await appBarElevation();
      return predicate(observed);
    },
    {
      timeout: LIFT_TIMEOUT_MS,
      message: () => `${expectation}, last observed elevation: ${observed}`,
    },
  );
}

const expectAppBarLifted = () =>
  waitForAppBarElevation(
    elevation => elevation > 0,
    'expected the app bar to be lifted (elevation > 0)',
  );

const expectAppBarFlat = () =>
  waitForAppBarElevation(
    elevation => elevation === 0,
    'expected the app bar to be flat (elevation === 0)',
  );

const expectAtTop = () =>
  waitFor(element(by.text(TOP_HEADING)))
    .toBeVisible()
    .withTimeout(3000);

/**
 * Detox starts an upward scroll at the scroll view's *top edge*. A transparent
 * header sits on top of the content there and swallows the touch, so the gesture
 * moves nothing and `scrollTo('top')` hangs waiting for an edge it never reaches.
 * Both helpers below anchor the gesture clear of the header instead, which keeps
 * them working in every header mode.
 */
const ANCHOR_FOR_UPWARD_SCROLL = 0.35;
const ANCHOR_FOR_DOWNWARD_SCROLL = 0.85;

/**
 * Enough to take the scroll position off zero, which is all the lifted state
 * depends on — it does not care how far the content travelled.
 */
const STEP_DP = 500;

/** More than the content is long, so one call covers any distance travelled. */
const LONG_WAY_DP = 20000;

async function scrollAwayFromTop() {
  await element(by.id(SCROLL_VIEW)).scroll(
    STEP_DP,
    'down',
    Number.NaN,
    ANCHOR_FOR_DOWNWARD_SCROLL,
  );
  await waitFor(element(by.text(TOP_HEADING)))
    .not.toBeVisible()
    .withTimeout(3000);
}

/**
 * Scrolls back up until the top of the content is on screen. Works in every
 * header mode, but makes no promise about the final offset: Detox's edge probe
 * can end the gesture early, and the heading comes back into view well before
 * offset zero. Anything that goes on to assert the app bar is *flat* must use
 * `scrollToTopEdge` instead — unlifting happens at offset zero exactly.
 */
async function scrollBackToTop() {
  await element(by.id(SCROLL_VIEW)).scroll(
    LONG_WAY_DP,
    'up',
    Number.NaN,
    ANCHOR_FOR_UPWARD_SCROLL,
  );
  await expectAtTop();
}

/**
 * Lands on offset zero, deterministically: Detox repeats the scroll until the
 * view reports it cannot move further. Unusable while the header is transparent,
 * which is exactly the hang described above — so this is for opaque or absent
 * headers only.
 */
async function scrollToTopEdge() {
  await element(by.id(SCROLL_VIEW)).scrollTo('top');
  await expectAtTop();
}

/**
 * Scrolls to the very end of the content and back, proving all of it stays
 * reachable. Heavier than a bounded step, so it is reserved for the cases that
 * are about scrollability itself rather than about the lifted state.
 */
async function scrollThroughAllContentAndBack() {
  await scrollUntilVisible(BOTTOM_MARKER, SCROLL_VIEW);
  await scrollToTopEdge();
}

// `SettingsSwitch` puts its testID on the touchable and renders
// `<label>: <value>` in a child `Text`, so its state is only observable through
// that text.
type Switch = { testID: string; label: string };

const ENABLED: Switch = {
  testID: 'header-config-enabled-switch',
  label: 'headerConfig enabled (attach/detach)',
};
const TRANSPARENT: Switch = {
  testID: 'transparent-switch',
  label: 'transparent',
};
const HIDDEN: Switch = { testID: 'hidden-switch', label: 'hidden' };

// Controls live inside the scrolled content, so scroll back up before reaching
// for one. The label assertion doubles as the wait for the re-render to land.
async function toggleSwitch({ testID, label }: Switch, expected: boolean) {
  await scrollBackToTop();
  await element(by.id(testID)).tap();
  await waitFor(element(by.text(`${label}: ${expected}`)))
    .toBeVisible()
    .withTimeout(3000);
}

// Option ids are `SettingsPicker`'s own `<label>-<item>`, lowercased. The second
// tap on the picker closes it again, so its options do not push the switches
// below it off-screen.
async function selectLiftOnScroll(value: TriState) {
  await scrollBackToTop();
  await element(by.id(LIFT_PICKER)).tap();
  await element(by.id(`liftonscroll-${value}`)).tap();
  await element(by.id(LIFT_PICKER)).tap();
  await expect(element(by.id(LIFT_PICKER))).toHaveText(
    `liftOnScroll: ${value}`,
  );
}

async function expectHeaderAttached() {
  await waitFor(element(stackV5Toolbar())).toBeVisible().withTimeout(3000);
  await expect(element(by.text(HEADER_TITLE))).toBeVisible();
  jestExpect(await countMatches(stackV5AppBar())).toBe(1);
}

// A hidden or detached header is removed from the hierarchy, so its absence is
// "does not exist". The content is asserted first, otherwise a screen that never
// rendered would pass too.
async function expectHeaderDetached() {
  await waitFor(element(by.id(SCROLL_VIEW)))
    .toBeVisible()
    .withTimeout(3000);
  await expect(element(stackV5AppBar())).not.toExist();
  await expect(element(stackV5Toolbar())).not.toExist();
  // Implied by the toolbar being gone — the title is one of its children — but
  // asserted anyway: it is the part a reader of `scenario.md` actually checks
  // ("there is no header"), and it keeps holding if the title ever stops being
  // parented by the toolbar. Safe against the outer navigator's own header,
  // whose title is the scenario name, and `by.text` matches exactly.
  await expect(element(by.text(HEADER_TITLE))).not.toExist();
}

/**
 * Whether the content starts above the app bar's bottom edge — i.e. whether the
 * header overlays it. This is what `transparent` flips: it drops the app bar's
 * scrolling content behavior, so the content is no longer offset below it.
 */
async function isContentUnderHeader(): Promise<boolean> {
  const { frame } = await appBarAttributes();
  return (await contentFrame()).y < frame.y + frame.height;
}

/**
 * Asserts the full lift cycle for a configuration where lift is expected:
 * flat at the top, lifted once scrolled away, flat again on return.
 */
async function expectLiftFollowsScroll() {
  await scrollToTopEdge();
  await expectAppBarFlat();
  await scrollAwayFromTop();
  await expectAppBarLifted();
  // Has to be the edge jump: unlifting needs offset zero exactly. That makes
  // this usable only with an opaque header — every caller has one.
  await scrollToTopEdge();
  await expectAppBarFlat();
}

/**
 * Asserts the lifted state is scroll-independent. Note this cannot assert a
 * *value*: an app bar that is not liftable at all rests at the animator's
 * "enabled" elevation, not at zero — only its invariance under scrolling is the
 * claim being made.
 */
async function expectLiftUnaffectedByScroll() {
  const elevationAtTop = await appBarElevation();

  await scrollAwayFromTop();
  jestExpect(await appBarElevation()).toBe(elevationAtTop);

  await scrollBackToTop();
  jestExpect(await appBarElevation()).toBe(elevationAtTop);
}

describeIfAndroid('Stack v5: header lift on scroll (Android)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-lift-on-scroll-android',
    );
    await waitFor(element(by.id(SCROLL_VIEW)))
      .toBeVisible()
      .withTimeout(5000);
  });

  describe('baseline — liftOnScroll defaults to true', () => {
    it('should render an attached small header, flat at rest', async () => {
      await expectHeaderAttached();
      await expectAppBarFlat();
    });

    it('should lift the header while scrolled and unlift it back at the top', async () => {
      await expectLiftFollowsScroll();
    });

    it('should keep the small header pinned across a full scroll', async () => {
      await scrollToTopEdge();
      const { frame: frameAtTop } = await appBarAttributes();

      await scrollUntilVisible(BOTTOM_MARKER, SCROLL_VIEW);
      jestExpect((await appBarAttributes()).frame).toEqual(frameAtTop);

      await scrollToTopEdge();
      jestExpect((await appBarAttributes()).frame).toEqual(frameAtTop);
    });

    it('should lay the content out below the header', async () => {
      jestExpect(await isContentUnderHeader()).toBe(false);
    });
  });

  describe('liftOnScroll = false', () => {
    beforeAll(async () => {
      await selectLiftOnScroll('false');
    });

    it('should keep the header attached', async () => {
      await expectHeaderAttached();
    });

    it('should not lift or unlift the header while the content scrolls', async () => {
      await expectLiftUnaffectedByScroll();
    });
  });

  describe('liftOnScroll set back to a lifting value', () => {
    it('should restore lift for the explicit true value', async () => {
      await selectLiftOnScroll('true');

      await expectHeaderAttached();
      await expectLiftFollowsScroll();
    });

    it('should restore lift for the undefined (default) value', async () => {
      await selectLiftOnScroll('undefined');

      await expectHeaderAttached();
      await expectLiftFollowsScroll();
    });
  });

  describe('transparent header', () => {
    it('should overlay the content and suppress lift while transparent', async () => {
      await toggleSwitch(TRANSPARENT, true);

      await expectHeaderAttached();
      jestExpect(await isContentUnderHeader()).toBe(true);
      await expectLiftUnaffectedByScroll();
    });

    it('should restore the content offset and lift once transparent is off', async () => {
      await toggleSwitch(TRANSPARENT, false);

      await expectHeaderAttached();
      jestExpect(await isContentUnderHeader()).toBe(false);
      await expectLiftFollowsScroll();
    });
  });

  describe('hidden header', () => {
    it('should detach the header while hidden, leaving the content scrollable', async () => {
      await toggleSwitch(HIDDEN, true);

      await expectHeaderDetached();
      await scrollThroughAllContentAndBack();
    });

    it('should re-resolve the lift target once the header is shown again', async () => {
      await toggleSwitch(HIDDEN, false);

      await expectHeaderAttached();
      await expectLiftFollowsScroll();
    });
  });

  describe('headerConfig attach / detach', () => {
    it('should remove the whole header when headerConfig is detached', async () => {
      await toggleSwitch(ENABLED, false);

      await expectHeaderDetached();
      await scrollThroughAllContentAndBack();
    });

    it('should re-resolve the lift target once headerConfig is re-attached', async () => {
      await toggleSwitch(ENABLED, true);

      await expectHeaderAttached();
      await expectLiftFollowsScroll();
    });
  });
});
