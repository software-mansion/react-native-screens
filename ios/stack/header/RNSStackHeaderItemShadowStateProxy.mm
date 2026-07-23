#import "RNSStackHeaderItemShadowStateProxy.h"
#import "RNSStackHeaderItemComponentView.h"

#import <React/RCTConversions.h>
#import <rnscreens/RNSStackHeaderItemComponentDescriptor.h>

namespace react = facebook::react;

@implementation RNSStackHeaderItemShadowStateProxy {
  RNSStackHeaderItemComponentView *__weak _headerItemView;
  CGRect _previousFrame;
}

- (instancetype)initWithHeaderItemView:(RNSStackHeaderItemComponentView *)headerItemView
{
  if (self = [super init]) {
    _headerItemView = headerItemView;
    [self initState];
  }
  return self;
}

- (void)initState
{
  _previousFrame = CGRectNull;
}

- (void)updateShadowStateWithFrame:(CGRect)frame
{
  if (CGRectEqualToRect(frame, _previousFrame)) {
    return;
  }
  if (_headerItemView.state == nullptr) {
    return;
  }
  auto newState = react::RNSStackHeaderItemState(RCTSizeFromCGSize(frame.size), RCTPointFromCGPoint(frame.origin));
  _headerItemView.state->updateState(std::move(newState));
  _previousFrame = frame;
}

- (void)invalidate
{
  [self initState];
}

@end
