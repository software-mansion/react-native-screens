#import "RNSSheetHostComponentView.h"
#import "RNSSheetContentController.h"
#import "RNSSheetContentView.h"
#import "RNSSheetContentWrapperComponentView.h"
#import "RNSSheetContentWrapperDelegate.h"
#import "RNSSheetDetentResolver.h"
#import "RNSSheetHostEventEmitter.h"
#import "RNSSheetHostShadowStateProxy.h"
#import "RNSSheetProviders.h"

#import "RNSConversions-Sheet.h"
#import "RNSDefines.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RNSSheetHostComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSSheetHostComponentView () <RCTMountingTransactionObserving,
                                         RNSSheetContentControllerDelegate,
                                         RNSSheetContentWrapperDelegate,
                                         RNSSheetPresentationProvider,
                                         RNSSheetAppearanceProvider,
                                         RNSSheetBehaviorProvider>
@end

@implementation RNSSheetHostComponentView {
  RNSSheetHostEventEmitter *_Nonnull _reactEventEmitter;
  RNSSheetHostShadowStateProxy *_Nonnull _shadowStateProxy;

  RNSSheetContentController *_Nullable _controller;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;

  // Props
  BOOL _isOpen;
  NSArray<NSNumber *> *_Nonnull _detents;
  BOOL _prefersGrabberVisible;
  CGFloat _preferredCornerRadius;
  NSInteger _largestUndimmedDetentIndex;
  NSInteger _initialDetentIndex;
  BOOL _prefersScrollingExpandsWhenScrolledToEdge;
  BOOL _prefersEdgeAttachedInCompactHeight;
  BOOL _preventNativeDismiss;
  UIColor *_Nullable _nativeContainerBackgroundColor;
  UIVisualEffect *_Nullable _backgroundEffect;

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

  _reactEventEmitter = [RNSSheetHostEventEmitter new];
  _shadowStateProxy = [RNSSheetHostShadowStateProxy new];
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSheetHostProps>();
  _props = defaultProps;

  _isOpen = NO;
  _detents = @[];
  _prefersGrabberVisible = NO;
  _preferredCornerRadius = -1.0;
  _largestUndimmedDetentIndex = kRNSSheetAlwaysDimmed;
  _initialDetentIndex = 0;
  _prefersScrollingExpandsWhenScrolledToEdge = YES;
  _prefersEdgeAttachedInCompactHeight = NO;
  _preventNativeDismiss = NO;
  _nativeContainerBackgroundColor = nil;
  _backgroundEffect = nil;

  _reactContentsHeight = 0.0;
}

- (void)setupController
{
  _controller = [RNSSheetContentController new];
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

#pragma mark - RNSSheetPresentationProvider

- (nullable UIWindow *)hostWindow
{
  return self.window;
}

#pragma mark - RNSSheetBehaviorProvider

- (NSArray<NSNumber *> *)detents
{
  return _detents;
}

- (CGFloat)contentsHeight
{
  return _reactContentsHeight;
}

#pragma mark - RNSSheetContentWrapperDelegate

- (void)contentWrapper:(RNSSheetContentWrapperComponentView *)wrapper
    didChangeReactContentsHeight:(CGFloat)reactContentsHeight
{
  if (_reactContentsHeight != reactContentsHeight) {
    _reactContentsHeight = reactContentsHeight;
    [_controller setNeedsBehaviorUpdate];
  }
}

#pragma mark - RNSSheetContentControllerDelegate

- (void)sheetControllerDidDismiss:(RNSSheetContentController *)controller
{
  [_reactEventEmitter emitOnDismiss];
}

- (void)sheetControllerDidNativeDismiss:(RNSSheetContentController *)controller
{
  _isOpen = NO;
  [_reactEventEmitter emitOnNativeDismiss];
}

- (void)sheetControllerDidPreventNativeDismiss:(RNSSheetContentController *)controller
{
  [_reactEventEmitter emitOnNativeDismissPrevented];
}

- (void)sheetControllerViewDidLayoutSubviews:(RNSSheetContentController *)controller
{
  [self ensureTouchHandlerAttached];
  [self syncShadowNodeState];
}

#if !TARGET_OS_TV
- (void)sheetController:(RNSSheetContentController *)controller
    didChangeDetentIdentifier:(nullable NSString *)identifier
{
  NSInteger index = [RNSSheetDetentResolver detentIndexFromDetentIdentifier:identifier forRawDetents:_detents];
  if (index >= 0) {
    [_reactEventEmitter emitOnDetentChangedWithIndex:index];
  }
}
#endif // !TARGET_OS_TV

- (void)sheetControllerWillAppear:(RNSSheetContentController *)controller
{
  [_reactEventEmitter emitOnWillAppear];
}

- (void)sheetControllerDidAppear:(RNSSheetContentController *)controller
{
  [_reactEventEmitter emitOnDidAppear];
}

- (void)sheetControllerWillDisappear:(RNSSheetContentController *)controller
{
  [_reactEventEmitter emitOnWillDisappear];
}

- (void)sheetControllerDidDisappear:(RNSSheetContentController *)controller
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
  [_reactEventEmitter updateEventEmitter:std::static_pointer_cast<const react::RNSSheetHostEventEmitter>(eventEmitter)];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSheetHostComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_controller.contentView insertSubview:childComponentView atIndex:index];

  // Assuming that for `fitToContents` the RNSSheetContentWrapperComponentView will be a direct child of
  // RNSSheetHostComponentView.
  if ([childComponentView isKindOfClass:[RNSSheetContentWrapperComponentView class]]) {
    ((RNSSheetContentWrapperComponentView *)childComponentView).delegate = self;
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:[RNSSheetContentWrapperComponentView class]]) {
    ((RNSSheetContentWrapperComponentView *)childComponentView).delegate = nil;
  }

  [childComponentView removeFromSuperview];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSheetHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSheetHostProps>(props);

  // Applied before `isOpen`, so a first-time presentation in the same batch already uses the requested style.
  if (oldComponentProps.presentationStyle != newComponentProps.presentationStyle) {
    _controller.presentationStyle =
        rnscreens::conversion::RNSSheetPresentationStyleFromHostProp(newComponentProps.presentationStyle);
  }

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = static_cast<BOOL>(newComponentProps.isOpen);
    [_controller setNeedsPresentationUpdate];

    if (_isOpen) {
      // ALWAYS refresh the sheet configuration when reopening,
      // because UIKit destroys the presentationController after the modal is dismissed.
      [_controller setNeedsAppearanceUpdate];
      [_controller setNeedsBehaviorUpdate];
      // Request the configured initialDetentIndex to be selected
      // again on the fresh presentation controller.
      [_controller setNeedsInitialDetentUpdate];
    }
  }

  if (oldComponentProps.detents != newComponentProps.detents) {
    NSMutableArray<NSNumber *> *detents = [NSMutableArray arrayWithCapacity:newComponentProps.detents.size()];
    for (double detent : newComponentProps.detents) {
      [detents addObject:@(detent)];
    }
    _detents = detents;
    [_controller setNeedsBehaviorUpdate];
  }

  if (oldComponentProps.prefersScrollingExpandsWhenScrolledToEdge !=
      newComponentProps.prefersScrollingExpandsWhenScrolledToEdge) {
    _prefersScrollingExpandsWhenScrolledToEdge =
        static_cast<BOOL>(newComponentProps.prefersScrollingExpandsWhenScrolledToEdge);
    [_controller setNeedsBehaviorUpdate];
  }

  if (oldComponentProps.prefersEdgeAttachedInCompactHeight != newComponentProps.prefersEdgeAttachedInCompactHeight) {
    _prefersEdgeAttachedInCompactHeight = static_cast<BOOL>(newComponentProps.prefersEdgeAttachedInCompactHeight);
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

#if !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)
  if (@available(iOS 26.1, *)) {
    if (oldComponentProps.backgroundEffect != newComponentProps.backgroundEffect ||
        oldComponentProps.backgroundEffectColor != newComponentProps.backgroundEffectColor ||
        oldComponentProps.backgroundEffectBlurStyle != newComponentProps.backgroundEffectBlurStyle) {
      _backgroundEffect = rnscreens::conversion::RNSSheetBackgroundEffectFromProps(newComponentProps);
      [_controller setNeedsAppearanceUpdate];
    }
  }
#endif // !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(26_1)

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

  [_shadowStateProxy updateShadowStateWithBounds:_controller.contentView.bounds];
}

#pragma mark - Touch Handling overrides

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  // The actual React children are "teleported" and mounted inside a separate view hierarchy (RNSSheetContentView).
  // Returning nil ensures that this host view never intercepts touch events meant for the underlying screen.
  return nil;
}

#pragma mark - Touch Handling helpers

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

Class<RCTComponentViewProtocol> RNSSheetHostCls(void)
{
  return RNSSheetHostComponentView.class;
}
