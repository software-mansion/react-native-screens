#import "RNSTabsHostComponentViewManager.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTImageLoader.h>
#import "RNSTabsHostComponentView.h"
#endif

@implementation RNSTabsHostComponentViewManager

// TODO: This seems to be legacy arch only - test & remove when no longer needed

RCT_EXPORT_MODULE(RNSTabsHostManager)

#if !RCT_NEW_ARCH_ENABLED

- (UIView *)view
{
  // For Paper, we need to initialize TabsHost with RCTImageLoader from bridge
  return [[RNSTabsHostComponentView alloc] initWithFrame:CGRectZero
                                        reactImageLoader:[self.bridge moduleForClass:[RCTImageLoader class]]];
}

#pragma mark - LEGACY Props

RCT_EXPORT_VIEW_PROPERTY(tabBarTintColor, UIColor);
RCT_EXPORT_VIEW_PROPERTY(tabBarHidden, BOOL);
RCT_EXPORT_VIEW_PROPERTY(nativeContainerBackgroundColor, UIColor);
// This remapping allows us to store UITabBarMinimizeBehavior in the component while accepting a custom enum as input
// from JS.
RCT_REMAP_VIEW_PROPERTY(
    tabBarMinimizeBehavior,
    tabBarMinimizeBehaviorFromRNSTabBarMinimizeBehavior,
    RNSTabBarMinimizeBehavior);
// This remapping allows us to store UITabBarControllerMode in the component while accepting a custom enum as input
// from JS.
RCT_REMAP_VIEW_PROPERTY(tabBarControllerMode, tabBarControllerModeFromRNSTabBarControllerMode, RNSTabBarControllerMode);

// TODO: Missing prop
//@property (nonatomic, readonly) BOOL experimental_controlNavigationStateInJS;

#pragma mark - LEGACY Events

RCT_EXPORT_VIEW_PROPERTY(onNativeFocusChange, RCTDirectEventBlock);

#endif

@end
