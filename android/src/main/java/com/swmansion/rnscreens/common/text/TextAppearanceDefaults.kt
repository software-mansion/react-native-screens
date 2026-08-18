package com.swmansion.rnscreens.common.text

import android.content.Context
import android.graphics.Typeface
import androidx.annotation.AttrRes
import com.swmansion.rnscreens.utils.resolveColorAttr
import com.swmansion.rnscreens.utils.resolveStyleResAttr

/**
 * Default text styling of a single title/subtitle slot, resolved from the M3 type-scale
 * style behind [textAppearanceAttr] and the color behind [textColorAttr].
 *
 * Values depend on the current theme and display metrics — resolve at apply time through
 * the widget's own context.
 */
internal class TextAppearanceDefaults(
    val color: Int,
    val textSizePx: Float,
    val typeface: Typeface,
) {
    companion object {
        fun resolve(
            context: Context,
            @AttrRes textAppearanceAttr: Int,
            @AttrRes textColorAttr: Int,
        ): TextAppearanceDefaults {
            val appearanceRes = resolveStyleResAttr(context, textAppearanceAttr)
            val attrs = context.obtainStyledAttributes(appearanceRes, APPEARANCE_ATTRS)
            try {
                val textSizePx = attrs.getDimension(IDX_TEXT_SIZE, 0f)
                require(textSizePx > 0f) { "[RNScreens] Text appearance defines no text size." }

                // The M3 type scale always declares the family as a plain string (e.g.
                // "sans-serif-medium"), which Material itself can only turn into a Typeface
                // asynchronously. Resolving it here up front yields the same typeface its
                // async fallback would eventually apply, deterministically.
                val textStyle = attrs.getInt(IDX_TEXT_STYLE, Typeface.NORMAL)
                val typeface =
                    attrs.getString(IDX_FONT_FAMILY)?.let { Typeface.create(it, textStyle) }
                        ?: Typeface.defaultFromStyle(textStyle)

                return TextAppearanceDefaults(
                    resolveColorAttr(context, textColorAttr),
                    textSizePx,
                    typeface,
                )
            } finally {
                attrs.recycle()
            }
        }

        // Framework attr ids are compile-time constants; the array must stay sorted
        // ascending (obtainStyledAttributes requirement).
        private val APPEARANCE_ATTRS =
            intArrayOf(
                android.R.attr.textSize,
                android.R.attr.textStyle,
                android.R.attr.fontFamily,
            )
        private const val IDX_TEXT_SIZE = 0
        private const val IDX_TEXT_STYLE = 1
        private const val IDX_FONT_FAMILY = 2
    }
}
