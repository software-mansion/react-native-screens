#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Plays a transition with one `UIViewPropertyAnimator`, built by a subclass on the first request, started by
 * `animateTransition:` and released when UIKit ends the transition. Subclasses implement `transitionDuration:` and
 * `propertyAnimatorForTransition:` (`RNSStackTransitionAnimatorSubclass.h`).
 */
@interface RNSStackTransitionAnimator : NSObject <UIViewControllerAnimatedTransitioning>

@end

NS_ASSUME_NONNULL_END
