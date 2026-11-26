#import "RNSStackHostEventEmitter.h"

#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import "RNSConversions-Stack.h"

namespace react = facebook::react;

@implementation RNSStackHostEventEmitter {
  std::shared_ptr<const react::RNSStackHostEventEmitter> _reactEventEmitter;
}

- (instancetype)init
{
  if (self = [super init]) {
    _reactEventEmitter = nullptr;
  }
  return self;
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHostEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

- (BOOL)emitOnNavStateChanged:(OnNavStateChangedPayload)payload
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onNavStateChanged(
        {.stack = rnscreens::conversion::RNSStdStringVectorFromNSStringArray(payload.navState.stack),
         .provenance = payload.navState.provenance,
         .actionOrigin =
             rnscreens::conversion::RNSOnNavStateChangedActionOriginFromRNSStackActionOrigin(payload.actionOrigin)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNavStateChanged event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnNavStateRequestRejected:(OnNavStateRequestRejectedPayload)payload
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onNavStateRequestRejected(
        {.stack = rnscreens::conversion::RNSStdStringVectorFromNSStringArray(payload.currentNavState.stack),
         .provenance = payload.currentNavState.provenance,
         .rejectedStack = rnscreens::conversion::RNSStdStringVectorFromNSStringArray(payload.rejectedRequest.stack),
         .rejectedBaseProvenance = payload.rejectedRequest.baseProvenance,
         .rejectionReason = rnscreens::conversion::
             RNSOnNavStateRequestRejectedRejectionReasonFromRNSStackNavigationStateRejectionReason(
                 payload.rejectionReason)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNavStateRequestRejected event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnScreensReleased:(OnScreensReleasedPayload)payload
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onScreensReleased(
        {.screenKeys = rnscreens::conversion::RNSStdStringVectorFromNSStringArray(payload.screenKeys)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnScreensReleased event emission due to nullish emitter");
    return NO;
  }
}

@end
