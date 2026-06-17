#import "RNSFormSheetHostComponentView.h"
#import "RNSFormSheetContentController.h"
#import "RNSFormSheetContentView.h"
#import "RNSFormSheetContentWrapperComponentView.h"
#import "RNSFormSheetContentWrapperDelegate.h"
#import "RNSFormSheetDetentResolver.h"
#import "RNSFormSheetHostEventEmitter.h"
#import "RNSFormSheetHostShadowStateProxy.h"
#import "RNSFormSheetProviders.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSFormSheetHostComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSFormSheetHostComponentView () <RCTMountingTransactionObserving,
                                             RNSFormSheetContentControllerDelegate,
                                             RNSFormSheetContentWrapperDelegate,
                                             RNSFormSheetPresentationProvider,
                                             RNSFormSheetAppearanceProvider,
                                             RNSFormSheetBehaviorProvider>
@end

@implementation RNSFormSheetHostComponentView {
  RNSFormSheetHostEventEmitter *_Nonnull _reactEventEmitter;
  RNSFormSheetHostShadowStateProxy *_Nonnull _shadowStateProxy;

  RNSFormSheetContentController *_Nullable _controller;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;

  // Props
  BOOL _isOpen;
  std::vector<double> _detents;
  BOOL _prefersGrabberVisible;
  CGFloat _preferredCornerRadius;
  NSInteger _largestUndimmedDetentIndex;
  NSInteger _initialDetentIndex;
  BOOL _prefersScrollingExpandsWhenScrolledToEdge;
  BOOL _preventNativeDismiss;
  UIColor *_Nullable _nativeContainerBackgroundColor;

  CGFloat _reactContentsHeight;
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

  _reactEventEmitter = [RNSFormSheetHostEventEmitter new];
  _shadowStateProxy = [RNSFormSheetHostShadowStateProxy new];
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSFormSheetHostProps>();
  _props = defaultProps;

  _isOpen = NO;
  _detents = {};
  _prefersGrabberVisible = NO;
  _preferredCornerRadius = -1.0;
  _largestUndimmedDetentIndex = kRNSFormSheetAlwaysDimmed;
  _initialDetentIndex = 0;
  _prefersScrollingExpandsWhenScrolledToEdge = YES;
  _preventNativeDismiss = NO;
  _nativeContainerBackgroundColor = nil;

  _reactContentsHeight = 0.0;
}

- (void)setupController
{
  _controller = [RNSFormSheetContentController new];
  _controller.delegate = self;

  _controller.presentationProvider = self;
  _controller.appearanceProvider = self;
  _controller.behaviorProvider = self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    [_controller setNeedsPresentationUpdate];
    [_controller flushPendingUpdates];
  }
}

#pragma mark - RNSFormSheetPresentationProvider

- (nullable UIWindow *)hostWindow
{
  return self.window;
}

#pragma mark - RNSFormSheetBehaviorProvider

- (const std::vector<double> &)detents
{
  return _detents;
}

- (CGFloat)reactContentsHeight
{
  return _reactContentsHeight;
}

#pragma mark - RNSFormSheetContentWrapperDelegate

- (void)contentWrapper:(RNSFormSheetContentWrapperComponentView *)wrapper
    didChangeReactContentsHeight:(CGFloat)reactContentsHeight
{
  if (_reactContentsHeight != reactContentsHeight) {
    _reactContentsHeight = reactContentsHeight;
    [_controller setNeedsBehaviorUpdate];
  }
}

#pragma mark - RNSFormSheetContentControllerDelegate

- (void)sheetControllerDidDismiss:(RNSFormSheetContentController *)controller
{
  [_reactEventEmitter emitOnDismiss];
}

- (void)sheetControllerDidNativeDismiss:(RNSFormSheetContentController *)controller
{
  _isOpen = NO;
  [_reactEventEmitter emitOnNativeDismiss];
}

- (void)sheetControllerDidPreventNativeDismiss:(RNSFormSheetContentController *)controller
{
  [_reactEventEmitter emitOnNativeDismissPrevented];
}

- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetContentController *)controller
{
  [self syncTouchHandlerOrigin];
  [self syncShadowNodeState];
}

#if !TARGET_OS_TV
- (void)sheetController:(RNSFormSheetContentController *)controller
    didChangeDetentIdentifier:(nullable NSString *)identifier
{
  NSInteger index = [RNSFormSheetDetentResolver detentIndexFromDetentIdentifier:identifier forRawDetents:_detents];
  if (index >= 0) {
    [_reactEventEmitter emitOnDetentChangedWithIndex:index];
  }
}
#endif // !TARGET_OS_TV

- (void)sheetControllerWillAppear:(RNSFormSheetContentController *)controller
{
  [_reactEventEmitter emitOnWillAppear];
}

- (void)sheetControllerDidAppear:(RNSFormSheetContentController *)controller
{
  [_reactEventEmitter emitOnDidAppear];
}

- (void)sheetControllerWillDisappear:(RNSFormSheetContentController *)controller
{
  [_reactEventEmitter emitOnWillDisappear];
}

- (void)sheetControllerDidDisappear:(RNSFormSheetContentController *)controller
{
  [_reactEventEmitter emitOnDidDisappear];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];
  [_shadowStateProxy updateState:state oldState:oldState];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSFormSheetHostEventEmitter>(eventEmitter)];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSFormSheetHostComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_controller.contentView insertReactSubview:childComponentView atIndex:index];

  // Assuming that for `fitToContents` the RNSFormSheetContentWrapperComponentView will be a direct child of
  // RNSFormSheetHostComponentView.
  if ([childComponentView isKindOfClass:[RNSFormSheetContentWrapperComponentView class]]) {
    ((RNSFormSheetContentWrapperComponentView *)childComponentView).delegate = self;
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:[RNSFormSheetContentWrapperComponentView class]]) {
    ((RNSFormSheetContentWrapperComponentView *)childComponentView).delegate = nil;
  }

  [_controller.contentView removeReactSubview:childComponentView];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSFormSheetHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSFormSheetHostProps>(props);

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = static_cast<BOOL>(newComponentProps.isOpen);
    [_controller setNeedsPresentationUpdate];

    if (_isOpen) {
      // ALWAYS refresh the sheet configuration when reopening,
      // because UIKit destroys the presentationController after the modal is dismissed.
      [_controller setNeedsAppearanceUpdate];
      [_controller setNeedsBehaviorUpdate];
      // Reset the initial-detent applied flag when reopening so the
      // configured initialDetentIndex can be applied again.
      [_controller setNeedsInitialDetentReset];
    }
  }

  if (oldComponentProps.detents != newComponentProps.detents) {
    _detents = newComponentProps.detents;
    [_controller setNeedsBehaviorUpdate];
  }

  if (oldComponentProps.prefersScrollingExpandsWhenScrolledToEdge !=
      newComponentProps.prefersScrollingExpandsWhenScrolledToEdge) {
    _prefersScrollingExpandsWhenScrolledToEdge =
        static_cast<BOOL>(newComponentProps.prefersScrollingExpandsWhenScrolledToEdge);
    [_controller setNeedsBehaviorUpdate];
  }

  if (oldComponentProps.preventNativeDismiss != newComponentProps.preventNativeDismiss) {
    _preventNativeDismiss = static_cast<BOOL>(newComponentProps.preventNativeDismiss);
    [_controller setNeedsBehaviorUpdate];
  }

  if (oldComponentProps.prefersGrabberVisible != newComponentProps.prefersGrabberVisible) {
    _prefersGrabberVisible = newComponentProps.prefersGrabberVisible;
    [_controller setNeedsAppearanceUpdate];
  }

  if (oldComponentProps.preferredCornerRadius != newComponentProps.preferredCornerRadius) {
    _preferredCornerRadius = newComponentProps.preferredCornerRadius;
    [_controller setNeedsAppearanceUpdate];
  }

  if (oldComponentProps.largestUndimmedDetentIndex != newComponentProps.largestUndimmedDetentIndex) {
    _largestUndimmedDetentIndex = newComponentProps.largestUndimmedDetentIndex;
    [_controller setNeedsAppearanceUpdate];
  }

  if (oldComponentProps.nativeContainerBackgroundColor != newComponentProps.nativeContainerBackgroundColor) {
    _nativeContainerBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.nativeContainerBackgroundColor);
    [_controller setNeedsAppearanceUpdate];
  }

  if (oldComponentProps.initialDetentIndex != newComponentProps.initialDetentIndex) {
    _initialDetentIndex = newComponentProps.initialDetentIndex;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)invalidate
{
  if (_touchHandler != nil) {
    [_touchHandler detachFromView:_controller.contentView];
    _touchHandler = nil;
  }

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

#pragma mark - Touch Handling overrides

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  // The actual React children are "teleported" and mounted inside a separate view hierarchy (RNSFormSheetContentView).
  // Returning nil ensures that this host view never intercepts touch events meant for the underlying screen.
  return nil;
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

#pragma mark - Dynamic frameworks support

#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSFormSheetHostCls(void)
{
  return RNSFormSheetHostComponentView.class;
}
