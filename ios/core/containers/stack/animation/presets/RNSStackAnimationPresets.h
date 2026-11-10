#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"
#import "RNSStackAnimationTransitionKind.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationTransitionTimeline;

@interface RNSStackAnimationPresets : NSObject

/**
 * The transition of `kind` that `config` plays, or nil for UIKit's own transition, which is also what a preset without
 * an iOS transition gets.
 */
+ (nullable RNSStackAnimationTransitionTimeline *)transitionTimelineForConfig:(id<RNSStackAnimationConfig>)config
                                                                         kind:(RNSStackAnimationTransitionKind)kind;

@end

NS_ASSUME_NONNULL_END
