#pragma once

#import "RNSPercentDrivenInteractiveTransition.h"

NS_ASSUME_NONNULL_BEGIN

/// A one-shot preparation gate for an iOS fade push. UIKit still mounts and
/// lays out both screens; only its animation clock is held at zero.
@interface RNSDeferredTransitionStart : RNSPercentDrivenInteractiveTransition
- (instancetype)initWithScreen:(RNSScreenView *)screen animator:(RNSScreenStackAnimator *)animator;
- (void)animationPrepared;
- (void)releaseTransition;
- (void)invalidate;
@end

NS_ASSUME_NONNULL_END
