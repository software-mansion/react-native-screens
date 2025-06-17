#import "RNSBottomTabsHostEventEmitter.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;

@implementation RNSBottomTabsHostEventEmitter {
  std::shared_ptr<const react::RNSBottomTabsEventEmitter> _reactEventEmitter;
}

- (instancetype)init
{
  if (self = [super init]) {
    _reactEventEmitter = nullptr;
  }
  return self;
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSBottomTabsEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

- (BOOL)emitOnNativeFocusChange:(OnNativeFocusChangePayload)payload
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onNativeFocusChange({.tabKey = RCTStringFromNSString(payload.tabKey)});
    return true;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNativeFocusChange event emission due to nullish emitter");
    return false;
  }
}

@end
