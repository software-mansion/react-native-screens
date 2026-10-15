import { device, by } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { expectTopmostVisible } from './assertions';
import { tapTopmost, tapWithinFrame } from './gestures';
import { getMatches } from './matchers';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_TOOLBAR,
} from './native-classes-android';
import { CLASS_NAME_UI_BUTTON_BAR_BUTTON } from './native-classes-ios';
import { isIOSVersionAtLeast } from './platform';
import { waitUntil } from './wait';

/** UIKit's `BackButton` id; ambiguous on iOS 26, so narrowed to the container. */
const iosBackButtonMatcher = (): NativeMatcher =>
  isIOSVersionAtLeast('26.0')
    ? by.id('BackButton').and(by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON))
    : by.id('BackButton');

/**
 * The toolbar's navigation icon, for the legacy (`CustomToolbar`) and Stack v5
 * (`MaterialToolbar`) headers alike — unlike `stackV5BackButton`.
 */
const androidBackButtonMatcher = (): NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
    .withAncestor(by.type(CLASS_NAME_ANDROID_TOOLBAR));

function backButtonMatcher(): NativeMatcher {
  const platform = device.getPlatform();
  if (platform === 'ios') {
    return iosBackButtonMatcher();
  } else if (platform === 'android') {
    return androidBackButtonMatcher();
  } else throw new Error(`Platform "${platform}" not supported`);
}

/**
 * iOS 27's Liquid Glass back button renders blank in Detox's visibility
 * snapshot, so `toBeVisible` and `tap()` reject it although it is on screen.
 * Waits for the topmost match to exist, then taps its frame by coordinates.
 */
async function forceTapTopmostIOS27(buildMatcher: () => NativeMatcher) {
  await waitUntil(
    async () =>
      (await getMatches(buildMatcher(), { orEmpty: true })).length > 0,
    { message: 'the header back button to exist' },
  );
  const matches = await getMatches(buildMatcher());
  await tapWithinFrame(matches[matches.length - 1].frame);
}

/**
 * Waits for, then taps, the topmost screen's header back button. With several
 * headers attached (a nested stack), the last match is tapped. `ancestorId`
 * narrows it to the header inside that view (e.g. a nested stack's screen).
 */
export async function tapBarBackButton(ancestorId?: string) {
  const buildMatcher = () =>
    ancestorId === undefined
      ? backButtonMatcher()
      : backButtonMatcher().withAncestor(by.id(ancestorId));

  if (isIOSVersionAtLeast('27.0')) {
    await forceTapTopmostIOS27(buildMatcher);
    return;
  }
  await expectTopmostVisible(buildMatcher);
  await tapTopmost(buildMatcher());
}
