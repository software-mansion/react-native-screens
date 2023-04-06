@interface RNSReanimatedDelegate : NSObject

+ (void)onTransitionStartWithController:(UIPercentDrivenInteractiveTransition *)interactionController
                      gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
                              sourceTag:(NSNumber *)sourceTag
                              targetTag:(NSNumber *)targetTag
                             completion:(void (^)())completion;
+ (void)registerTransitionListener;

@end
