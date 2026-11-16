#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationEdge.h"
#import "RNSStackAnimationTransitionKind.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationTransitionTimeline;

@interface RNSStackAnimationIosPresets : NSObject

/**
 * The pushed or popped screen travels the full width along `edge`'s vector over a background that moves 30 % with it
 * and is darkened while covered.
 */
+ (RNSStackAnimationTransitionTimeline *)transitionFromEdge:(RNSStackAnimationEdge)edge
                                                       kind:(RNSStackAnimationTransitionKind)kind;

@end

NS_ASSUME_NONNULL_END
