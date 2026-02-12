#import "RNSBottomTabsHostEventEmitter.h"

#import <React/RCTLog.h>
#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSBottomTabsHostEventEmitter {
#if RCT_NEW_ARCH_ENABLED
  std::shared_ptr<const react::RNSBottomTabsEventEmitter> _reactEventEmitter;
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
- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSBottomTabsEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}
#endif // RCT_NEW_ARCH_ENABLED

- (BOOL)emitOnNativeFocusChange:(OnNativeFocusChangePayload)payload
{
#if RCT_NEW_ARCH_ENABLED
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onNativeFocusChange(
        {.tabKey = RCTStringFromNSString(payload.tabKey),
         .repeatedSelectionHandledBySpecialEffect =
             static_cast<bool>(payload.repeatedSelectionHandledBySpecialEffect)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNativeFocusChange event emission due to nullish emitter");
    return NO;
  }
#else
  if (self.onNativeFocusChange) {
    self.onNativeFocusChange(@{
      @"tabKey" : payload.tabKey,
      @"repeatedSelectionHandledBySpecialEffect" : @(payload.repeatedSelectionHandledBySpecialEffect)
    });
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNativeFocusChange event emission due to nullish emitter");
    return NO;
  }
#endif // RCT_NEW_ARCH_ENABLED
}

@end
