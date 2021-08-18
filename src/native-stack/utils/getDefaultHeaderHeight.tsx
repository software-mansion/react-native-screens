import { Platform } from 'react-native';

type Layout = { width: number; height: number };

export default function getDefaultHeaderHeight(
  layout: Layout,
  isModalPresentation: boolean,
  statusBarHeight: number
): number {
  // default header heights
  let headerHeight = Platform.OS === 'android' ? 56 : 64;

  const isLandscape = layout.width > layout.height;

  if (Platform.OS === 'ios') {
    if (Platform.isPad) {
      headerHeight = isModalPresentation ? 56 : 50;
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        headerHeight = isModalPresentation ? 56 : 44;
      }
    }
  }
  
  return headerHeight + statusBarHeight;
}
