#import "RNSTabsBottomAccessoryWrapperView.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@implementation RNSTabsBottomAccessoryWrapperView

- (CGSize)sizeThatFits:(CGSize)size
{
  // In regular width (e.g. iPad), UIKit asks the content view for its size and uses
  // the answer if it is smaller than the proposed size (unless Auto Layout is used).
  //
  // Default implementation returns current bounds, therefore the accessory keeps stale
  // width when available space grows (e.g. after hiding the sidebar or rotating the
  // device). By returning the proposed size, we make sure that the accessory always
  // takes full available width.
  // See https://github.com/software-mansion/react-native-screens/issues/4728.
  return size;
}

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
