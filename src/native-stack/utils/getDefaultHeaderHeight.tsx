import { Platform } from 'react-native';
import { StackPresentationTypes } from 'react-native-screens';
type Layout = { width: number; height: number };

const formSheetModalHeight = 56;

export default function getDefaultHeaderHeight(
  layout: Layout,
  topInset: number,
  stackPresentation: StackPresentationTypes
): number {
  // default header heights
  let headerHeight = Platform.OS === 'android' ? 56 : 64;
  let statusBarHeight = topInset;

  if (Platform.OS === 'ios') {
    const isLandscape = layout.width > layout.height;
    const isFromSheetModal =
      stackPresentation === 'modal' || stackPresentation === 'formSheet';
    if (isFromSheetModal && !isLandscape) {
      // `modal` and `formSheet` presentations do not take whole screen, so should not take the inset.
      statusBarHeight = 0;
    }

    if (Platform.isPad || Platform.isTVOS) {
      headerHeight = isFromSheetModal ? formSheetModalHeight : 50;
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        headerHeight = isFromSheetModal ? formSheetModalHeight : 44;
      }
    }
  }

  return headerHeight + statusBarHeight;
}
