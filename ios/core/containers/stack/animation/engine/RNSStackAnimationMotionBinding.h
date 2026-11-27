#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationMotionTimeline;

/**
 * One screen's motion bound to its view: resolves the lengths against the container and its layout direction, composes
 * the tracks into the view's transform (scale, rotation, translation) and alpha and a dim scrim's alpha, adds the
 * keyframes, restores the rest values. Only the properties a track animates are written, and the view's frame never
 * changes.
 */
@interface RNSStackAnimationMotionBinding : NSObject

/**
 * Call once `view` is in the transition's container; a dim track adds its scrim to the container directly above
 * `view`, until `restore`.
 */
- (instancetype)initWithMotion:(RNSStackAnimationMotionTimeline *)motion
                          view:(UIView *)view
                 containerSize:(CGSize)containerSize
               layoutDirection:(UIUserInterfaceLayoutDirection)layoutDirection;

/**
 * Adds the motion as keyframes, starting at its time 0; call inside `+[UIView animateKeyframesWithDuration:...]`
 * lasting `durationMs`, which the motion must not outlast.
 */
- (void)addKeyframesForDurationMs:(NSInteger)durationMs;

/**
 * Returns the animated properties to their rest values: identity transform, alpha 1, no scrim.
 */
- (void)restore;

@end

NS_ASSUME_NONNULL_END
