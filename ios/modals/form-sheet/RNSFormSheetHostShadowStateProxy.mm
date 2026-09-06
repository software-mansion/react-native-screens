#import "RNSFormSheetHostShadowStateProxy.h"

#import <React/RCTConversions.h>
#import <rnscreens/RNSFormSheetHostShadowNode.h>
#import <rnscreens/RNSFormSheetHostState.h>

namespace react = facebook::react;

@implementation RNSFormSheetHostShadowStateProxy {
  react::RNSFormSheetHostShadowNode::ConcreteState::Shared _state;
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
  _state = std::static_pointer_cast<const react::RNSFormSheetHostShadowNode::ConcreteState>(state);
}

- (void)updateShadowStateWithBounds:(CGRect)bounds
{
  if (_state == nullptr) {
    return;
  }

  CGSize size = bounds.size;

  if (!CGSizeEqualToSize(size, _lastScheduledSize)) {
    auto newState = react::RNSFormSheetHostState{RCTSizeFromCGSize(size)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);

    _lastScheduledSize = size;
  }
}

@end
