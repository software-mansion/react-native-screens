#import "RNSFormSheetHostComponentView.h"
#import "RNSDefines.h"
#import "RNSFormSheetContentController.h"
#import "RNSFormSheetContentView.h"
#import "RNSFormSheetHostEventEmitter.h"
#import "RNSFormSheetHostShadowStateProxy.h"
#import "RNSPresentationSourceProvider.h"

#import <React/RCTLog.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSFormSheetHostComponentDescriptor.h>

namespace react = facebook::react;

// Predefined values for `largestUndimmedDetentIndex`.
static NSInteger const kRNSFormSheetAlwaysDimmed = -1;
static NSInteger const kRNSFormSheetNeverDimmed = -2;

@interface RNSFormSheetHostComponentView () <RNSFormSheetHostControllerDelegate>
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

  // Invalidation flags
  BOOL _needsSheetPresentationUpdate;
  BOOL _needsSheetConfigurationUpdate;
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

  _needsSheetPresentationUpdate = NO;
  _needsSheetConfigurationUpdate = NO;
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

#pragma mark - RNSFormSheetHostControllerDelegate

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
    _needsSheetPresentationUpdate = YES;

    // ALWAYS refresh the sheet configuration when reopening,
    // because UIKit destroys the presentationController after the modal is dismissed.
    if (_isOpen) {
      _needsSheetConfigurationUpdate = YES;
    }
  }

  if (oldComponentProps.detents != newComponentProps.detents) {
    _detents = newComponentProps.detents;
    _needsSheetConfigurationUpdate = YES;
  }

  if (oldComponentProps.prefersGrabberVisible != newComponentProps.prefersGrabberVisible) {
    _prefersGrabberVisible = newComponentProps.prefersGrabberVisible;
    _needsSheetConfigurationUpdate = YES;
  }

  if (oldComponentProps.preferredCornerRadius != newComponentProps.preferredCornerRadius) {
    _preferredCornerRadius = newComponentProps.preferredCornerRadius;
    _needsSheetConfigurationUpdate = YES;
  }

  if (oldComponentProps.largestUndimmedDetentIndex != newComponentProps.largestUndimmedDetentIndex) {
    _largestUndimmedDetentIndex = newComponentProps.largestUndimmedDetentIndex;
    _needsSheetConfigurationUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];

  if (_needsSheetConfigurationUpdate) {
    _needsSheetConfigurationUpdate = NO;
    [self updateConfiguration];
  }

  if (_needsSheetPresentationUpdate) {
    _needsSheetPresentationUpdate = NO;
    [self updatePresentationState];
  }
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

- (void)updateConfiguration
{
#if !TARGET_OS_TV
  UISheetPresentationController *sheet = _controller.sheetPresentationController;
  RCTAssert(
      sheet != nil,
      @"[RNScreens] sheetPresentationController is nil. Ensure modalPresentationStyle is set to UIModalPresentationFormSheet.");

  NSArray<UISheetPresentationControllerDetent *> *nativeDetents = [self buildSheetDetents];
  UISheetPresentationControllerDetentIdentifier largestUndimmedDetentIdentifier =
      [self largestUndimmedDetentIdentifierForDetents:nativeDetents];

  // TODO: @t0maboro - consider refactoring to follow the RNSSplitAppearanceCoordinator convention
  [sheet animateChanges:^{
    sheet.detents = nativeDetents;
    sheet.prefersGrabberVisible = _prefersGrabberVisible;
    sheet.preferredCornerRadius =
        _preferredCornerRadius < 0 ? UISheetPresentationControllerAutomaticDimension : _preferredCornerRadius;
    sheet.largestUndimmedDetentIdentifier = largestUndimmedDetentIdentifier;
  }];
#endif // !TARGET_OS_TV
}

#if !TARGET_OS_TV
- (NSArray<UISheetPresentationControllerDetent *> *)buildSheetDetents
{
  size_t detentsCount = _detents.size();

  // Defaults to large detent across all iOS versions
  if (detentsCount == 0) {
    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  if (![self areDetentsValid]) {
    RCTLogError(
        @"[RNScreens] The values in the detents array must fall within the 0.0 to 1.0 range. Falling back to large detent.");

    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  if (![self areDetentsStrictlyAscending]) {
    RCTLogError(
        @"[RNScreens] The values in the detents array must be in strictly ascending order. Falling back to large detent.");

    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  NSMutableArray<UISheetPresentationControllerDetent *> *nativeDetents =
      [[NSMutableArray alloc] initWithCapacity:detentsCount];

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  if (@available(iOS 16.0, *)) {
    for (size_t i = 0; i < detentsCount; i++) {
      double fraction = _detents[i];
      NSString *ident = [NSString stringWithFormat:@"%zu", i];

      [nativeDetents
          addObject:[UISheetPresentationControllerDetent
                        customDetentWithIdentifier:ident
                                          resolver:^CGFloat(
                                              id<UISheetPresentationControllerDetentResolutionContext> context) {
                                            return context.maximumDetentValue * fraction;
                                          }]];
    }
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  {
    // iOS 15 Legacy Fallback
    if (detentsCount == 1) {
      double firstDetentFraction = _detents[0];
      if (firstDetentFraction < 1.0) {
        [nativeDetents addObject:UISheetPresentationControllerDetent.mediumDetent];
      } else {
        [nativeDetents addObject:UISheetPresentationControllerDetent.largeDetent];
      }
    } else {
      // Handles detentsCount > 1
      [nativeDetents addObject:UISheetPresentationControllerDetent.mediumDetent];
      [nativeDetents addObject:UISheetPresentationControllerDetent.largeDetent];
    }
  }

  return nativeDetents;
}

- (UISheetPresentationControllerDetentIdentifier)largestUndimmedDetentIdentifierForDetents:
    (NSArray<UISheetPresentationControllerDetent *> *)detents
{
  if (_largestUndimmedDetentIndex == kRNSFormSheetAlwaysDimmed) {
    return nil;
  }

  NSInteger ludIndex = _largestUndimmedDetentIndex == kRNSFormSheetNeverDimmed ? (NSInteger)detents.count - 1
                                                                               : _largestUndimmedDetentIndex;

  if (ludIndex < 0 || ludIndex >= (NSInteger)detents.count) {
    RCTLogError(
        @"[RNScreens] largestUndimmedDetentIndex (%ld) exceeds effective detents count (%lu). Falling back to the default behavior (always dimmed).",
        (long)_largestUndimmedDetentIndex,
        (unsigned long)detents.count);
    return nil;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  if (@available(iOS 16.0, *)) {
    return detents[(NSUInteger)ludIndex].identifier;
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  {
    // iOS 15 Fallback - mirroring buildSheetDetents
    UISheetPresentationControllerDetent *targetDetent = detents[(NSUInteger)ludIndex];

    if ([targetDetent isEqual:[UISheetPresentationControllerDetent mediumDetent]]) {
      return UISheetPresentationControllerDetentIdentifierMedium;
    }

    return UISheetPresentationControllerDetentIdentifierLarge;
  }
}

#endif // !TARGET_OS_TV

- (BOOL)areDetentsValid
{
  for (double currentDetent : _detents) {
    if (isnan(currentDetent)) {
      return NO;
    }

    if (currentDetent < 0.0 || currentDetent > 1.0) {
      return NO;
    }
  }
  return YES;
}

- (BOOL)areDetentsStrictlyAscending
{
  for (size_t i = 1; i < _detents.size(); i++) {
    if (_detents[i - 1] >= _detents[i]) {
      return NO;
    }
  }
  return YES;
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
