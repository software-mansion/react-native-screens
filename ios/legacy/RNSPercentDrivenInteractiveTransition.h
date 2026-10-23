#pragma once

#import <UIKit/UIKit.h>
#import "RNSScreenStackAnimator.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSPercentDrivenInteractiveTransition : UIPercentDrivenInteractiveTransition

@property (nonatomic, nullable) RNSScreenStackAnimator *animationController;

/// Finger velocity at release (pt/s, positive toward dismissal) and the length of the
/// transition along the gesture axis (pt). Seed the spring that completes the transition.
@property (nonatomic) CGFloat releaseVelocity;
@property (nonatomic) CGFloat transitionDistance;

@end

NS_ASSUME_NONNULL_END
