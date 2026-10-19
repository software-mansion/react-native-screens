#import "RNSContainedModalProviderComponentView.h"
#import "RNSContainedModalProviderController.h"

#import <React/RCTConversions.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>

namespace react = facebook::react;

@implementation RNSContainedModalProviderComponentView {
  // Inner layer of the provider's double wrap: this component view tightly
  // wraps the controller's view, which carries the presentation context and
  // the provider's React children (see RNSContainedModalProviderController.h).
  RNSContainedModalProviderController *_Nonnull _wrappedContextViewController;
  NSString *_Nullable _containerId;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSContainedModalProviderProps>();
    _props = defaultProps;

    _wrappedContextViewController = [[RNSContainedModalProviderController alloc] init];
  }
  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _wrappedContextViewController.view.frame = self.bounds;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    [self reactAddControllerToClosestParent:_wrappedContextViewController];
  } else {
    // When the provider leaves the window (e.g. navigating back), detach the
    // controller from its parent. Otherwise it keeps a stale
    // parentViewController pointing at the already-removed screen controller,
    // and on the next mount a modal would be presented from a detached view
    // controller - producing a corrupt, mis-sized presentation.
    [self reactRemoveControllerFromParent:_wrappedContextViewController];
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
      // This view is the wrapper the presentation container anchors to (see
      // RNSContainedModalProviderController.h): the controller's view must be
      // its DIRECT subview and fill it exactly. Insert at the BOTTOM: when a
      // presentation is suspended (this view left the window with a modal
      // open), UIKit's container view stays behind as a wrapper subview, and
      // appending the context view on re-attach would stack this full-bounds
      // transparent view on top of it - swallowing every touch meant for the
      // restored modal.
      controller.view.frame = self.bounds;
      [self insertSubview:controller.view atIndex:0];
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

#pragma mark - RNSContainedModalContainmentProviding

- (nullable NSString *)containerId
{
  return _containerId;
}

- (nonnull UIViewController *)contextViewController
{
  return _wrappedContextViewController;
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
  [_wrappedContextViewController.view insertSubview:childComponentView atIndex:index];
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
