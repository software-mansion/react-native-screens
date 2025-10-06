#import "RNSBottomTabsAccessoryEventEmitter.h"

#import <React/RCTLog.h>
#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSBottomTabsAccessoryEventEmitter {
#if RCT_NEW_ARCH_ENABLED
  std::shared_ptr<const react::RNSBottomTabsAccessoryEventEmitter> _reactEventEmitter;
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
- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSBottomTabsAccessoryEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}
#endif // RCT_NEW_ARCH_ENABLED

- (BOOL)emitOnEnvironmentChangeIfNecessary:(UITabAccessoryEnvironment)environment API_AVAILABLE(ios(26.0))
{
#if RCT_NEW_ARCH_ENABLED
  if (_reactEventEmitter != nullptr) {
    react::RNSBottomTabsAccessoryEventEmitter::OnEnvironmentChangeEnvironment payloadEnvironment;
    switch (environment) {
      case UITabAccessoryEnvironmentRegular:
        payloadEnvironment = react::RNSBottomTabsAccessoryEventEmitter::OnEnvironmentChangeEnvironment::Regular;
        break;
      case UITabAccessoryEnvironmentInline:
        payloadEnvironment = react::RNSBottomTabsAccessoryEventEmitter::OnEnvironmentChangeEnvironment::Inline;
        break;
      default:
        return NO;
    }

    _reactEventEmitter->onEnvironmentChange({.environment = payloadEnvironment});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnEnvironmentChange event emission due to nullish emitter");
    return NO;
  }
#else
  if (self.onEnvironmentChange) {
    // TODO
    self.onEnvironmentChange(@{@"environment" : });
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnEnvironmentChange event emission due to nullish emitter");
    return NO;
  }
#endif // RCT_NEW_ARCH_ENABLED
}

@end
