#ifndef RNSUtils_h
#define RNSUtils_h

#import "../RNSEnums.h"

int getDefaultHeaderHeight(
    int layoutWidth,
    int layoutHeight,
    int topInset,
    RNSScreenStackPresentation stackPresentation)
{
  const int formSheetModalHeight{56};
  int headerHeight{64};
  int statusBarHeight = topInset;

  const bool isLandscape = layoutWidth > layoutHeight;
  const bool isFormSheetModal =
      stackPresentation == RNSScreenStackPresentationModal || stackPresentation == RNSScreenStackPresentationFormSheet;

  if (!isLandscape && isFormSheetModal) {
    statusBarHeight = 0;
  }

  // check for isPad is TV
  UIUserInterfaceIdiom interfaceIdiom = [[UIDevice currentDevice] userInterfaceIdiom];
  if (interfaceIdiom == UIUserInterfaceIdiomPad || UIUserInterfaceIdiomTV) {
    headerHeight = isFormSheetModal ? formSheetModalHeight : 50;
  } else if (isLandscape) {
    headerHeight = 32;
  } else {
    headerHeight = isFormSheetModal ? formSheetModalHeight : 44;
  }

  return headerHeight + statusBarHeight;
}

#endif /* RNSUtils_h */
