#import "RNSContainedModalHostComponentView.h"
#import "RNSContainedModalContentController.h"
#import "RNSContainedModalContentView.h"
#import "RNSContainedModalHostShadowStateProxy.h"
#import "RNSContainedModalProviderComponentView.h"
#import "RNSContainedModalProviders.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSContainedModalHostComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSContainedModalHostComponentView () <RCTMountingTransactionObserving,
                                                  RNSContainedModalContentControllerDelegate,
                                                  RNSContainedModalPresentationProvider>
@end

@implementation RNSContainedModalHostComponentView {
  RNSContainedModalHostShadowStateProxy *_Nonnull _shadowStateProxy;

  RNSContainedModalContentController *_controller;
  NSString *_targetContainerId;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
  BOOL _isOpen;
  BOOL _transparent;
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
  _transparent = YES;
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

#pragma mark - RNSContainedModalContentControllerDelegate

- (void)modalControllerViewDidLayoutSubviews:(RNSContainedModalContentController *)controller
{
  [self syncTouchHandlerOrigin];
  [self syncShadowNodeState];
}

- (void)modalControllerViewDidDisappear:(RNSContainedModalContentController *)controller
{
  // The touch handler is attached to the controller's content view on present/layout
  // Once the modal is dismissed, that content view is no longer on screen, so the
  // handler must be detached.
  [self detachTouchHandler];
}

#pragma mark - RNSContainedModalPresentationProvider

- (nullable UIView *)hostView
{
  return self;
}

- (nullable UIWindow *)hostWindow
{
  return self.window;
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

  if (oldComponentProps.transparent != newComponentProps.transparent) {
    _transparent = static_cast<BOOL>(newComponentProps.transparent);
    // The presentation style is applied during the presentation update (in the
    // presentation manager, right before the modal is presented), so we just
    // request an update here rather than mutating the controller directly.
    [_controller setNeedsPresentationUpdate];
  }

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = static_cast<BOOL>(newComponentProps.isOpen);
    [_controller setNeedsPresentationUpdate];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)invalidate
{
  [self detachTouchHandler];

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
  // content view (RNSContainedModalContentView), which has its own touch handler.
  // This host view itself is an empty, zero-sized anchor in the React tree, so it
  // must never be a hit-test target - returning nil lets touches pass through to
  // whatever is actually behind it instead of being swallowed by this empty view.
  return nil;
}

#pragma mark - Layout helpers

- (void)syncShadowNodeState
{
  if (_controller == nil || _controller.contentView == nil) {
    return;
  }

  // contentOriginOffset is the vector from the host view's origin to the content view's origin,
  // both expressed in window space. It offsets child layout positions to account for the fact that
  // React children are mounted in a separate UIViewController hierarchy.
  CGPoint contentViewOriginInWindow = [_controller.contentView convertPoint:CGPointZero toView:nil];
  CGPoint hostOriginInWindow = [self convertPoint:CGPointZero toView:nil];
  CGPoint contentOriginOffset = CGPointMake(contentViewOriginInWindow.x - hostOriginInWindow.x,
                                            contentViewOriginInWindow.y - hostOriginInWindow.y);

  [_shadowStateProxy updateShadowStateWithBounds:_controller.contentView.bounds origin:contentOriginOffset];
}

#pragma mark - Touch Handling helpers

- (void)syncTouchHandlerOrigin
{
  if (_controller == nil || _controller.contentView == nil) {
    return;
  }

  // Touch handler requires absolute positioning coordinates, relatively to root (UIWindow)
  CGPoint contentViewOriginInWindow = [_controller.contentView convertPoint:CGPointZero toView:nil];
  [self updateTouchHandlerWithOrigin:contentViewOriginInWindow];
}

- (void)updateTouchHandlerWithOrigin:(CGPoint)origin
{
  if (_touchHandler == nil) {
    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:_controller.contentView];
  }

  // Aligns touch coordinate space with window coordinate space
  _touchHandler.viewOriginOffset = origin;
}

- (void)detachTouchHandler
{
  if (_touchHandler != nil) {
    [_touchHandler detachFromView:_controller.contentView];
    _touchHandler = nil;
  }
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
