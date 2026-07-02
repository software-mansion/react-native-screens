#import "RNSStackScreenComponentView.h"
#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSStackScreenComponentDescriptor.h>

#import "RNSConversions-Stack.h"
#import "RNSScrollViewMarkerComponentView.h"
#import "RNSScrollViewSeeking.h"
#import "RNSStackHeaderConfigComponentView.h"
#import "RNSStackHostComponentView.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenController.h"
#import "RNSStackScreenHeaderCoordinator.h"

#import "Swift-Bridging.h"

namespace react = facebook::react;

@interface RNSStackScreenComponentView () <RCTMountingTransactionObserving, RNSScrollViewSeeking>
@end

#pragma mark - View implementation

@implementation RNSStackScreenComponentView {
  RNSStackScreenController *_Nonnull _controller;
  RNSStackScreenComponentEventEmitter *_Nonnull _reactEventEmitter;

  // Content scroll view registered by a descendant `RNSScrollViewMarkerComponentView`. Queried by
  // the owning `RNSStackScreenController` (as `RNSContainerItem`) when resolving the content
  // scroll view for special effects.
  __weak UIScrollView *_Nullable _contentScrollView;

  // Flags
  BOOL _hasUpdatedActivityMode;
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
  [self resetProps];
  [self setupController];

  _reactEventEmitter = [RNSStackScreenComponentEventEmitter new];

  _hasUpdatedActivityMode = NO;
  _isNativelyDismissed = NO;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSStackScreenProps>();
  _props = defaultProps;

  // container state
  _screenKey = nil;
  _activityMode = RNSStackScreenActivityModeDetached;
}

- (void)setupController
{
  _controller = [[RNSStackScreenController alloc] initWithComponentView:self];
  _controller.view = self;
}

- (void)invalidateImpl
{
  // We want to run after container updates are performed (transitions etc.)
  __weak auto weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    auto strongSelf = weakSelf;
    if (strongSelf) {
      strongSelf->_controller = nil;
    }
  });
}

#pragma mark - RNSScrollViewSeeking

- (void)registerDescendantScrollView:(UIScrollView *)scrollView fromMarker:(RNSScrollViewMarkerComponentView *)marker
{
  // Native scroll-edge behavior (UINavigationBar scroll edge appearance, top-screen-tap scroll-to-top on iPad).
  [_controller setContentScrollView:scrollView forEdge:NSDirectionalRectEdgeAll];
  // Cache used by the container-nesting content-scroll-view resolution.
  _contentScrollView = scrollView;
}

- (nullable UIScrollView *)cachedContentScrollView
{
  return _contentScrollView;
}

#pragma mark - Events

- (nonnull RNSStackScreenComponentEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSStackScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSStackScreenProps>(props);

  if (oldComponentProps.activityMode != newComponentProps.activityMode) {
    _activityMode = rnscreens::conversion::convert<RNSStackScreenActivityMode>(newComponentProps.activityMode);
    _hasUpdatedActivityMode = YES;
  }

  if (oldComponentProps.screenKey != newComponentProps.screenKey) {
    RCTAssert(_screenKey == nil, @"[RNScreens] ScreenController cannot change its screenKey");
    _screenKey = RCTNSStringFromStringNilIfEmpty(newComponentProps.screenKey);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:RNSStackHeaderConfigComponentView.class]) {
    [_controller.headerCoordinator clearHeaderConfiguration];
  }
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_hasUpdatedActivityMode) {
    _hasUpdatedActivityMode = NO;
    [self.stackHost stackScreenChangedActivityMode:self];
  }

  [super finalizeUpdates:updateMask];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSStackScreenEventEmitter>(eventEmitter)];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)invalidate
{
  [self invalidateImpl];
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSStackScreenCls(void)
{
  return RNSStackScreenComponentView.class;
}
