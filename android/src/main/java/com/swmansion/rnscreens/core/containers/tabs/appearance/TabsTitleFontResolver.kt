package com.swmansion.rnscreens.core.containers.tabs.appearance

import android.graphics.Typeface

/**
 * Resolves the tab title font. Supplied by the host, so that fonts and text sizes are resolved
 * the same way as the rest of the host's text.
 */
internal interface TabsTitleFontResolver {
    fun resolveTypeface(
        family: String?,
        weight: Int,
        isItalic: Boolean,
    ): Typeface

    /**
     * Converts a font size in sp to px.
     */
    fun resolveTextSizePx(sizeSp: Float): Float
}
