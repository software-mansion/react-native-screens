package com.swmansion.rnscreens.gamma.tabs.screen

internal enum class TabsScreenIconTinting {
    DEFAULT,
    TINTED,
    ORIGINAL,
    ;

    companion object {
        fun fromString(value: String?): TabsScreenIconTinting =
            when (value) {
                "tinted" -> TINTED
                "original" -> ORIGINAL
                else -> DEFAULT
            }
    }
}
