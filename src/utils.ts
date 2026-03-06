import { BackHandler, Platform } from 'react-native';
import { featureFlags } from './flags';

export const isSearchBarAvailableForCurrentPlatform = [
  'ios',
  'android',
].includes(Platform.OS);

export const isHeaderBarButtonsAvailableForCurrentPlatform =
  Platform.OS === 'ios';

export function executeNativeBackPress() {
  // This function invokes the native back press event
  BackHandler.exitApp();
  return true;
}

type OptionalBoolean = 'undefined' | 'false' | 'true';
export function parseBooleanToOptionalBooleanNativeProp(
  prop: boolean | undefined,
): OptionalBoolean {
  switch (prop) {
    case undefined:
      return 'undefined';
    case true:
      return 'true';
    case false:
      return 'false';
  }
}

export const RNSLog = {
  log: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.log(message, ...args);
    }
  },
  warn: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.warn(message, ...args);
    }
  },
  error: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.error(message, ...args);
    }
  },
  info: (message?: any, ...args: any[]) => {
    if (featureFlags.stable.debugLogging) {
      console.info(message, ...args);
    }
  },
};
