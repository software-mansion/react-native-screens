#import "RNSStackScreenComponentEventEmitter.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>

@implementation RNSStackScreenComponentEventEmitter {
  std::shared_ptr<const react::RNSStackScreenEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnWillAppear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onWillAppear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillAppear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnDidAppear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDidAppear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidAppear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnWillDisappear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onWillDisappear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillDisappear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnDidDisappear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDidDisappear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidDisappear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnDismiss
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDismiss({.isNativeDismiss = false});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDismiss event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnNativeDismiss
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDismiss({.isNativeDismiss = true});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDismiss (native) event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackScreenEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
