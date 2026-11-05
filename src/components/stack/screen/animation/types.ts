export type StackScreenAnimationBezier = [number, number, number, number];

export type StackScreenAnimationEasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'standard'
  | 'standardAccelerate'
  | 'standardDecelerate'
  | 'emphasized'
  | 'emphasizedAccelerate'
  | 'emphasizedDecelerate';

/**
 * A named curve or a cubic bezier `[x1, y1, x2, y2]` with `x1`, `x2` in `[0, 1]`.
 */
export type StackScreenAnimationEasing =
  | StackScreenAnimationEasingName
  | StackScreenAnimationBezier;

/**
 * A number is density-independent pixels, `'N%'` is a fraction of the container.
 */
export type StackScreenAnimationLength = number | `${number}%`;

export type StackScreenAnimationPresetName =
  | 'default'
  | 'none'
  | 'fade'
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromBottom'
  | 'slideFromTop'
  | 'fadeFromBottom'
  | 'fadeFromTop'
  | 'iosFromRight'
  | 'iosFromLeft';

export interface StackScreenAnimationTimingOptions {
  /**
   * Replaces the preset's reference duration (the longer of its push and pop) in
   * milliseconds; both are rescaled by the same factor.
   */
  duration?: number | undefined;
  /**
   * Replaces the curve of every animated property of the preset. A predictive
   * back gesture always scrubs linearly with the finger.
   */
  easing?: StackScreenAnimationEasing | undefined;
}

export type StackScreenAnimationFadeFromEdgePresetName =
  | 'fadeFromBottom'
  | 'fadeFromTop';

export type StackScreenAnimationTimedPresetName =
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromBottom'
  | 'slideFromTop'
  | 'fade'
  | 'iosFromRight'
  | 'iosFromLeft';

export type StackScreenAnimationUntimedPresetName = 'default' | 'none';

export interface StackScreenAnimationFadeFromEdgePresetRef
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationFadeFromEdgePresetName;
  /**
   * How far the moving screen rises or falls. Defaults to `'8%'`.
   */
  distance?: StackScreenAnimationLength | undefined;
}

export interface StackScreenAnimationTimedPresetRef
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationTimedPresetName;
}

export interface StackScreenAnimationUntimedPresetRef {
  type: 'preset';
  name: StackScreenAnimationUntimedPresetName;
}

export type StackScreenAnimationPresetRef =
  | StackScreenAnimationFadeFromEdgePresetRef
  | StackScreenAnimationTimedPresetRef
  | StackScreenAnimationUntimedPresetRef;

export type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetRef;
