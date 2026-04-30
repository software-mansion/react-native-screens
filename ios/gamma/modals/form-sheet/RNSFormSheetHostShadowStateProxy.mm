#import "RNSFormSheetHostShadowStateProxy.h"

#import <React/RCTConversions.h>
#import <rnscreens/RNSFormSheetHostShadowNode.h>
#import <rnscreens/RNSFormSheetHostState.h>

namespace react = facebook::react;

@implementation RNSFormSheetHostShadowStateProxy {
  react::RNSFormSheetHostShadowNode::ConcreteState::Shared _state;
  CGRect _lastScheduledFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    _lastScheduledFrame = CGRectNull;
  }
  return self;
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const react::RNSFormSheetHostShadowNode::ConcreteState>(state);
}

- (void)updateShadowStateWithBounds:(CGRect)bounds origin:(CGPoint)origin
{
  if (_state == nullptr) {
    return;
  }

  CGRect frame = {origin, bounds.size};

  if (!CGRectEqualToRect(frame, _lastScheduledFrame)) {
    auto newState = react::RNSFormSheetHostState{RCTSizeFromCGSize(bounds.size), RCTPointFromCGPoint(origin)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);

    _lastScheduledFrame = frame;
  }
}

- (void)resetShadowState
{
  if (_state != nullptr) {
    auto newState = react::RNSFormSheetHostState{RCTSizeFromCGSize(CGSizeZero), RCTPointFromCGPoint(CGPointZero)};
    _lastScheduledFrame = CGRectNull;
    _state->updateState(std::move(newState));
  }
}

@end
