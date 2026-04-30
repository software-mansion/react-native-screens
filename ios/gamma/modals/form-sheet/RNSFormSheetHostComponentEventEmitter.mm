#import "RNSFormSheetHostComponentEventEmitter.h"
#import <React/RCTConversions.h>
#import <React/RCTLog.h>

@implementation RNSFormSheetHostComponentEventEmitter {
  std::shared_ptr<const react::RNSFormSheetHostEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnNativeDismiss
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onNativeDismiss({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnNativeDismiss event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSFormSheetHostEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
