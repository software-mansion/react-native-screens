#import "RNSConversions-Stack.h"
#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import "RNSDefines.h"

namespace rnscreens::conversion {

namespace react = facebook::react;

std::vector<std::string> RNSStdStringVectorFromNSStringArray(NSArray<NSString *> *strings)
{
  std::vector<std::string> result;
  result.reserve(strings.count);
  for (NSString *string in strings) {
    result.push_back(RCTStringFromNSString(string));
  }
  return result;
}

react::RNSStackHostEventEmitter::OnNavStateChangedActionOrigin RNSOnNavStateChangedActionOriginFromRNSStackActionOrigin(
    RNSStackActionOrigin actionOrigin)
{
  using enum react::RNSStackHostEventEmitter::OnNavStateChangedActionOrigin;
  switch (actionOrigin) {
    case RNSStackActionOriginUser:
      return User;
    case RNSStackActionOriginProgrammaticJs:
      return ProgrammaticJs;
    case RNSStackActionOriginProgrammaticNative:
      return ProgrammaticNative;
    case RNSStackActionOriginImplicit:
      return Implicit;
    default:
      RCTLogError(@"[RNScreens] Unexpected actionOrigin: %ld", static_cast<long>(actionOrigin));
      return User;
  }
}

react::RNSStackHostEventEmitter::OnNavStateRequestRejectedRejectionReason
RNSOnNavStateRequestRejectedRejectionReasonFromRNSStackNavigationStateRejectionReason(
    RNSStackNavigationStateRejectionReason reason)
{
  using enum react::RNSStackHostEventEmitter::OnNavStateRequestRejectedRejectionReason;
  switch (reason) {
    case RNSStackNavigationStateRejectionReasonStale:
      return Stale;
    case RNSStackNavigationStateRejectionReasonRepeated:
      return Repeated;
    case RNSStackNavigationStateRejectionReasonInvalid:
      return Invalid;
    default:
      RCTLogError(@"[RNScreens] Unexpected rejectionReason: %ld", static_cast<long>(reason));
      return Invalid;
  }
}

RNSHeaderItemPlacement RNSHeaderItemPlacementFromReactRNSStackHeaderItemIOSPlacement(
    react::RNSStackHeaderItemIOSPlacement placement)
{
  switch (placement) {
    case react::RNSStackHeaderItemIOSPlacement::Leading:
      return RNSHeaderItemPlacementLeading;
    case react::RNSStackHeaderItemIOSPlacement::Trailing:
      return RNSHeaderItemPlacementTrailing;
    case react::RNSStackHeaderItemIOSPlacement::Title:
      return RNSHeaderItemPlacementTitle;
    case react::RNSStackHeaderItemIOSPlacement::Subtitle:
      return RNSHeaderItemPlacementSubtitle;
    case react::RNSStackHeaderItemIOSPlacement::LargeSubtitle:
      return RNSHeaderItemPlacementLargeSubtitle;
  }
}

UIBarButtonItemStyle UIBarButtonItemStyleFromReactRNSStackHeaderItemIOSVariant(
    react::RNSStackHeaderItemIOSVariant variant)
{
  switch (variant) {
    case react::RNSStackHeaderItemIOSVariant::Plain:
      return UIBarButtonItemStylePlain;
    case react::RNSStackHeaderItemIOSVariant::Prominent:
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      if (@available(iOS 26.0, *)) {
        return UIBarButtonItemStyleProminent;
      }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      // Bold text look, closest counterpart of prominent style before iOS 26
      return UIBarButtonItemStyleDone;
  }
}

RNSHeaderItemSpacerPlacement RNSHeaderItemSpacerPlacementFromReactRNSStackHeaderItemSpacerIOSPlacement(
    react::RNSStackHeaderItemSpacerIOSPlacement placement)
{
  switch (placement) {
    case react::RNSStackHeaderItemSpacerIOSPlacement::Leading:
      return RNSHeaderItemSpacerPlacementLeading;
    case react::RNSStackHeaderItemSpacerIOSPlacement::Trailing:
      return RNSHeaderItemSpacerPlacementTrailing;
  }
}

UINavigationItemBackButtonDisplayMode
UINavigationItemBackButtonDisplayModeFromReactRNSStackHeaderConfigIOSBackButtonDisplayMode(
    react::RNSStackHeaderConfigIOSBackButtonDisplayMode displayMode)
{
  switch (displayMode) {
    case react::RNSStackHeaderConfigIOSBackButtonDisplayMode::Default:
      return UINavigationItemBackButtonDisplayModeDefault;
    case react::RNSStackHeaderConfigIOSBackButtonDisplayMode::Generic:
      return UINavigationItemBackButtonDisplayModeGeneric;
    case react::RNSStackHeaderConfigIOSBackButtonDisplayMode::Minimal:
      return UINavigationItemBackButtonDisplayModeMinimal;
  }
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_VISION && !TARGET_OS_TV

UIBarMinimizationBehavior UIBarMinimizationBehaviorFromReactRNSStackHeaderConfigIOSMinimizationBehavior(
    react::RNSStackHeaderConfigIOSMinimizationBehavior minimizationBehavior)
{
  switch (minimizationBehavior) {
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::Automatic:
      return UIBarMinimizationBehaviorAutomatic;
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::Never:
      return UIBarMinimizationBehaviorNever;
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::OnScrollDown:
      return UIBarMinimizationBehaviorOnScrollDown;
    case react::RNSStackHeaderConfigIOSMinimizationBehavior::OnScrollUp:
      return UIBarMinimizationBehaviorOnScrollUp;
  }
}

UIBarMinimizationRestorationBehavior
UIBarMinimizationRestorationBehaviorFromReactRNSStackHeaderConfigIOSRestorationBehavior(
    react::RNSStackHeaderConfigIOSRestorationBehavior restorationBehavior)
{
  switch (restorationBehavior) {
    case react::RNSStackHeaderConfigIOSRestorationBehavior::Automatic:
      return UIBarMinimizationRestorationBehaviorAutomatic;
    case react::RNSStackHeaderConfigIOSRestorationBehavior::AtScrollEdge:
      return UIBarMinimizationRestorationBehaviorAtScrollEdge;
  }
}

UIBarMinimizationSafeAreaAdjustment
UIBarMinimizationSafeAreaAdjustmentFromReactRNSStackHeaderConfigIOSSafeAreaAdjustment(
    react::RNSStackHeaderConfigIOSSafeAreaAdjustment safeAreaAdjustment)
{
  switch (safeAreaAdjustment) {
    case react::RNSStackHeaderConfigIOSSafeAreaAdjustment::Automatic:
      return UIBarMinimizationSafeAreaAdjustmentAutomatic;
    case react::RNSStackHeaderConfigIOSSafeAreaAdjustment::Enabled:
      return UIBarMinimizationSafeAreaAdjustmentEnabled;
    case react::RNSStackHeaderConfigIOSSafeAreaAdjustment::Disabled:
      return UIBarMinimizationSafeAreaAdjustmentDisabled;
  }
}

#endif // Check for iOS >= 27 && !TARGET_OS_VISION && !TARGET_OS_TV

RNSHeaderItemVisibilityPriority RNSHeaderItemVisibilityPriorityFromReactRNSStackHeaderItemIOSVisibilityPriority(
    react::RNSStackHeaderItemIOSVisibilityPriority visibilityPriority)
{
  switch (visibilityPriority) {
    case react::RNSStackHeaderItemIOSVisibilityPriority::Low:
      return RNSHeaderItemVisibilityPriorityLow;
    case react::RNSStackHeaderItemIOSVisibilityPriority::Standard:
      return RNSHeaderItemVisibilityPriorityStandard;
    case react::RNSStackHeaderItemIOSVisibilityPriority::High:
      return RNSHeaderItemVisibilityPriorityHigh;
  }
}

}; // namespace rnscreens::conversion
