#import "RNSReanimatedDelegate.h"

@implementation RNSReanimatedDelegate

+ (void)onTransitionStartWithController:(UIPercentDrivenInteractiveTransition *)interactionController
                      gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
                              sourceTag:(NSNumber *)sourceTag
                              targetTag:(NSNumber *)targetTag
                             completion:(void (^)())completion
{
  // listener has to:
  // - call [interactionController updateInteractiveTransition:transitionProgress] each frame
  // - ideally end with a call of `transitionProgress` being 0 or 1 depending if the transition was successfull or not
  // - call either [interactionController finishInteractiveTransition] if the transition was successfull or
  // [interactionController cancelInteractiveTransition] if it was not successfull
  // - call the completion block at the end

  // e.g.:
  //    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
  //        [interactionController updateInteractiveTransition:0.25];
  //    });
  //    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
  //        [interactionController updateInteractiveTransition:0.5];
  //    });
  //    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
  //        [interactionController updateInteractiveTransition:1.0];
  //        [interactionController finishInteractiveTransition];
  //        // or
  ////        [interactionController updateInteractiveTransition:0.0];
  ////        [interactionController cancelInteractiveTransition];
  //        completion();
  //    });
}

+ (void)registerTransitionListener
{
  // TODO
}
@end
