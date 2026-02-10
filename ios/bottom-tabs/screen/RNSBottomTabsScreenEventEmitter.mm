#import "RNSBottomTabsScreenEventEmitter.h"

#import <React/RCTLog.h>
#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSBottomTabsScreenEventEmitter {
#if RCT_NEW_ARCH_ENABLED
  std::shared_ptr<const react::RNSBottomTabsScreenEventEmitter> _reactEventEmitter;
#endif // RCT_NEW_ARCH_ENABLED
}

- (BOOL)emitOnWillAppear
{
#if RCT_NEW_ARCH_ENABLED
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onWillAppear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillAppear event emission due to nullish emitter");
    return NO;
  }
#else
  if (self.onWillAppear) {
    self.onWillAppear(nil);
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillAppear event emission due to nullish emitter");
    return NO;
  }
#endif
}

- (BOOL)emitOnDidAppear
{
#if RCT_NEW_ARCH_ENABLED
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDidAppear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidAppear event emission due to nullish emitter");
    return NO;
  }
#else
  if (self.onDidAppear) {
    self.onDidAppear(nil);
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidAppear event emission due to nullish emitter");
    return NO;
  }
#endif
}

- (BOOL)emitOnWillDisappear
{
#if RCT_NEW_ARCH_ENABLED
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onWillDisappear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillDisappear event emission due to nullish emitter");
    return NO;
  }
#else
  if (self.onWillDisappear) {
    self.onWillDisappear(nil);
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillDisappear event emission due to nullish emitter");
    return NO;
  }
#endif
}

- (BOOL)emitOnDidDisappear
{
#if RCT_NEW_ARCH_ENABLED
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDidDisappear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidDisappear event emission due to nullish emitter");
    return NO;
  }
#else
  if (self.onDidDisappear) {
    self.onDidDisappear(nil);
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidDisappear event emission due to nullish emitter");
    return NO;
  }
#endif
}

#if RCT_NEW_ARCH_ENABLED
- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSBottomTabsScreenEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}
#endif

@end
