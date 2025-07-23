#import "RNSSplitViewHostComponentEventEmitter.h"
#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import "RNSConversions.h"

@implementation RNSSplitViewHostComponentEventEmitter {
  std::shared_ptr<const react::RNSSplitViewHostEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnCollapse
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onCollapse({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnCollapse event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnDisplayModeWillChangeFrom:(UISplitViewControllerDisplayMode)currentDisplayMode
                                     to:(UISplitViewControllerDisplayMode)nextDisplayMode
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDisplayModeWillChange(
        {.currentDisplayMode = rnscreens::conversion::UISplitViewControllerDisplayModeToString(currentDisplayMode),
         .nextDisplayMode = rnscreens::conversion::UISplitViewControllerDisplayModeToString(nextDisplayMode)});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDisplayModeWillChange event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnExpand
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onExpand({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnExpand event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnHideInspector
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onInspectorHide({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnHideInspector event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSSplitViewHostEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
