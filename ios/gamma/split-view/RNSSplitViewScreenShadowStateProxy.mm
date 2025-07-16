#import "RNSSplitViewScreenShadowStateProxy.h"

#import <React/RCTConversions.h>
#import <rnscreens/RNSSplitViewScreenShadowNode.h>
#import "RNSSplitViewScreenComponentView.h"

namespace react = facebook::react;

@implementation RNSSplitViewScreenShadowStateProxy {
  react::RNSSplitViewScreenShadowNode::ConcreteState::Shared _state;
  CGRect _lastScheduledFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    _lastScheduledFrame = CGRectNull;
  }

  return self;
}

- (void)updateShadowStateOfComponent:(RNSSplitViewScreenComponentView *)screenComponentView
{
  [self updateShadowStateOfComponent:screenComponentView inContextOfAncestorView:nil];
}

- (void)updateShadowStateOfComponent:(RNSSplitViewScreenComponentView *)screenComponentView
             inContextOfAncestorView:(UIView *_Nullable)ancestorView
{
  CGRect frame = screenComponentView.frame;
  if (ancestorView != nil) {
    frame = [screenComponentView convertRect:frame toView:ancestorView];
  }
  [self updateShadowStateWithFrame:frame];
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (_state == nullptr) {
    return;
  }

  if (!CGRectEqualToRect(frame, _lastScheduledFrame)) {
    auto newState = react::RNSSplitViewScreenState{RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin)};
    _state->updateState(std::move(newState));
    _lastScheduledFrame = frame;
  }
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const react::RNSSplitViewScreenShadowNode::ConcreteState>(state);
}

@end
