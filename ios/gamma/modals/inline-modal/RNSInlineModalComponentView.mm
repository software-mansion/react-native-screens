#import "RNSInlineModalComponentView.h"
#import "RNSInlineModalProviderComponentView.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSInlineModalComponentDescriptor.h"
#import "RNSInlineModalState.h"

using namespace facebook::react;

@class RNSInlineModalController;

@protocol RNSInlineModalControllerDelegate <NSObject>
- (UIView *)providerViewForInlineModalController:(RNSInlineModalController *)controller;
- (void)inlineModalControllerDidLayoutWithBounds:(CGRect)bounds;
@end

@interface RNSInlineModalController : UIViewController
@property (nonatomic, weak) id<RNSInlineModalControllerDelegate> delegate;
@end

@implementation RNSInlineModalController {
  CGRect _lastNotifiedFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
  }
  return self;
}

- (void)loadView
{
  UIView *view = [[UIView alloc] init];
  view.backgroundColor = [UIColor clearColor];
  // Ensure the view stretches to fill the presentation context
  view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  self.view = view;
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  _lastNotifiedFrame = CGRectZero;
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  UIView *providerView = nil;
  if ([self.delegate respondsToSelector:@selector(providerViewForInlineModalController:)]) {
    providerView = [self.delegate providerViewForInlineModalController:self];
  }

  CGRect newFrame = [self.view convertRect:self.view.bounds toView:providerView];
  if (newFrame.size.width > 0 && newFrame.size.height > 0 && !CGRectEqualToRect(newFrame, _lastNotifiedFrame)) {
    _lastNotifiedFrame = newFrame;
    if ([self.delegate respondsToSelector:@selector(inlineModalControllerDidLayoutWithBounds:)]) {
      [self.delegate inlineModalControllerDidLayoutWithBounds:self.view.bounds];
    }
  }
}

@end

@interface RNSInlineModalComponentView () <UIAdaptivePresentationControllerDelegate, RNSInlineModalControllerDelegate>
@end

@implementation RNSInlineModalComponentView {
  RNSInlineModalController *_controller;
  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_reactSubviews;
  RNSInlineModalShadowNode::ConcreteState::Shared _state;
  BOOL _isOpen;
  BOOL _needsPresentationUpdate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSInlineModalProps>();
    _props = defaultProps;

    _reactSubviews = [NSMutableArray new];
    _controller = [[RNSInlineModalController alloc] init];
    _controller.presentationController.delegate = self;
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

- (RNSInlineModalProviderComponentView *)findProviderView
{
  UIView *currentView = self;
  while (currentView != nil) {
    if ([currentView isKindOfClass:[RNSInlineModalProviderComponentView class]]) {
      return (RNSInlineModalProviderComponentView *)currentView;
    }
    currentView = currentView.superview;
  }
  return nil;
}

- (UIViewController *)findProviderViewController
{
  RNSInlineModalProviderComponentView *providerView = [self findProviderView];
  return providerView ? providerView.contextViewController : nil;
}

- (void)updatePresentationState
{
  if (self.window == nil) {
    return;
  }

  if (_isOpen && _controller.presentingViewController == nil) {
    UIViewController *providerController = [self findProviderViewController];
    if (providerController != nil) {
      [providerController presentViewController:_controller animated:YES completion:nil];
    }
  } else if (!_isOpen && _controller.presentingViewController != nil) {
    __weak __typeof(self) weakSelf = self;
    [_controller dismissViewControllerAnimated:YES
                                    completion:^{
                                      [weakSelf resetShadowNodeSize];
                                    }];
  }
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  _isOpen = NO;
  [self resetShadowNodeSize];

  if (_eventEmitter != nullptr) {
    std::static_pointer_cast<const RNSInlineModalEventEmitter>(_eventEmitter)->onDismiss({});
  }
}

#pragma mark - RNSInlineModalControllerDelegate

- (UIView *)providerViewForInlineModalController:(RNSInlineModalController *)controller
{
  return [self findProviderView];
}

- (void)inlineModalControllerDidLayoutWithBounds:(CGRect)bounds
{
  if (_state != nullptr) {
    // To neutralize any layout offsets that Yoga has already applied to this Host View
    // in the Element tree, relatively to the Provider component, we need to feed it an inverse offset.
    // First, we find the Host View's position relative to the native modal container.
    // Then, we negate this vector to cancel out the JS-side displacement.
    CGPoint hostOriginInControllerSpace = [self convertPoint:CGPointZero toView:_controller.view];
    CGPoint contentOriginOffset = CGPointMake(-hostOriginInControllerSpace.x, -hostOriginInControllerSpace.y);

    auto newState = RNSInlineModalState{RCTSizeFromCGSize(bounds.size), RCTPointFromCGPoint(contentOriginOffset)};
    _state->updateState(std::move(newState), EventQueue::UpdateMode::unstable_Immediate);
  }
}

- (void)resetShadowNodeSize
{
  if (_state != nullptr) {
    auto newState = RNSInlineModalState{RCTSizeFromCGSize(CGSizeZero), RCTPointFromCGPoint(CGPointZero)};
    _state->updateState(std::move(newState), EventQueue::UpdateMode::unstable_Immediate);
  }
}

#pragma mark - RCTComponentViewProtocol

- (void)updateState:(State::Shared const &)state oldState:(State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];
  _state = std::static_pointer_cast<const RNSInlineModalShadowNode::ConcreteState>(state);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSInlineModalComponentDescriptor>();
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_reactSubviews insertObject:childComponentView atIndex:index];
  [_controller.view insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_reactSubviews removeObject:childComponentView];
  [childComponentView removeFromSuperview];
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const RNSInlineModalProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const RNSInlineModalProps>(props);

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
}

@end

Class<RCTComponentViewProtocol> RNSInlineModalCls(void)
{
  return RNSInlineModalComponentView.class;
}
