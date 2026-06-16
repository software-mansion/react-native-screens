#import "RNSStackHeaderConfigEventEmitter.h"
#import <React/RCTLog.h>

@implementation RNSStackHeaderConfigEventEmitter {
  std::shared_ptr<const react::RNSStackHeaderConfigIOSEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnMenuItemPress:(NSString *)menuElementId
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onMenuItemPress({.menuElementId = menuElementId.cString});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnMenuItemPress event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHeaderConfigIOSEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
