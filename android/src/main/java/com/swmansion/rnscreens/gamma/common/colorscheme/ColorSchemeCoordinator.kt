package com.swmansion.rnscreens.gamma.common.colorscheme

import android.content.res.Configuration
import android.view.View
import android.view.ViewParent
import kotlin.properties.Delegates

internal class ColorSchemeCoordinator :
    ColorSchemeProviding,
    ColorSchemeListener {
    internal var colorScheme: ColorScheme by Delegates.observable(ColorScheme.INHERIT) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            applyResolvedColorScheme()
        }
    }
    private var parentProvider: ColorSchemeProviding? = null
    private var systemUiNightMode: Int = Configuration.UI_MODE_NIGHT_NO
    private var lastAppliedUiNightMode: Int? = null
    private val childListeners = mutableListOf<ColorSchemeListener>()

    internal var onUiNightModeResolved: ((Int) -> Unit)? = null

    override fun getResolvedUiNightMode(): Int =
        when (colorScheme) {
            ColorScheme.LIGHT -> Configuration.UI_MODE_NIGHT_NO
            ColorScheme.DARK -> Configuration.UI_MODE_NIGHT_YES
            ColorScheme.INHERIT ->
                parentProvider?.getResolvedUiNightMode()
                    ?: systemUiNightMode
        }

    internal fun onAttachedToWindow(hostView: View) {
        systemUiNightMode = hostView.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        parentProvider = findParentColorSchemeProvider(hostView)
        parentProvider?.addColorSchemeListener(this)
        applyResolvedColorScheme()
    }

    internal fun onDetachedFromWindow() {
        parentProvider?.removeColorSchemeListener(this)
        parentProvider = null
    }

    internal fun onConfigurationChanged(configuration: Configuration?) {
        systemUiNightMode = configuration?.uiMode?.and(Configuration.UI_MODE_NIGHT_MASK) ?: Configuration.UI_MODE_NIGHT_UNDEFINED
        applyResolvedColorScheme()
    }

    override fun onParentUiNightModeChanged() {
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
        val resolved = getResolvedUiNightMode()
        if (resolved == lastAppliedUiNightMode) return
        lastAppliedUiNightMode = resolved

        onUiNightModeResolved?.invoke(resolved)
        childListeners.forEach { it.onParentUiNightModeChanged() }
    }

    private fun findParentColorSchemeProvider(hostView: View): ColorSchemeProviding? {
        var current: ViewParent? = hostView.parent
        while (current != null) {
            if (current is ColorSchemeProviding) return current
            current = current.parent
        }
        return null
    }
}
