#pragma once

#if defined(__cplusplus)
#import <react/renderer/components/rnscreens/Props.h>
#import <React/RCTImageSource.h>
#import "RNSEnums.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

std::optional<UIBlurEffectStyle>
RNSMaybeUIBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(
    react::RNSBottomTabsTabBarBlurEffect blurEffect);

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsTabBarBlurEffect(
    react::RNSBottomTabsTabBarBlurEffect blurEffect);

UIOffset RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct
        titlePositionAdjustment);

std::optional<UIBlurEffectStyle>
RNSMaybeUIBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect);

UIBlurEffect *RNSUIBlurEffectFromRNSBottomTabsScreenTabBarBlurEffect(
    react::RNSBottomTabsScreenTabBarBlurEffect blurEffect);

UIOffset RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct(
    react::RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct
        titlePositionAdjustment);

RNSBottomTabsIconType RNSBottomTabsIconTypeFromIcon(react::RNSBottomTabsScreenIconType iconType);

RCTImageSource *RCTImageSourceFromImageSourceAndIconType(
    const facebook::react::ImageSource *imageSource,
    RNSBottomTabsIconType iconType);

#pragma mark SplitView

UISplitViewControllerSplitBehavior SplitViewSplitBehaviorFromHostProp(
    react::RNSSplitViewHostSplitBehavior behavior);

UISplitViewControllerPrimaryEdge SplitViewPrimaryEdgeFromHostProp(
    react::RNSSplitViewHostPrimaryEdge primaryEdge);

UISplitViewControllerDisplayMode SplitViewDisplayModeFromHostProp(
    react::RNSSplitViewHostDisplayMode displayMode);

}; // namespace rnscreens::conversion

#endif
