#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * The two screens' motions named separately. An omitted one is `none`, a static screen spanning the transition.
 */
@interface RNSStackAnimationCustomTransitionConfig : NSObject <RNSStackAnimationTransitionConfig>

@property (nonatomic, readonly) id<RNSStackAnimationMotionConfig> enter;
@property (nonatomic, readonly) id<RNSStackAnimationMotionConfig> exit;

- (instancetype)initWithEnter:(id<RNSStackAnimationMotionConfig>)enter exit:(id<RNSStackAnimationMotionConfig>)exit;

@end

NS_ASSUME_NONNULL_END
