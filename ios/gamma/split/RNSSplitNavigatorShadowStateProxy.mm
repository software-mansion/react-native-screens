#import "RNSSplitNavigatorShadowStateProxy.h"
#import "RNSSplitNavigatorComponentView.h"

#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <cxxreact/ReactNativeVersion.h>
#import <rnscreens/RNSSplitNavigatorShadowNode.h>

namespace react = facebook::react;

@implementation RNSSplitNavigatorShadowStateProxy {
  react::RNSSplitNavigatorShadowNode::ConcreteState::Shared _state;
  CGRect _lastScheduledFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    _lastScheduledFrame = CGRectNull;
  }

  return self;
}

- (void)updateShadowStateOfComponent:(RNSSplitNavigatorComponentView *)navigatorComponentView
{
  [self updateShadowStateOfComponent:navigatorComponentView inContextOfAncestorView:nil];
}

- (void)updateShadowStateOfComponent:(RNSSplitNavigatorComponentView *)navigatorComponentView
             inContextOfAncestorView:(UIView *_Nullable)ancestorView
{
  CGRect frame = navigatorComponentView.frame;
  if (ancestorView != nil) {
    frame = [navigatorComponentView convertRect:frame toView:ancestorView];
  }
  [self updateShadowStateWithFrame:frame];
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (_state == nullptr) {
    return;
  }

  if (!CGRectEqualToRect(frame, _lastScheduledFrame)) {
    auto newState = react::RNSSplitNavigatorState{RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin)};
    _state->updateState(
        std::move(newState)
// TODO: @t0maboro - remove this compilation check once TVOSExample is upgraded to RN 82+
#if REACT_NATIVE_VERSION_MINOR >= 82
            ,
        facebook::react::EventQueue::UpdateMode::unstable_Immediate
#endif
    );

    _lastScheduledFrame = frame;
  }
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const react::RNSSplitNavigatorShadowNode::ConcreteState>(state);
}

@end
