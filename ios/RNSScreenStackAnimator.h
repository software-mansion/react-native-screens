#import "RNSScreen.h"

@interface RNSScreenStackAnimator : NSObject <UIViewControllerAnimatedTransitioning>

- (nonnull instancetype)initWithOperation:(UINavigationControllerOperation)operation;
+ (BOOL)isCustomAnimation:(RNSScreenStackAnimation)animation;

@end
