#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * What both screens of one transition do.
 */
@interface RNSStackTransitionTimeline : NSObject

/**
 * Whether neither screen moves: the transition swaps them at once.
 */
@property (nonatomic, readonly) BOOL isStatic;

@property (class, nonatomic, readonly) RNSStackTransitionTimeline *staticTimeline;

@end

NS_ASSUME_NONNULL_END
