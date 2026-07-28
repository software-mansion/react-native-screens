package com.swmansion.rnscreens.utils

import android.content.Context
import android.util.TypedValue
import androidx.annotation.StyleRes

/**
 * Resolves a theme attribute pointing at a style (e.g. `?attr/textAppearanceTitleLarge`)
 * to its concrete style resource id. Used to recover Material's default text
 * appearances so they can be re-applied at runtime.
 */
@StyleRes
internal fun resolveStyleResAttr(
    context: Context,
    attr: Int,
): Int {
    val typedValue = TypedValue()
    require(context.theme.resolveAttribute(attr, typedValue, true)) {
        "[RNScreens] Unable to resolve Material theme style attribute."
    }
    return typedValue.resourceId
}
