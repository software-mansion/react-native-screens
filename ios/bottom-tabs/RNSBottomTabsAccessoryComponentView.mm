#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomAccessoryHelper.h"

#if RCT_NEW_ARCH_ENABLED
#import <rnscreens/RNSBottomTabsAccessoryComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSBottomTabsAccessoryComponentView {
  RNSBottomAccessoryHelper *_helper API_AVAILABLE(ios(26.0));
  RNSBottomTabsHostComponentView *__weak _Nullable _reactSuperview;
  RNSBottomTabsAccessoryEventEmitter *_Nonnull _reactEventEmitter;
#if !RCT_NEW_ARCH_ENABLED
  __weak RCTBridge *_bridge;
#endif // !RCT_NEW_ARCH_ENABLED
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

#if !RCT_NEW_ARCH_ENABLED

- (instancetype)initWithFrame:(CGRect)frame bridge:(RCTBridge *)bridge
{
  if (self = [self initWithFrame:frame]) {
    _bridge = bridge;
  }
  return self;
}

- (RCTBridge *)bridge
{
  return _bridge;
}

#endif // !RCT_NEW_ARCH_ENABLED

- (void)initState
{
  if (@available(iOS 26, *)) {
    _helper = [[RNSBottomAccessoryHelper alloc] initWithBottomAccessoryView:self];
  }
  _reactSuperview = nil;
  _reactEventEmitter = [RNSBottomTabsAccessoryEventEmitter new];
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (nullable RNSBottomTabsHostComponentView *)reactSuperview
{
  return _reactSuperview;
}
RNS_IGNORE_SUPER_CALL_END

#pragma mark - UIKit callbacks

- (void)didMoveToWindow
{
  if (self.window != nil) {
    [_helper registerForAccessoryFrameChanges];
  } else {
#if RCT_NEW_ARCH_ENABLED
    [self invalidateController];
#else // RCT_NEW_ARCH_ENABLED
    [self invalidate];
#endif // RCT_NEW_ARCH_ENABLED
  }
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTViewComponentViewProtocol

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  [super updateState:state oldState:oldState];

  if (@available(iOS 26, *)) {
    [_helper updateState:state oldState:oldState];
  }
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];

  const auto &castedEventEmitter =
      std::static_pointer_cast<const react::RNSBottomTabsAccessoryEventEmitter>(eventEmitter);
  [_reactEventEmitter updateEventEmitter:castedEventEmitter];
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

#else // RCT_NEW_ARCH_ENABLED

#pragma mark - LEGACY architecture implementation

- (void)setOnEnvironmentChange:(RCTDirectEventBlock)onEnvironmentChange
{
  [self.reactEventEmitter setOnEnvironmentChange:onEnvironmentChange];
}

#pragma mark - RCTInvalidating

- (void)invalidate
{
  [_helper invalidate];
  _helper = nil;
}

#endif // RCT_NEW_ARCH_ENABLED

#pragma mark - React events

- (nonnull RNSBottomTabsAccessoryEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsAccessoryCls(void)
{
  return RNSBottomTabsAccessoryComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
