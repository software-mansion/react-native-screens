package com.swmansion.rnscreens.gamma.common.colorscheme

interface ColorSchemeProviding {
    fun getResolvedUiNightMode(): Int // UI_MODE_NIGHT_YES,  UI_MODE_NIGHT_NO or UI_MODE_NIGHT_UNDEFINED

    fun addColorSchemeListener(listener: ColorSchemeListener)

    fun removeColorSchemeListener(listener: ColorSchemeListener)
}
