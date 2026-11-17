package com.swmansion.rnscreens.react.common.text

import android.content.Context
import android.graphics.Typeface
import com.facebook.react.common.ReactConstants
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.uimanager.PixelUtil
import com.swmansion.rnscreens.core.common.text.FontResolver

/**
 * Resolves fonts like React Native resolves `Text` fonts: custom fonts registered with
 * [ReactFontManager], and sp sizes through [PixelUtil].
 */
internal class ReactFontResolver(
    private val context: Context,
) : FontResolver {
    // React Native's defaults: an empty family is the platform default family, an unset weight
    // makes ReactFontManager apply 400, and text is upright unless italic is requested.
    override fun resolveTypeface(
        family: String?,
        weight: Int?,
        isItalic: Boolean?,
    ): Typeface =
        ReactFontManager.getInstance().getTypeface(
            family ?: "",
            weight ?: ReactConstants.UNSET,
            isItalic ?: false,
            context.assets,
        )

    override fun resolveTextSizePx(sizeSp: Float): Float = PixelUtil.toPixelFromSP(sizeSp)
}
