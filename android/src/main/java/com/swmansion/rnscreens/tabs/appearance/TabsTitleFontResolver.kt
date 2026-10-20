package com.swmansion.rnscreens.tabs.appearance

import android.graphics.Typeface

/**
 * Resolves the tab title font. Supplied by the host, so that tab titles are resolved the same way
 * as the rest of the host's text. A `null` argument means "the host's default".
 *
 * Tabs don't use [com.swmansion.rnscreens.core.common.text.TextAppearance], Stack's text
 * abstraction: it applies its overrides on top of a base typeface and converts sp in core, while
 * tab titles have always been resolved from scratch by the host (`ReactFontManager` and
 * `PixelUtil` in React Native). Moving tab titles to `TextAppearance` would change how they render,
 * so it is out of scope for the core / react split.
 */
internal interface TabsTitleFontResolver {
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
