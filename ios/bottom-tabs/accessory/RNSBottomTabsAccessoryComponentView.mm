#import "RNSBottomTabsAccessoryComponentView.h"

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#import "RNSBottomAccessoryHelper.h"

#if RCT_NEW_ARCH_ENABLED
#import <rnscreens/RNSBottomTabsAccessoryComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace react = facebook::react;

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#pragma mark - View implementation

@implementation RNSBottomTabsAccessoryComponentView {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  RNSBottomAccessoryHelper *_helper API_AVAILABLE(ios(26.0));
  RNSBottomTabsAccessoryEventEmitter *_Nonnull _reactEventEmitter;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  RNSBottomTabsHostComponentView *__weak _Nullable _bottomTabsHostView;
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
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  if (@available(iOS 26, *)) {
    _helper = [[RNSBottomAccessoryHelper alloc] initWithBottomAccessoryView:self];
    _reactEventEmitter = [RNSBottomTabsAccessoryEventEmitter new];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  _bottomTabsHostView = nil;
}

#pragma mark - UIKit callbacks

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

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

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTViewComponentViewProtocol

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

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

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

#pragma mark - RNSViewControllerInvalidating

- (void)invalidateController
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  [_helper invalidate];
  _helper = nil;
#else // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  return;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
}

- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation
{
  // For bottom tabs, Host is responsible for invalidating children.
  return NO;
}

#else // RCT_NEW_ARCH_ENABLED

#pragma mark - LEGACY architecture implementation

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

- (void)setOnEnvironmentChange:(RCTDirectEventBlock)onEnvironmentChange
{
  [self.reactEventEmitter setOnEnvironmentChange:onEnvironmentChange];
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#pragma mark - RCTInvalidating

- (void)invalidate
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  [_helper invalidate];
  _helper = nil;
#else // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  return;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION
}

#endif // RCT_NEW_ARCH_ENABLED

#pragma mark - React events

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

- (nonnull RNSBottomTabsAccessoryEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsAccessoryCls(void)
{
  return RNSBottomTabsAccessoryComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
