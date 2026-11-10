#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackTransitionKind.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSStackTransitionTimeline;

@interface RNSStackTransitionResolver : NSObject

/**
 * The transition a stack plays when `outgoing` leaves the top for `incoming`; nil as in
 * `+[RNSStackPresets transitionTimelineForConfig:kind:]`. A push plays the incoming screen's push transition, a pop the
 * outgoing screen's pop transition. The config is read on every call, so a change of the `animation` prop applies to
 * the next transition.
 */
+ (nullable RNSStackTransitionTimeline *)timelineForKind:(RNSStackTransitionKind)kind
                                                outgoing:(nullable RNSStackScreenController *)outgoing
                                                incoming:(nullable RNSStackScreenController *)incoming;

@end

NS_ASSUME_NONNULL_END
