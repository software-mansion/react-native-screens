package com.swmansion.rnscreens.react.containers.tabs.host

import android.content.Context
import android.graphics.Typeface
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.uimanager.PixelUtil
import com.swmansion.rnscreens.core.containers.tabs.appearance.TabsTitleFontResolver

/**
 * Resolves tab title fonts like React Native resolves `Text` fonts: custom fonts registered with
 * [ReactFontManager], and sp sizes through [PixelUtil].
 */
internal class ReactTabsTitleFontResolver(
    private val context: Context,
) : TabsTitleFontResolver {
    override fun resolveTypeface(
        family: String?,
        weight: Int,
        isItalic: Boolean,
    ): Typeface = ReactFontManager.getInstance().getTypeface(family ?: "", weight, isItalic, context.assets)

    override fun resolveTextSizePx(sizeSp: Float): Float = PixelUtil.toPixelFromSP(sizeSp)
}
