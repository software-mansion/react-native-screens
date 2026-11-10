#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"
#import "RNSStackTransitionKind.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackTransitionTimeline;

@interface RNSStackPresets : NSObject

/**
 * The transition of `kind` that `config` plays, or nil for UIKit's own transition, which is also what a preset without
 * an iOS transition gets.
 */
+ (nullable RNSStackTransitionTimeline *)transitionTimelineForConfig:(id<RNSStackAnimationConfig>)config
                                                                kind:(RNSStackTransitionKind)kind;

@end

NS_ASSUME_NONNULL_END
