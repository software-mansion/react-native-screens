package com.swmansion.rnscreens.core.common.text

import android.graphics.Typeface

/**
 * Resolves fonts and text sizes. Supplied by the host, so that text is resolved the same way as
 * the rest of the host's text. A `null` argument means "the host's default".
 *
 * Unlike [TextAppearance.resolveTypeface], which applies overrides on top of a base typeface
 * (e.g. a Material default), this builds the typeface from scratch.
 */
internal interface FontResolver {
    /**
     * Resolves the typeface for [family] (`null`: the host's default family), [weight] (`null`:
     * the host's default weight) and [isItalic] (`null`: the host's default style).
     */
    fun resolveTypeface(
        family: String?,
        weight: Int?,
        isItalic: Boolean?,
    ): Typeface

    /**
     * Converts a font size in sp to px.
     */
    fun resolveTextSizePx(sizeSp: Float): Float
}
