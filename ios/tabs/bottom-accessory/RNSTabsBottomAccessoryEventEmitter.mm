#import "RNSTabsBottomAccessoryEventEmitter.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import "RNSConversions.h"

namespace react = facebook::react;

@implementation RNSTabsBottomAccessoryEventEmitter {
  std::shared_ptr<const react::RNSTabsBottomAccessoryEventEmitter> _reactEventEmitter;
}

- (instancetype)init
{
  if (self = [super init]) {
    _reactEventEmitter = nullptr;
  }
  return self;
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSTabsBottomAccessoryEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

- (BOOL)emitOnEnvironmentChangeIfNeeded:(UITabAccessoryEnvironment)environment API_AVAILABLE(ios(26.0))
{
  if (_reactEventEmitter != nullptr) {
    auto payloadEnvironment =
        rnscreens::conversion::RNSTabsBottomAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(
            environment);

    // If environment is other than `regular` or `inline`, we don't emit the event.
    if (!payloadEnvironment.has_value()) {
      return NO;
    }

    _reactEventEmitter->onEnvironmentChange({.environment = payloadEnvironment.value()});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnEnvironmentChange event emission due to nullish emitter");
    return NO;
  }
}

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
