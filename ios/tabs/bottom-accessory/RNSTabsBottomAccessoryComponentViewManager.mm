#import "RNSTabsBottomAccessoryComponentViewManager.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTImageLoader.h>
#import "RNSTabsBottomAccessoryComponentView.h"

@implementation RNSTabsBottomAccessoryComponentViewManager

// TODO: This is legacy arch only - remove when no longer needed

RCT_EXPORT_MODULE(RNSTabsBottomAccessoryManager)

- (UIView *)view
{
  // For Paper, we need to initialize TabsAccessory with bridge
  return [[RNSTabsBottomAccessoryComponentView alloc] initWithFrame:CGRectZero bridge:self.bridge];
}

#pragma mark - LEGACY Events

RCT_EXPORT_VIEW_PROPERTY(onEnvironmentChange, RCTDirectEventBlock);

@end

#endif // !RCT_NEW_ARCH_ENABLED
