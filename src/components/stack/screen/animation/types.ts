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
 * Options apply to what they are written on: on the whole animation they
 * rescale both transitions, on a transition that transition alone, on a motion
 * that motion alone.
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
   * @defaultValue The preset's own duration.
   * @platform android
   */
  duration?: number | undefined;
  /**
   * Curve of every animated property of what the option is written on.
   *
   * @remarks
   * A predictive back gesture always scrubs linearly with the finger.
   *
   * @defaultValue The preset's own curves.
   * @platform android
   */
  easing?: StackScreenAnimationEasing | undefined;
}

/**
 * Presets that slide a screen over the full width or height of the container.
 *
 * @remarks
 * The following values are supported:
 * - `'slideFromRight'`, `'slideFromLeft'` — a horizontal slide from the right
 *   or left edge of the container; both screens move together.
 * - `'slideFromBottom'`, `'slideFromTop'` — a vertical slide from the bottom or
 *   top edge of the container; the other screen stays put.
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
   *
   * @platform android
   */
  type: 'preset';
  /**
   * Name of the preset.
   *
   * @platform android
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
   * Only a single motion can be shortened; the parallax recede of the
   * `iosFrom*` presets' background is a `'30%'` slide. A whole transition keeps
   * the full width or height.
   *
   * @defaultValue `'100%'`
   * @platform android
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
   *
   * @platform android
   */
  type: 'preset';
  /**
   * Name of the preset.
   *
   * @platform android
   */
  name: StackScreenAnimationFadeFromPresetName;
  /**
   * How far the moving screen rises or falls.
   *
   * @defaultValue `'8%'`
   * @platform android
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
   *
   * @platform android
   */
  type: 'preset';
  /**
   * Name of the preset.
   *
   * @platform android
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
   *
   * @platform android
   */
  type: 'preset';
  /**
   * Name of the preset.
   *
   * @platform android
   */
  name: StackScreenAnimationIosFromPresetName;
}

/**
 * Object form of the `'none'` preset; it takes no options.
 */
export interface StackScreenAnimationNonePresetConfig {
  /**
   * Discriminator of the object.
   *
   * @platform android
   */
  type: 'preset';
  /**
   * Name of the preset.
   *
   * @platform android
   */
  name: 'none';
}

/**
 * Object form of the `'default'` preset; it takes no options.
 */
export interface StackScreenAnimationDefaultPresetConfig {
  /**
   * Discriminator of the object.
   *
   * @platform android
   */
  type: 'preset';
  /**
   * Name of the preset.
   *
   * @platform android
   */
  name: 'default';
}

/**
 * Preset names allowed as one screen's motion, the
 * {@link StackScreenAnimationCustomTransition.enter | enter} or
 * {@link StackScreenAnimationCustomTransition.exit | exit} value of a
 * {@link StackScreenAnimationCustomTransition}.
 *
 * @remarks
 * A name denotes a motion along its vector: at `enter` the screen arrives along
 * it, at `exit` the screen departs along it.
 *
 * Accepts any {@link StackScreenAnimationSlideFromPresetName} and any
 * {@link StackScreenAnimationFadeFromPresetName} value, plus:
 * - `'none'` — the screen stays put for the whole transition.
 * - `'fade'` — the screen fades in at `enter` and out at `exit`.
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
 * One screen's motion during a transition: the
 * {@link StackScreenAnimationCustomTransition.enter | enter} or
 * {@link StackScreenAnimationCustomTransition.exit | exit} value of a
 * {@link StackScreenAnimationCustomTransition}.
 *
 * @remarks
 * The following values are supported:
 * - a {@link StackScreenAnimationMotionPresetName} — a preset by name.
 * - a {@link StackScreenAnimationMotionPresetConfig} — a preset with options.
 * - a {@link StackScreenAnimationCustomMotion} — a motion written as tracks.
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
   *
   * @platform android
   */
  type: 'custom';
  /**
   * Motion of the screen whose view appears.
   *
   * @defaultValue `'none'`
   * @platform android
   */
  enter?: StackScreenAnimationMotion | undefined;
  /**
   * Motion of the screen whose view disappears.
   *
   * @defaultValue `'none'`
   * @platform android
   */
  exit?: StackScreenAnimationMotion | undefined;
}

/**
 * Preset names allowed as a whole transition, the
 * {@link StackScreenAnimationCustom.push | push} or
 * {@link StackScreenAnimationCustom.pop | pop} value of a
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
 * {@link StackScreenAnimationIosFromPresetName} value.
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
 * One transition of a custom animation: the
 * {@link StackScreenAnimationCustom.push | push} or
 * {@link StackScreenAnimationCustom.pop | pop} value of a
 * {@link StackScreenAnimationCustom}.
 *
 * @remarks
 * The following values are supported:
 * - a {@link StackScreenAnimationTransitionPresetName} — a preset by name.
 * - a {@link StackScreenAnimationTransitionPresetConfig} — a preset with
 *   options.
 * - a {@link StackScreenAnimationCustomTransition} — the two screens' motions.
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
   *
   * @platform android
   */
  type: 'custom';
  /**
   * Transition played when the screen is pushed.
   *
   * @defaultValue `'none'`
   * @platform android
   */
  push?: StackScreenAnimationTransition | undefined;
  /**
   * Transition played when the screen is popped.
   *
   * @defaultValue `'none'`
   * @platform android
   */
  pop?: StackScreenAnimationTransition | undefined;
}

/**
 * Preset names allowed as the whole animation, the
 * {@link StackScreenProps.animation | animation} prop itself.
 *
 * @remarks
 * Accepts any {@link StackScreenAnimationTransitionPresetName} value, plus:
 * - `'default'` — the platform's transition: a cross-zoom below Android 13
 *   and, from Android 13 on, the horizontal slide of Android 13, which follows
 *   the layout direction. Takes no options.
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
 * Value of the {@link StackScreenProps.animation | animation} prop of
 * {@link Stack.Screen}.
 *
 * @remarks
 * The following values are supported:
 * - a {@link StackScreenAnimationPresetName} — a preset by name.
 * - a {@link StackScreenAnimationPresetConfig} — a preset with options.
 * - a {@link StackScreenAnimationCustom} — a custom animation.
 */
export type StackScreenAnimation =
  | StackScreenAnimationPresetName
  | StackScreenAnimationPresetConfig
  | StackScreenAnimationCustom;
