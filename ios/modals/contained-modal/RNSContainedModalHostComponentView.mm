#import "RNSContainedModalHostComponentView.h"
#import "RNSContainedModalContentController.h"
#import "RNSContainedModalContentView.h"
#import "RNSContainedModalHostShadowStateProxy.h"
#import "RNSContainedModalProviders.h"

#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RNSContainedModalHostComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSContainedModalHostComponentView () <RCTMountingTransactionObserving,
                                                  RNSContainedModalContentControllerDelegate,
                                                  RNSContainedModalPresentationProvider>
@end

@implementation RNSContainedModalHostComponentView {
  RNSContainedModalHostShadowStateProxy *_Nonnull _shadowStateProxy;

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

// A contained modal is presented from the provider whose `containerId` matches the
// modal's `targetContainerId`, so it stays contained within that provider's bounds.
// This resolves the provider only once - on the first presentation. The provider is
// an ancestor of the modal in the React tree, so it cannot be unmounted without also
// unmounting the modal.
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
// The whole containment model rides on UIKit attaching the presentation
// container to the context view's superview (the provider wrapper) sized to
// its bounds - observed, not documented behavior. Detection only: if an iOS
// release changes the attach point or re-asserts its own layout, this warns
// instead of leaving a silently misplaced (and touch-misrouted) modal.
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
    RCTLogWarn(
        @"[RNScreens] ContainedModal presentation container escaped its provider (container: %@ in %@, provider bounds: %@). UIKit's context attach-point contract may have changed on this OS version.",
        NSStringFromCGRect(containerView.frame),
        NSStringFromClass([containerView.superview class]),
        NSStringFromCGRect(providerView.bounds));
  }
}
#endif

- (void)modalControllerViewDidAppear:(RNSContainedModalContentController *)controller
{
  // The layout callback also re-syncs, but a restore after a suspension
  // (covering screen popped, split column re-shown, app re-foregrounded)
  // re-attaches the content WITHOUT any layout pass, so appearance is the
  // only trigger that fires then. The proxy dedupes by frame, so an
  // overlapping trigger costs a point comparison.
  [self syncShadowNodeState];
}

- (void)modalControllerViewDidDisappear:(RNSContainedModalContentController *)controller
{
  // Nothing to tear down: touch delivery is owned by the main surface's touch
  // handler (see the note in `hitTest:`), which has no per-modal lifecycle.
}

- (void)modalControllerDidRejectPresentation:(RNSContainedModalContentController *)controller
{
  RCTLogWarn(
      @"[RNScreens] ContainedModal (targetContainerId '%@') was not presented: its provider is already presenting another modal. Only one modal can be open per provider; the request was dropped.",
      _targetContainerId);
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
  [_controller.contentView insertReactSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_controller.contentView removeReactSubview:childComponentView];
}

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSContainedModalHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSContainedModalHostProps>(props);

  if (oldComponentProps.targetContainerId != newComponentProps.targetContainerId) {
    _targetContainerId = RCTNSStringFromStringNilIfEmpty(newComponentProps.targetContainerId);
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
}

#pragma mark - Touch Handling overrides

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  // The modal's React children are teleported into the presented controller's
  // content view (RNSContainedModalContentView). Unlike FormSheet, that view
  // stays INSIDE the main surface's view hierarchy (containment), so the main
  // surface's RCTSurfaceTouchHandler delivers its touches - a dedicated
  // handler would produce a second, differently-offset event stream for the
  // same touch and break Pressability. This host view itself is an empty
  // anchor in the React tree, so it must never be a hit-test target -
  // returning nil lets touches pass through to whatever is actually behind it
  // instead of being swallowed by this empty view.
  return nil;
}

#pragma mark - Layout helpers

- (void)syncShadowNodeState
{
  if (_controller == nil || _controller.contentView == nil || _controller.contentView.window == nil) {
    return;
  }

  // contentOriginOffset must be the content view's ABSOLUTE origin in window
  // space: measurement of the teleported children stops at this host (its
  // shadow node carries the RootNodeKind trait) and then adds this offset, so
  // the offset is what lifts content-local child metrics into the same
  // window-rooted coordinate space the main surface's touch handler reports
  // events in. Anything else makes Pressability's measured region diverge
  // from event pageX/pageY and cancels any press on the first finger move.
  CGPoint contentViewOriginInWindow = [_controller.contentView convertPoint:CGPointZero toView:nil];

  [_shadowStateProxy updateShadowStateWithBounds:_controller.contentView.bounds origin:contentViewOriginInWindow];
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
