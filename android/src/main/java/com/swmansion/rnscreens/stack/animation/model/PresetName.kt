package com.swmansion.rnscreens.stack.animation.model

import com.facebook.react.bridge.JSApplicationIllegalArgumentException

internal enum class PresetName(
    val jsName: String,
) {
    SLIDE_FROM_RIGHT("slideFromRight"),
    SLIDE_FROM_LEFT("slideFromLeft"),
    SLIDE_FROM_BOTTOM("slideFromBottom"),
    SLIDE_FROM_TOP("slideFromTop"),
    NONE("none"),
    ;

    companion object {
        fun fromJs(value: String): PresetName =
            entries.firstOrNull { it.jsName == value }
                ?: throw JSApplicationIllegalArgumentException("[RNScreens] Unknown animation preset: $value.")
    }
}
