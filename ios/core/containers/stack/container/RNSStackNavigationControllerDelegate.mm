#import "RNSStackNavigationControllerDelegate.h"
#import "RNSStackNoneAnimator.h"
#import "RNSStackScreenController.h"
#import "RNSStackTransitionResolver.h"
#import "RNSStackTransitionTimeline.h"

static RNSStackScreenController *_Nullable RNSStackScreenControllerOrNil(UIViewController *controller)
{
  return [controller isKindOfClass:RNSStackScreenController.class] ? static_cast<RNSStackScreenController *>(controller)
                                                                   : nil;
}

@implementation RNSStackNavigationControllerDelegate

- (nullable id<UIViewControllerAnimatedTransitioning>)navigationController:
                                                          (UINavigationController *)navigationController
                                           animationControllerForOperation:(UINavigationControllerOperation)operation
                                                        fromViewController:(UIViewController *)fromVC
                                                          toViewController:(UIViewController *)toVC
{
  RNSStackTransitionKind kind =
      operation == UINavigationControllerOperationPop ? RNSStackTransitionKindPop : RNSStackTransitionKindPush;
  RNSStackTransitionTimeline *timeline =
      [RNSStackTransitionResolver timelineForKind:kind
                                         outgoing:RNSStackScreenControllerOrNil(fromVC)
                                         incoming:RNSStackScreenControllerOrNil(toVC)];
  // A static timeline gets here with pops UIKit starts itself (back button, back menu, tvOS Menu). The container
  // applies its own static changes without animation, see `applyStackModel:`.
  return timeline.isStatic ? [RNSStackNoneAnimator new] : nil;
}

@end
