@interface RNSReanimatedDelegate : NSObject

+ (void)onTransitionStartWithController:(UIPercentDrivenInteractiveTransition *)interactionController
                      gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
                              sourceTag:(NSNumber *)sourceTag
                              targetTag:(NSNumber *)targetTag;
+ (void)registerTransitionListener;

@end
