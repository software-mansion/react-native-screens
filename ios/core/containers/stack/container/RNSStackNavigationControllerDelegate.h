#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackTransitionAnimator.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * UIKit asks it for the animation of every animated push and pop, except a pop started by a swipe
 * (undocumented).
 */
@interface RNSStackNavigationControllerDelegate
    : NSObject <UINavigationControllerDelegate, RNSStackTransitionAnimatorDelegate>

/**
 * The animator of the transition in flight when the stack plays its own; nil when UIKit plays the transition or
 * none is in flight.
 */
@property (nonatomic, strong, readonly, nullable) RNSStackTransitionAnimator *transitionAnimator;

@end

NS_ASSUME_NONNULL_END
