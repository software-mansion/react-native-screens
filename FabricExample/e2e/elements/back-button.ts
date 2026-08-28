import { device, by } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import {
  DEFAULT_TIMEOUT_MS,
  expectTopmostVisible,
  isIOSVersionAtLeast,
  tapTopmost,
} from '../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_TOOLBAR,
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
} from '../native-class-names';

const BACK_BUTTON_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;

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
 * Waits for, then taps, the topmost screen's header back button. With several
 * headers attached (a nested stack), the last match is tapped.
 */
export async function tapBarBackButton() {
  await expectTopmostVisible(backButtonMatcher, {
    timeout: BACK_BUTTON_TIMEOUT_MS,
  });
  await tapTopmost(backButtonMatcher());
}
