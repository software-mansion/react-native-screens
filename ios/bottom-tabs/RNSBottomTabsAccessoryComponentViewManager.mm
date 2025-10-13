#import "RNSBottomTabsAccessoryComponentViewManager.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTImageLoader.h>
#import "RNSBottomTabsAccessoryComponentView.h"
#endif

@implementation RNSBottomTabsAccessoryComponentViewManager

// TODO: This seems to be legacy arch only - test & remove when no longer needed

RCT_EXPORT_MODULE(RNSBottomTabsAccessoryManager)

#if !RCT_NEW_ARCH_ENABLED

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
- (UIView *)view
{
  // For Paper, we need to initialize TabsAccessory with bridge
  return [[RNSBottomTabsAccessoryComponentView alloc] initWithFrame:CGRectZero bridge:self.bridge];
}

#pragma mark - LEGACY Events

RCT_EXPORT_VIEW_PROPERTY(onEnvironmentChange, RCTDirectEventBlock);

#else // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

- (UIView *)view
{
  return [RNSBottomTabsAccessoryComponentView new];
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#endif // !RCT_NEW_ARCH_ENABLED

@end
