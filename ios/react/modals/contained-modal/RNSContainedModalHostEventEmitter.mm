#import "RNSContainedModalHostEventEmitter.h"
#import <React/RCTLog.h>

@implementation RNSContainedModalHostEventEmitter {
  std::shared_ptr<const react::RNSContainedModalHostEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnPresentationRejected
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onPresentationRejected({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnPresentationRejected event emission due to nullish emitter");
    return NO;
  }
}

#pragma mark - Lifecycle events

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

#pragma mark - Hidden from Swift

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSContainedModalHostEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
