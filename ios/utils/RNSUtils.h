#ifndef RNSUtils_h
#define RNSUtils_h

struct Layout {
  int width;
  int height;
};

int getDefaultHeaderHeight(
    Layout layout,
    int topInset,
    RNSStackPresentation stackPresentation) {
  int headerHeight = 64;
  int statusBarHeight = topInset;

  const bool isLandscape = layout.width > layout.height;
  //  const bool isFormSheetModal = stackPresentation

  if (!isLandscape) {
    statusBarHeight = 0;
  }

  return headerHeight + statusBarHeight;
}

#endif /* RNSUtils_h */
