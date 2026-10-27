/**
 * Cubic bezier control points `[x1, y1, x2, y2]` with `x1` and `x2` in `[0, 1]`.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationBezier = [number, number, number, number];

/**
 * Named easing curve of an animated property.
 *
 * The following values are supported:
 * - `'linear'`, `'easeIn'`, `'easeOut'`, `'easeInOut'` - the CSS curves.
 * - `'standard'`, `'standardAccelerate'`, `'standardDecelerate'` - the Material 3
 *   standard curves.
 * - `'emphasized'`, `'emphasizedAccelerate'`, `'emphasizedDecelerate'` - the
 *   Material 3 emphasized curves.
 *
 * @platform android >= 21
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
 * Easing curve: a {@link StackScreenAnimationEasingName} or a
 * {@link StackScreenAnimationBezier}.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationEasing =
  | StackScreenAnimationEasingName
  | StackScreenAnimationBezier;

/**
 * Distance on the screen: a number is density-independent pixels, `'N%'` is a
 * fraction of the container's width or height.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationLength = number | `${number}%`;

/**
 * Timing options every preset except `'default'` and `'none'` accepts.
 *
 * @remarks
 * Options apply to what they are written on: on the whole animation they rescale
 * both transitions, on a transition that transition alone, on a motion that
 * motion alone.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationTimingOptions {
  /**
   * Duration in milliseconds.
   *
   * @remarks
   * Replaces the reference duration of what the option is written on: the
   * longer of a preset's push and pop transition (both are rescaled by the same
   * factor), a single transition's own length, or a single motion's length.
   *
   * @platform android >= 21
   */
  duration?: number | undefined;
  /**
   * Curve of every animated property of what the option is written on.
   *
   * @remarks
   * A predictive back gesture always scrubs linearly with the finger.
   *
   * @platform android >= 21
   */
  easing?: StackScreenAnimationEasing | undefined;
}

/**
 * Presets that slide a screen over the full width or height of the container.
 *
 * The following values are supported:
 * - `'slideFromRight'`, `'slideFromLeft'` - a horizontal slide; both screens
 *   move together.
 * - `'slideFromBottom'`, `'slideFromTop'` - a vertical slide; the other screen
 *   stays put.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationSlideFromPresetName =
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromBottom'
  | 'slideFromTop';

/**
 * Presets that fade a screen while it travels a short distance; the other
 * screen stays put.
 *
 * The following values are supported:
 * - `'fadeFromBottom'` - the screen rises while fading in.
 * - `'fadeFromTop'` - the screen sinks while fading in.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationFadeFromPresetName =
  | 'fadeFromBottom'
  | 'fadeFromTop';

/**
 * Presets with the iOS look: the pushed or popped screen travels the full width
 * over a background that moves 30 % with it and is darkened while covered.
 *
 * The following values are supported:
 * - `'iosFromRight'` - the pushed screen arrives from the right.
 * - `'iosFromLeft'` - the pushed screen arrives from the left.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationIosFromPresetName =
  | 'iosFromRight'
  | 'iosFromLeft';

/**
 * Object form of a {@link StackScreenAnimationSlideFromPresetName} preset.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationSlideFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationSlideFromPresetName;
}

/**
 * Object form of a {@link StackScreenAnimationSlideFromPresetName} preset
 * written as one screen's motion.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationSlideFromMotionPresetConfig
  extends StackScreenAnimationSlideFromPresetConfig {
  /**
   * How far the screen travels.
   *
   * @remarks
   * Only a single motion can be shortened; the parallax recede of the `iosFrom*`
   * presets' background is a `'30%'` slide. A whole transition keeps the full
   * width or height.
   *
   * @defaultValue `'100%'`
   * @platform android >= 21
   */
  distance?: StackScreenAnimationLength | undefined;
}

/**
 * Object form of a {@link StackScreenAnimationFadeFromPresetName} preset.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationFadeFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationFadeFromPresetName;
  /**
   * How far the moving screen rises or falls.
   *
   * @defaultValue `'8%'`
   * @platform android >= 21
   */
  distance?: StackScreenAnimationLength | undefined;
}

/**
 * Object form of the `'fade'` preset.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationFadePresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: 'fade';
}

/**
 * Object form of a {@link StackScreenAnimationIosFromPresetName} preset.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationIosFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  type: 'preset';
  name: StackScreenAnimationIosFromPresetName;
}

/**
 * Object form of the `'none'` preset; it takes no options.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationNonePresetConfig {
  type: 'preset';
  name: 'none';
}

/**
 * Object form of the `'default'` preset; it takes no options.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationDefaultPresetConfig {
  type: 'preset';
  name: 'default';
}

/**
 * Preset names allowed as one screen's motion, the `enter` or `exit` value of a
 * {@link StackScreenAnimationCustomTransition}.
 *
 * @remarks
 * A name denotes a motion along its vector: at `enter` the screen arrives along
 * it, at `exit` the screen departs along it. `'none'` is a screen that stays
 * put for the whole transition.
 *
 * Accepts `'none'`, `'fade'`, any {@link StackScreenAnimationSlideFromPresetName}
 * and any {@link StackScreenAnimationFadeFromPresetName}.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationMotionPresetName =
  | 'none'
  | 'fade'
  | StackScreenAnimationSlideFromPresetName
  | StackScreenAnimationFadeFromPresetName;

/**
 * Object form of a {@link StackScreenAnimationMotionPresetName} preset, with
 * its options.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationMotionPresetConfig =
  | StackScreenAnimationSlideFromMotionPresetConfig
  | StackScreenAnimationFadeFromPresetConfig
  | StackScreenAnimationFadePresetConfig
  | StackScreenAnimationNonePresetConfig;

/**
 * One screen's motion during a transition: the `enter` or `exit` value of a
 * {@link StackScreenAnimationCustomTransition}.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationMotion =
  | StackScreenAnimationMotionPresetName
  | StackScreenAnimationMotionPresetConfig;

/**
 * Transition built from the two screens' motions.
 *
 * @remarks
 * Both omitted equals `'none'`. The draw order is the transition's: on a push
 * the entering screen is drawn over the exiting one, on a pop the exiting
 * screen stays on top. A motion written only on the screen underneath an
 * opaque, still one is not visible.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationCustomTransition {
  type: 'custom';
  /**
   * Motion of the screen whose view appears.
   *
   * @remarks
   * When omitted the screen stays put for the whole transition.
   *
   * @platform android >= 21
   */
  enter?: StackScreenAnimationMotion | undefined;
  /**
   * Motion of the screen whose view disappears.
   *
   * @remarks
   * When omitted the screen stays put for the whole transition.
   *
   * @platform android >= 21
   */
  exit?: StackScreenAnimationMotion | undefined;
}

/**
 * Preset names allowed as a whole transition, the `push` or `pop` value of a
 * {@link StackScreenAnimationCustom}.
 *
 * @remarks
 * A name denotes a motion along its vector: the pushed or popped screen moves
 * along it. The position decides the role, so `pop: 'slideFromLeft'` is the
 * pop transition of the `'slideFromRight'` preset, and `pop: 'slideFromRight'`
 * keeps both screens moving left. The other screen is animated too by
 * `'fade'` (a cross-fade), `'slideFromRight'`, `'slideFromLeft'` and the
 * `iosFrom*` presets; the vertical slides and the `fadeFrom*` presets leave it
 * still.
 *
 * Accepts any {@link StackScreenAnimationMotionPresetName} and any
 * {@link StackScreenAnimationIosFromPresetName}.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationTransitionPresetName =
  | StackScreenAnimationMotionPresetName
  | StackScreenAnimationIosFromPresetName;

/**
 * Object form of a {@link StackScreenAnimationTransitionPresetName} preset,
 * with its options.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationTransitionPresetConfig =
  | StackScreenAnimationSlideFromPresetConfig
  | StackScreenAnimationFadeFromPresetConfig
  | StackScreenAnimationFadePresetConfig
  | StackScreenAnimationIosFromPresetConfig
  | StackScreenAnimationNonePresetConfig;

/**
 * One transition of a custom animation: the `push` or `pop` value of a
 * {@link StackScreenAnimationCustom}.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationTransition =
  | StackScreenAnimationTransitionPresetName
  | StackScreenAnimationTransitionPresetConfig
  | StackScreenAnimationCustomTransition;

/**
 * Animation whose push and pop transitions are named separately.
 *
 * @remarks
 * Every preset but `'default'` is `{ push: name, pop: <the name whose vector
 * points the other way> }`, so
 * `{ type: 'custom', push: 'slideFromRight', pop: 'slideFromLeft' }` is
 * `'slideFromRight'` spelled out.
 *
 * @platform android >= 21
 */
export interface StackScreenAnimationCustom {
  type: 'custom';
  /**
   * Transition played when the screen is pushed.
   *
   * @defaultValue `'none'`
   * @platform android >= 21
   */
  push?: StackScreenAnimationTransition | undefined;
  /**
   * Transition played when the screen is popped.
   *
   * @defaultValue `'none'`
   * @platform android >= 21
   */
  pop?: StackScreenAnimationTransition | undefined;
}

/**
 * Preset names allowed as the whole animation, the `animation` prop itself.
 *
 * The following values are supported:
 * - `'default'` - the platform's transition: a cross-zoom below Android 13, the
 *   Android 13 horizontal slide from there on. Takes no options.
 * - `'none'` - no visible transition. Takes no options.
 * - `'fade'` - a cross-fade of both screens.
 * - `'slideFromRight'`, `'slideFromLeft'`, `'slideFromBottom'`,
 *   `'slideFromTop'` - see {@link StackScreenAnimationSlideFromPresetName}.
 * - `'fadeFromBottom'`, `'fadeFromTop'` - see
 *   {@link StackScreenAnimationFadeFromPresetName}; accept `distance`.
 * - `'iosFromRight'`, `'iosFromLeft'` - see
 *   {@link StackScreenAnimationIosFromPresetName}.
 *
 * @remarks
 * A preset's pop transition is the push transition of the preset whose vector
 * points the other way, so `'slideFromRight'` pops to the right.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationPresetName =
  | StackScreenAnimationTransitionPresetName
  | 'default';

/**
 * Object form of a {@link StackScreenAnimationPresetName} preset, with its
 * options.
 *
 * @platform android >= 21
 */
export type StackScreenAnimationPresetConfig =
  | StackScreenAnimationTransitionPresetConfig
  | StackScreenAnimationDefaultPresetConfig;

/**
 * Value of the `animation` prop of {@link Stack.Screen}: a preset by name, a
 * preset with options, or a custom animation.
 *
 * @platform android >= 21
 */
export type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetConfig
  | StackScreenAnimationCustom;
