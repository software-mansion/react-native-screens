// web implementation is taken from `index.tsx`
import { Platform, UIManager } from 'react-native';
import { version } from 'react-native/package.json';

// const that tells if the library should use new implementation, will be undefined for older versions
export const shouldUseActivityState = true;

export const isNativePlatformSupported =
  Platform.OS === 'ios' ||
  Platform.OS === 'android' ||
  Platform.OS === 'windows';

let ENABLE_SCREENS = isNativePlatformSupported;

export const enableScreens = (shouldEnableScreens = true) => {
  ENABLE_SCREENS = isNativePlatformSupported && shouldEnableScreens;
  if (ENABLE_SCREENS && !UIManager.getViewManagerConfig('RNSScreen')) {
    console.error(
      `Screen native module hasn't been linked. Please check the react-native-screens README for more details`
    );
  }
};

let ENABLE_FREEZE = false;

export const enableFreeze = (shouldEnableReactFreeze = true) => {
  const minor = parseInt(version.split('.')[1]); // eg. takes 66 from '0.66.0'

  // react-freeze requires react-native >=0.64, react-native from main is 0.0.0
  if (!(minor === 0 || minor >= 64) && shouldEnableReactFreeze) {
    console.warn(
      'react-freeze library requires at least react-native 0.64. Please upgrade your react-native version in order to use this feature.'
    );
  }

  ENABLE_FREEZE = shouldEnableReactFreeze;
};

export const screensEnabled = () => {
  return ENABLE_SCREENS;
};

export const freezeEnabled = () => {
  return ENABLE_FREEZE;
};
