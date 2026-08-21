package com.swmansion.rnscreens.common.text

import android.content.res.AssetManager
import android.graphics.Typeface
import android.os.Build
import com.facebook.react.common.ReactConstants
import com.facebook.react.common.assets.ReactFontManager.TypefaceStyle
import com.facebook.react.views.text.ReactTypefaceUtils
import kotlin.properties.Delegates
import kotlin.properties.ReadWriteProperty

/**
 * [TextAppearance] driven by React props. Font family, weight and style are kept as the raw
 * React values and turned into a [Typeface]. [onChanged] is invoked whenever a property
 * actually changes value.
 */
internal class ReactTextAppearance(
    private val assets: AssetManager,
    onChanged: () -> Unit,
) : TextAppearance {
    override var color: Int? by changeNotifying(onChanged)
    override var fontSize: Float? by changeNotifying(onChanged)
    internal var fontFamily: String? by changeNotifying(onChanged)
    internal var fontWeight: String? by changeNotifying(onChanged)
    internal var fontStyle: String? by changeNotifying(onChanged)

    override fun resolveTypeface(base: Typeface): Typeface {
        val weight = ReactTypefaceUtils.parseFontWeight(fontWeight)
        val style = ReactTypefaceUtils.parseFontStyle(fontStyle)

        if (fontFamily == null && weight == ReactConstants.UNSET && style == ReactConstants.UNSET) {
            return base
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

private fun <T> changeNotifying(onChanged: () -> Unit): ReadWriteProperty<Any?, T?> =
    Delegates.observable(null) { _, old, new -> if (old != new) onChanged() }

/**
 * Numeric weight of this typeface. [Typeface.getWeight] requires API 28; below it only bold
 * can be told apart from regular.
 */
private fun Typeface.resolveWeight(): Int =
    when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.P -> weight
        isBold -> TypefaceStyle.BOLD
        else -> TypefaceStyle.NORMAL
    }

private fun Typeface.resolveStyle(): Int = if (isItalic) Typeface.ITALIC else Typeface.NORMAL
