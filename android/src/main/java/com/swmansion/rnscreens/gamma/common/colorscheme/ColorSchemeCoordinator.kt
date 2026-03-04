package com.swmansion.rnscreens.gamma.common.colorscheme

import android.content.res.Configuration
import android.view.View
import android.view.ViewParent
import kotlin.properties.Delegates

class ColorSchemeCoordinator(
    private val hostView: View,
) : ColorSchemeProviding,
    ColorSchemeListener {
    internal var colorScheme: ColorScheme by Delegates.observable(ColorScheme.INHERIT) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            applyResolvedColorScheme()
        }
    }
    private var parentProvider: ColorSchemeProviding? = null
    private var lastAppliedUiNightMode: Int? = null
    private val childListeners = mutableListOf<ColorSchemeListener>()

    var onColorSchemeChanged: ((Int) -> Unit)? = null

    override val resolvedUiNightMode: Int
        get() =
            when (colorScheme) {
                ColorScheme.LIGHT -> Configuration.UI_MODE_NIGHT_NO
                ColorScheme.DARK -> Configuration.UI_MODE_NIGHT_YES
                ColorScheme.INHERIT ->
                    parentProvider?.resolvedUiNightMode
                        ?: (hostView.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK)
            }

    fun onAttachedToWindow() {
        parentProvider = findParentColorSchemeProvider()
        parentProvider?.addColorSchemeListener(this)
        applyResolvedColorScheme()
    }

    fun onDetachedFromWindow() {
        parentProvider?.removeColorSchemeListener(this)
        parentProvider = null
    }

    fun onConfigurationChanged() {
        applyResolvedColorScheme()
    }

    override fun onResolvedColorSchemeChanged() {
        if (colorScheme == ColorScheme.INHERIT) {
            applyResolvedColorScheme()
        }
    }

    override fun addColorSchemeListener(listener: ColorSchemeListener) {
        childListeners.add(listener)
    }

    override fun removeColorSchemeListener(listener: ColorSchemeListener) {
        childListeners.remove(listener)
    }

    private fun applyResolvedColorScheme() {
        val resolved = resolvedUiNightMode
        if (resolved == lastAppliedUiNightMode) return
        lastAppliedUiNightMode = resolved

        onColorSchemeChanged?.invoke(resolved)
        childListeners.forEach { it.onResolvedColorSchemeChanged() }
    }

    private fun findParentColorSchemeProvider(): ColorSchemeProviding? {
        var current: ViewParent? = hostView.parent
        while (current != null) {
            if (current is ColorSchemeProviding) return current
            current = current.parent
        }
        return null
    }
}
