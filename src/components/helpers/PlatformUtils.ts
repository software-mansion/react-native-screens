import { Platform } from 'react-native';

export const isIOS26OrHigher =
  Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 26;
