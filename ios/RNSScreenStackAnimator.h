#import "RNSScreen.h"

@interface RNSScreenStackAnimator : NSObject <UIViewControllerAnimatedTransitioning>

/// This property is filled only when there is an property aniamator associated with an ongoing interactive transition.
/// In our case this is when we're handling full swipe or edge back gesture.
@property (nonatomic, strong, nullable, readonly) UIViewPropertyAnimator *inFlightAnimator;

- (nonnull instancetype)initWithOperation:(UINavigationControllerOperation)operation;
+ (BOOL)isCustomAnimation:(RNSScreenStackAnimation)animation;

@end
