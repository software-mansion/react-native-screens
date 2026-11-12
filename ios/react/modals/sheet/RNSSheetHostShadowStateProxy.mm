#import "RNSSheetHostShadowStateProxy.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/RNSSheetHostShadowNode.h>
#import <react/renderer/components/rnscreens/RNSSheetHostState.h>

namespace react = facebook::react;

@implementation RNSSheetHostShadowStateProxy {
  react::RNSSheetHostShadowNode::ConcreteState::Shared _state;
  CGSize _lastScheduledSize;
}

- (instancetype)init
{
  if (self = [super init]) {
    _lastScheduledSize = CGSizeZero;
  }
  return self;
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const react::RNSSheetHostShadowNode::ConcreteState>(state);
}

- (void)updateShadowStateWithBounds:(CGRect)bounds
{
  if (_state == nullptr) {
    return;
  }

  CGSize size = bounds.size;

  if (!CGSizeEqualToSize(size, _lastScheduledSize)) {
    auto newState = react::RNSSheetHostState{RCTSizeFromCGSize(size)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);

    _lastScheduledSize = size;
  }
}

@end
