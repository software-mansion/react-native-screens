import { device, element, by, waitFor } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { countMatches, getFrame, readSingleText, type Frame } from './matchers';

export type ScrollOptions = {
  /** Pixels per step. Smaller steps avoid overshooting a short row. */
  pixels?: number;
  /** Swipe start, as a fraction of height. Keep it inside the view: on
   * Android a `NaN`/0 start lands in the status bar and opens the shade. */
  startPercentage?: number;
  /** Scroll direction; `whileElement` only ever scrolls one way. */
  direction?: 'up' | 'down';
};

export async function scrollUntilVisible(
  id: string,
  scrollViewId: string,
  {
    pixels = 600,
    startPercentage = 0.85,
    direction = 'down',
  }: ScrollOptions = {},
) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(pixels, direction, Number.NaN, startPercentage);
}

/**
 * Rewinds to the top first — `whileElement` only scrolls one way. Down only:
 * rewinding to the top makes an upward scan pointless, so `direction` is
 * rejected at the type level.
 */
export async function rewindAndScrollUntilVisible(
  id: string,
  scrollViewId: string,
  options: Omit<ScrollOptions, 'direction'> = {},
) {
  await element(by.id(scrollViewId)).scrollTo('top');
  await scrollUntilVisible(id, scrollViewId, options);
}

/** Coordinate tap at (`xFraction`, 1/2) of `frame`, bypassing visibility checks. */
export async function tapWithinFrame(
  { x, y, width, height }: Frame,
  xFraction = 0.5,
) {
  await device.tap({ x: x + width * xFraction, y: y + height / 2 });
}

/** Coordinate tap (iOS) — bypasses Detox's visibility check. */
export async function forceTapByLabeliOS(testLabel: string) {
  await tapWithinFrame(
    await getFrame(by.label(testLabel), `label "${testLabel}"`),
  );
}

/** Taps the last match (topmost stacked screen). Pass a fresh matcher: `atIndex` mutates it on Android. */
export async function tapTopmost(matcher: NativeMatcher): Promise<void> {
  await element(matcher)
    .atIndex((await countMatches(matcher)) - 1)
    .tap();
}

/**
 * Taps a Push/Pop/Toggle button on the topmost stacked screen. React Native's
 * core `<Button>` uppercases its `title` on Android, so pass the rendered text.
 */
export async function tapTopmostButton(title: string): Promise<void> {
  await tapTopmost(by.text(title));
}

/** A scroll view plus the tuning used to bring one of its rows into view. */
export type ScrollTargetOptions = ScrollOptions & { scrollViewId: string };

/** Rewinds, scrolls `id` into view and taps it. */
export async function scrollToAndTap(
  id: string,
  { scrollViewId, ...scroll }: ScrollTargetOptions,
) {
  await rewindAndScrollUntilVisible(id, scrollViewId, scroll);
  await element(by.id(id)).tap();
}

/** Rewinds, scrolls `id` into view and returns its text (`''` when unset). */
export async function scrollToAndReadText(
  id: string,
  { scrollViewId, ...scroll }: ScrollTargetOptions,
): Promise<string> {
  await rewindAndScrollUntilVisible(id, scrollViewId, scroll);
  return readSingleText(id);
}
