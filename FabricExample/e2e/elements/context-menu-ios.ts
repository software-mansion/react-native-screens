import { device, element, by, waitFor } from 'detox';
import { NativeMatcher } from 'detox/detox';
import { getFrame } from '../e2e-utils';
import {
  CLASS_NAME_UI_CONTEXT_MENU_CELL,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_PLATTER_TRANSITION_VIEW,
  CLASS_NAME_UI_IMAGE_VIEW,
} from '../native-class-names';

/**
 * The presented native `UIMenu`.
 *
 * UIKit exposes no way to query a presented menu, so structure and layout are
 * checked indirectly: `by.id(...)` on an image matches the SF Symbol name; a
 * row's chevron tells a collapsed submenu from an inlined one; and icon frames
 * tell a horizontal palette from a vertical list.
 */
export const contextMenu = element(
  by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW),
);

/** How long a menu is given to leave the hierarchy after a dismissing tap. */
export const MENU_DISMISS_TIMEOUT = 2000;

export type MenuRowOptions = {
  /**
   * Require a `_UIContextMenuCell` ancestor, which excludes a submenu's pinned
   * title/back row. That row shares the label of the submenu's first entry
   * whenever that entry also has an `onPress`, so a menu with submenus needs
   * this to address the entry rather than the header.
   */
  inCell?: boolean;
};

/** A row of a presented menu, matched by its visible label. */
export function menuRowMatcher(
  label: string,
  { inCell = false }: MenuRowOptions = {},
): NativeMatcher {
  const content = by
    .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
    .and(by.label(label));

  return inCell
    ? content.withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL))
    : content;
}

/**
 * Any row of a presented menu — the handle for index-addressed assertions.
 * Built per call, never hoisted to a const: Detox's `atIndex` rewrites the
 * matcher it is given, so a shared one would stay pinned to its last index.
 */
export const anyMenuRowMatcher = (): NativeMatcher =>
  by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW);

/** `menuRowMatcher` as an element — the common case. */
export const menuRow = (label: string, options?: MenuRowOptions) =>
  element(menuRowMatcher(label, options));

/** The checkmark of a checked toggle / singleSelection row. */
export const checkmarkFor = (label: string, options?: MenuRowOptions) =>
  element(by.id('checkmark').withAncestor(menuRowMatcher(label, options)));

/**
 * UIKit's disclosure indicator, drawn only on rows that open a submenu. Its
 * absence marks an inlined submenu; the title alone cannot, since an inlined
 * submenu may keep its title as a section header.
 */
export const chevronFor = (label: string, options?: MenuRowOptions) =>
  element(
    by.id('chevron.forward').withAncestor(menuRowMatcher(label, options)),
  );

/** A menu row's SF Symbol, whose identifier is the symbol name. */
export const iconFor = (
  iconId: string,
  label: string,
  options?: MenuRowOptions,
) =>
  element(
    by
      .type(CLASS_NAME_UI_IMAGE_VIEW)
      .and(by.id(iconId))
      .withAncestor(menuRowMatcher(label, options)),
  );

/**
 * Dismisses the presented menu by tapping a point inside `anchor`, given as a
 * fraction of its frame — there is no API to close a `UIMenu`, so it has to be
 * a tap somewhere the platter does not cover.
 *
 * The platter is anchored under the header's trailing items, so on a full-width
 * anchor the centre often falls under the menu: a centre tap then only pops one
 * submenu level, while a tap near the leading edge is clear of it and closes
 * the menu at any depth. Hence the fractions rather than a fixed centre tap.
 */
export async function dismissMenuAt(
  anchor: NativeMatcher,
  {
    xFraction = 0.5,
    yFraction = 0.5,
  }: { xFraction?: number; yFraction?: number } = {},
) {
  const { x, y, width, height } = await getFrame(anchor);

  await device.tap({ x: x + width * xFraction, y: y + height * yFraction });
  await waitFor(contextMenu).not.toExist().withTimeout(MENU_DISMISS_TIMEOUT);
}

/**
 * Dismisses the presented menu by tapping UIKit's full-screen platter backdrop,
 * which every context menu puts up regardless of its anchor — so no per-screen
 * off-menu coordinate has to be computed.
 *
 * Near the leading edge, not the centre. Menus are anchored to the header's
 * trailing items, but once submenus stack they can reach screen centre, and a
 * tap that lands on the menu only pops one level instead of dismissing it.
 * The leading edge is clear of the platter at any depth.
 */
export async function dismissMenu() {
  await dismissMenuAt(
    by.type(CLASS_NAME_UI_CONTEXT_MENU_PLATTER_TRANSITION_VIEW),
    { xFraction: 0.1 },
  );
}
