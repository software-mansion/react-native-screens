#import "RNSSplitScreenComponentView.h"
#import <React/RCTAssert.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <rnscreens/RNSSplitScreenComponentDescriptor.h>
#import "RNSConversions.h"
#import "RNSSafeAreaViewNotifications.h"
#import "RNSSplitHostComponentView.h"
#import "RNSSplitHostController.h"
#import "RNSSplitScreenController.h"

namespace react = facebook::react;

// TODO(@t0maboro): Temporary frame-reporting logic for stack-backed columns. Unify this with
// RNSSplitNavigationControllerFrameObserver.
static void *RNSSplitScreenProvidedViewFrameContext = &RNSSplitScreenProvidedViewFrameContext;

@implementation RNSSplitScreenComponentView {
  RNSSplitScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitScreenController *_Nullable _controller;
  RNSSplitScreenShadowStateProxy *_Nonnull _shadowStateProxy;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
  NSMutableSet<UIView *> *_viewsForFrameCorrection;

  __weak UIView<RNSNavigationControllerProviding> *_Nullable _navigationControllerProvider;
  __weak UIView *_Nullable _observedProvidedView;
}

- (RNSSplitScreenController *)controller
{
  RCTAssert(
      _controller != nil,
      @"[RNScreens] Attempt to access RNSSplitScreenController before RNSSplitScreenComponentView was initialized. (for: %@)",
      self);
  return _controller;
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

  _reactEventEmitter = [RNSSplitScreenComponentEventEmitter new];
  _shadowStateProxy = [RNSSplitScreenShadowStateProxy new];

  _viewsForFrameCorrection = [NSMutableSet set];
}

- (void)setupController
{
  _controller = [[RNSSplitScreenController alloc] initWithSplitScreenComponentView:self];
  _controller.view = self;
}

- (void)didMoveToWindow
{
  // Starting from iOS 26, a new column type called 'inspector' was introduced.
  // This column can be displayed as a modal, independent of the React Native view hierarchy.
  // In contrast, prior to iOS 26, all SplitView columns were placed under RCTSurface,
  // meaning that touches were handler by RN handlers.
  if (@available(iOS 26.0, *)) {
    // If the current controller’s splitViewController is of type RNSSplitHostController,
    // we know that we're still inside the RN hierarchy,
    // so there's no need to enforce additional touch event support.
    if ([_controller isInSplitHostSubtree]) {
      return;
    }

    if (self.window != nil) {
      if (_touchHandler == nil) {
        _touchHandler = [RCTSurfaceTouchHandler new];
      }
      [_touchHandler attachToView:self];
    } else {
      [_touchHandler detachFromView:self];
    }
  }
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitScreenProps>();
  _props = defaultProps;

  _columnType = RNSSplitScreenColumnTypeColumn;
}

- (void)registerForFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection addObject:view];
}

- (void)unregisterFromFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection removeObject:view];
}

- (void)dealloc
{
  [self stopObservingProvidedView];
}

#pragma mark - Nested container

- (nullable UIView<RNSNavigationControllerProviding> *)navigationControllerProvider
{
  return _navigationControllerProvider;
}

- (void)takeOverNavigationControllerOfProvider:(UIView<RNSNavigationControllerProviding> *)provider
{
  RCTAssert(_navigationControllerProvider == nil && self.subviews.count == 0,
            @"[RNScreens] A component providing a navigation controller must be the only child of a Split column");

  _navigationControllerProvider = provider;
  provider.navigationControllerPlacedByParent = YES;
  [self startObservingProvidedView:provider.navigationController];

  [self requestSplitHostControllerUpdateIfNeeded];
}

- (void)releaseNavigationControllerOfProvider:(UIView<RNSNavigationControllerProviding> *)provider
{
  RCTAssert(provider == _navigationControllerProvider,
            @"[RNScreens] Attempt to release a provider which is not the column's one");

  [self stopObservingProvidedView];
  provider.navigationControllerPlacedByParent = NO;
  _navigationControllerProvider = nil;

  [self requestSplitHostControllerUpdateIfNeeded];
}

- (void)requestSplitHostControllerUpdateIfNeeded
{
  if (self.splitHost != nil) {
    [self.splitHost.splitHostController setNeedsUpdateOfChildViewControllers];
  }
}

// TODO(@t0maboro): Temporary frame-reporting logic for stack-backed columns. Unify this with
// RNSSplitNavigationControllerFrameObserver.
- (void)startObservingProvidedView:(UIViewController *)controller
{
  [self stopObservingProvidedView];

  // Loaded here so that the very first frame set by UISplitViewController is observed.
  [controller loadViewIfNeeded];
  UIView *view = controller.view;
  [view addObserver:self
         forKeyPath:@"frame"
            options:NSKeyValueObservingOptionNew
            context:RNSSplitScreenProvidedViewFrameContext];
  _observedProvidedView = view;
}

- (void)stopObservingProvidedView
{
  [_observedProvidedView removeObserver:self forKeyPath:@"frame" context:RNSSplitScreenProvidedViewFrameContext];
  _observedProvidedView = nil;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  if (context != RNSSplitScreenProvidedViewFrameContext) {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    return;
  }
  [self updateShadowStateFromProvidedView];
}

- (void)updateShadowStateFromProvidedView
{
  UIView *providedView = _observedProvidedView;
  if (providedView.window == nil || self.splitHost == nil) {
    return;
  }

  UIView *ancestorView = self.splitHost.splitHostController.view;
  CGRect frame = [providedView convertRect:providedView.bounds toView:ancestorView];
  [_shadowStateProxy updateShadowStateWithFrame:frame];
}

#pragma mark - Layout

/**
 * This override **should be considered as a workaround** for which I made some assumptions:
 * 1. All parents of views with associated `UINavigationController` should have the same width as the SplitView column
 * 2. I'm greedily aligning all native components which are extending `UINavigationController` - is covers both old and
 * new stack implementations, however, it will have an impact on any other native component which will be extending
 * from the same class.
 */
- (void)layoutSubviews
{
  [super layoutSubviews];
}

#pragma mark - ShadowTreeState

- (nonnull RNSSplitScreenShadowStateProxy *)shadowStateProxy
{
  RCTAssert(_shadowStateProxy != nil, @"[RNScreens] Attempt to access uninitialized _shadowStateProxy");
  return _shadowStateProxy;
}

#pragma mark - Events

- (nonnull RNSSplitScreenComponentEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#pragma mark - RNSSafeAreaProviding

- (UIEdgeInsets)providerSafeAreaInsets
{
  return self.safeAreaInsets;
}

- (void)dispatchSafeAreaDidChangeNotification
{
  [NSNotificationCenter.defaultCenter postNotificationName:RNSSafeAreaDidChange object:self userInfo:nil];
}

#pragma mark - RNSSafeAreaProviding related methods

// TODO: register for UIKeyboard notifications

- (void)safeAreaInsetsDidChange
{
  [super safeAreaInsetsDidChange];
  [self dispatchSafeAreaDidChangeNotification];
}

#pragma mark - RCTComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView conformsToProtocol:@protocol(RNSNavigationControllerProviding)]) {
    [self takeOverNavigationControllerOfProvider:(UIView<RNSNavigationControllerProviding> *)childComponentView];
    return;
  }

  RCTAssert(_navigationControllerProvider == nil,
            @"[RNScreens] A column backed by a provided navigation controller cannot have other children");
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if (childComponentView == (UIView *)_navigationControllerProvider) {
    [self releaseNavigationControllerOfProvider:(UIView<RNSNavigationControllerProviding> *)childComponentView];
    return;
  }
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];

  [_shadowStateProxy updateState:state oldState:oldState];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(props);

  if (oldComponentProps.columnType != newComponentProps.columnType) {
    _columnType = rnscreens::conversion::RNSSplitScreenColumnTypeFromScreenProp(newComponentProps.columnType);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSSplitScreenEventEmitter>(eventEmitter)];
}

- (void)invalidate
{
  // Controller keeps the strong reference to the component via the `.view` property.
  // Therefore, we need to enforce a proper cleanup, breaking the retain cycle,
  // when we want to destroy the component.
  _controller = nil;
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

Class<RCTComponentViewProtocol> RNSSplitScreenCls(void)
{
  return RNSSplitScreenComponentView.class;
}
