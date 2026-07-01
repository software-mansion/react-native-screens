#import "RNSContainedModalProviderComponentView.h"
#import "RNSContainedModalProviderController.h"

#import <React/RCTConversions.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>

namespace react = facebook::react;

@interface RNSContainedModalProviderComponentView ()
@property (nonatomic, copy, readwrite, nullable) NSString *containerId;
@end

@implementation RNSContainedModalProviderComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSContainedModalProviderProps>();
    _props = defaultProps;

    _contextViewController = [[RNSContainedModalProviderController alloc] init];
  }
  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _contextViewController.view.frame = self.bounds;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    [self reactAddControllerToClosestParent:_contextViewController];
  } else {
    // When the host leaves the window (e.g. navigating back), detach the controller
    // from its parent. Otherwise it keeps a stale parentViewController pointing at the
    // already-removed screen controller, and on the next mount it would be presented
    // from a detached view controller - producing a corrupt, mis-sized presentation.
    [self reactRemoveControllerFromParent:_contextViewController];
  }
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
  if (controller.parentViewController != nil) {
    return;
  }

  UIView *parentView = (UIView *)self.reactSuperview;
  while (parentView != nil) {
    if (parentView.reactViewController != nil) {
      [parentView.reactViewController addChildViewController:controller];
      [self addSubview:controller.view];
      [controller didMoveToParentViewController:parentView.reactViewController];
      break;
    }
    parentView = (UIView *)parentView.reactSuperview;
  }
}

- (void)reactRemoveControllerFromParent:(UIViewController *)controller
{
  if (controller.parentViewController == nil) {
    return;
  }

  [controller willMoveToParentViewController:nil];
  [controller.view removeFromSuperview];
  [controller removeFromParentViewController];
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
  [_contextViewController.view insertSubview:childComponentView atIndex:index];
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
    self.containerId = RCTNSStringFromStringNilIfEmpty(newComponentProps.containerId);
  }

  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> RNSContainedModalProviderCls(void)
{
  return RNSContainedModalProviderComponentView.class;
}
