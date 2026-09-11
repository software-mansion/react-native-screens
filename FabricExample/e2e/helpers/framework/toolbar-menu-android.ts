import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { getSingleMatch } from './matchers';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
  CLASS_NAME_ANDROID_CHECK_BOX,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
  CLASS_NAME_ANDROID_RADIO_BUTTON,
} from './native-classes-android';

/**
 * Detox's idle sync does not cover popup window animations, so waits that
 * straddle the overflow menu opening or dismissing must be explicit.
 */
export const MENU_ANIMATION_TIMEOUT_MS = 5000;

/** Probes an already-settled popup: by now it is either up or was never opened. */
const MENU_PRESENCE_TIMEOUT_MS = 250;

/** Outlasts a popup's exit animation without paying the full animation timeout. */
const MENU_DISMISS_PROBE_TIMEOUT_MS = 1000;

/** The accessibility label AppCompat gives the overflow button. */
export const OVERFLOW_MENU_LABEL = 'More options';

/** The popup hosting the overflow menu (or, once opened, a submenu). */
const overflowMenuMatcher = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW);

const overflowMenu = () => element(overflowMenuMatcher());

/**
 * A multi-toggle group renders check boxes and a single-selection one radio
 * buttons, so the class asserts the group type.
 */
export type ToggleWidget =
  | typeof CLASS_NAME_ANDROID_CHECK_BOX
  | typeof CLASS_NAME_ANDROID_RADIO_BUTTON;

export function menuItemRow(title: string): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
    .withDescendant(by.text(title));
}

export function menuItemToggle(
  title: string,
  widget: ToggleWidget,
): NativeMatcher {
  return by.type(widget).withAncestor(menuItemRow(title));
}

/**
 * The visible image view in `title`'s row — divider, submenu arrow or icon;
 * they share one class and Detox cannot tell them apart by resource id.
 */
export function menuItemImage(title: string): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
    .withAncestor(menuItemRow(title));
}

/** `title` inside the focused popup (row title or submenu header). */
export function overflowMenuText(title: string): NativeMatcher {
  return by.text(title).withAncestor(overflowMenuMatcher());
}

/**
 * Any row of the focused popup — the only handle on an entry with no title.
 * Built per call: `atIndex` rewrites the matcher it is given on Android.
 */
export function overflowMenuRow(): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
    .withAncestor(overflowMenuMatcher());
}

/** Asserts the open popup lists `titles` top to bottom in this order. */
export async function expectOverflowMenuOrder(
  titles: readonly string[],
): Promise<void> {
  const rows: { title: string; top: number }[] = [];

  for (const title of titles) {
    const { frame } = await getSingleMatch(
      overflowMenuText(title),
      `menu row "${title}"`,
    );
    rows.push({ title, top: frame.y });
  }

  rows.sort((a, b) => a.top - b.top);
  jestExpect(rows.map(row => row.title)).toEqual(titles);
}

/** Asserts `title`'s row hosts a check box (multi-toggle group), not a radio. */
export async function expectCheckBox(title: string, checked: boolean) {
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_RADIO_BUTTON)),
  ).not.toExist();
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_CHECK_BOX)),
  ).toHaveToggleValue(checked);
}

/** Asserts `title`'s row hosts a radio button (a single-selection group). */
export async function expectRadioButton(title: string, checked: boolean) {
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_CHECK_BOX)),
  ).not.toExist();
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_RADIO_BUTTON)),
  ).toHaveToggleValue(checked);
}

/** Resolves instead of throwing, so it can be used as a condition. */
async function isMenuOpen(): Promise<boolean> {
  return waitFor(overflowMenu())
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT_MS)
    .then(
      () => true,
      () => false,
    );
}

/** Waits for the popup itself, so a menu that never opened fails here rather
 * than on a row assertion racing the open animation. */
export async function openOverflowMenu() {
  await element(by.label(OVERFLOW_MENU_LABEL)).tap();
  await waitFor(overflowMenu())
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

/** Waits for `title`'s row in the open popup, outlasting the open animation. */
async function waitForMenuItem(title: string) {
  await waitFor(element(overflowMenuText(title)))
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

export type ExpectMenuItemsOptions = {
  /** Also assert the entries appear top to bottom in the order given. */
  checkOrder?: boolean;
  /** Also assert no row renders an image — icons never show in the popup. */
  withoutIcons?: boolean;
};

/**
 * Asserts the exact contents of an already-open popup: every entry of
 * `expectedVisible` present, every other entry of `allTitles` absent. Pass the
 * screen's full title set, or a title outside it would go unasserted. Wrap the
 * call in `withOverflowMenu` so a failure cannot leak the popup.
 */
export async function expectOverflowMenuItems<Title extends string>(
  expectedVisible: readonly [Title, ...Title[]],
  allTitles: readonly Title[],
  { checkOrder = false, withoutIcons = false }: ExpectMenuItemsOptions = {},
): Promise<void> {
  // Rows populate in a single layout pass, so once the first expected entry is
  // up the `not.toExist()` checks below cannot pass prematurely.
  await waitForMenuItem(expectedVisible[0]);

  for (const title of expectedVisible) {
    await expect(element(overflowMenuText(title))).toBeVisible();
    if (withoutIcons) {
      await expect(element(menuItemImage(title))).not.toExist();
    }
  }

  if (checkOrder) {
    await expectOverflowMenuOrder(expectedVisible);
  }

  for (const title of allTitles) {
    if (!expectedVisible.includes(title)) {
      await expect(element(overflowMenuText(title))).not.toExist();
    }
  }
}

export type OverflowMenuControl = {
  /** The screen's scroll view — the anchor proving the popup is gone. */
  scrollViewId: string;
  /**
   * Upper bound of Back presses while a popup is still up: one per popup of
   * the deepest expected path. The default covers an overflow menu with one
   * submenu level, plus margin to notice an unexpected extra popup.
   */
  maxMenuDepth?: number;
};

/** Overflow-menu helpers bound to one spec's scroll view. */
export function createOverflowMenuHelpers({
  scrollViewId,
  maxMenuDepth = 3,
}: OverflowMenuControl) {
  /** Detox searches the focused window only: the screen itself must be back. */
  const waitForScreen = async () => {
    await waitFor(element(by.id(scrollViewId)))
      .toBeVisible()
      .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
  };

  /** Reported rather than thrown — a stacked popup keeps it false. The short
   * probe outlasts the exit animation without stalling stacked cleanup. */
  const isScreenAddressable = () =>
    waitFor(element(by.id(scrollViewId)))
      .toBeVisible()
      .withTimeout(MENU_DISMISS_PROBE_TIMEOUT_MS)
      .then(
        () => true,
        () => false,
      );

  /**
   * Back only ever goes to an open popup: with no menu up the activity takes
   * it and pops the test screen, failing every later case in a stateful
   * suite. Submenus stack a popup per level, hence the loop.
   */
  const closeMenuIfOpen = async () => {
    let pressCount = 0;

    while (await isMenuOpen()) {
      if (pressCount === maxMenuDepth) {
        throw new Error(
          `The overflow menu was still open after ${maxMenuDepth} Back presses.`,
        );
      }
      await device.pressBack();
      pressCount++;

      // A popup lingers while animating out and would read as a second menu;
      // the screen coming back settles it. If it does not, a parent popup is up.
      if (await isScreenAddressable()) {
        return;
      }
    }

    if (pressCount > 0) {
      await waitForScreen();
    }
  };

  /** Closes the menu even on failure — a leaked popup fails every later case. */
  const closingMenuAfter = async (assertions: () => Promise<void>) => {
    let assertionFailed = false;

    try {
      await assertions();
    } catch (error) {
      assertionFailed = true;
      throw error;
    } finally {
      try {
        await closeMenuIfOpen();
      } catch (cleanupError) {
        // A throw from `finally` would replace the error that actually failed.
        if (assertionFailed) {
          console.warn(
            'Cleanup failed after a failed assertion:',
            cleanupError,
          );
        } else {
          throw cleanupError;
        }
      }
    }
  };

  /**
   * While the menu is open, Espresso resolves matchers against its window, so
   * `assertions` can only address rows inside it.
   */
  const withOverflowMenu = async (assertions: () => Promise<void>) => {
    await openOverflowMenu();
    await closingMenuAfter(assertions);
  };

  /** Taps `title` in the open popup and waits for the popup to go away. */
  const tapMenuItem = async (title: string) => {
    await waitForMenuItem(title);
    await element(overflowMenuText(title)).tap();
    await waitFor(element(overflowMenuText(title)))
      .not.toExist()
      .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
    await waitForScreen();
  };

  return {
    waitForScreen,
    closeMenuIfOpen,
    closingMenuAfter,
    withOverflowMenu,
    waitForMenuItem,
    tapMenuItem,
  };
}
