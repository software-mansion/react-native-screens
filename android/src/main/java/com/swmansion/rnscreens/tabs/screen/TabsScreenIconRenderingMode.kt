package com.swmansion.rnscreens.tabs.screen

internal enum class TabsScreenIconRenderingMode {
    AUTOMATIC,
    MONOCHROME,
    ORIGINAL,
    ;

    companion object {
        fun fromString(value: String?): TabsScreenIconRenderingMode =
            when (value) {
                "monochrome" -> MONOCHROME
                "original" -> ORIGINAL
                else -> AUTOMATIC
            }
    }
}
