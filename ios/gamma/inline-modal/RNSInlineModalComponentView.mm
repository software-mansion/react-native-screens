#import "RNSInlineModalComponentView.h"
#import "RNSInlineModalProviderComponentView.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSInlineModalComponentDescriptor.h"
#import "RNSInlineModalState.h"

using namespace facebook::react;

@protocol RNSInlineModalControllerDelegate <NSObject>
- (void)inlineModalControllerDidLayoutWithBounds:(CGRect)bounds;
@end

@interface RNSInlineModalController : UIViewController
@property (nonatomic, weak) id<RNSInlineModalControllerDelegate> delegate;
@end

@implementation RNSInlineModalController {
  CGSize _lastNotifiedSize;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationOverCurrentContext;
  }
  return self;
}

- (void)loadView
{
  UIView *view = [[UIView alloc] init];
  view.backgroundColor = [UIColor clearColor];
  self.view = view;
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  _lastNotifiedSize = CGSizeZero;
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  CGSize newSize = self.view.bounds.size;
  if (newSize.width > 0 && newSize.height > 0 && !CGSizeEqualToSize(newSize, _lastNotifiedSize)) {
    _lastNotifiedSize = newSize;
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

- (UIViewController *)findProviderViewController
{
  UIView *currentView = self;
  while (currentView != nil) {
    if ([currentView isKindOfClass:[RNSInlineModalProviderComponentView class]]) {
      RNSInlineModalProviderComponentView *providerView = (RNSInlineModalProviderComponentView *)currentView;
      return providerView.contextViewController;
    }
    currentView = currentView.superview;
  }
  return nil;
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

- (void)inlineModalControllerDidLayoutWithBounds:(CGRect)bounds
{
  CGPoint origin = [_controller.view convertPoint:CGPointZero toView:nil];

  if (_state != nullptr) {
    auto newState = RNSInlineModalState{RCTSizeFromCGSize(bounds.size), RCTPointFromCGPoint(origin)};
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
