import { Platform } from 'react-native';

export const IS_SEARCH_BAR_AVAILABLE = ['ios', 'android'].includes(Platform.OS);
