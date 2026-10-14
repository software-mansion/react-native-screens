package com.swmansion.rnscreens.core.containers.stack.animation.model

private val TIMING = setOf(PresetOption.DURATION, PresetOption.EASING)

// A shorter slide is the parallax recede of a custom transition, not a top-level look, so
// `distance` is only offered where the preset's own travel is short.
private val TIMING_AND_DISTANCE = TIMING + PresetOption.DISTANCE

internal enum class PresetName(
    internal val stringName: String,
    internal val options: Set<PresetOption>,
) {
    DEFAULT("default", emptySet()),
    NONE("none", emptySet()),
    FADE("fade", TIMING),
    SLIDE_FROM_RIGHT("slideFromRight", TIMING),
    SLIDE_FROM_LEFT("slideFromLeft", TIMING),
    SLIDE_FROM_BOTTOM("slideFromBottom", TIMING),
    SLIDE_FROM_TOP("slideFromTop", TIMING),
    FADE_FROM_BOTTOM("fadeFromBottom", TIMING_AND_DISTANCE),
    FADE_FROM_TOP("fadeFromTop", TIMING_AND_DISTANCE),
    IOS_FROM_RIGHT("iosFromRight", TIMING),
    IOS_FROM_LEFT("iosFromLeft", TIMING),
    ;

    companion object {
        internal fun fromString(value: String): PresetName =
            entries.firstOrNull { it.stringName == value }
                ?: throw IllegalArgumentException("[RNScreens] Unknown animation preset: $value.")
    }
}
