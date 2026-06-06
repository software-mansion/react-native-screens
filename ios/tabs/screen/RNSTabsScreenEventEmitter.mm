#import "RNSTabsScreenEventEmitter.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;

@implementation RNSTabsScreenEventEmitter {
  std::shared_ptr<const react::RNSTabsScreenIOSEventEmitter> _reactEventEmitter;
}

- (BOOL)emitOnWillAppear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onWillAppear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillAppear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnDidAppear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDidAppear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidAppear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnWillDisappear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onWillDisappear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnWillDisappear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnDidDisappear
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onDidDisappear({});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnDidDisappear event emission due to nullish emitter");
    return NO;
  }
}

- (BOOL)emitOnPressToolbarItem:(NSString *)buttonId
{
  if (_reactEventEmitter != nullptr) {
    _reactEventEmitter->onPressToolbarItem(
        react::RNSTabsScreenIOSEventEmitter::OnPressToolbarItem{.buttonId = std::string([buttonId UTF8String])});
    return YES;
  } else {
    RCTLogWarn(@"[RNScreens] Skipped OnPressToolbarItem event emission due to nullish emitter");
    return NO;
  }
}

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSTabsScreenIOSEventEmitter> &)emitter
{
  _reactEventEmitter = emitter;
}

@end
