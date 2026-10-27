#import "RNSContainedModalHostEventEmitter.h"
#import <React/RCTLog.h>

@implementation RNSContainedModalHostEventEmitter {
  std::shared_ptr<const react::RNSContainedModalHostEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnPresentationRejected
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onPresentationRejected({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnPresentationRejected event emission due to nullish emitter");
    return NO;
  }
}

#pragma mark - Hidden from Swift

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSContainedModalHostEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
