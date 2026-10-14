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

    companion object {
        internal fun fromString(value: String): PresetName =
            entries.firstOrNull { it.stringName == value }
                ?: throw IllegalArgumentException("[RNScreens] Unknown animation preset: $value.")
    }
}
