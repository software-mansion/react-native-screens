#import "RNSFormSheetHostEventEmitter.h"
#import <React/RCTLog.h>

@implementation RNSFormSheetHostEventEmitter {
  std::shared_ptr<const react::RNSFormSheetHostEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnDismiss
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDismiss({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDismiss event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnNativeDismiss
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onNativeDismiss({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNativeDismiss event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnNativeDismissPrevented
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onNativeDismissPrevented({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNativeDismissPrevented event emission due to nullish emitter");
    return NO;
  }
}

#if !TARGET_OS_TV
- (BOOL)emitOnDetentChangedWithIndex:(NSInteger)index
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDetentChanged({.index = static_cast<int>(index)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDetentChanged event emission due to nullish emitter");
    return NO;
  }
}
#endif // !TARGET_OS_TV

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

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFormSheetHostEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
