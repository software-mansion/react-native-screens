package com.swmansion.rnscreens.core.containers.stack.animation.model

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
     * The options the preset accepts in the object form of the `animation` prop.
     */
    internal val options: Set<PresetOption>
        get() =
            when (this) {
                DEFAULT, NONE -> emptySet()

                FADE, IOS_FROM_RIGHT, IOS_FROM_LEFT, SLIDE_FROM_RIGHT, SLIDE_FROM_LEFT, SLIDE_FROM_BOTTOM, SLIDE_FROM_TOP ->
                    TIMING_OPTIONS

                // Only these presets move by a short offset; a shortened full-screen slide is a
                // custom transition.
                FADE_FROM_BOTTOM, FADE_FROM_TOP -> TIMING_AND_DISTANCE_OPTIONS
            }

    companion object {
        private val TIMING_OPTIONS = setOf(PresetOption.DURATION, PresetOption.EASING)
        private val TIMING_AND_DISTANCE_OPTIONS = TIMING_OPTIONS + PresetOption.DISTANCE

        internal fun fromString(value: String): PresetName =
            entries.firstOrNull { it.stringName == value }
                ?: throw IllegalArgumentException("[RNScreens] Unknown animation preset: $value.")
    }
}
