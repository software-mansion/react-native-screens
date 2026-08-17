package com.swmansion.rnscreens.common.text

import android.content.res.AssetManager
import android.graphics.Typeface
import android.os.Build
import com.facebook.react.common.ReactConstants
import com.facebook.react.common.assets.ReactFontManager.TypefaceStyle
import com.facebook.react.views.text.ReactTypefaceUtils

/**
 * [TextAppearance] driven by React props. Font family, weight and style are kept as the raw
 * React values and turned into a [Typeface].
 */
internal class ReactTextAppearance(
    private val assets: AssetManager,
) : TextAppearance {
    override var color: Int? = null
    override var fontSize: Float? = null
    internal var fontFamily: String? = null
    internal var fontWeight: String? = null
    internal var fontStyle: String? = null

    override fun resolveTypeface(base: Typeface?): Typeface {
        val weight = ReactTypefaceUtils.parseFontWeight(fontWeight)
        val style = ReactTypefaceUtils.parseFontStyle(fontStyle)

        if (fontFamily == null && weight == ReactConstants.UNSET && style == ReactConstants.UNSET) {
            return base ?: Typeface.DEFAULT
        }

        // ReactFontManager.TypefaceStyle turns an unset weight into 400 and an unset style into
        // "not italic" rather than deriving them from the base. This would drop default styling
        // from base typeface. Resolve both up front so it never receives UNSET style or weight.
        return ReactTypefaceUtils.applyStyles(
            base,
            if (style != ReactConstants.UNSET) style else base.resolveStyle(),
            if (weight != ReactConstants.UNSET) weight else base.resolveWeight(),
            fontFamily,
            assets,
        )
    }
}

/**
 * Numeric weight of this typeface. [Typeface.getWeight] requires API 28; below it only bold
 * can be told apart from regular.
 */
private fun Typeface?.resolveWeight(): Int =
    when {
        this == null -> TypefaceStyle.NORMAL
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.P -> weight
        isBold -> TypefaceStyle.BOLD
        else -> TypefaceStyle.NORMAL
    }

private fun Typeface?.resolveStyle(): Int = if (this?.isItalic == true) Typeface.ITALIC else Typeface.NORMAL
