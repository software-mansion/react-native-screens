import { BackHandler, Platform } from 'react-native';

export const isSearchBarAvailableForCurrentPlatform = [
  'ios',
  'android',
].includes(Platform.OS);

export function executeNativeBackPress() {
  // This function invokes the native back press event
  BackHandler.exitApp();
  return true;
}
