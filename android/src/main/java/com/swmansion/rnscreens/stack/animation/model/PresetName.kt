package com.swmansion.rnscreens.stack.animation.model

internal enum class PresetName(
    val stringName: String,
) {
    DEFAULT("default"),
    SLIDE_FROM_RIGHT("slideFromRight"),
    SLIDE_FROM_LEFT("slideFromLeft"),
    SLIDE_FROM_BOTTOM("slideFromBottom"),
    SLIDE_FROM_TOP("slideFromTop"),
    FADE("fade"),
    FADE_FROM_BOTTOM("fadeFromBottom"),
    FADE_FROM_TOP("fadeFromTop"),
    IOS_FROM_RIGHT("iosFromRight"),
    IOS_FROM_LEFT("iosFromLeft"),
    NONE("none"),
    ;

    companion object {
        fun fromString(value: String): PresetName =
            values().firstOrNull { it.stringName == value }
                ?: throw IllegalArgumentException("[RNScreens] Unknown animation preset: $value.")
    }
}
