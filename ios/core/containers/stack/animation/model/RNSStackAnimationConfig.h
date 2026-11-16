#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * What a screen asked for through its `animation` prop.
 */
@protocol RNSStackAnimationConfig <NSObject>

@end

/**
 * One `push` or `pop` value of a custom animation: a whole transition, both screens included.
 */
@protocol RNSStackAnimationTransitionConfig <NSObject>

@end

/**
 * One `enter` or `exit` value of a custom transition: one screen's motion.
 */
@protocol RNSStackAnimationMotionConfig <NSObject>

@end

NS_ASSUME_NONNULL_END
