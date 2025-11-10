#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomAccessoryHelper.h"

#define BOTTOM_ACCESSORY_AVAILABLE RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#if BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED
#import <rnscreens/RNSBottomTabsAccessoryComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace react = facebook::react;

#endif // BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - View implementation

@implementation RNSBottomTabsAccessoryComponentView {
#if BOTTOM_ACCESSORY_AVAILABLE
  RNSBottomAccessoryHelper *_helper API_AVAILABLE(ios(26.0));
  RNSBottomTabsAccessoryEventEmitter *_Nonnull _reactEventEmitter;
#endif // BOTTOM_ACCESSORY_AVAILABLE
  RNSBottomTabsHostComponentView *__weak _Nullable _bottomTabsHostView;
#if RCT_NEW_ARCH_ENABLED
  react::RNSBottomTabsAccessoryShadowNode::ConcreteState::Shared _state;
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
#if BOTTOM_ACCESSORY_AVAILABLE
  if (@available(iOS 26, *)) {
    _helper = [[RNSBottomAccessoryHelper alloc] initWithBottomAccessoryView:self];
    _reactEventEmitter = [RNSBottomTabsAccessoryEventEmitter new];
  }
#endif // BOTTOM_ACCESSORY_AVAILABLE
  _bottomTabsHostView = nil;
}

#pragma mark - UIKit callbacks

#if BOTTOM_ACCESSORY_AVAILABLE

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

#endif // BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTViewComponentViewProtocol

#if BOTTOM_ACCESSORY_AVAILABLE

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  [super updateState:state oldState:oldState];
  _state = std::static_pointer_cast<const react::RNSBottomTabsAccessoryComponentDescriptor::ConcreteState>(state);
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

#endif // BOTTOM_ACCESSORY_AVAILABLE

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (facebook::react::RNSBottomTabsAccessoryShadowNode::ConcreteState::Shared)state
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
  // For bottom tabs, Host is responsible for invalidating children.
  return NO;
}

#else // RCT_NEW_ARCH_ENABLED

#pragma mark - LEGACY architecture implementation

#if BOTTOM_ACCESSORY_AVAILABLE

- (void)setOnEnvironmentChange:(RCTDirectEventBlock)onEnvironmentChange
{
  [self.reactEventEmitter setOnEnvironmentChange:onEnvironmentChange];
}

#endif // BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - RCTInvalidating

- (void)invalidate
{
  [self invalidateImpl];
}

#endif // RCT_NEW_ARCH_ENABLED

- (void)invalidateImpl
{
#if BOTTOM_ACCESSORY_AVAILABLE
  [_helper invalidate];
  _helper = nil;
#endif // BOTTOM_ACCESSORY_AVAILABLE

#if RCT_NEW_ARCH_ENABLED
  _state.reset();
#endif // RCT_NEW_ARCH_ENABLED
}

#pragma mark - React events

#if BOTTOM_ACCESSORY_AVAILABLE

- (nonnull RNSBottomTabsAccessoryEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#endif // BOTTOM_ACCESSORY_AVAILABLE

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsAccessoryCls(void)
{
  return RNSBottomTabsAccessoryComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED

#undef BOTTOM_ACCESSORY_AVAILABLE
