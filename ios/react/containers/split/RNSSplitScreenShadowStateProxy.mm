#import "RNSSplitScreenShadowStateProxy.h"

#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/RNSSplitScreenShadowNode.h>

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
    // Asynchronous, like `RNSScreen` by default. A synchronous update commits and lays out the shadow
    // tree on the main thread from `viewDidLayoutSubviews`. If the JS thread is measuring text at that
    // moment, it holds the text measurement cache lock while `NSTextStorage` waits for the main queue,
    // and the two threads deadlock.
    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::Asynchronous);

    _lastScheduledFrame = frame;
  }
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const react::RNSSplitScreenShadowNode::ConcreteState>(state);
}

@end
