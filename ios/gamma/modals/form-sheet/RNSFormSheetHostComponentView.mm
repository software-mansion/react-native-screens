#import "RNSFormSheetHostComponentView.h"
#import "RNSFormSheetHostComponentEventEmitter.h"
#import "RNSFormSheetHostController.h"
#import "RNSPresentationSourceProvider.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSFormSheetHostComponentDescriptor.h>
#import <rnscreens/RNSFormSheetHostState.h>

namespace react = facebook::react;

@interface RNSFormSheetHostComponentView () <RNSFormSheetControllerDelegate>
@end

@implementation RNSFormSheetHostComponentView {
  RNSFormSheetHostComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSFormSheetHostController *_controller;
  RCTSurfaceTouchHandler *_touchHandler;
  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_reactSubviews;
  react::RNSFormSheetHostShadowNode::ConcreteState::Shared _state;

  // Props
  BOOL _isOpen;
  std::vector<double> _detents;

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

  _reactEventEmitter = [RNSFormSheetHostComponentEventEmitter new];
  _reactSubviews = [NSMutableArray new];

  _needsSheetPresentationUpdate = NO;
  _needsSheetConfigurationUpdate = NO;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSFormSheetHostProps>();
  _props = defaultProps;

  _isOpen = NO;
  _detents = {};
}

- (void)setupController
{
  _controller = [RNSFormSheetHostController new];
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

  UIViewController *presentationSourceViewController =
      [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:self.window
                                                            ignoringController:_controller];
  if (presentationSourceViewController == nil) {
    return;
  }

  BOOL isPresented = _controller.presentingViewController != nil;

  if (_isOpen && !isPresented) {
    [presentationSourceViewController presentViewController:_controller animated:YES completion:nil];
  } else if (!_isOpen && isPresented) {
    // Dismiss programmatically and delay the reset until the animation completes.
    // This prevents conflicting layout updates while the sheet is sliding down.
    __weak auto weakSelf = self;
    [_controller dismissViewControllerAnimated:YES
                                    completion:^{
                                      [weakSelf resetShadowNodeSize];
                                    }];
  } else {
    // The remaining two combinations are valid and require no action:
    // 1. _isOpen == NO and isPresented == NO: This occurs on the initial mount before the sheet is opened,
    //    or when the sheet has already been successfully dismissed.
    // 2. _isOpen == YES and isPresented == YES: This occurs when the sheet is already visible
    //    and we are just updating other configuration props (e.g., detents) via updateProps.
  }
}

#pragma mark - RNSFormSheetControllerDelegate

- (void)sheetControllerDidDismiss:(RNSFormSheetHostController *)controller
{
  _isOpen = NO;
  [self resetShadowNodeSize];

  [_reactEventEmitter emitOnDismiss];
}

- (void)sheetControllerDidLayoutWithBounds:(CGRect)bounds
{
  CGPoint origin = [_controller.view convertPoint:CGPointZero toView:nil];

  [self updateTouchHandlerWithOrigin:origin];

  if (_state != nullptr) {
    auto newState = react::RNSFormSheetHostState{RCTSizeFromCGSize(bounds.size), RCTPointFromCGPoint(origin)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);
  }
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];
  _state = std::static_pointer_cast<const react::RNSFormSheetHostShadowNode::ConcreteState>(state);
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
  [_reactSubviews insertObject:childComponentView atIndex:index];
  [_controller insertReactSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_reactSubviews removeObject:childComponentView];
  [_controller removeReactSubview:childComponentView];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSFormSheetHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSFormSheetHostProps>(props);

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = newComponentProps.isOpen;
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
    [_touchHandler detachFromView:_controller.view];
    _touchHandler = nil;
  }

  if (_controller != nil) {
    if (_controller.presentingViewController != nil) {
      [_controller dismissViewControllerAnimated:NO completion:nil];
    }
    _controller = nil;
  }
}

#pragma mark - Dynamic frameworks support

#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

#pragma mark - Layout helpers

- (void)resetShadowNodeSize
{
  if (_state != nullptr) {
    auto newState = react::RNSFormSheetHostState{RCTSizeFromCGSize(CGSizeZero), RCTPointFromCGPoint(CGPointZero)};

    _state->updateState(std::move(newState));
  }
}

- (void)updateConfiguration
{
  UISheetPresentationController *sheet = _controller.sheetPresentationController;
  if (sheet == nil) {
    return;
  }

  NSArray<UISheetPresentationControllerDetent *> *nativeDetents = [self buildSheetDetents];

  [sheet animateChanges:^{
    sheet.detents = nativeDetents;
  }];
}

- (NSArray<UISheetPresentationControllerDetent *> *)buildSheetDetents
{
  NSMutableArray<UISheetPresentationControllerDetent *> *nativeDetents = [NSMutableArray new];

  if (![self areDetentsValid]) {
    RCTLogError(
        @"[RNScreens] The values in the detents array must fall within the 0.0 to 1.0 range. Falling back to large detent.");

    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  if (![self areDetentsSorted]) {
    RCTLogError(
        @"[RNScreens] The values in the detents array must be sorted in ascending order. Falling back to large detent.");

    return @[ [UISheetPresentationControllerDetent largeDetent] ];
  }

  if (@available(iOS 16.0, *)) {
    if (_detents.size() == 0) {
      [nativeDetents addObject:[UISheetPresentationControllerDetent largeDetent]];
    } else {
      for (size_t i = 0; i < _detents.size(); i++) {
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
    }
  } else {
    // iOS 15 Legacy Fallback
    if (_detents.size() == 1) {
      double firstDetentFraction = _detents[0];
      if (firstDetentFraction < 1.0) {
        [nativeDetents addObject:UISheetPresentationControllerDetent.mediumDetent];
      } else {
        [nativeDetents addObject:UISheetPresentationControllerDetent.largeDetent];
      }
    } else {
      [nativeDetents addObject:UISheetPresentationControllerDetent.mediumDetent];
      [nativeDetents addObject:UISheetPresentationControllerDetent.largeDetent];
    }
  }

  return nativeDetents;
}

- (BOOL)areDetentsValid
{
  for (size_t i = 0; i < _detents.size(); i++) {
    double currentDetent = _detents[i];

    if (isnan(currentDetent) || isinf(currentDetent)) {
      return NO;
    }

    if (currentDetent < 0.0 || currentDetent > 1.0) {
      return NO;
    }
  }
  return YES;
}

- (BOOL)areDetentsSorted
{
  for (size_t i = 1; i < _detents.size(); i++) {
    if (_detents[i - 1] >= _detents[i]) {
      return NO;
    }
  }
  return YES;
}

#pragma mark - Touch Handling helpers

- (void)updateTouchHandlerWithOrigin:(CGPoint)origin
{
  if (_touchHandler == nil) {
    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:_controller.view];
  }

  // Aligns touch coordinate space with window coordinate space
  _touchHandler.viewOriginOffset = origin;
}

@end

Class<RCTComponentViewProtocol> RNSFormSheetCls(void)
{
  return RNSFormSheetHostComponentView.class;
}
