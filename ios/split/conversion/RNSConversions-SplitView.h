#pragma once

#if defined(__cplusplus)

#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <optional>
#import <string>
#import "RNSEnums.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

#pragma mark SplitHost props

UISplitViewControllerSplitBehavior SplitViewPreferredSplitBehaviorFromHostProp(
    react::RNSSplitHostPreferredSplitBehavior behavior);

UISplitViewControllerPrimaryEdge SplitViewPrimaryEdgeFromHostProp(
    react::RNSSplitHostPrimaryEdge primaryEdge);

UISplitViewControllerDisplayMode SplitViewPreferredDisplayModeFromHostProp(
    react::RNSSplitHostPreferredDisplayMode displayMode);

#if !TARGET_OS_TV
UISplitViewControllerBackgroundStyle
SplitViewPrimaryBackgroundStyleFromHostProp(
    react::RNSSplitHostPrimaryBackgroundStyle primaryBackgroundStyle);
#endif // !TARGET_OS_TV

UISplitViewControllerDisplayModeButtonVisibility
SplitViewDisplayModeButtonVisibilityFromHostProp(
    react::RNSSplitHostDisplayModeButtonVisibility displayModeButtonVisibility);

std::string UISplitViewControllerDisplayModeToString(
    UISplitViewControllerDisplayMode displayMode);

std::optional<UISplitViewControllerColumn>
SplitViewTopColumnForCollapsingFromHostProp(
    react::RNSSplitHostTopColumnForCollapsing topColumnForCollapsing);

RNSOrientation RNSOrientationFromRNSSplitHostOrientation(
    react::RNSSplitHostOrientation orientation);

UIUserInterfaceStyle UIUserInterfaceStyleFromHostProp(
    react::RNSSplitHostColorScheme colorScheme);

#pragma mark SplitScreen props

RNSSplitScreenColumnType RNSSplitScreenColumnTypeFromScreenProp(
    react::RNSSplitScreenColumnType columnType);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
