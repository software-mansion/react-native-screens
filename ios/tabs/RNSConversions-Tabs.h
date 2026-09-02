#pragma once

#if defined(__cplusplus)

#import <React/RCTImageSource.h>
#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <optional>
#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSTabsNavigationState.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

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

std::optional<UITabBarSystemItem> RNSTabsScreenSystemItemToUITabBarSystemItem(RNSTabsScreenSystemItem systemItem);

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

UITraitEnvironmentLayoutDirection UITraitEnvironmentLayoutDirectionFromTabsHostCppEquivalent(
    react::RNSTabsHostIOSLayoutDirection layoutDirection);

UIUserInterfaceStyle UIUserInterfaceStyleFromHostProp(react::RNSTabsHostIOSColorScheme colorScheme);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
