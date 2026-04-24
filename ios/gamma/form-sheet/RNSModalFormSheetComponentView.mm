#import "RNSModalFormSheetComponentView.h"
#import "RNSModalFormSheetController.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSModalFormSheetComponentDescriptor.h"
#import "RNSModalFormSheetState.h"

namespace react = facebook::react;

@interface RNSModalFormSheetComponentView () <RNSModalFormSheetControllerDelegate>
@end

@implementation RNSModalFormSheetComponentView {
  RCTSurfaceTouchHandler *_touchHandler;
  RNSModalFormSheetController *_controller;
  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_reactSubviews;
  react::RNSModalFormSheetShadowNode::ConcreteState::Shared _state;
  BOOL _isOpen;
  BOOL _needsPresentationUpdate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSModalFormSheetProps>();
    _props = defaultProps;

    _reactSubviews = [NSMutableArray new];
    _controller = [[RNSModalFormSheetController alloc] init];
    _controller.delegate = self;

    _isOpen = NO;
    _needsPresentationUpdate = NO;
  }
  return self;
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
    // Dismiss programmatically and reset shadow node size immediately
    [_controller dismissViewControllerAnimated:YES completion:nil];
    [self resetShadowNodeSize];
  }
}

#pragma mark - RNSModalFormSheetControllerDelegate

- (void)sheetControllerDidDismiss:(RNSModalFormSheetController *)controller
{
  _isOpen = NO;
  [self resetShadowNodeSize];

  if (_eventEmitter != nullptr) {
    std::static_pointer_cast<const react::RNSModalFormSheetEventEmitter>(_eventEmitter)->onDismiss({});
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
    auto newState = react::RNSModalFormSheetState{RCTSizeFromCGSize(bounds.size), RCTPointFromCGPoint(origin)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);
  }
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];
  _state = std::static_pointer_cast<const react::RNSModalFormSheetShadowNode::ConcreteState>(state);
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSModalFormSheetComponentDescriptor>();
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
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSModalFormSheetProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSModalFormSheetProps>(props);

  if (oldComponentProps.isOpen != newComponentProps.isOpen) {
    _isOpen = newComponentProps.isOpen;
    _needsPresentationUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];

  if (_needsPresentationUpdate) {
    _needsPresentationUpdate = NO;
    [self updatePresentationState];
  }
}

- (void)invalidate
{
  if (_controller != nil) {
    if (_controller.presentingViewController != nil) {
      [_controller dismissViewControllerAnimated:NO completion:nil];
    }
    _controller = nil;
  }

  if (_touchHandler != nil) {
    [_touchHandler detachFromView:self];
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

#pragma mark - Layout helpers

- (void)resetShadowNodeSize
{
  if (_state != nullptr) {
    auto newState = react::RNSModalFormSheetState{RCTSizeFromCGSize(CGSizeZero), RCTPointFromCGPoint(CGPointZero)};

    _state->updateState(std::move(newState), facebook::react::EventQueue::UpdateMode::unstable_Immediate);
  }
}

@end

Class<RCTComponentViewProtocol> RNSModalFormSheetCls(void)
{
  return RNSModalFormSheetComponentView.class;
}
