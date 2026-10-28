import type { ColorValue } from 'react-native';

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
 * - `'slideFromTrailing'`, `'slideFromLeading'` — a horizontal slide from the
 *   trailing or leading edge of the container, the right or left one in a
 *   left-to-right container; both screens move together.
 * - `'slideFromBottom'`, `'slideFromTop'` — a vertical slide; the other screen
 *   stays put.
 *
 * `'slideFromRight'` and `'slideFromLeft'` do not mirror in a right-to-left
 * container; `'slideFromTrailing'` and `'slideFromLeading'` do.
 */
export type StackScreenAnimationSlideFromPresetName =
  | 'slideFromRight'
  | 'slideFromLeft'
  | 'slideFromTrailing'
  | 'slideFromLeading'
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
 * - `'iosFromTrailing'` — the pushed screen arrives from the trailing edge of
 *   the container, the right one in a left-to-right container.
 * - `'iosFromLeading'` — the pushed screen arrives from the leading edge of the
 *   container, the left one in a left-to-right container.
 *
 * `'iosFromRight'` and `'iosFromLeft'` do not mirror in a right-to-left
 * container; `'iosFromTrailing'` and `'iosFromLeading'` do.
 */
export type StackScreenAnimationIosFromPresetName =
  | 'iosFromRight'
  | 'iosFromLeft'
  | 'iosFromTrailing'
  | 'iosFromLeading';

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
 * Timing of one track of a {@link StackScreenAnimationCustomMotion}.
 */
export interface StackScreenAnimationTrackTiming {
  /**
   * Duration in milliseconds.
   *
   * @remarks
   * Whole milliseconds, at least 1. Every track states its own duration. The
   * transition lasts until the longest track of either screen ends, and both
   * screens stay in place that long.
   */
  duration: number;
  /**
   * Milliseconds after the transition starts before the track runs.
   *
   * @remarks
   * The property sits at `from` until the delay elapses, not at rest: a
   * delayed `opacity: { from: 0 }` keeps the screen invisible that long.
   *
   * @defaultValue `0`
   */
  delay?: number | undefined;
  /**
   * Curve of the track.
   *
   * @remarks
   * A predictive back gesture always scrubs linearly with the finger.
   *
   * @defaultValue `'linear'`
   */
  easing?: StackScreenAnimationEasing | undefined;
}

/**
 * One animated property of a {@link StackScreenAnimationCustomMotion}, as a
 * `from` / `to` span.
 *
 * @remarks
 * An omitted endpoint is the property's rest value: `1` for `opacity` and the
 * scales, `0` for `rotate`. With both omitted the track holds the rest value
 * for its span, which only lengthens the transition.
 */
export interface StackScreenAnimationTrack
  extends StackScreenAnimationTrackTiming {
  /**
   * Value at the start of the track.
   */
  from?: number | undefined;
  /**
   * Value at the end of the track.
   */
  to?: number | undefined;
}

/**
 * A `translateX` or `translateY` track; the endpoints are lengths.
 *
 * @remarks
 * `'N%'` is a fraction of the container's width on `translateX` and of its
 * height on `translateY`. An omitted endpoint is `0`. `translateX` is
 * physical: it does not mirror in a right-to-left container.
 */
export interface StackScreenAnimationTranslateTrack
  extends StackScreenAnimationTrackTiming {
  /**
   * Value at the start of the track.
   */
  from?: StackScreenAnimationLength | undefined;
  /**
   * Value at the end of the track.
   */
  to?: StackScreenAnimationLength | undefined;
}

/**
 * A scrim over this screen, its opacity animated from `from` to `to` in
 * `[0, 1]`.
 *
 * @remarks
 * The scrim covers this screen only and draws above its content, so either
 * screen of a transition can carry one. An omitted endpoint is `0`, no scrim.
 * The scrim's opacity multiplies the color's own alpha.
 */
export interface StackScreenAnimationDimTrack
  extends StackScreenAnimationTrack {
  /**
   * Color of the scrim.
   *
   * @remarks
   * A color that cannot be read is the default one.
   *
   * @defaultValue `'black'`
   */
  color?: ColorValue | undefined;
}

/**
 * One screen's motion written as tracks, one per animated property.
 *
 * @remarks
 * A property without a track stays at rest; a motion without tracks is a
 * screen that stays put, like `'none'`. Scale and rotation apply about the
 * screen's center, then the translation, as on an Android `View`.
 */
export interface StackScreenAnimationCustomMotion {
  /**
   * Discriminator of the object.
   */
  type: 'custom';
  /**
   * Horizontal translation.
   */
  translateX?: StackScreenAnimationTranslateTrack | undefined;
  /**
   * Vertical translation.
   */
  translateY?: StackScreenAnimationTranslateTrack | undefined;
  /**
   * Opacity of the screen, in `[0, 1]`.
   */
  opacity?: StackScreenAnimationTrack | undefined;
  /**
   * Uniform scale about the center.
   *
   * @remarks
   * `scaleX` / `scaleY` take their axis over `scale`; an axis they leave out
   * keeps it.
   */
  scale?: StackScreenAnimationTrack | undefined;
  /**
   * Horizontal scale about the center.
   */
  scaleX?: StackScreenAnimationTrack | undefined;
  /**
   * Vertical scale about the center.
   */
  scaleY?: StackScreenAnimationTrack | undefined;
  /**
   * Rotation about the center, clockwise, in degrees.
   *
   * @remarks
   * A number, unlike the `'45deg'` strings of `transform`.
   */
  rotate?: StackScreenAnimationTrack | undefined;
  /**
   * A scrim over this screen.
   */
  dim?: StackScreenAnimationDimTrack | undefined;
}

/**
 * One screen's motion during a transition: the `enter` or `exit` value of a
 * {@link StackScreenAnimationCustomTransition}. A preset by name, a preset
 * with options, or a motion written as tracks.
 */
export type StackScreenAnimationMotion =
  | StackScreenAnimationMotionPresetName
  | StackScreenAnimationMotionPresetConfig
  | StackScreenAnimationCustomMotion;

/**
 * Transition built from the two screens' motions.
 *
 * @remarks
 * Both omitted equals `'none'`. The draw order is the transition's: on a push
 * the entering screen is drawn over the exiting one, on a pop the exiting
 * screen stays on top. A motion written only on the screen underneath an
 * opaque, still one is not visible.
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
 * along it. The position decides the role, so `pop: 'slideFromLeft'` is the
 * pop transition of the `'slideFromRight'` preset, and `pop: 'slideFromRight'`
 * keeps both screens moving left. The other screen is animated too by
 * `'fade'` (a cross-fade), the horizontal slides and the `iosFrom*` presets;
 * the vertical slides and the `fadeFrom*` presets leave it still.
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
 * Every preset but `'default'` is `{ push: name, pop: <the name whose vector
 * points the other way> }`, so
 * `{ type: 'custom', push: 'slideFromRight', pop: 'slideFromLeft' }` is
 * `'slideFromRight'` spelled out.
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
 * - `'slideFromTrailing'`, `'slideFromLeading'` — `'slideFromRight'` and
 *   `'slideFromLeft'` in a left-to-right container, mirrored in a
 *   right-to-left one.
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
 * - `'iosFromTrailing'`, `'iosFromLeading'` — `'iosFromRight'` and
 *   `'iosFromLeft'` in a left-to-right container, mirrored in a right-to-left
 *   one.
 *
 * A preset's pop transition is the push transition of the preset whose vector
 * points the other way, so `'slideFromRight'` pops to the right.
 *
 * `'default'` and the `*Trailing` / `*Leading` presets follow the container's
 * layout direction; the `*Right` / `*Left` presets do not, so in a
 * right-to-left container `'default'` and `'iosFromRight'` move opposite ways.
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
