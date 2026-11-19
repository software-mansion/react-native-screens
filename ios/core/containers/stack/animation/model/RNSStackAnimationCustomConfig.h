#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * The push and pop transitions named separately. An omitted one is `none`; the mapper never leaves one out.
 */
@interface RNSStackAnimationCustomConfig : NSObject <RNSStackAnimationConfig>

@property (nonatomic, readonly) id<RNSStackAnimationTransitionConfig> push;
@property (nonatomic, readonly) id<RNSStackAnimationTransitionConfig> pop;

- (instancetype)initWithPush:(id<RNSStackAnimationTransitionConfig>)push pop:(id<RNSStackAnimationTransitionConfig>)pop;

@end

NS_ASSUME_NONNULL_END
