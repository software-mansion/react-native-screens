package com.swmansion.rnscreens.gamma.common.colorscheme

interface ColorSchemeProviding {
    val resolvedUiNightMode: Int // UI_MODE_NIGHT_YES or UI_MODE_NIGHT_NO

    fun addColorSchemeListener(listener: ColorSchemeListener)

    fun removeColorSchemeListener(listener: ColorSchemeListener)
}
