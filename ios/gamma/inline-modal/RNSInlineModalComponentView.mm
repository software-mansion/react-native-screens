#import "RNSInlineModalComponentView.h"
#import "RNSInlineModalProviderComponentView.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>

using namespace facebook::react;

@interface RNSInlineModalController : UIViewController
@end

@implementation RNSInlineModalController

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

@end

@interface RNSInlineModalComponentView () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSInlineModalComponentView {
  RNSInlineModalController *_controller;
  NSMutableArray<UIView<RCTComponentViewProtocol> *> *_reactSubviews;
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
    [_controller dismissViewControllerAnimated:YES completion:nil];
  }
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  _isOpen = NO;
  if (_eventEmitter != nullptr) {
    std::static_pointer_cast<const RNSInlineModalEventEmitter>(_eventEmitter)->onDismiss({});
  }
}

#pragma mark - RCTComponentViewProtocol

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
