#import "RNSFormSheetHostEventEmitter.h"
#import <React/RCTLog.h>

@implementation RNSFormSheetHostEventEmitter {
  std::shared_ptr<const react::RNSFormSheetHostEventEmitter> _reactEventEmitter;
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

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFormSheetHostEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
