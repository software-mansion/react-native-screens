package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * Where a preset name is written in the `animation` prop; [position] is the wording of the
 * rejection messages.
 */
internal enum class PresetLevel(
    internal val position: String,
) {
    ANIMATION("the whole animation"),
    TRANSITION("a push or pop transition"),
    MOTION("one screen's motion"),
}

internal enum class PresetName(
    internal val stringName: String,
) {
    DEFAULT("default"),
    NONE("none"),
    FADE("fade"),
    SLIDE_FROM_RIGHT("slideFromRight"),
    SLIDE_FROM_LEFT("slideFromLeft"),
    SLIDE_FROM_BOTTOM("slideFromBottom"),
    SLIDE_FROM_TOP("slideFromTop"),
    FADE_FROM_BOTTOM("fadeFromBottom"),
    FADE_FROM_TOP("fadeFromTop"),
    IOS_FROM_RIGHT("iosFromRight"),
    IOS_FROM_LEFT("iosFromLeft"),
    ;

    /**
     * The levels the name may be written at: `default` is only a whole animation (its two
     * transitions are not built from screen motions), `iosFrom*` has no single-screen motion.
     */
    internal val levels: Set<PresetLevel>
        get() =
            when (this) {
                DEFAULT -> setOf(PresetLevel.ANIMATION)
                IOS_FROM_RIGHT, IOS_FROM_LEFT -> setOf(PresetLevel.ANIMATION, PresetLevel.TRANSITION)
                NONE, FADE, SLIDE_FROM_RIGHT, SLIDE_FROM_LEFT, SLIDE_FROM_BOTTOM, SLIDE_FROM_TOP, FADE_FROM_BOTTOM, FADE_FROM_TOP ->
                    ALL_LEVELS
            }

    /**
     * The options the preset accepts at [level] in the object form of the `animation` prop.
     */
    internal fun optionsAt(level: PresetLevel): Set<PresetOption> =
        when (this) {
            DEFAULT, NONE -> emptySet()

            FADE, IOS_FROM_RIGHT, IOS_FROM_LEFT -> TIMING_OPTIONS

            // A shortened slide is the parallax recede of one screen (the background of `iosFrom*`);
            // a whole transition keeps the full width.
            SLIDE_FROM_RIGHT, SLIDE_FROM_LEFT, SLIDE_FROM_BOTTOM, SLIDE_FROM_TOP ->
                if (level == PresetLevel.MOTION) TIMING_AND_DISTANCE_OPTIONS else TIMING_OPTIONS

            FADE_FROM_BOTTOM, FADE_FROM_TOP -> TIMING_AND_DISTANCE_OPTIONS
        }

    /**
     * The name whose vector points the other way; a preset's pop transition is its opposite's.
     * Names without a vector are their own opposite.
     */
    internal val opposite: PresetName
        get() =
            when (this) {
                SLIDE_FROM_RIGHT -> SLIDE_FROM_LEFT
                SLIDE_FROM_LEFT -> SLIDE_FROM_RIGHT
                SLIDE_FROM_BOTTOM -> SLIDE_FROM_TOP
                SLIDE_FROM_TOP -> SLIDE_FROM_BOTTOM
                FADE_FROM_BOTTOM -> FADE_FROM_TOP
                FADE_FROM_TOP -> FADE_FROM_BOTTOM
                IOS_FROM_RIGHT -> IOS_FROM_LEFT
                IOS_FROM_LEFT -> IOS_FROM_RIGHT
                DEFAULT, NONE, FADE -> this
            }

    /**
     * Whether a transition of this preset animates the covered or revealed screen too. Both screens
     * travel together in the horizontal slides and cross-fade in `fade`; in the vertical slides and
     * `fadeFrom*` the other screen stays put (legacy parity: `rns_no_animation_*.xml` on that side).
     */
    internal val animatesBothScreens: Boolean
        get() =
            when (this) {
                FADE, SLIDE_FROM_RIGHT, SLIDE_FROM_LEFT -> true
                else -> false
            }

    companion object {
        private val ALL_LEVELS = PresetLevel.entries.toSet()
        private val TIMING_OPTIONS = setOf(PresetOption.DURATION, PresetOption.EASING)
        private val TIMING_AND_DISTANCE_OPTIONS = TIMING_OPTIONS + PresetOption.DISTANCE

        internal fun fromString(value: String): PresetName =
            entries.firstOrNull { it.stringName == value }
                ?: throw IllegalArgumentException("[RNScreens] Unknown animation preset: $value.")
    }
}
