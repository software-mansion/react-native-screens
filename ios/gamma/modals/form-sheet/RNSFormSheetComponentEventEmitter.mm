#import "RNSFormSheetComponentEventEmitter.h"
#import <React/RCTConversions.h>
#import <React/RCTLog.h>

@implementation RNSFormSheetComponentEventEmitter {
  std::shared_ptr<const react::RNSFormSheetEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnDismiss
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDismiss({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDismiss event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFormSheetEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
