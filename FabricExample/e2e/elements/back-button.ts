import { device, by } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import {
  expectTopmostVisible,
  isIOSVersionAtLeast,
  stackV5BackButton,
  tapTopmost,
} from '../e2e-utils';
import { CLASS_NAME_UI_BUTTON_BAR_BUTTON } from '../native-class-names';

const BACK_BUTTON_TIMEOUT_MS = 3000;

/** UIKit's `BackButton` id; ambiguous on iOS 26, so narrowed to the container. */
const iosBackButtonMatcher = (): NativeMatcher =>
  isIOSVersionAtLeast('26.0')
    ? by.id('BackButton').and(by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON))
    : by.id('BackButton');

function backButtonMatcher(): NativeMatcher {
  const platform = device.getPlatform();
  if (platform === 'ios') {
    return iosBackButtonMatcher();
  } else if (platform === 'android') {
    return stackV5BackButton();
  } else throw new Error(`Platform "${platform}" not supported`);
}

/** Waits for, then taps, the topmost screen's header back button. */
export async function tapBarBackButton() {
  await expectTopmostVisible(backButtonMatcher, {
    timeout: BACK_BUTTON_TIMEOUT_MS,
  });
  await tapTopmost(backButtonMatcher());
}
