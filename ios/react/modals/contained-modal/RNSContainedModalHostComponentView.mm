#import "RNSContainedModalHostComponentView.h"
#import "RNSContainedModalContainmentProviding.h"
#import "RNSContainedModalContentController.h"
#import "RNSContainedModalContentView.h"
#import "RNSContainedModalHostEventEmitter.h"
#import "RNSContainedModalHostShadowStateProxy.h"
#import "RNSContainedModalProviders.h"

#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RNSContainedModalHostComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSContainedModalHostComponentView () <RCTMountingTransactionObserving,
                                                  RNSContainedModalContentControllerDelegate,
                                                  RNSContainedModalPresentationProvider>
@end

@implementation RNSContainedModalHostComponentView {
  RNSContainedModalHostShadowStateProxy *_Nonnull _shadowStateProxy;
  RNSContainedModalHostEventEmitter *_Nonnull _reactEventEmitter;

  RNSContainedModalContentController *_Nullable _controller;

  __weak UIView<RNSContainedModalContainmentProviding> *_cachedProviderView;

  // Props
  BOOL _isOpen;
  NSString *_Nullable _targetContainerId;
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

  _shadowStateProxy = [RNSContainedModalHostShadowStateProxy new];
  _reactEventEmitter = [RNSContainedModalHostEventEmitter new];
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSContainedModalHostProps>();
  _props = defaultProps;

  _isOpen = NO;
  _targetContainerId = nil;
}

- (void)setupController
{
  _controller = [RNSContainedModalContentController new];
  _controller.delegate = self;
  _controller.presentationProvider = self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    [_controller setNeedsPresentationUpdate];
    [_controller flushPendingUpdates];
  }
}

#pragma mark - Provider resolution

// Presents from the provider whose `containerId` matches the modal's
// `targetContainerId`. Cached after the first walk: the provider is an
// ancestor in the React tree, so it cannot unmount without also unmounting the
// modal; only a retarget (`updateProps`) invalidates the cache.
- (nullable UIView<RNSContainedModalContainmentProviding> *)resolveProviderView
{
  if (_cachedProviderView != nil) {
    return _cachedProviderView;
  }

  if (_targetContainerId == nil) {
    RCTAssert(NO, @"[RNScreens] ContainedModal has a nil targetContainerId; cannot resolve a provider to present in.");
    return nil;
  }

  UIView *currentView = self.superview;
  while (currentView != nil) {
    if ([currentView conformsToProtocol:@protocol(RNSContainedModalContainmentProviding)]) {
      auto *providerView = (UIView<RNSContainedModalContainmentProviding> *)currentView;

      if ([_targetContainerId isEqualToString:providerView.containerId]) {
        _cachedProviderView = providerView;
        return providerView;
      }
    }
    currentView = currentView.superview;
  }

  RCTAssert(NO, @"[RNScreens] No ContainedModalProvider found matching targetContainerId '%@'.", _targetContainerId);
  return nil;
}

#pragma mark - RNSContainedModalContentControllerDelegate

- (void)modalControllerViewDidLayoutSubviews:(RNSContainedModalContentController *)controller
{
  [self syncShadowNodeState];
#if DEBUG
  [self validateContainmentIntegrity];
#endif
}

#if DEBUG
// The attach point is observed, not documented, UIKit behavior, and the
// container's bounds are the modal's touch-blocking area - an escaped
// container means dead touch zones, not just a misplaced view. Detection
// only, but loud: this is never a valid state.
- (void)validateContainmentIntegrity
{
  if (_controller == nil || _controller.presentingViewController == nil || _controller.viewIfLoaded.window == nil) {
    return;
  }

  UIView *containerView = _controller.viewIfLoaded.superview;
  UIView *providerView = _cachedProviderView;
  if (containerView == nil || providerView == nil || providerView.window == nil) {
    return;
  }

  if (containerView.superview != providerView || !CGRectEqualToRect(containerView.frame, providerView.bounds)) {
    RCTLogError(
        @"[RNScreens] ContainedModal presentation container escaped its provider (container: %@ in %@, provider bounds: %@). UIKit's context attach-point contract may have changed on this OS version.",
        NSStringFromCGRect(containerView.frame),
        NSStringFromClass([containerView.superview class]),
        NSStringFromCGRect(providerView.bounds));
  }
}
#endif

- (void)modalControllerViewDidAppear:(RNSContainedModalContentController *)controller
{
  // A restore after a suspension re-attaches the content view without a
  // layout pass and after the covering transaction already mounted, so
  // appearance is the only trigger that fires at that point.
  [self syncShadowNodeState];
}

- (void)modalControllerViewDidDisappear:(RNSContainedModalContentController *)controller
{
  // Nothing to tear down: touch delivery is owned by the enclosing surface's
  // touch handler (see the note in `hitTest:`), which has no per-modal
  // lifecycle.
}

- (void)modalControllerDidRejectPresentation:(RNSContainedModalContentController *)controller
{
  RCTLogWarn(
      @"[RNScreens] ContainedModal (targetContainerId '%@') was not presented: no matching provider was found, its provider is already presenting another modal, or an ancestor presentation is being dismissed. The request was dropped, not queued.",
      _targetContainerId);
  [_reactEventEmitter emitOnPresentationRejected];
}

#pragma mark - RNSContainedModalPresentationProvider

- (nullable UIWindow *)hostWindow
{
  return self.window;
}

- (nullable UIViewController *)presentationSourceViewController
{
  return [self resolveProviderView].contextViewController;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState
{
  [super updateState:state oldState:oldState];
  [_shadowStateProxy updateState:state oldState:oldState];
}

- (void)updateEventEmitter:(const react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSContainedModalHostEventEmitter>(eventEmitter)];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSContainedModalHostComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_controller.contentView insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSContainedModalHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSContainedModalHostProps>(props);

  if (oldComponentProps.targetContainerId != newComponentProps.targetContainerId) {
    _targetContainerId = RCTNSStringFromStringNilIfEmpty(newComponentProps.targetContainerId);
    // The cached provider was resolved for the previous target; keeping it
    // would present a retargeted modal inside the old provider's bounds.
    _cachedProviderView = nil;
  }

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = static_cast<BOOL>(newComponentProps.isOpen);
    [_controller setNeedsPresentationUpdate];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)invalidate
{
  if (_controller != nil) {
    if (_controller.presentingViewController != nil) {
      [_controller dismissViewControllerAnimated:NO completion:nil];
    }
    _controller = nil;
  }
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  [_controller flushPendingUpdates];

  // The provider can move in surface space without any layout pass on the
  // presented controller's view (an ancestor ScrollView scrolls, a sibling
  // collapses) - the controller's layout/appearance callbacks never fire for a
  // pure position change, so re-sync after every transaction (scrolling and
  // layout shifts each commit state).
  [self syncShadowNodeState];
}

#pragma mark - Touch Handling overrides

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  // The modal's React children are teleported into the presented controller's
  // content view, which stays inside the enclosing surface's view hierarchy -
  // the nearest RCTSurfaceTouchHandler up the chain (see
  // `resolveTouchRootView`) delivers its touches, and a dedicated handler
  // would emit a second, differently-offset event stream for the same touch
  // and break Pressability. This host view is an empty anchor; return nil so
  // it never swallows touches meant for views behind it.
  return nil;
}

#pragma mark - Layout helpers

- (void)syncShadowNodeState
{
  if (_controller == nil || _controller.contentView == nil || _controller.contentView.window == nil) {
    return;
  }

  // The offset must be the content view's origin in the TOUCH ROOT's
  // coordinate space: child measurement stops at this host's RootNodeKind
  // shadow node and adds this offset, and RCTSurfaceTouchHandler reports
  // pageX/pageY relative to the view it is attached to - NOT the window. Which
  // view that is depends on where the provider lives: the surface view for the
  // main surface, or the content view of a natively presented screen
  // (FormSheet, modal stack screens) that attaches its own handler. Anything
  // else desyncs the measured press rect from pageX/pageY by exactly that
  // view's origin and presses cancel on the first finger move.
  CGPoint contentViewOriginInTouchRoot = [_controller.contentView convertPoint:CGPointZero
                                                                        toView:[self resolveTouchRootView]];

  [_shadowStateProxy updateShadowStateWithBounds:_controller.contentView.bounds origin:contentViewOriginInTouchRoot];
}

// The nearest ancestor an RCTSurfaceTouchHandler is attached to: that handler
// delivers this content's touches and defines their pageX/pageY space.
- (nullable UIView *)resolveTouchRootView
{
  UIView *currentView = _controller.contentView.superview;
  while (currentView != nil) {
    for (UIGestureRecognizer *recognizer in currentView.gestureRecognizers) {
      if ([recognizer isKindOfClass:RCTSurfaceTouchHandler.class]) {
        return currentView;
      }
    }
    currentView = currentView.superview;
  }
  // nil (not found) makes convertPoint:toView: fall back to window
  // coordinates - the best remaining guess.
  return currentView;
}

#pragma mark - Dynamic frameworks support

#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSContainedModalHostCls(void)
{
  return RNSContainedModalHostComponentView.class;
}
