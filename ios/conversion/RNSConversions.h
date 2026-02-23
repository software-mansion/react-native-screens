#pragma once

#if defined(__cplusplus)
#import <React/RCTImageSource.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <optional>
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
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSTabsHostTabBarMinimizeBehavior(
    react::RNSTabsHostTabBarMinimizeBehavior tabBarMinimizeBehavior);
#else // RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSTabBarMinimizeBehavior(
    RNSTabBarMinimizeBehavior tabBarMinimizeBehavior);
#endif // RCT_NEW_ARCH_ENABLED

#endif // Check for iOS >= 26

#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)

#if RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(18.0))
UITabBarControllerMode UITabBarControllerModeFromRNSTabsHostTabBarControllerMode(
    react::RNSTabsHostTabBarControllerMode tabBarControllerMode);
#else // RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(18.0))
UITabBarControllerMode UITabBarControllerModeFromRNSTabBarControllerMode(RNSTabBarControllerMode tabBarControllerMode);
#endif // RCT_NEW_ARCH_ENABLED

#endif // Check for iOS >= 18

RNSTabsIconType RNSTabsIconTypeFromIcon(react::RNSTabsScreenIconType iconType);

RNSTabsScreenSystemItem RNSTabsScreenSystemItemFromReactRNSTabsScreenSystemItem(
    react::RNSTabsScreenSystemItem systemItem);

UITabBarSystemItem RNSTabsScreenSystemItemToUITabBarSystemItem(RNSTabsScreenSystemItem systemItem);

RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenBottomScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenBottomScrollEdgeEffect edgeEffect);
RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenLeftScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenLeftScrollEdgeEffect edgeEffect);
RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenRightScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenRightScrollEdgeEffect edgeEffect);
RNSScrollEdgeEffect RNSTabsScrollEdgeEffectFromTabsScreenTopScrollEdgeEffectCppEquivalent(
    react::RNSTabsScreenTopScrollEdgeEffect edgeEffect);

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
std::optional<react::RNSTabsBottomAccessoryEventEmitter::OnEnvironmentChangeEnvironment>
RNSTabsBottomAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(UITabAccessoryEnvironment environment);

#if REACT_NATIVE_VERSION_MINOR >= 82
RNSTabsBottomAccessoryEnvironment RNSTabsBottomAccessoryEnvironmentFromCppEquivalent(
    react::RNSTabsBottomAccessoryContentEnvironment environment);
#endif // REACT_NATIVE_VERSION_MINOR >= 82
#else // RCT_NEW_ARCH_ENABLED
API_AVAILABLE(ios(26.0))
NSString *_Nullable RNSTabsBottomAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(
    UITabAccessoryEnvironment environment);
#endif // RCT_NEW_ARCH_ENABLED

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

UIUserInterfaceStyle UIUserInterfaceStyleFromTabsScreenCppEquivalent(
    react::RNSTabsScreenUserInterfaceStyle userInterfaceStyle);

RCTImageSource *RCTImageSourceFromImageSourceAndIconType(
    const facebook::react::ImageSource *imageSource,
    RNSTabsIconType iconType);

RNSOrientation RNSOrientationFromRNSTabsScreenOrientation(react::RNSTabsScreenOrientation orientation);

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

#if !TARGET_OS_TV
UISplitViewControllerBackgroundStyle SplitViewPrimaryBackgroundStyleFromHostProp(
    react::RNSSplitViewHostPrimaryBackgroundStyle primaryBackgroundStyle);
#endif // !TARGET_OS_TV

UISplitViewControllerDisplayModeButtonVisibility SplitViewDisplayModeButtonVisibilityFromHostProp(
    react::RNSSplitViewHostDisplayModeButtonVisibility displayModeButtonVisibility);

std::string UISplitViewControllerDisplayModeToString(UISplitViewControllerDisplayMode displayMode);

std::optional<UISplitViewControllerColumn> SplitViewTopColumnForCollapsingFromHostProp(
    react::RNSSplitViewHostTopColumnForCollapsing topColumnForCollapsing);

RNSOrientation RNSOrientationFromRNSSplitViewHostOrientation(react::RNSSplitViewHostOrientation orientation);

#pragma mark SplitViewScreen props

RNSSplitViewScreenColumnType RNSSplitViewScreenColumnTypeFromScreenProp(react::RNSSplitViewScreenColumnType columnType);

}; // namespace rnscreens::conversion

#if RCT_NEW_ARCH_ENABLED

#import "RNSConversions-Stack.h"

#endif // RCT_NEW_ARCH_ENABLED

#endif
