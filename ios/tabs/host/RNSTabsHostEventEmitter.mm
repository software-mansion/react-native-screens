#import "RNSTabsHostEventEmitter.h"

#import <React/RCTLog.h>
#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import "RNSConversions.h"
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSTabsHostEventEmitter {
#if RCT_NEW_ARCH_ENABLED
  std::shared_ptr<const react::RNSTabsHostIOSEventEmitter> _reactEventEmitter;
#endif // RCT_NEW_ARCH_ENABLED
}

- (instancetype)init
{
  if (self = [super init]) {
#if RCT_NEW_ARCH_ENABLED
    _reactEventEmitter = nullptr;
#endif // RCT_NEW_ARCH_ENABLED
  }
  return self;
}

#if RCT_NEW_ARCH_ENABLED
- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSTabsHostIOSEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}
#endif // RCT_NEW_ARCH_ENABLED

- (BOOL)emitOnTabSelected:(OnTabSelectedPayload)payload
{
  if (_reactEventEmitter != nullptr) {
    auto convertedActionOrigin =
        rnscreens::conversion::RNSOnTabSelectedActionOriginFromRNSTabsActionOrigin(payload.actionOrigin);
    _reactEventEmitter->onTabSelected(
        {.selectedScreenKey = RCTStringFromNSString(payload.selectedScreenKey),
         .provenance = payload.provenance,
         .isRepeated = static_cast<bool>(payload.isRepeated),
         .hasTriggeredSpecialEffect = static_cast<bool>(payload.hasTriggeredSpecialEffect),
         .actionOrigin = convertedActionOrigin});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnTabSelected event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnTabSelectionRejected:(OnTabSelectionRejectedPayload)payload
{
  if (_reactEventEmitter != nullptr) {
    auto convertedReason =
        rnscreens::conversion::RNSOnTabSelectionRejectedRejectionReasonFromRNSTabsNavigationStateRejectionReason(
            payload.rejectionReason);
    _reactEventEmitter->onTabSelectionRejected(
        {.selectedScreenKey = RCTStringFromNSString(payload.currentNavState.selectedScreenKey),
         .provenance = payload.currentNavState.provenance,
         .rejectedScreenKey = RCTStringFromNSString(payload.rejectedRequest.selectedScreenKey),
         .rejectedBaseProvenance = payload.rejectedRequest.baseProvenance,
         .rejectionReason = convertedReason});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnTabSelectionRejected event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnTabSelectionPrevented:(OnTabSelectionPreventedPayload)payload
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onTabSelectionPrevented(
        {.selectedScreenKey = RCTStringFromNSString(payload.currentNavState.selectedScreenKey),
         .provenance = payload.currentNavState.provenance,
         .preventedScreenKey = RCTStringFromNSString(payload.preventedScreenKey)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnTabSelectionPrevented event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnMoreTabSelected:(OnMoreTabSelectedPayload)payload
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onMoreTabSelected(
        {.selectedScreenKey = RCTStringFromNSString(payload.currentNavState.selectedScreenKey),
         .provenance = payload.currentNavState.provenance});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnMoreTabSelected event emission due to nullish emitter");
    return NO;
  }
}

@end
