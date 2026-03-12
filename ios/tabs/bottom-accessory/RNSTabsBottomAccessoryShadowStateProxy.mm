#import "RNSTabsBottomAccessoryShadowStateProxy.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <rnscreens/RNSTabsBottomAccessoryShadowNode.h>
#else // RCT_NEW_ARCH_ENABLED
#import <React/RCTUIManager.h>
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSTabsBottomAccessoryShadowStateProxy {
  RNSTabsBottomAccessoryComponentView *__weak _bottomAccessoryView;
  CGRect _previousFrame;
}

- (instancetype)initWithBottomAccessoryView:(RNSTabsBottomAccessoryComponentView *)bottomAccessoryView
{
  if (self = [super init]) {
    _bottomAccessoryView = bottomAccessoryView;
    [self initState];
  }

  return self;
}

- (void)initState
{
  _previousFrame = CGRectZero;
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (!CGRectEqualToRect(frame, _previousFrame)) {
#if RCT_NEW_ARCH_ENABLED
    if (_bottomAccessoryView.state != nullptr) {
      auto newState =
          react::RNSTabsBottomAccessoryState{RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin)};
      _bottomAccessoryView.state->updateState(
          std::move(newState)
#if REACT_NATIVE_VERSION_MINOR >= 82
              ,
          facebook::react::EventQueue::UpdateMode::unstable_Immediate
#endif // REACT_NATIVE_VERSION_MINOR >= 82
      );
      _previousFrame = frame;
    }
#else // RCT_NEW_ARCH_ENABLED
    [_bottomAccessoryView.bridge.uiManager setSize:frame.size forView:_bottomAccessoryView];
    _previousFrame = frame;
#endif // RCT_NEW_ARCH_ENABLED
  }
}

- (void)invalidate
{
  _previousFrame = CGRectZero;
}

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
