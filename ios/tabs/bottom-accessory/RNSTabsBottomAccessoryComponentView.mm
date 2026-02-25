#import "RNSTabsBottomAccessoryComponentView.h"
#import "RNSTabsBottomAccessoryHelper.h"
#import "RNSTabsBottomAccessoryShadowStateProxy.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED
#import <rnscreens/RNSTabsBottomAccessoryComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace react = facebook::react;

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - View implementation

@implementation RNSTabsBottomAccessoryComponentView {
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  RNSTabsBottomAccessoryHelper *_helper API_AVAILABLE(ios(26.0));
  RNSTabsBottomAccessoryShadowStateProxy *_shadowStateProxy API_AVAILABLE(ios(26.0));
  RNSTabsBottomAccessoryEventEmitter *_Nonnull _reactEventEmitter;
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  RNSTabsHostComponentView *__weak _Nullable _tabsHostView;
#if RCT_NEW_ARCH_ENABLED
  react::RNSTabsBottomAccessoryShadowNode::ConcreteState::Shared _state;
#else // RCT_NEW_ARCH_ENABLED
  __weak RCTBridge *_bridge;
#endif // RCT_NEW_ARCH_ENABLED
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
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  if (@available(iOS 26, *)) {
    _helper = [[RNSTabsBottomAccessoryHelper alloc] initWithBottomAccessoryView:self];
    _shadowStateProxy = [[RNSTabsBottomAccessoryShadowStateProxy alloc] initWithBottomAccessoryView:self];
    _reactEventEmitter = [RNSTabsBottomAccessoryEventEmitter new];
  }
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  _tabsHostView = nil;
}

#pragma mark - UIKit callbacks

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

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

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTViewComponentViewProtocol

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  [super updateState:state oldState:oldState];
  _state = std::static_pointer_cast<const react::RNSTabsBottomAccessoryComponentDescriptor::ConcreteState>(state);
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];

  const auto &castedEventEmitter =
      std::static_pointer_cast<const react::RNSTabsBottomAccessoryEventEmitter>(eventEmitter);
  [_reactEventEmitter updateEventEmitter:castedEventEmitter];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSTabsBottomAccessoryComponentDescriptor>();
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (facebook::react::RNSTabsBottomAccessoryShadowNode::ConcreteState::Shared)state
{
  return _state;
}

#pragma mark - RNSViewControllerInvalidating

- (void)invalidateController
{
  [self invalidateImpl];
}

- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation
{
  // For tabs, Host is responsible for invalidating children.
  return NO;
}

#else // RCT_NEW_ARCH_ENABLED

#pragma mark - LEGACY architecture implementation

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

- (void)setOnEnvironmentChange:(RCTDirectEventBlock)onEnvironmentChange
{
  [self.reactEventEmitter setOnEnvironmentChange:onEnvironmentChange];
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - RCTInvalidating

- (void)invalidate
{
  [self invalidateImpl];
}

#endif // RCT_NEW_ARCH_ENABLED

- (void)invalidateImpl
{
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  [_helper invalidate];
  _helper = nil;

  [_shadowStateProxy invalidate];
  _shadowStateProxy = nil;
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED
  _state.reset();
#endif // RCT_NEW_ARCH_ENABLED
}

#pragma mark - React events

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

- (nonnull RNSTabsBottomAccessoryEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSTabsBottomAccessoryCls(void)
{
  return RNSTabsBottomAccessoryComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
