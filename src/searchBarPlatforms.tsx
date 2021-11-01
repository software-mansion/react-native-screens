import { Platform } from 'react-native';

export const isSearchBarAvailableForCurrentPlatform = [
  'ios',
  'android',
].includes(Platform.OS);
