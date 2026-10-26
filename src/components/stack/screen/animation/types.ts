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
  duration?: number;
  /**
   * Replaces the curve of every track of the preset. A predictive back gesture
   * always scrubs linearly with the finger.
   */
  easing?: StackScreenAnimationEasing;
}

export type StackScreenAnimationPresetRef =
  | ({
      type: 'preset';
      name: 'fadeFromBottom' | 'fadeFromTop';
      /**
       * How far the moving screen rises or falls. Defaults to `'8%'`.
       */
      distance?: StackScreenAnimationLength;
    } & StackScreenAnimationTimingOptions)
  | ({
      type: 'preset';
      name:
        | 'slideFromRight'
        | 'slideFromLeft'
        | 'slideFromBottom'
        | 'slideFromTop'
        | 'fade'
        | 'iosFromRight'
        | 'iosFromLeft';
    } & StackScreenAnimationTimingOptions)
  | { type: 'preset'; name: 'default' | 'none' };

export type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetRef;
