/**
 * Cubic bezier curve `[x1, y1, x2, y2]`.
 *
 * @remarks
 * `x1` and `x2` must be in `[0, 1]`.
 */
export type StackScreenAnimationBezier = [number, number, number, number];

/**
 * Name of an easing curve.
 *
 * @remarks
 * The following values are supported:
 * - `'linear'` — constant speed.
 * - `'easeIn'`, `'easeOut'`, `'easeInOut'` — the CSS `ease-in`, `ease-out`
 *   and `ease-in-out` curves.
 * - `'standard'`, `'standardAccelerate'`, `'standardDecelerate'`,
 *   `'emphasized'`, `'emphasizedAccelerate'`, `'emphasizedDecelerate'` — the
 *   Material 3 easing tokens of the same names.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function | CSS easing functions}
 * @see {@link https://m3.material.io/styles/motion/easing-and-duration/tokens-specs | Material 3 easing tokens}
 */
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
 * A named curve or a cubic bezier.
 */
export type StackScreenAnimationEasing =
  | StackScreenAnimationEasingName
  | StackScreenAnimationBezier;

/**
 * A number is density-independent pixels, `'N%'` is a fraction of the
 * container.
 */
export type StackScreenAnimationLength = number | `${number}%`;

/**
 * Name of a transition preset.
 *
 * @remarks
 * The following values are supported:
 * - `'default'` — a cross-zoom below API 33 and, from API 33 on, the
 *   horizontal slide of Android 13, which follows the layout direction.
 * - `'none'` — no visible animation.
 * - `'fade'` — the screens cross-fade.
 * - `'slideFromRight'` — the new screen slides in from the right and pushes
 *   the previous one out to the left; a pop reverses it.
 * - `'slideFromLeft'` — the new screen slides in from the left and pushes the
 *   previous one out to the right; a pop reverses it.
 * - `'slideFromBottom'` — the new screen slides up from the bottom over the
 *   previous one; a pop slides it back down.
 * - `'slideFromTop'` — the new screen slides down from the top over the
 *   previous one; a pop slides it back up.
 * - `'fadeFromBottom'` — the new screen fades in while rising from slightly
 *   below; a pop fades it out while it falls.
 * - `'fadeFromTop'` — the new screen fades in while falling from slightly
 *   above; a pop fades it out while it rises.
 * - `'iosFromRight'` — the new screen slides in from the right while the
 *   previous one moves partly to the left and dims; a pop reverses it.
 * - `'iosFromLeft'` — the new screen slides in from the left while the
 *   previous one moves partly to the right and dims; a pop reverses it.
 *
 * The edges in the names are physical: they are not mirrored in right-to-left
 * layouts.
 */
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

/**
 * Options that change the timing of a preset.
 */
export interface StackScreenAnimationTimingOptions {
  /**
   * Replaces the preset's reference duration (the longer of its push and pop)
   * in milliseconds; both are rescaled by the same factor.
   */
  duration?: number | undefined;
  /**
   * Replaces the curve of every animated property of the preset. A predictive
   * back gesture always scrubs linearly with the finger.
   */
  easing?: StackScreenAnimationEasing | undefined;
}

/**
 * Names of the {@link StackScreenAnimationPresetName | presets} that accept
 * {@link StackScreenAnimationFadeFromEdgePresetRef.distance | distance} and the
 * timing options.
 */
export type StackScreenAnimationFadeFromEdgePresetName =
  | 'fadeFromBottom'
  | 'fadeFromTop';

/**
 * Names of the {@link StackScreenAnimationPresetName | presets} that accept
 * the timing options.
 */
export type StackScreenAnimationTimedPresetName =
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromBottom'
  | 'slideFromTop'
  | 'fade'
  | 'iosFromRight'
  | 'iosFromLeft';

/**
 * Names of the {@link StackScreenAnimationPresetName | presets} that accept no
 * options.
 */
export type StackScreenAnimationUntimedPresetName = 'default' | 'none';

/**
 * A `fadeFromBottom` or `fadeFromTop` preset with options.
 */
export interface StackScreenAnimationFadeFromEdgePresetRef
  extends StackScreenAnimationTimingOptions {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: StackScreenAnimationFadeFromEdgePresetName;
  /**
   * How far the moving screen rises or falls.
   *
   * @defaultValue `'8%'`
   */
  distance?: StackScreenAnimationLength | undefined;
}

/**
 * A preset with the timing options.
 */
export interface StackScreenAnimationTimedPresetRef
  extends StackScreenAnimationTimingOptions {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: StackScreenAnimationTimedPresetName;
}

/**
 * A `default` or `none` preset written as an object.
 */
export interface StackScreenAnimationUntimedPresetRef {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: StackScreenAnimationUntimedPresetName;
}

/**
 * A preset written as an object, with the options it accepts.
 */
export type StackScreenAnimationPresetRef =
  | StackScreenAnimationFadeFromEdgePresetRef
  | StackScreenAnimationTimedPresetRef
  | StackScreenAnimationUntimedPresetRef;

/**
 * Transition of a {@link Stack.Screen}.
 *
 * @remarks
 * The following values are supported:
 * - a {@link StackScreenAnimationPresetName} — the preset with its own
 *   timing.
 * - a {@link StackScreenAnimationPresetRef} — the preset with options.
 */
export type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetRef;
