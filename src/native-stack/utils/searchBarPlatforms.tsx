import { Platform } from 'react-native';

export function isSearchBarAvailable() {
  return ['ios', 'android'].includes(Platform.OS);
}
