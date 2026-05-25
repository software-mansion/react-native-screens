#pragma once

#if defined(__cplusplus)
#import <React/RCTImageSource.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <optional>
#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSTabsNavigationState.h"

#import <folly/dynamic.h>

namespace rnscreens::conversion {

namespace react = facebook::react;

// copied from FollyConvert.mm
id RNSConvertFollyDynamicToId(const folly::dynamic &dyn);

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromString(NSString *blurEffectString);

UIBlurEffect *RNSUIBlurEffectFromString(NSString *blurEffectString);

std::optional<UIBlurEffectStyle> RNSMaybeUIBlurEffectStyleFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect);

UIBlurEffect *RNSUIBlurEffectFromRNSBlurEffectStyle(RNSBlurEffectStyle blurEffect);

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

API_AVAILABLE(ios(26.0))
UITabBarMinimizeBehavior UITabBarMinimizeBehaviorFromRNSTabsHostTabBarMinimizeBehavior(
    react::RNSTabsHostIOSTabBarMinimizeBehavior tabBarMinimizeBehavior);

#endif // Check for iOS >= 26

#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)

API_AVAILABLE(ios(18.0))
UITabBarControllerMode UITabBarControllerModeFromRNSTabsHostTabBarControllerMode(
    react::RNSTabsHostIOSTabBarControllerMode tabBarControllerMode);

#endif // Check for iOS >= 18

react::RNSTabsHostIOSEventEmitter::OnTabSelectionRejectedRejectionReason
RNSOnTabSelectionRejectedRejectionReasonFromRNSTabsNavigationStateRejectionReason(
    RNSTabsNavigationStateRejectionReason reason);

react::RNSTabsHostIOSEventEmitter::OnTabSelectedActionOrigin RNSOnTabSelectedActionOriginFromRNSTabsActionOrigin(
    RNSTabsActionOrigin actionOrigin);

RNSTabsIconType RNSTabsIconTypeFromIcon(react::RNSTabsScreenIOSIconType iconType);

RNSTabsScreenSystemItem RNSTabsScreenSystemItemFromReactRNSTabsScreenSystemItem(
    react::RNSTabsScreenIOSSystemItem systemItem);

UITabBarSystemItem RNSTabsScreenSystemItemToUITabBarSystemItem(RNSTabsScreenSystemItem systemItem);

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

API_AVAILABLE(ios(26.0))
std::optional<react::RNSTabsBottomAccessoryEventEmitter::OnEnvironmentChangeEnvironment>
RNSTabsBottomAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(UITabAccessoryEnvironment environment);

RNSTabsBottomAccessoryEnvironment RNSTabsBottomAccessoryEnvironmentFromCppEquivalent(
    react::RNSTabsBottomAccessoryContentEnvironment environment);

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

UIUserInterfaceStyle UIUserInterfaceStyleFromTabsScreenCppEquivalent(
    react::RNSTabsScreenIOSUserInterfaceStyle userInterfaceStyle);

RCTImageSource *RCTImageSourceFromImageSourceAndIconType(const facebook::react::ImageSource *imageSource,
                                                         RNSTabsIconType iconType);

RNSOrientation RNSOrientationFromRNSTabsScreenOrientation(react::RNSTabsScreenIOSOrientation orientation);

#if !TARGET_OS_TV
UIInterfaceOrientationMask UIInterfaceOrientationMaskFromRNSOrientation(RNSOrientation orientation);

RNSOrientation RNSOrientationFromUIInterfaceOrientationMask(UIInterfaceOrientationMask orientationMask);
#endif // !TARGET_OS_TV

UITraitEnvironmentLayoutDirection UITraitEnvironmentLayoutDirectionFromTabsHostCppEquivalent(
    react::RNSTabsHostIOSLayoutDirection layoutDirection);

UIUserInterfaceStyle UIUserInterfaceStyleFromHostProp(react::RNSTabsHostIOSColorScheme colorScheme);

#pragma mark SplitHost props

UISplitViewControllerSplitBehavior SplitViewPreferredSplitBehaviorFromHostProp(
    react::RNSSplitHostPreferredSplitBehavior behavior);

UISplitViewControllerPrimaryEdge SplitViewPrimaryEdgeFromHostProp(react::RNSSplitHostPrimaryEdge primaryEdge);

UISplitViewControllerDisplayMode SplitViewPreferredDisplayModeFromHostProp(
    react::RNSSplitHostPreferredDisplayMode displayMode);

#if !TARGET_OS_TV
UISplitViewControllerBackgroundStyle SplitViewPrimaryBackgroundStyleFromHostProp(
    react::RNSSplitHostPrimaryBackgroundStyle primaryBackgroundStyle);
#endif // !TARGET_OS_TV

UISplitViewControllerDisplayModeButtonVisibility SplitViewDisplayModeButtonVisibilityFromHostProp(
    react::RNSSplitHostDisplayModeButtonVisibility displayModeButtonVisibility);

std::string UISplitViewControllerDisplayModeToString(UISplitViewControllerDisplayMode displayMode);

std::optional<UISplitViewControllerColumn> SplitViewTopColumnForCollapsingFromHostProp(
    react::RNSSplitHostTopColumnForCollapsing topColumnForCollapsing);

RNSOrientation RNSOrientationFromRNSSplitHostOrientation(react::RNSSplitHostOrientation orientation);

UIUserInterfaceStyle UIUserInterfaceStyleFromHostProp(react::RNSSplitHostColorScheme colorScheme);

#pragma mark SplitScreen props

RNSSplitScreenColumnType RNSSplitScreenColumnTypeFromScreenProp(react::RNSSplitScreenColumnType columnType);

}; // namespace rnscreens::conversion

#if RNS_GAMMA_ENABLED

#import "RNSConversions-ScrollViewMarker.h"
#import "RNSConversions-Stack.h"

#endif // RNS_GAMMA_ENABLED

#endif // defined(__cplusplus)
