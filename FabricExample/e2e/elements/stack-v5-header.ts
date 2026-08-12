import { by } from 'detox';
import { NativeMatcher } from 'detox/detox';
import { tapTopmost } from '../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
} from '../native-class-names';

/**
 * Matchers for the Stack v5 native header on Android.
 *
 * Every matcher is built fresh on each call: on Android `atIndex` rewrites a
 * matcher in place, so a shared instance would stay pinned to the index of
 * whichever call indexed it first (see `tapTopmost`).
 */

/**
 * The Stack v5 header's toolbar. Scoped to `MaterialToolbar` so it never
 * matches the example app's own v4 header, a `CustomToolbar` — which extends
 * `Toolbar` but not `MaterialToolbar`.
 */
export const stackV5ToolbarMatcher = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR);

/**
 * The header's back chevron.
 *
 * A covered screen keeps its toolbar in the hierarchy but loses its navigation
 * icon, and `Toolbar` drops the icon's view along with it — so while a headered
 * screen is on top this resolves to that screen's chevron alone. It does *not*
 * resolve to zero when the topmost screen is headerless: a covered screen's
 * toolbar is still there, hidden behind it. Detox intersects a view only with
 * its parents, never with an occluding sibling, so that leftover chevron reads
 * as visible.
 */
export const stackV5BackButtonMatcher = (): NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
    .withAncestor(stackV5ToolbarMatcher());

/** A native header title, which renders as a `MaterialToolbar` child. */
export const stackV5HeaderTitleMatcher = (title: string): NativeMatcher =>
  by.text(title).withAncestor(stackV5ToolbarMatcher());

/** Taps the back chevron of the topmost headered screen. */
export async function tapStackV5BackButton(): Promise<void> {
  await tapTopmost(stackV5BackButtonMatcher());
}
