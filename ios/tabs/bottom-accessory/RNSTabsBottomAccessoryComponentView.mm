#import "RNSTabsBottomAccessoryComponentView.h"
#import "RNSTabsBottomAccessoryHelper.h"
#import "RNSTabsBottomAccessoryShadowStateProxy.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#import <rnscreens/RNSTabsBottomAccessoryComponentDescriptor.h>

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
  react::RNSTabsBottomAccessoryShadowNode::ConcreteState::Shared _state;
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
    // The helper & shadow proxy are torn down below whenever the accessory
    // leaves the window (e.g. a full-screen push covering the tab bar), so
    // they must be recreated on re-entry — previously
    // `registerForAccessoryFrameChanges` was messaged at nil here and all
    // trait/frame callbacks and content-view switching stayed permanently
    // dead after the first full-screen push, freezing the accessory on
    // whichever content copy was last visible. The content views' own
    // `didMoveToWindow` runs after this one (window changes propagate
    // top-down), so they re-register into the fresh helper.
    if (@available(iOS 26, *)) {
      if (_helper == nil) {
        _helper = [[RNSTabsBottomAccessoryHelper alloc] initWithBottomAccessoryView:self];
      }
      if (_shadowStateProxy == nil) {
        _shadowStateProxy = [[RNSTabsBottomAccessoryShadowStateProxy alloc] initWithBottomAccessoryView:self];
      }
    }
    [_helper registerForAccessoryFrameChanges];
  } else {
    // Lighter teardown than `invalidate` — keep the Fabric `_state` alive
    // across a detach/reattach cycle. Only React can re-deliver the state
    // (via `updateState` on a commit), so resetting it on a mere window
    // detach would leave the recreated shadow proxy unable to publish
    // accessory frame updates until an unrelated commit happens to arrive.
    // True unmount still fully invalidates via RNSTabsHostComponentView.
    if (@available(iOS 26, *)) {
      [_helper invalidate];
      _helper = nil;
      [_shadowStateProxy invalidate];
      _shadowStateProxy = nil;
    }
  }
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

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

- (void)invalidate
{
  [self invalidateImpl];
}

- (facebook::react::RNSTabsBottomAccessoryShadowNode::ConcreteState::Shared)state
{
  return _state;
}

- (void)invalidateImpl
{
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  [_helper invalidate];
  _helper = nil;

  [_shadowStateProxy invalidate];
  _shadowStateProxy = nil;
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

  _state.reset();
}

#pragma mark - React events

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

- (nonnull RNSTabsBottomAccessoryEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSTabsBottomAccessoryCls(void)
{
  return RNSTabsBottomAccessoryComponentView.class;
}
