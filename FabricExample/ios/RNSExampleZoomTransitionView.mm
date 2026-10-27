#import <React/RCTConversions.h>
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#import <react/renderer/components/FabricExampleSpec/ComponentDescriptors.h>
#import <react/renderer/components/FabricExampleSpec/Props.h>

using namespace facebook::react;

// Test-only component, see `apps/src/shared/native/ZoomTransitionNativeComponent.ts`.
@interface RNSExampleZoomTransitionView : RCTViewComponentView
@end

@implementation RNSExampleZoomTransitionView {
  NSString *_sourceTestID;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSExampleZoomTransitionComponentDescriptor>();
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNSExampleZoomTransitionProps>(props);
  _sourceTestID = RCTNSStringFromString(newProps.sourceTestID);
  [super updateProps:props oldProps:oldProps];
}

- (void)didMoveToSuperview
{
  [super didMoveToSuperview];
  if (self.superview == nil) {
    return;
  }
  // The screen's controller is reachable only once the whole screen is mounted. The push starts later in the same
  // run loop iteration, so setting the transition on the next one is still in time (expo-router does the same).
  dispatch_async(dispatch_get_main_queue(), ^{
    [self applyZoomTransition];
  });
}

// Lets e2e tests read the navigation bar's state: `hidden`, or its alpha (e.g. `1.00`).
- (NSString *)accessibilityValue
{
  UINavigationController *navigationController = [self findViewController].navigationController;
  if (navigationController == nil) {
    return nil;
  }
  if (navigationController.navigationBarHidden) {
    return @"hidden";
  }
  return [NSString stringWithFormat:@"%.2f", navigationController.navigationBar.alpha];
}

- (void)applyZoomTransition
{
  if (_sourceTestID.length == 0) {
    return;
  }
  if (@available(iOS 18.0, *)) {
    UIViewController *controller = [self findViewController];
    if (controller == nil) {
      return;
    }
    NSString *sourceTestID = _sourceTestID;
    controller.preferredTransition = [UIViewControllerTransition
           zoomWithOptions:nil
        sourceViewProvider:^UIView *(UIZoomTransitionSourceViewProviderContext *context) {
          return [RNSExampleZoomTransitionView findViewWithIdentifier:sourceTestID
                                                               inView:context.sourceViewController.view];
        }];
  }
}

- (nullable UIViewController *)findViewController
{
  for (UIResponder *responder = self; responder != nil; responder = responder.nextResponder) {
    if ([responder isKindOfClass:[UIViewController class]]) {
      return (UIViewController *)responder;
    }
  }
  return nil;
}

+ (nullable UIView *)findViewWithIdentifier:(NSString *)identifier inView:(UIView *)view
{
  if ([view.accessibilityIdentifier isEqualToString:identifier]) {
    return view;
  }
  for (UIView *subview in view.subviews) {
    UIView *match = [self findViewWithIdentifier:identifier inView:subview];
    if (match != nil) {
      return match;
    }
  }
  return nil;
}

@end
