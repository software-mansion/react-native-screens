#import "RNSContainedModalProviderComponentView.h"
#import "RNSContainedModalContextController.h"

#import <React/RCTConversions.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>

namespace react = facebook::react;

@implementation RNSContainedModalProviderComponentView {
  // The provider is double-wrapped: this component view (outer) tightly wraps
  // the context controller's view (inner), which carries the presentation
  // context and the provider's React children (see
  // RNSContainedModalContextController.h).
  RNSContainedModalContextController *_Nonnull _contextController;
  NSString *_Nullable _containerId;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSContainedModalProviderProps>();
    _props = defaultProps;

    _contextController = [[RNSContainedModalContextController alloc] init];
  }
  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _contextController.view.frame = self.bounds;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    [self reactAddControllerToClosestParent:_contextController];
  } else {
    [self reactRemoveControllerFromParent:_contextController];
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
      // Wrapper invariant (RNSContainedModalContextController.h): the context
      // view must be a direct, exactly-filling subview. Insert at the BOTTOM -
      // during a suspension UIKit's container stays behind as a wrapper
      // subview, and re-attaching this transparent full-bounds view above it
      // would swallow every touch meant for the restored modal.
      if (![self isContextViewRemovedByReplacingPresentation:controller]) {
        controller.view.frame = self.bounds;
        [self insertSubview:controller.view atIndex:0];
      }
      [controller didMoveToParentViewController:parentView.reactViewController];
      break;
    }
    parentView = (UIView *)parentView.reactSuperview;
  }
}

// A replacing presentation (`UIModalPresentationCurrentContext`) takes the
// context view out of the hierarchy for the presentation's whole lifetime,
// suspensions included, and puts it back itself when the modal is dismissed.
// Re-inserting the view on a window re-entry (a restore after a covering
// stack screen was popped) would show the replaced content under the modal
// again.
- (BOOL)isContextViewRemovedByReplacingPresentation:(UIViewController *)controller
{
  UIViewController *presentedViewController = controller.presentedViewController;
  return presentedViewController != nil && presentedViewController.presentingViewController == controller &&
      presentedViewController.modalPresentationStyle == UIModalPresentationCurrentContext;
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

#pragma mark - RNSContainedModalContextProviding

- (nullable NSString *)containerId
{
  return _containerId;
}

- (nonnull UIViewController *)contextViewController
{
  return _contextController;
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
  [_contextController.view insertSubview:childComponentView atIndex:index];
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
