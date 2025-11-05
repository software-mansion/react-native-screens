#import "RNSBottomTabsAccessoryEventEmitter.h"

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#import <RNSConversions.h>
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

- (BOOL)emitOnEnvironmentChangeIfNeeded:(UITabAccessoryEnvironment)environment API_AVAILABLE(ios(26.0))
{
#if RCT_NEW_ARCH_ENABLED
  if (_reactEventEmitter != nullptr) {
    react::RNSBottomTabsAccessoryEventEmitter::OnEnvironmentChangeEnvironment payloadEnvironment;
    if (!rnscreens::conversion::RNSBottomTabsAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(
            &payloadEnvironment, environment)) {
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
    NSString *environmentString =
        rnscreens::conversion::RNSBottomTabsAccessoryOnEnvironmentChangePayloadFromUITabAccessoryEnvironment(
            environment);
    if (environmentString == nil) {
      return NO;
    }

    self.onEnvironmentChange(@{@"environment" : environmentString});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnEnvironmentChange event emission due to nullish emitter");
    return NO;
  }
#endif // RCT_NEW_ARCH_ENABLED
}

@end

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
