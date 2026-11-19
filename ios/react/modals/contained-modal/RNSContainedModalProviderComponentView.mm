#import "RNSContainedModalProviderComponentView.h"
#import "RNSContainedModalProviderController.h"
#import "RNSContainedModalProviderView.h"

#import <React/RCTConversions.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>

namespace react = facebook::react;

@implementation RNSContainedModalProviderComponentView {
  // The core provider view owns the presentation context (the context
  // controller and its view, see RNSContainedModalProviderView.h). It is this
  // component view's only direct subview, added once and never removed, so the
  // context view's superview is always the core view no matter how
  // RCTViewComponentView arranges its own subviews (it may move them into a
  // private container for `overflow: hidden` with `boxShadow` or `outline`).
  // React children mount into the context view.
  RNSContainedModalProviderView *_Nonnull _providerView;
  NSString *_Nullable _containerId;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSContainedModalProviderProps>();
    _props = defaultProps;

    _providerView = [[RNSContainedModalProviderView alloc] initWithFrame:self.bounds];
    [self addSubview:_providerView];
  }
  return self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    UIViewController *parentViewController = [self closestParentViewController];
    if (parentViewController != nil) {
      [_providerView attachContextControllerToParentViewController:parentViewController];
    }
  } else {
    [_providerView detachContextControllerFromParentViewController];
  }
}

- (nullable UIViewController *)closestParentViewController
{
  UIView *parentView = (UIView *)self.reactSuperview;
  while (parentView != nil) {
    if (parentView.reactViewController != nil) {
      return parentView.reactViewController;
    }
    parentView = (UIView *)parentView.reactSuperview;
  }
  return nil;
}

#pragma mark - RNSContainedModalContainmentProviding

- (nullable NSString *)containerId
{
  return _containerId;
}

- (nonnull RNSContainedModalProviderView *)providerView
{
  return _providerView;
}

#pragma mark - RCTComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSContainedModalProviderComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_providerView.contextViewController.view insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSContainedModalProviderProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSContainedModalProviderProps>(props);

  if (oldComponentProps.containerId != newComponentProps.containerId) {
    _containerId = RCTNSStringFromStringNilIfEmpty(newComponentProps.containerId);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
  // The superview is this view or RCTViewComponentView's private container;
  // both are sized to this view's bounds.
  _providerView.frame = _providerView.superview.bounds;
}

#pragma mark - Dynamic frameworks support

#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSContainedModalProviderCls(void)
{
  return RNSContainedModalProviderComponentView.class;
}
