package com.swmansion.rnscreens.tabs.screen

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
