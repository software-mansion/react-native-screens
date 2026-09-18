import { element, by, waitFor } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_APP_BAR_LAYOUT,
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
} from './native-classes-android';
import { DEFAULT_TIMEOUT_MS } from './wait';

// Factories: on Android `atIndex` rewrites a matcher in place (see `tapTopmost`).

/**
 * The Stack v5 header's toolbar. Scoped to `MaterialToolbar` so it never
 * matches the example app's own legacy header, a `CustomToolbar` — which
 * extends `Toolbar` but not `MaterialToolbar`.
 */
export const stackV5Toolbar = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR);

/**
 * The Stack v5 header's app bar. Every stacked screen keeps its own
 * `AppBarLayout`, so the bare class matches several; only the Stack v5 header
 * wraps a `MaterialToolbar`.
 */
export const stackV5AppBar = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_APP_BAR_LAYOUT).withDescendant(stackV5Toolbar());

/**
 * The header's back chevron. A covered screen keeps its toolbar but loses its
 * chevron, so under a headered top screen this is that screen's alone; under a
 * headerless one the covered screen's chevron is still there and visible.
 */
export const stackV5BackButton = (): NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
    .withAncestor(stackV5Toolbar());

/** A native header title, which renders as a `MaterialToolbar` child. */
export const stackV5HeaderTitle = (title: string): NativeMatcher =>
  by.text(title).withAncestor(stackV5Toolbar());

/**
 * A toolbar action button, matched by label in both forms; icon-only buttons
 * have empty text, text buttons show `title`.
 */
export function actionMenuItem(title: string): NativeMatcher {
  return by.label(title).and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW));
}

/**
 * A `showAsAction` change re-inflates the action menu, and a rotation does it
 * from a configuration change, so the toolbar can lag an assertion.
 */
export const TOOLBAR_UPDATE_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;

/**
 * Asserts `title`'s action button is up and renders `text`. Asserted
 * positively — on Android a negated matcher passes on a missing view.
 * `timeoutMs` covers waits longer than a re-inflation, e.g. an image load.
 */
async function expectActionItem(
  title: string,
  text: string,
  timeoutMs = TOOLBAR_UPDATE_TIMEOUT_MS,
) {
  await waitFor(element(actionMenuItem(title)))
    .toBeVisible()
    .withTimeout(timeoutMs);
  await waitFor(element(actionMenuItem(title)))
    .toHaveText(text)
    .withTimeout(timeoutMs);
}

/**
 * Asserts `title` is promoted to the toolbar as an icon-only button, whose
 * text AppCompat clears. Which icon it is cannot be asserted through Detox.
 */
export const expectIconActionItem = (title: string, timeoutMs?: number) =>
  expectActionItem(title, '', timeoutMs);

/**
 * Asserts `title` is promoted to the toolbar as a text button (no icon, or
 * WITH_TEXT). An icon beside the text is a compound drawable — not assertable.
 */
export const expectTextActionItem = (title: string) =>
  expectActionItem(title, title);

/** Asserts `title` is not promoted: the button is in neither form. */
export async function expectNoActionItem(title: string) {
  await waitFor(element(actionMenuItem(title)))
    .not.toExist()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT_MS);
}
