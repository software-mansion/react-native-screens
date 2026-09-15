package com.swmansion.rnscreens.stack.animation.model

internal enum class PresetName(
    val stringName: String,
) {
    SLIDE_FROM_RIGHT("slideFromRight"),
    SLIDE_FROM_LEFT("slideFromLeft"),
    SLIDE_FROM_BOTTOM("slideFromBottom"),
    SLIDE_FROM_TOP("slideFromTop"),
    NONE("none"),
    ;

    companion object {
        fun fromString(value: String): PresetName =
            values().firstOrNull { it.stringName == value }
                ?: throw IllegalArgumentException("[RNScreens] Unknown animation preset: $value.")
    }
}
