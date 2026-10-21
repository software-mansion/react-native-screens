package com.swmansion.rnscreens.core.common.text

import android.graphics.Typeface

/**
 * Resolves fonts and text sizes. Supplied by the host, so that text is resolved the same way as
 * the rest of the host's text.
 */
internal interface FontResolver {
    /**
     * Resolves the typeface for [family]. A `null` [weight] means the host's default weight.
     */
    fun resolveTypeface(
        family: String?,
        weight: Int?,
        isItalic: Boolean,
    ): Typeface

    /**
     * Converts a font size in sp to px.
     */
    fun resolveTextSizePx(sizeSp: Float): Float
}
