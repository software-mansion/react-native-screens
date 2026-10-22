import { expect, element, by } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { tapWithinFrame } from './gestures';
import { getFrame, getMatches } from './matchers';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
} from './native-classes-ios';
import { isIOSVersionAtLeast } from './platform';

// Stack v5 header items (`UIBarButtonItem`).

// iOS 27 hosts header items in a glass platter that Detox's visibility snapshot
// renders blank, so its items can be neither asserted visible nor gestured on
// as elements. There items and icons are checked for existence and gestured on
// by coordinates.

export type HeaderItemOptions = {
  /**
   * Match the inner control (`_UIModernBarButton`) instead of the item
   * container (`_UIButtonBarButton`). Both carry the title as their label.
   */
  control?: boolean;
};

/** Matcher for a title-only header item, addressed by its visible title. */
export function headerItemMatcher(
  title: string,
  { control = false }: HeaderItemOptions = {},
): NativeMatcher {
  return by
    .type(
      control
        ? CLASS_NAME_UI_MODERN_BAR_BUTTON
        : CLASS_NAME_UI_BUTTON_BAR_BUTTON,
    )
    .and(by.label(title));
}

/** A title-only header item, addressed by its visible title. */
export function headerItem(title: string, options?: HeaderItemOptions) {
  return element(headerItemMatcher(title, options));
}

/**
 * Asserts the view matched by `matcher`, hosted in the header (e.g. a custom
 * item view), is shown: `toBeVisible(visibilityPct)`, or on iOS 27 (see above)
 * only `toExist`.
 */
export async function expectHeaderViewShown(
  matcher: NativeMatcher,
  visibilityPct?: number,
) {
  if (isIOSVersionAtLeast('27.0')) {
    await expect(element(matcher)).toExist();
  } else {
    await expect(element(matcher)).toBeVisible(visibilityPct);
  }
}

/**
 * Taps the `index`-th view matched by `matcher`, hosted in the header (e.g. a
 * custom item view or `_UIButtonBarButton`), by coordinates on iOS 27 (see
 * above).
 */
export async function tapHeaderView(matcher: NativeMatcher, index = 0) {
  if (isIOSVersionAtLeast('27.0')) {
    const matches = await getMatches(matcher);
    await tapWithinFrame(matches[index].frame);
  } else {
    await element(matcher).atIndex(index).tap();
  }
}

/**
 * Asserts the header item titled `title` is shown: `toBeVisible`, or on
 * iOS 27 (see above) only `toExist`.
 */
export async function expectHeaderItemShown(
  title: string,
  options?: HeaderItemOptions,
) {
  await expectHeaderViewShown(headerItemMatcher(title, options));
}

/** Taps the header item titled `title`, by coordinates on iOS 27 (see above). */
export async function tapHeaderItem(title: string) {
  if (isIOSVersionAtLeast('27.0')) {
    await tapWithinFrame(
      await getFrame(headerItemMatcher(title), `header item "${title}"`),
    );
  } else {
    await headerItem(title).tap();
  }
}

/** The header title label. */
export function headerTitle(title: string): NativeMatcher {
  return by.type(CLASS_NAME_UI_LABEL).and(by.text(title));
}

/** A header item's icon, by icon id (SF Symbol name or asset path). */
export function barButtonIcon(iconId: string) {
  return element(
    by.id(iconId).withAncestor(by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON)),
  );
}

/**
 * Asserts a header item renders the icon carrying `iconId`: `toBeVisible`, or
 * on iOS 27 (see above) only `toExist`.
 */
export async function expectBarButtonIconShown(iconId: string) {
  if (isIOSVersionAtLeast('27.0')) {
    await expect(barButtonIcon(iconId)).toExist();
  } else {
    await expect(barButtonIcon(iconId)).toBeVisible();
  }
}
