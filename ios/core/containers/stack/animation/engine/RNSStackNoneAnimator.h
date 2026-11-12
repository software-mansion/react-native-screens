#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Plays a static transition that UIKit animates itself, such as a back button pop: the incoming screen replaces the
 * outgoing one at once.
 */
@interface RNSStackNoneAnimator : NSObject <UIViewControllerAnimatedTransitioning>

@end

NS_ASSUME_NONNULL_END
