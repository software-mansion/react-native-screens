#import "RNSTabsBottomAccessoryShadowStateProxy.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#import <React/RCTConversions.h>
#import <rnscreens/RNSTabsBottomAccessoryShadowNode.h>

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
    if (_bottomAccessoryView.state != nullptr) {
      auto newState =
          react::RNSTabsBottomAccessoryState{RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin)};
      _bottomAccessoryView.state->updateState(std::move(newState),
                                              facebook::react::EventQueue::UpdateMode::unstable_Immediate);
      _previousFrame = frame;
    }
  }
}

- (void)invalidate
{
  _previousFrame = CGRectZero;
}

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
