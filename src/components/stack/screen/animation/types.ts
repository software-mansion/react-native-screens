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
 * Easing curve: a {@link StackScreenAnimationEasingName} or a
 * {@link StackScreenAnimationBezier}.
 */
export type StackScreenAnimationEasing =
  | StackScreenAnimationEasingName
  | StackScreenAnimationBezier;

/**
 * Distance on the screen: a number is density-independent pixels, `'N%'` is a
 * fraction of the container's width or height.
 */
export type StackScreenAnimationLength = number | `${number}%`;

/**
 * Timing options every preset except `'default'` and `'none'` accepts.
 *
 * @remarks
 * Options apply to what they are written on: on the whole animation they rescale
 * both transitions, on a transition that transition alone, on a motion that
 * motion alone.
 */
export interface StackScreenAnimationTimingOptions {
  /**
   * Duration in milliseconds.
   *
   * @remarks
   * Replaces the reference duration of what the option is written on: the
   * longer of a preset's push and pop transition (both are rescaled by the same
   * factor), a single transition's own length, or a single motion's length.
   */
  duration?: number | undefined;
  /**
   * Curve of every animated property of what the option is written on.
   *
   * @remarks
   * A predictive back gesture always scrubs linearly with the finger.
   */
  easing?: StackScreenAnimationEasing | undefined;
}

/**
 * Presets that slide a screen over the full width or height of the container.
 *
 * @remarks
 * The following values are supported:
 * - `'slideFromRight'`, `'slideFromLeft'` — a horizontal slide; both screens
 *   move together.
 * - `'slideFromBottom'`, `'slideFromTop'` — a vertical slide; the other screen
 *   stays put.
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
 * @remarks
 * The following values are supported:
 * - `'fadeFromBottom'` — the screen rises while fading in.
 * - `'fadeFromTop'` — the screen sinks while fading in.
 */
export type StackScreenAnimationFadeFromPresetName =
  | 'fadeFromBottom'
  | 'fadeFromTop';

/**
 * Presets with the iOS look: the pushed or popped screen travels the full width
 * over a background that moves 30 % with it and is darkened while covered.
 *
 * @remarks
 * The following values are supported:
 * - `'iosFromRight'` — the pushed screen arrives from the right.
 * - `'iosFromLeft'` — the pushed screen arrives from the left.
 */
export type StackScreenAnimationIosFromPresetName =
  | 'iosFromRight'
  | 'iosFromLeft';

/**
 * Object form of a {@link StackScreenAnimationSlideFromPresetName} preset.
 */
export interface StackScreenAnimationSlideFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: StackScreenAnimationSlideFromPresetName;
}

/**
 * Object form of a {@link StackScreenAnimationSlideFromPresetName} preset
 * written as one screen's motion.
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
   */
  distance?: StackScreenAnimationLength | undefined;
}

/**
 * Object form of a {@link StackScreenAnimationFadeFromPresetName} preset.
 */
export interface StackScreenAnimationFadeFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: StackScreenAnimationFadeFromPresetName;
  /**
   * How far the moving screen rises or falls.
   *
   * @defaultValue `'8%'`
   */
  distance?: StackScreenAnimationLength | undefined;
}

/**
 * Object form of the `'fade'` preset.
 */
export interface StackScreenAnimationFadePresetConfig
  extends StackScreenAnimationTimingOptions {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: 'fade';
}

/**
 * Object form of a {@link StackScreenAnimationIosFromPresetName} preset.
 */
export interface StackScreenAnimationIosFromPresetConfig
  extends StackScreenAnimationTimingOptions {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: StackScreenAnimationIosFromPresetName;
}

/**
 * Object form of the `'none'` preset; it takes no options.
 */
export interface StackScreenAnimationNonePresetConfig {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
  name: 'none';
}

/**
 * Object form of the `'default'` preset; it takes no options.
 */
export interface StackScreenAnimationDefaultPresetConfig {
  /**
   * Discriminator of the object.
   */
  type: 'preset';
  /**
   * Name of the preset.
   */
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
 */
export type StackScreenAnimationMotionPresetName =
  | 'none'
  | 'fade'
  | StackScreenAnimationSlideFromPresetName
  | StackScreenAnimationFadeFromPresetName;

/**
 * Object form of a {@link StackScreenAnimationMotionPresetName} preset, with
 * its options.
 */
export type StackScreenAnimationMotionPresetConfig =
  | StackScreenAnimationSlideFromMotionPresetConfig
  | StackScreenAnimationFadeFromPresetConfig
  | StackScreenAnimationFadePresetConfig
  | StackScreenAnimationNonePresetConfig;

/**
 * One screen's motion during a transition: the `enter` or `exit` value of a
 * {@link StackScreenAnimationCustomTransition}.
 */
export type StackScreenAnimationMotion =
  | StackScreenAnimationMotionPresetName
  | StackScreenAnimationMotionPresetConfig;

/**
 * Transition built from the two screens' motions.
 *
 * @remarks
 * Both omitted equals `'none'`.
 */
export interface StackScreenAnimationCustomTransition {
  /**
   * Discriminator of the object.
   */
  type: 'custom';
  /**
   * Motion of the screen whose view appears.
   *
   * @remarks
   * When omitted the screen stays put for the whole transition.
   */
  enter?: StackScreenAnimationMotion | undefined;
  /**
   * Motion of the screen whose view disappears.
   *
   * @remarks
   * When omitted the screen stays put for the whole transition.
   */
  exit?: StackScreenAnimationMotion | undefined;
}

/**
 * Preset names allowed as a whole transition, the `push` or `pop` value of a
 * {@link StackScreenAnimationCustom}.
 *
 * @remarks
 * A name denotes a motion along its vector: the pushed or popped screen moves
 * along it, and so does the other screen for `'slideFromRight'`,
 * `'slideFromLeft'` and the `iosFrom*` presets. The position decides the role,
 * so `pop: 'slideFromLeft'` is the pop transition of the `'slideFromRight'`
 * preset, and `pop: 'slideFromRight'` keeps both screens moving left.
 *
 * Accepts any {@link StackScreenAnimationMotionPresetName} and any
 * {@link StackScreenAnimationIosFromPresetName}.
 */
export type StackScreenAnimationTransitionPresetName =
  | StackScreenAnimationMotionPresetName
  | StackScreenAnimationIosFromPresetName;

/**
 * Object form of a {@link StackScreenAnimationTransitionPresetName} preset,
 * with its options.
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
 */
export type StackScreenAnimationTransition =
  | StackScreenAnimationTransitionPresetName
  | StackScreenAnimationTransitionPresetConfig
  | StackScreenAnimationCustomTransition;

/**
 * Animation whose push and pop transitions are named separately.
 *
 * @remarks
 * Every preset is `{ push: name, pop: <the name whose vector points the other
 * way> }`, so `{ type: 'custom', push: 'slideFromRight', pop: 'slideFromLeft' }`
 * is `'slideFromRight'` spelled out.
 */
export interface StackScreenAnimationCustom {
  /**
   * Discriminator of the object.
   */
  type: 'custom';
  /**
   * Transition played when the screen is pushed.
   *
   * @defaultValue `'none'`
   */
  push?: StackScreenAnimationTransition | undefined;
  /**
   * Transition played when the screen is popped.
   *
   * @defaultValue `'none'`
   */
  pop?: StackScreenAnimationTransition | undefined;
}

/**
 * Preset names allowed as the whole animation, the `animation` prop itself.
 *
 * @remarks
 * The following values are supported:
 * - `'default'` — the platform's transition: a cross-zoom below Android 13
 *   and, from Android 13 on, the horizontal slide of Android 13, which follows
 *   the layout direction. Takes no options.
 * - `'none'` — no visible transition. Takes no options.
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
 *   below; a pop fades it out while it falls. Accepts `distance`.
 * - `'fadeFromTop'` — the new screen fades in while falling from slightly
 *   above; a pop fades it out while it rises. Accepts `distance`.
 * - `'iosFromRight'` — the new screen slides in from the right while the
 *   previous one moves partly to the left and dims; a pop reverses it.
 * - `'iosFromLeft'` — the new screen slides in from the left while the
 *   previous one moves partly to the right and dims; a pop reverses it.
 *
 * A preset's pop transition is the push transition of the preset whose vector
 * points the other way, so `'slideFromRight'` pops to the right.
 *
 * The edges in the names are physical: they are not mirrored in right-to-left
 * layouts.
 */
export type StackScreenAnimationPresetName =
  | StackScreenAnimationTransitionPresetName
  | 'default';

/**
 * Object form of a {@link StackScreenAnimationPresetName} preset, with its
 * options.
 */
export type StackScreenAnimationPresetConfig =
  | StackScreenAnimationTransitionPresetConfig
  | StackScreenAnimationDefaultPresetConfig;

/**
 * Value of the `animation` prop of {@link Stack.Screen}: a preset by name, a
 * preset with options, or a custom animation.
 */
export type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetConfig
  | StackScreenAnimationCustom;
