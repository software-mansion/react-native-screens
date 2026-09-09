import { element, by, waitFor } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { tapWithinFrame } from './gestures';
import { getFrame } from './matchers';
import {
  CLASS_NAME_UI_CONTEXT_MENU_CELL,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_PLATTER_TRANSITION_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW,
  CLASS_NAME_UI_IMAGE_VIEW,
} from './native-classes-ios';

// The menu UIKit presents from a header item or the header title.

/**
 * Detox's idle sync does not cover the menu's present/dismiss animation, so
 * waits that straddle it must be explicit.
 */
export const CONTEXT_MENU_ANIMATION_TIMEOUT_MS = 2000;

/**
 * Tap point on the dismiss overlay, as a fraction of its width: the leading
 * edge is clear of a trailing- or title-anchored platter (a platter tap only
 * pops one level).
 */
const CONTEXT_MENU_DISMISS_X_FRACTION = 0.1;

/** The list hosting the rows of the presented menu (or submenu). */
export const contextMenu = () =>
  element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW));

export type MenuRowOptions = {
  /**
   * Restrict to selectable rows (those inside a `_UIContextMenuCell`). This
   * excludes a submenu's pinned title/back row, which shares the label of the
   * submenu's first entry when that item also has an `onPress`.
   */
  actionsOnly?: boolean;
};

/** Matcher for a row of a presented menu, addressed by its visible label. */
function menuRowMatcher(
  title: string,
  { actionsOnly = false }: MenuRowOptions = {},
): NativeMatcher {
  const row = by
    .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
    .and(by.label(title));
  return actionsOnly
    ? row.withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL))
    : row;
}

/** A row of a presented menu, addressed by its visible label. */
export function menuRow(title: string, options?: MenuRowOptions) {
  return element(menuRowMatcher(title, options));
}

/** A submenu's pinned title row — its own class, not a menu row. */
export function submenuTitleRow(title: string) {
  return element(
    by
      .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
      .and(by.label(title))
      .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW)),
  );
}

/** The checkmark of a checked toggle / singleSelection row. */
export function checkmarkFor(title: string) {
  return element(by.id('checkmark').withAncestor(menuRowMatcher(title)));
}

/** The submenu chevron; absent on inlined submenus. */
export function chevronFor(title: string) {
  return element(by.id('chevron.forward').withAncestor(menuRowMatcher(title)));
}

/** A row's icon by id, scoped to its row: parent rows stay attached under a submenu. */
export function menuRowIcon(iconId: string, title: string) {
  return element(
    by
      .type(CLASS_NAME_UI_IMAGE_VIEW)
      .and(by.id(iconId))
      .withAncestor(menuRowMatcher(title)),
  );
}

export type OpenContextMenuOptions = {
  /** `longPress` for an item that also has an `onPress` — a tap fires that. */
  gesture?: 'tap' | 'longPress';
  timeout?: number;
};

/** Opens the menu attached to `anchor` and waits for it to present. */
export async function openContextMenu(
  anchor: Detox.NativeElement,
  {
    gesture = 'tap',
    timeout = CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
  }: OpenContextMenuOptions = {},
) {
  await waitFor(anchor).toBeVisible().withTimeout(timeout);
  if (gesture === 'longPress') {
    await anchor.longPress();
  } else {
    await anchor.tap();
  }
  await waitFor(contextMenu()).toBeVisible().withTimeout(timeout);
}

/**
 * Dismisses the menu at any submenu depth by tapping UIKit's dismiss overlay
 * near its leading edge (a tap on the menu itself only pops one level).
 */
export async function dismissContextMenu(
  timeout = CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
) {
  await tapWithinFrame(
    await getFrame(
      by.type(CLASS_NAME_UI_CONTEXT_MENU_PLATTER_TRANSITION_VIEW),
      'the context menu platter',
    ),
    CONTEXT_MENU_DISMISS_X_FRACTION,
  );
  await waitFor(contextMenu()).not.toExist().withTimeout(timeout);
}
