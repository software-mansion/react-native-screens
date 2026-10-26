#import "RNSStackHeaderItemEventEmitter.h"
#import <React/RCTLog.h>

@implementation RNSStackHeaderItemEventEmitter {
  std::shared_ptr<const react::RNSStackHeaderItemIOSEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnPress
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onHeaderItemPress({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnHeaderItemPress event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSStackHeaderItemIOSEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
