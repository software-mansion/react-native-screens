'use client';

import { Platform, UIManager } from 'react-native';

/**
 * The platforms this library ships native code for, and so the platforms where
 * native screens are used by default.
 *
 * Not a list of platforms where they *can* work. A platform that provides the
 * `RNSScreen` and `RNSScreenStack` components out of tree says so by calling
 * `enableScreens()`; see `nativeScreensAvailable`.
 */
export const isNativePlatformSupported =
  Platform.OS === 'ios' ||
  Platform.OS === 'android' ||
  Platform.OS === 'windows';

let ENABLE_SCREENS = isNativePlatformSupported;

/**
 * Whether an application has asked for native screens on a platform this
 * library does not ship native code for.
 *
 * Separate from `ENABLE_SCREENS` because the two answer different questions.
 * `ENABLE_SCREENS` is "should screens be used", which an app turns off on iOS
 * and Android; this is "do screens exist here at all", which only an app can
 * know for a platform that is not in the list above.
 */
let ENABLED_OUT_OF_TREE = false;

/**
 * Whether the native components can be used at all.
 *
 * `isNativePlatformSupported` on its own is not the question the components
 * want answered, and it cannot be: `ScreenStackItem` passes `enabled` to every
 * `Screen` it renders, so the platform term is the only thing keeping a
 * platform without the native code from mounting components that do not exist.
 */
export function nativeScreensAvailable() {
  return isNativePlatformSupported || ENABLED_OUT_OF_TREE;
}

/**
 * Turns native screens on or off.
 *
 * The default is `isNativePlatformSupported`, so on iOS, Android and Windows
 * this is only needed to turn them off. Calling it with `true` on any other
 * platform is how an application says that its platform provides `RNSScreen`
 * and the rest itself, and is an assertion that those components exist: see
 * `nativeScreensAvailable`.
 *
 * @param shouldEnableScreens whether screens should be used at all.
 */
export function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;

  if (!isNativePlatformSupported) {
    // An application on a platform this library knows nothing about, asserting
    // that the platform supplies the native components itself. React Native
    // forks for desktop do this; the components are ordinary Fabric C++ and
    // nothing about them is tied to the platforms above.
    ENABLED_OUT_OF_TREE = shouldEnableScreens;
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
  if (!isNativePlatformSupported) {
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
