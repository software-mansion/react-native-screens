#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomAccessoryHelper.h"

#import <rnscreens/RNSBottomTabsAccessoryComponentDescriptor.h>

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSBottomTabsAccessoryComponentView {
  RNSBottomAccessoryHelper *_helper API_AVAILABLE(ios(26.0));
  RNSBottomTabsHostComponentView *__weak _Nullable _reactSuperview;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  if (@available(iOS 26, *)) {
    _helper = [[RNSBottomAccessoryHelper alloc] initWithBottomAccessoryView:self];
  }
  _reactSuperview = nil;
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (nullable RNSBottomTabsHostComponentView *)reactSuperview
{
  return _reactSuperview;
}
RNS_IGNORE_SUPER_CALL_END

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  [super updateState:state oldState:oldState];

  if (@available(iOS 26, *)) {
    [_helper updateState:state oldState:oldState];
  }
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsAccessoryComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - RNSViewControllerInvalidating

- (void)invalidateController
{
  [_helper invalidate];
  _helper = nil;
}

- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation
{
  // For bottom tabs, Host is responsible for invalidating children.
  return NO;
}

#else

#pragma mark - RCTInvalidating

- (void)invalidate
{
  [_helper invalidate];
  _helper = nil;
}

#endif // RCT_NEW_ARCH_ENABLED

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsAccessoryCls(void)
{
  return RNSBottomTabsAccessoryComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
