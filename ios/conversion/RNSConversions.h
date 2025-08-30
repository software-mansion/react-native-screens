#pragma once

#if defined(__cplusplus)
#import <React/RCTImageSource.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSDefines.h"
#import "RNSEnums.h"

#if RCT_NEW_ARCH_ENABLED
#import <folly/dynamic.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace rnscreens::conversion {

namespace react = facebook::react;

#if RCT_NEW_ARCH_ENABLED

// copied from FollyConvert.mm
id RNSConvertFollyDynamicToId(const folly::dynamic &dyn);

#endif // RCT_NEW_ARCH_ENABLED

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromString(NSString *blurEffectString);

UIBlurEffect *RNSUIBlurEffectFromString(NSString *blurEffectString);

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect);

UIBlurEffect *RNSUIBlurEffectFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect);

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#if RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSBottomTabsTabBarMinimizeBehavior(
    react::RNSBottomTabsTabBarMinimizeBehavior tabBarMinimizeBehavior);
#else // RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSTabBarMinimizeBehavior(
    RNSTabBarMinimizeBehavior tabBarMinimizeBehavior);
#endif // RCT_NEW_ARCH_ENABLED

#endif // Check for iOS >= 26

RNSBottomTabsIconType RNSBottomTabsIconTypeFromIcon(react::RNSBottomTabsScreenIconType iconType);

RNSBottomTabsScreenSystemItem RNSBottomTabsScreenSystemItemFromReactRNSBottomTabsScreenSystemItem(
    react::RNSBottomTabsScreenSystemItem systemItem);

UITabBarSystemItem RNSBottomTabsScreenSystemItemToUITabBarSystemItem(RNSBottomTabsScreenSystemItem systemItem);

RCTImageSource *RCTImageSourceFromImageSourceAndIconType(
    const facebook::react::ImageSource *imageSource,
    RNSBottomTabsIconType iconType);

RNSOrientation RNSOrientationFromRNSBottomTabsScreenOrientation(react::RNSBottomTabsScreenOrientation orientation);

#if !TARGET_OS_TV
UIInterfaceOrientationMask UIInterfaceOrientationMaskFromRNSOrientation(RNSOrientation orientation);

RNSOrientation RNSOrientationFromUIInterfaceOrientationMask(UIInterfaceOrientationMask orientationMask);
#endif // !TARGET_OS_TV

#pragma mark SplitViewHost props

UISplitViewControllerSplitBehavior SplitViewPreferredSplitBehaviorFromHostProp(
    react::RNSSplitViewHostPreferredSplitBehavior behavior);

UISplitViewControllerPrimaryEdge SplitViewPrimaryEdgeFromHostProp(react::RNSSplitViewHostPrimaryEdge primaryEdge);

UISplitViewControllerDisplayMode SplitViewPreferredDisplayModeFromHostProp(
    react::RNSSplitViewHostPreferredDisplayMode displayMode);

UISplitViewControllerDisplayModeButtonVisibility SplitViewDisplayModeButtonVisibilityFromHostProp(
    react::RNSSplitViewHostDisplayModeButtonVisibility displayModeButtonVisibility);

std::string UISplitViewControllerDisplayModeToString(UISplitViewControllerDisplayMode displayMode);

RNSOrientation RNSOrientationFromRNSSplitViewHostOrientation(react::RNSSplitViewHostOrientation orientation);

#pragma mark SplitViewScreen props

RNSSplitViewScreenColumnType RNSSplitViewScreenColumnTypeFromScreenProp(react::RNSSplitViewScreenColumnType columnType);

}; // namespace rnscreens::conversion

#endif
