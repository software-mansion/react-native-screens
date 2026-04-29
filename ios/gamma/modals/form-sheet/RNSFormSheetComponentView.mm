#import "RNSFormSheetComponentView.h"
#import "RNSFormSheetController.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSFormSheetComponentDescriptor.h"
#import "RNSFormSheetState.h"

namespace react = facebook::react;

@interface RNSFormSheetComponentView () <RNSFormSheetControllerDelegate>
@end

@implementation RNSFormSheetComponentView {
  RNSFormSheetController *_controller;
  RCTSurfaceTouchHandler *_touchHandler;
  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_reactSubviews;
  react::RNSFormSheetShadowNode::ConcreteState::Shared _state;

  // Props
  BOOL _isOpen;
  NSArray<NSNumber *> *_detents;

  // Invalidation flags
  BOOL _needsPresentationUpdate;
  BOOL _needsSheetUpdate;
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

  _reactSubviews = [NSMutableArray new];

  _needsPresentationUpdate = NO;
  _needsSheetUpdate = NO;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSFormSheetProps>();
  _props = defaultProps;

  _isOpen = NO;
  _detents = @[];
}

- (void)setupController
{
  _controller = [[RNSFormSheetController alloc] init];
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

  UIViewController *presentingViewController = self.window.rootViewController;
  while (presentingViewController.presentedViewController != nil &&
         presentingViewController.presentedViewController != _controller) {
    presentingViewController = presentingViewController.presentedViewController;
  }

  if (_isOpen && _controller.presentingViewController == nil) {
    [presentingViewController presentViewController:_controller animated:YES completion:nil];
  } else if (!_isOpen && _controller.presentingViewController != nil) {
    // Dismiss programmatically and delay the reset until the animation completes.
    // This prevents conflicting layout updates while the sheet is sliding down.
    __weak __typeof(self) weakSelf = self;
    [_controller dismissViewControllerAnimated:YES
                                    completion:^{
                                      [weakSelf resetShadowNodeSize];
                                    }];
  }
}

#pragma mark - RNSFormSheetControllerDelegate

- (void)sheetControllerDidDismiss:(RNSFormSheetController *)controller
{
  _isOpen = NO;
  [self resetShadowNodeSize];

  if (_eventEmitter != nullptr) {
    std::static_pointer_cast<const react::RNSFormSheetEventEmitter>(_eventEmitter)->onDismiss({});
  }
}

- (void)sheetControllerDidLayoutWithBounds:(CGRect)bounds
{
  if (_touchHandler == nil) {
    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:_controller.view];
  }

  CGPoint origin = [_controller.view convertPoint:CGPointZero toView:nil];

  // Aligns touch coordinate space with window coordinate space
  _touchHandler.viewOriginOffset = origin;

  if (_state != nullptr) {
    auto newState = react::RNSFormSheetState{RCTSizeFromCGSize(bounds.size), RCTPointFromCGPoint(origin)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);
  }
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];
  _state = std::static_pointer_cast<const react::RNSFormSheetShadowNode::ConcreteState>(state);
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSFormSheetComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_reactSubviews insertObject:childComponentView atIndex:index];
  [_controller updateContentSubviews:_reactSubviews];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_reactSubviews removeObject:childComponentView];
  [_controller updateContentSubviews:_reactSubviews];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSFormSheetProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSFormSheetProps>(props);

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = newComponentProps.isOpen;
    _needsPresentationUpdate = YES;

    // ALWAYS refresh the sheet configuration when reopening,
    // because UIKit destroys the presentationController after the modal is dismissed.
    if (_isOpen) {
      _needsSheetUpdate = YES;
    }
  }

  if (oldComponentProps.detents != newComponentProps.detents) {
    NSMutableArray<NSNumber *> *detentsArray = [NSMutableArray new];
    for (double detent : newComponentProps.detents) {
      [detentsArray addObject:@(detent)];
    }
    _detents = detentsArray;
    _needsSheetUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];

  if (_needsSheetUpdate) {
    _needsSheetUpdate = NO;
    [self applySheetConfiguration];
  }

  if (_needsPresentationUpdate) {
    _needsPresentationUpdate = NO;
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

#pragma mark - Layout

- (void)resetShadowNodeSize
{
  if (_state != nullptr) {
    auto newState = react::RNSFormSheetState{RCTSizeFromCGSize(CGSizeZero), RCTPointFromCGPoint(CGPointZero)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);
  }
}

- (void)applySheetConfiguration
{
  if (@available(iOS 15.0, *)) {
    UISheetPresentationController *sheet = _controller.sheetPresentationController;
    if (sheet == nil) {
      return;
    }

    if (_detents.count == 0) {
      sheet.detents = @[ [UISheetPresentationControllerDetent largeDetent] ];
      return;
    }

    NSMutableArray<UISheetPresentationControllerDetent *> *nativeDetents = [NSMutableArray new];

    if (@available(iOS 16.0, *)) {
      for (NSUInteger i = 0; i < _detents.count; i++) {
        double fraction = [_detents[i] doubleValue];
        NSString *ident = [NSString stringWithFormat:@"%lu", (unsigned long)i];

        [nativeDetents
            addObject:[UISheetPresentationControllerDetent
                          customDetentWithIdentifier:ident
                                            resolver:^CGFloat(
                                                id<UISheetPresentationControllerDetentResolutionContext> context) {
                                              return context.maximumDetentValue * fraction;
                                            }]];
      }
    } else {
      for (NSNumber *fractionNumber in _detents) {
        double fraction = [fractionNumber doubleValue];
        if (fraction <= 0.6) {
          if (![nativeDetents containsObject:[UISheetPresentationControllerDetent mediumDetent]]) {
            [nativeDetents addObject:[UISheetPresentationControllerDetent mediumDetent]];
          }
        } else {
          if (![nativeDetents containsObject:[UISheetPresentationControllerDetent largeDetent]]) {
            [nativeDetents addObject:[UISheetPresentationControllerDetent largeDetent]];
          }
        }
      }
    }

    [sheet animateChanges:^{
      sheet.detents = nativeDetents;
    }];
  }
}

@end

Class<RCTComponentViewProtocol> RNSFormSheetCls(void)
{
  return RNSFormSheetComponentView.class;
}
