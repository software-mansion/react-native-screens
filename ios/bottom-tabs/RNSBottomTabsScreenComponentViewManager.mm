#import "RNSBottomTabsScreenComponentViewManager.h"

#if !RCT_NEW_ARCH_ENABLED
#import "RNSBottomTabsScreenComponentView.h"
#endif // !RCT_NEW_ARCH_ENABLED

@implementation RNSBottomTabsScreenComponentViewManager

// TODO: This seems to be legacy arch only - remove when no longer needed

RCT_EXPORT_MODULE(RNSBottomTabsScreenManager)

#if !RCT_NEW_ARCH_ENABLED
- (UIView *)view
{
  // This uses main initializer for Fabric implementation.
  return [[RNSBottomTabsScreenComponentView alloc] initWithFrame:CGRectZero];
}

RCT_EXPORT_VIEW_PROPERTY(tabKey, NSString);

RCT_REMAP_VIEW_PROPERTY(isFocused, isSelectedScreen, BOOL);
RCT_EXPORT_VIEW_PROPERTY(title, NSString);
RCT_EXPORT_VIEW_PROPERTY(orientation, RNSOrientation);
RCT_EXPORT_VIEW_PROPERTY(badgeValue, NSString);

RCT_EXPORT_VIEW_PROPERTY(standardAppearance, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(scrollEdgeAppearance, NSDictionary);

RCT_EXPORT_VIEW_PROPERTY(iconType, RNSBottomTabsIconType);
RCT_EXPORT_VIEW_PROPERTY(iconImageSource, RCTImageSource);
RCT_EXPORT_VIEW_PROPERTY(iconSfSymbolName, NSString);
RCT_EXPORT_VIEW_PROPERTY(selectedIconImageSource, RCTImageSource);
RCT_EXPORT_VIEW_PROPERTY(selectedIconSfSymbolName, NSString);

RCT_EXPORT_VIEW_PROPERTY(shouldUseRepeatedTabSelectionPopToRootSpecialEffect, BOOL);
RCT_EXPORT_VIEW_PROPERTY(shouldUseRepeatedTabSelectionScrollToTopSpecialEffect, BOOL);

RCT_EXPORT_VIEW_PROPERTY(overrideScrollViewContentInsetAdjustmentBehavior, BOOL);

RCT_EXPORT_VIEW_PROPERTY(systemItem, RNSBottomTabsScreenSystemItem);

RCT_EXPORT_VIEW_PROPERTY(onWillAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onWillDisappear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDidAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDidDisappear, RCTDirectEventBlock);

#endif // !RCT_NEW_ARCH_ENABLED

@end
