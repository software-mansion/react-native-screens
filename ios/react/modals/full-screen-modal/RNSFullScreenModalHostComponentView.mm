#import "RNSFullScreenModalHostComponentView.h"
#import "RNSFullScreenModalContentController.h"
#import "RNSFullScreenModalContentView.h"
#import "RNSFullScreenModalHostEventEmitter.h"
#import "RNSFullScreenModalHostShadowStateProxy.h"
#import "RNSFullScreenModalProviders.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RNSFullScreenModalHostComponentDescriptor.h>

namespace react = facebook::react;

static RNSFullScreenModalPresentationStyle RNSFullScreenModalPresentationStyleFromHostProp(
    react::RNSFullScreenModalHostPresentationStyle presentationStyle)
{
  switch (presentationStyle) {
    using enum react::RNSFullScreenModalHostPresentationStyle;
    case OverContent:
      return RNSFullScreenModalPresentationStyleOverContent;
    case ReplacingContent:
      return RNSFullScreenModalPresentationStyleReplacingContent;
    default:
      RCTLogError(@"[RNScreens] Unsupported presentationStyle value, falling back to replacingContent.");
      return RNSFullScreenModalPresentationStyleReplacingContent;
  }
}

@interface RNSFullScreenModalHostComponentView () <RCTMountingTransactionObserving,
                                                   RNSFullScreenModalContentControllerDelegate,
                                                   RNSFullScreenModalPresentationProvider>
@end

@implementation RNSFullScreenModalHostComponentView {
  RNSFullScreenModalHostShadowStateProxy *_Nonnull _shadowStateProxy;
  RNSFullScreenModalHostEventEmitter *_Nonnull _reactEventEmitter;

  RNSFullScreenModalContentController *_Nullable _controller;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;

  // Props
  BOOL _isOpen;
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

  _shadowStateProxy = [RNSFullScreenModalHostShadowStateProxy new];
  _reactEventEmitter = [RNSFullScreenModalHostEventEmitter new];
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSFullScreenModalHostProps>();
  _props = defaultProps;

  _isOpen = NO;
}

- (void)setupController
{
  _controller = [RNSFullScreenModalContentController new];
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

#pragma mark - RNSFullScreenModalPresentationProvider

- (nullable UIView *)hostView
{
  return self;
}

#pragma mark - RNSFullScreenModalContentControllerDelegate

- (void)modalControllerViewDidLayoutSubviews:(RNSFullScreenModalContentController *)controller
{
  [self ensureTouchHandlerAttached];
  [self syncShadowNodeState];
}

- (void)modalControllerViewWillAppear:(RNSFullScreenModalContentController *)controller
{
  [_reactEventEmitter emitOnWillAppear];
}

- (void)modalControllerViewDidAppear:(RNSFullScreenModalContentController *)controller
{
  [_reactEventEmitter emitOnDidAppear];
}

- (void)modalControllerViewWillDisappear:(RNSFullScreenModalContentController *)controller
{
  [_reactEventEmitter emitOnWillDisappear];
}

- (void)modalControllerViewDidDisappear:(RNSFullScreenModalContentController *)controller
{
  [_reactEventEmitter emitOnDidDisappear];
}

- (void)modalControllerDidDismiss:(RNSFullScreenModalContentController *)controller
{
  [_reactEventEmitter emitOnDismiss];
}

- (void)modalControllerDidNativeDismiss:(RNSFullScreenModalContentController *)controller
{
  // Nothing presents the modal again until `isOpen` goes to `false` and back to `true`: neither a window re-entry nor
  // a later flush.
  _isOpen = NO;
  [_reactEventEmitter emitOnNativeDismiss];
}

- (void)modalControllerDidRejectPresentation:(RNSFullScreenModalContentController *)controller
{
  // Same as after a native dismissal: only a new `isOpen` value retries.
  _isOpen = NO;
  RCTLogWarn(
      @"[RNScreens] FullScreenModal was not presented: the view controller containing it is being dismissed. The request was dropped, not queued.");
  [_reactEventEmitter emitOnPresentationRejected];
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
      updateEventEmitter:std::static_pointer_cast<const react::RNSFullScreenModalHostEventEmitter>(eventEmitter)];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSFullScreenModalHostComponentDescriptor>();
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
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSFullScreenModalHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSFullScreenModalHostProps>(props);

  // Applied before `isOpen`, so a first-time presentation in the same batch already uses the requested style.
  if (oldComponentProps.presentationStyle != newComponentProps.presentationStyle) {
    _controller.presentationStyle =
        RNSFullScreenModalPresentationStyleFromHostProp(newComponentProps.presentationStyle);
  }

  if (oldComponentProps.nativeContainerBackgroundColor != newComponentProps.nativeContainerBackgroundColor) {
    _controller.nativeContainerBackgroundColor =
        RCTUIColorFromSharedColor(newComponentProps.nativeContainerBackgroundColor);
  }

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = static_cast<BOOL>(newComponentProps.isOpen);
    [_controller setNeedsPresentationUpdate];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)invalidate
{
  if (_touchHandler != nil) {
    [_touchHandler detachFromView:_controller.contentView];
    _touchHandler = nil;
  }

  RNSFullScreenModalContentController *controller = _controller;
  _controller = nil;
  if (controller == nil) {
    return;
  }

  // A host that is going away emits nothing.
  controller.delegate = nil;
  controller.presentationProvider = nil;

  // A presentation still running is dismissed by the controller itself once it appears.
  if (controller.presentingViewController == nil || controller.isBeingPresented) {
    return;
  }

  // Dismissing from the presenting controller also takes down everything presented over the modal.
  [controller.presentingViewController dismissViewControllerAnimated:NO completion:nil];
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  [_controller flushPendingUpdates];
}

#pragma mark - Layout helpers

- (void)syncShadowNodeState
{
  if (_controller == nil || _controller.contentView == nil) {
    return;
  }

  [_shadowStateProxy updateShadowStateWithBounds:_controller.contentView.bounds];
}

#pragma mark - Touch Handling overrides

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  // The React children are mounted in the presented controller's content view, outside this host. Returning nil
  // ensures that this empty anchor never intercepts touches meant for the views behind it.
  return nil;
}

#pragma mark - Touch Handling helpers

// UIKit's presentation container lives outside the React Native root view, so no surface touch handler up the chain
// delivers the content's touches.
- (void)ensureTouchHandlerAttached
{
  if (_touchHandler != nil || _controller == nil || _controller.contentView == nil) {
    return;
  }

  _touchHandler = [RCTSurfaceTouchHandler new];
  [_touchHandler attachToView:_controller.contentView];
}

#pragma mark - Dynamic frameworks support

#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSFullScreenModalHostCls(void)
{
  return RNSFullScreenModalHostComponentView.class;
}
