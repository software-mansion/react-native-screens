#pragma once

#if defined(__cplusplus)
#import <React/RCTImageSource.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

std::optional<UIBlurEffectStyle>
RNSMaybeUIBlurEffectStyleFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect);

UIBlurEffect *RNSUIBlurEffectFromRNSBlurEffectStyle(
    RNSBlurEffectStyle blurEffect);

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
API_AVAILABLE(ios(26.0))
UITabBarMinimizeBehavior
UITabBarMinimizeBehaviorFromRNSBottomTabsTabBarMinimizeBehavior(
    react::RNSBottomTabsTabBarMinimizeBehavior tabBarMinimizeBehavior);
#endif // Check for iOS >= 26

RNSBlurEffectStyle
RNSBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect);

UIOffset RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct
        titlePositionAdjustment);

RNSBottomTabsIconType RNSBottomTabsIconTypeFromIcon(
    react::RNSBottomTabsScreenIconType iconType);

RCTImageSource *RCTImageSourceFromImageSourceAndIconType(
    const facebook::react::ImageSource *imageSource,
    RNSBottomTabsIconType iconType);

#pragma mark SplitViewHost props

UISplitViewControllerSplitBehavior SplitViewSplitBehaviorFromHostProp(
    react::RNSSplitViewHostSplitBehavior behavior);

UISplitViewControllerPrimaryEdge SplitViewPrimaryEdgeFromHostProp(
    react::RNSSplitViewHostPrimaryEdge primaryEdge);

UISplitViewControllerDisplayMode SplitViewDisplayModeFromHostProp(
    react::RNSSplitViewHostDisplayMode displayMode);

UISplitViewControllerDisplayModeButtonVisibility
SplitViewDisplayModeButtonVisibilityFromHostProp(
    react::RNSSplitViewHostDisplayModeButtonVisibility
        displayModeButtonVisibility);

#pragma mark SplitViewScreen props

RNSSplitViewScreenColumnType RNSSplitViewScreenColumnTypeFromScreenProp(
    react::RNSSplitViewScreenColumnType columnType);

}; // namespace rnscreens::conversion

#endif
