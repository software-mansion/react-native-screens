#import "RNSFormSheetHostComponentView.h"
#import "RNSDefines.h"
#import "RNSFormSheetAppearanceApplicator.h"
#import "RNSFormSheetAppearanceCoordinator.h"
#import "RNSFormSheetContentController.h"
#import "RNSFormSheetContentView.h"
#import "RNSFormSheetDetentResolver.h"
#import "RNSFormSheetHostEventEmitter.h"
#import "RNSFormSheetHostShadowStateProxy.h"
#import "RNSPresentationSourceProvider.h"

#import <React/RCTLog.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSFormSheetHostComponentDescriptor.h>

namespace react = facebook::react;

@interface RNSFormSheetHostComponentView () <RNSFormSheetContentControllerDelegate>
@end

@implementation RNSFormSheetHostComponentView {
  RNSFormSheetHostEventEmitter *_Nonnull _reactEventEmitter;
  RNSFormSheetHostShadowStateProxy *_Nonnull _shadowStateProxy;
  RNSFormSheetAppearanceCoordinator *_Nonnull _appearanceCoordinator;
  RNSFormSheetAppearanceApplicator *_Nonnull _appearanceApplicator;

  RNSFormSheetContentController *_Nullable _controller;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;

  // Props
  BOOL _isOpen;
  std::vector<double> _detents;
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
  _appearanceCoordinator = [RNSFormSheetAppearanceCoordinator new];
  _appearanceApplicator = [RNSFormSheetAppearanceApplicator new];
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
}

- (const std::vector<double> &)detents
{
  return _detents;
}

- (void)setupController
{
  _controller = [RNSFormSheetContentController new];
  _controller.delegate = self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  if (self.window != nil) {
    [self updatePresentationState];
  }
}

#pragma mark - Presentation Logic

- (void)updatePresentationState
{
  if (self.window == nil) {
    return;
  }

  BOOL isPresented = _controller.presentingViewController != nil;

  // TODO: @t0maboro - This presentation logic is currently quite primitive.
  // We are not entirely safe from rapid conflicting updates, and there are edge cases
  // where the presentation state might become desynchronized. Addressing this robustly
  // might require an approach similar to the tabs implementation using state provenance,
  // which will be handled separately.
  // Followup ticket: https://github.com/software-mansion/react-native-screens-labs/issues/1420
  if (_isOpen && !isPresented) {
    UIViewController *presentationSourceViewController =
        [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:self.window];
    if (presentationSourceViewController == nil) {
      RCTLogError(
          @"[RNScreens] Failed to present form sheet: The source view controller cannot be found for target window.");
      return;
    }

    // TODO: @t0maboro - this log definitely requires refactor now and it should be removed outside Host in a followup
    // PR
    [_controller prepareForPresentation];
    [presentationSourceViewController presentViewController:_controller animated:YES completion:nil];
  } else if (!_isOpen && isPresented) {
    [_controller dismissViewControllerAnimated:YES completion:nil];
  } else {
    // The remaining two combinations are valid and require no action:
    // 1. _isOpen == NO and isPresented == NO: This occurs on the initial mount before the sheet is opened,
    //    or when the sheet has already been successfully dismissed.
    // 2. _isOpen == YES and isPresented == YES: This occurs when the sheet is already visible
    //    and we are just updating other configuration props (e.g., detents) via updateProps.
  }
}

#pragma mark - RNSFormSheetContentControllerDelegate

- (void)sheetControllerDidNativeDismiss:(RNSFormSheetContentController *)controller
{
  _isOpen = NO;
  [_reactEventEmitter emitOnNativeDismiss];
}

- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetContentController *)controller
{
  [self syncTouchHandlerOrigin];
  [self syncShadowNodeState];
}

#if !TARGET_OS_TV
- (void)sheetController:(RNSFormSheetContentController *)controller didChangeDetentIdentifier:(NSString *)identifier
{
  NSInteger index = [self detentIndexFromDetentIdentifier:identifier];
  [_reactEventEmitter emitOnDetentChangedWithIndex:index];
}
#endif // !TARGET_OS_TV

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
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_controller.contentView removeReactSubview:childComponentView];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSFormSheetHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSFormSheetHostProps>(props);

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = static_cast<BOOL>(newComponentProps.isOpen);
    [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsPresentation];

    if (_isOpen) {
      // ALWAYS refresh the sheet configuration when reopening,
      // because UIKit destroys the presentationController after the modal is dismissed.
      [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration];
      // Reset the initial-detent applied flag when reopening so the
      // configured initialDetentIndex can be applied again.
      [_appearanceApplicator resetInitialDetent];
    }
  }

  if (oldComponentProps.detents != newComponentProps.detents) {
    _detents = newComponentProps.detents;
    [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration];
  }

  if (oldComponentProps.prefersGrabberVisible != newComponentProps.prefersGrabberVisible) {
    _prefersGrabberVisible = newComponentProps.prefersGrabberVisible;
    [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration];
  }

  if (oldComponentProps.preferredCornerRadius != newComponentProps.preferredCornerRadius) {
    _preferredCornerRadius = newComponentProps.preferredCornerRadius;
    [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration];
  }

  if (oldComponentProps.largestUndimmedDetentIndex != newComponentProps.largestUndimmedDetentIndex) {
    _largestUndimmedDetentIndex = newComponentProps.largestUndimmedDetentIndex;
    [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration];
  }

  if (oldComponentProps.initialDetentIndex != newComponentProps.initialDetentIndex) {
    _initialDetentIndex = newComponentProps.initialDetentIndex;
  }

  if (oldComponentProps.prefersScrollingExpandsWhenScrolledToEdge !=
      newComponentProps.prefersScrollingExpandsWhenScrolledToEdge) {
    _prefersScrollingExpandsWhenScrolledToEdge =
        static_cast<BOOL>(newComponentProps.prefersScrollingExpandsWhenScrolledToEdge);
    [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];

  [_appearanceApplicator updateAppearanceIfNeededForHost:self
                                              controller:_controller
                                             coordinator:_appearanceCoordinator];

  [_appearanceCoordinator updateIfNeeds:RNSFormSheetAppearanceUpdateFlagsPresentation
                      performOperations:^{
                        [self updatePresentationState];
                      }];
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
