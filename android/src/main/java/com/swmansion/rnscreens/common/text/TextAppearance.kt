package com.swmansion.rnscreens.common.text

import android.graphics.Typeface

/**
 * Provides text styling for some given part of the interface. Interface is React-agnostic. A `null`
 * value means "keep the default".
 */
internal interface TextAppearance {
    val color: Int?

    /** Font size in SP. */
    val fontSize: Float?

    /**
     * Returns the modified typeface based on [base] typeface. Properties that are not overridden
     * are inherited from [base], which is returned unchanged when there are no overrides at all.
     */
    fun resolveTypeface(base: Typeface): Typeface
}
