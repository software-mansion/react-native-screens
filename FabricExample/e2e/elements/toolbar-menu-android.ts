import { device, element, by, waitFor } from 'detox';
import { NativeMatcher } from 'detox/detox';
import { countMatches, waitUntil } from '../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
} from '../native-class-names';

/** The platform content description of the toolbar's overflow button. */
export const OVERFLOW_MENU_LABEL = 'More options';

/**
 * Detox's idle sync does not cover popup window animations, so every wait that
 * straddles a menu opening or dismissing has to be explicit.
 */
export const MENU_ANIMATION_TIMEOUT = 5000;

/**
 * Probes an already-settled popup rather than an animation — by the time it is
 * used the menu is either up or was never opened.
 */
export const MENU_PRESENCE_TIMEOUT = 250;

/**
 * One Back press per popup window. A submenu replaces its parent on phones and
 * stacks on it on tablets, plus one press to notice an unexpected extra level.
 */
const MAX_MENU_DEPTH = 4;

/**
 * The popup window an open toolbar menu is rendered into. Espresso only
 * searches the focused window, so parent popups behind a submenu are out of
 * reach of anything anchored here.
 */
export const focusedPopup: NativeMatcher = by.type(
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
);

/** A row or header of the focused popup showing `text`. */
export const textInMenu = (text: string): NativeMatcher =>
  by.text(text).withAncestor(focusedPopup);

/**
 * A menu row holding `text`. A submenu header is a `FrameLayout`, not a row, so
 * this matches the item alone even where both show the same string.
 */
export const menuRowWithText = (text: string): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW).withDescendant(by.text(text));

/**
 * Any row of the focused popup — the only handle on an entry with no title.
 * Built per call, never hoisted to a const: Detox's `atIndex` rewrites the
 * matcher it is given, so a shared one would stay pinned to the index it was
 * last tapped at.
 */
export const menuRow = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW).withAncestor(focusedPopup);

/**
 * An image view inside the row holding `text`. A row's `group_divider`, icon
 * slot and `submenuarrow` all share this class and differ only by resource id,
 * which Detox cannot match — so a row is asserted to hold at most one visible
 * image at a time, and which one it is follows from what the screen sets.
 */
export const menuRowImage = (text: string): NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
    .withAncestor(menuRowWithText(text));

/**
 * Detox resolves matchers against a single window: while a popup holds focus
 * nothing behind it is in the searched hierarchy, so the menu going away is not
 * enough — the screen itself has to become addressable again.
 */
export async function waitForScreen(scrollViewId: string) {
  await waitFor(element(by.id(scrollViewId)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

/** Waits for a row or header of the focused popup showing `text`. */
export async function waitForMenuItem(text: string) {
  await waitFor(element(textInMenu(text)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

/**
 * Waits until exactly `count` elements in the focused popup show `text`. The
 * awaited text is often up in the parent popup too, so only the match count
 * tells the two apart — hence `waitUntil`, as `waitFor` cannot assert a count.
 */
export async function waitForMenuTextCount(text: string, count: number) {
  let matches = 0;

  await waitUntil(
    async () => {
      // Resolves to 0 mid-animation, a legitimate intermediate state here.
      matches = await countMatches(textInMenu(text), { orEmpty: true });
      return matches === count;
    },
    {
      timeout: MENU_ANIMATION_TIMEOUT,
      message: () =>
        `expected ${count} element(s) reading "${text}" in the focused popup, saw ${matches}`,
    },
  );
}

/** Resolves instead of throwing, so it can be used as a condition. */
async function isScreenReachable(scrollViewId: string): Promise<boolean> {
  return waitFor(element(by.id(scrollViewId)))
    .toBeVisible()
    .withTimeout(MENU_PRESENCE_TIMEOUT)
    .then(
      () => true,
      () => false,
    );
}

/** Whether a toolbar menu popup is currently up. */
export async function isOverflowMenuOpen(): Promise<boolean> {
  return waitFor(element(focusedPopup))
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT)
    .then(
      () => true,
      () => false,
    );
}

/** Waits for the popup here, so a menu that never opened fails at the tap. */
export async function openOverflowMenu() {
  await element(by.label(OVERFLOW_MENU_LABEL)).tap();
  await waitFor(element(focusedPopup))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT);
}

/**
 * Taps a row that dismisses the whole menu chain, then waits for the screen
 * behind it: until the popup gives focus back, every later matcher resolves
 * against the popup window instead of the activity.
 */
export async function tapLeafItem(
  matcher: NativeMatcher,
  scrollViewId: string,
) {
  await element(matcher).tap();
  await waitForScreen(scrollViewId);
}

/**
 * Presses Back until the screen is addressable again, and never once more: with
 * no popup up the activity takes the press and pops the test screen, failing
 * every later case in a stateful suite. Submenus stack, so each press closes one
 * level; a menu that was never opened costs one probe and no press at all.
 *
 * A left-over popup is never a local failure — every later matcher would resolve
 * against the popup window instead of the activity, so the whole rest of the
 * suite fails on views that are plainly there.
 */
export type CloseMenuOptions = {
  /** Cap on Back presses. Lower it on a screen with fewer nestable popups. */
  maxDepth?: number;
};

export async function closeOverflowMenu(
  scrollViewId: string,
  { maxDepth = MAX_MENU_DEPTH }: CloseMenuOptions = {},
) {
  for (let presses = 0; presses < maxDepth; presses++) {
    if (await isScreenReachable(scrollViewId)) {
      return;
    }
    await device.pressBack();
  }

  if (!(await isScreenReachable(scrollViewId))) {
    throw new Error(
      `A toolbar menu popup was still up after ${maxDepth} Back presses.`,
    );
  }
}

/**
 * Runs `assertions` with the menu already open, closing it afterwards even when
 * they throw — a leaked popup would fail every later case.
 */
export async function closingMenuAfter(
  scrollViewId: string,
  assertions: () => Promise<void>,
  options: CloseMenuOptions = {},
) {
  let assertionFailed = false;

  try {
    await assertions();
  } catch (error) {
    assertionFailed = true;
    throw error;
  } finally {
    try {
      await closeOverflowMenu(scrollViewId, options);
    } catch (cleanupError) {
      // A throw from `finally` would replace the error that actually failed.
      if (!assertionFailed) {
        throw cleanupError;
      }
      // Logged rather than dropped: the popup is still up, so the *next* test
      // fails on views that are plainly there, with no trace in its own output.
      console.warn(
        'closeOverflowMenu failed while cleaning up after a failed assertion:',
        cleanupError,
      );
    }
  }
}

/**
 * Opens the overflow menu, runs `assertions`, and closes it again.
 *
 * While the menu is open Espresso resolves matchers against its window, so
 * `assertions` can only address rows inside it.
 */
export async function withOverflowMenu(
  scrollViewId: string,
  assertions: () => Promise<void>,
  options: CloseMenuOptions = {},
) {
  await openOverflowMenu();
  await closingMenuAfter(scrollViewId, assertions, options);
}
