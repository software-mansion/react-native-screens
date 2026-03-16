// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#import "RNSSafeAreaViewManager.h"

#if !RCT_NEW_ARCH_ENABLED
#import "RNSSafeAreaViewComponentView.h"
#import "RNSSafeAreaViewEdges.h"
#import "RNSSafeAreaViewShadowView.h"

@implementation RNSSafeAreaViewManager

RCT_EXPORT_MODULE(RNSSafeAreaView)

- (UIView *)view
{
  return [[RNSSafeAreaViewComponentView alloc] initWithBridge:self.bridge];
}

- (RNSSafeAreaViewShadowView *)shadowView
{
  return [RNSSafeAreaViewShadowView new];
}

RCT_EXPORT_VIEW_PROPERTY(edges, RNSSafeAreaViewEdges)

@end
#endif // !RCT_NEW_ARCH_ENABLED
