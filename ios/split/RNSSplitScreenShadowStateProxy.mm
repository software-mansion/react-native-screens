#import "RNSSplitScreenShadowStateProxy.h"

#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <rnscreens/RNSSplitScreenShadowNode.h>

namespace react = facebook::react;

@implementation RNSSplitScreenShadowStateProxy {
  react::RNSSplitScreenShadowNode::ConcreteState::Shared _state;
  CGRect _lastScheduledFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    _lastScheduledFrame = CGRectNull;
  }

  return self;
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (_state == nullptr) {
    return;
  }

  if (!CGRectEqualToRect(frame, _lastScheduledFrame)) {
    auto newState = react::RNSSplitScreenState{RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin)};
    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);

    _lastScheduledFrame = frame;
  }
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const react::RNSSplitScreenShadowNode::ConcreteState>(state);
}

@end
