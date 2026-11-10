#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationTransitionKind.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSStackAnimationTransitionTimeline;

@interface RNSStackAnimationResolver : NSObject

/**
 * The transition a stack plays when `outgoing` leaves the top for `incoming`; nil as in
 * `+[RNSStackAnimationPresets transitionTimelineForConfig:kind:]`. A push plays the incoming screen's push transition,
 * a pop the outgoing screen's pop transition. The config is read on every call, so a change of the `animation` prop
 * applies to the next transition.
 */
+ (nullable RNSStackAnimationTransitionTimeline *)
    transitionTimelineForKind:(RNSStackAnimationTransitionKind)kind
                     outgoing:(nullable RNSStackScreenController *)outgoing
                     incoming:(nullable RNSStackScreenController *)incoming;

@end

NS_ASSUME_NONNULL_END
