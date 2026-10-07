'use client';

import { Platform, UIManager } from 'react-native';

/**
 * The platforms this library ships native code for, and so the platforms where
 * native screens are used by default.
 *
 * Not a list of platforms where they *can* work. A platform that provides the
 * `RNSScreen` and `RNSScreenStack` components out of tree says so by calling
 * `provideNativeScreens()`; see `nativeScreensAvailable()`.
 */
export const isNativePlatformSupported =
  Platform.OS === 'ios' ||
  Platform.OS === 'android' ||
  Platform.OS === 'windows';

let ENABLE_SCREENS = isNativePlatformSupported;

/**
 * Whether a host has said its platform supplies the native components itself.
 *
 * Separate from `ENABLE_SCREENS` because the two answer different questions.
 * `ENABLE_SCREENS` is "should screens be used", which an app turns off on iOS
 * and Android; this is "do screens exist here at all", which only the host can
 * know for a platform that is not in the list above.
 */
let PROVIDED_OUT_OF_TREE = false;

/**
 * Whether the native components can be used at all.
 *
 * `isNativePlatformSupported` on its own is not the question the components
 * want answered, and it cannot be: `ScreenStackItem` passes `enabled` to every
 * `Screen` it renders, so the platform term is the only thing keeping a
 * platform without the native code from mounting components that do not exist.
 */
export function nativeScreensAvailable() {
  return isNativePlatformSupported || PROVIDED_OUT_OF_TREE;
}

/**
 * Declares that this platform supplies `RNSScreen` and the rest itself.
 *
 * For a platform this library ships no native code for: an out-of-tree React
 * Native can register the same Fabric components under the same names. Calling
 * this asserts that they are registered, so a platform where they are not must
 * not call it.
 *
 * Not `enableScreens()`, which applications call unconditionally and which has
 * always left the fallback in place where there are no native components. A host
 * does both, the two answering different questions:
 *
 *     provideNativeScreens();
 *     enableScreens();
 *
 * @param provided whether this platform registers the native components.
 */
export function provideNativeScreens(provided = true) {
  PROVIDED_OUT_OF_TREE = provided;
}

/**
 * Turns native screens on or off.
 *
 * The default is `isNativePlatformSupported`, so on iOS, Android and Windows this
 * is only needed to turn them off. Its meaning on any other platform is
 * unchanged: screens are used where they exist, and a platform with no native
 * components keeps the fallback. Saying that a platform does have them is
 * `provideNativeScreens()`, which is a separate call for a reason given there.
 *
 * @param shouldEnableScreens whether screens should be used at all.
 */
export function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;

  // The list rather than `nativeScreensAvailable()`, unlike the gates elsewhere:
  // what follows checks this library's own autolinking, and a platform that
  // registers the components itself may well not answer `getViewManagerConfig`
  // for them. Telling such a host its native module is missing would be worse
  // than saying nothing.
  if (!isNativePlatformSupported) {
    return;
  }

  if (ENABLE_SCREENS && !UIManager.getViewManagerConfig('RNSScreen')) {
    console.error(
      `Screen native module hasn't been linked. Please check the react-native-screens README for more details`,
    );
  }
}

let ENABLE_FREEZE = false;

export function enableFreeze(shouldEnableReactFreeze = true) {
  // The same question `Screen` asks, rather than the platform list, because the
  // freeze is applied on the native path: `Screen` reads `freezeEnabled()` inside
  // the branch it takes when `nativeScreensAvailable()`. Gating this on the list
  // alone would leave a host that supplies the components able to reach the freeze
  // and unable to turn it on.
  //
  // Nothing changes for any platform that does not make that claim: on iOS,
  // Android and Windows the two answers are identical, and elsewhere this still
  // returns early until `provideNativeScreens()` has been called.
  if (!nativeScreensAvailable()) {
    return;
  }

  ENABLE_FREEZE = shouldEnableReactFreeze;
}

export function screensEnabled() {
  return ENABLE_SCREENS;
}

export function freezeEnabled() {
  return ENABLE_FREEZE;
}
