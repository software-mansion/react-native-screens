#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationMotionTimeline;

/**
 * One screen's motion bound to its view: resolves the lengths against the container, composes the tracks into the
 * view's transform and alpha, adds the keyframes, restores the rest values. Only the properties a track animates are
 * written, and the view's frame never changes.
 */
@interface RNSStackAnimationMotionBinding : NSObject

- (instancetype)initWithMotion:(RNSStackAnimationMotionTimeline *)motion
                          view:(UIView *)view
                 containerSize:(CGSize)containerSize;

/**
 * Adds the motion as keyframes, starting at its time 0; call inside `+[UIView animateKeyframesWithDuration:...]`
 * lasting `durationMs`, which the motion must not outlast.
 */
- (void)addKeyframesForDurationMs:(NSInteger)durationMs;

/**
 * Returns the animated properties to their rest values: no translation, alpha 1.
 */
- (void)restore;

@end

NS_ASSUME_NONNULL_END
