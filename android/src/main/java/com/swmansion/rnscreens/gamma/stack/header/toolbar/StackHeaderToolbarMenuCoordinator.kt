package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.util.Log
import android.util.TypedValue
import android.view.Menu
import android.view.MenuItem
import androidx.core.graphics.drawable.toBitmap
import androidx.core.graphics.drawable.toDrawable
import androidx.core.view.MenuItemCompat
import com.google.android.material.appbar.MaterialToolbar

internal class StackHeaderToolbarMenuCoordinator(
    private val onItemClicked: (id: String) -> Unit,
) {
    private val forwardIdMap = HashMap<String, Int>()
    private val reverseIdMap = HashMap<Int, String>()
    private var lastMenuItems: List<StackHeaderToolbarMenuItemConfig> = emptyList()

    internal fun rebuildMenuIfNeeded(
        toolbar: MaterialToolbar,
        items: List<StackHeaderToolbarMenuItemConfig>,
    ) {
        if (items == lastMenuItems) return

        toolbar.menu.clear()
        forwardIdMap.clear()
        reverseIdMap.clear()

        items.forEachIndexed { index, item ->
            // We use IDs > 0 because 0 is Menu.NONE.
            val nativeId = index + 1
            forwardIdMap[item.id] = nativeId
            reverseIdMap[nativeId] = item.id
            val menuItem = toolbar.menu.add(Menu.NONE, nativeId, index, null)

            applyOptions(toolbar, menuItem, item.toOptions())
        }

        toolbar.setOnMenuItemClickListener { menuItem ->
            reverseIdMap[menuItem.itemId]?.let(onItemClicked)
            true
        }

        lastMenuItems = items
    }

    internal fun clear() {
        forwardIdMap.clear()
        reverseIdMap.clear()
        lastMenuItems = emptyList()
    }

    internal fun updateItem(
        toolbar: MaterialToolbar,
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        val item =
            forwardIdMap[id]?.let { toolbar.menu.findItem(it) } ?: run {
                Log.e(TAG, "[RNScreens] Unable to find menu item.")
                return
            }

        applyOptions(toolbar, item, options)
    }

    private fun applyOptions(
        toolbar: MaterialToolbar,
        menuItem: MenuItem,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        options.title?.let { menuItem.title = it }
        options.hidden?.let { menuItem.isVisible = !it }
        options.showAsAction?.let { menuItem.setShowAsAction(it.toNativeShowAsAction()) }

        options.icon?.let {
            when (it) {
                StackHeaderToolbarUpdate.Reset -> menuItem.icon = null
                is StackHeaderToolbarUpdate.Set<Drawable> ->
                    menuItem.icon = getResizedDrawable(toolbar, it.value)
            }
        }

        if (options.requiresIconTintColorUpdate || options.icon != null) {
            MenuItemCompat.setIconTintList(menuItem, getResolvedIconTintList(menuItem, options))
        }
    }

    private fun StackHeaderToolbarMenuItemConfig.toOptions() =
        StackHeaderToolbarMenuItemOptions(
            title = title,
            hidden = hidden,
            showAsAction = showAsAction,
            icon = StackHeaderToolbarUpdate.from(icon),
            iconTintColorNormal = StackHeaderToolbarUpdate.from(iconTintColorNormal),
            iconTintColorPressed = StackHeaderToolbarUpdate.from(iconTintColorPressed),
            iconTintColorFocused = StackHeaderToolbarUpdate.from(iconTintColorFocused),
            iconTintColorDisabled = StackHeaderToolbarUpdate.from(iconTintColorDisabled),
        )

    /**
     * Returns drawable resized to 24 dp height. Width is scaled proportionally to keep the aspect
     * ratio.
     *
     * Icon size source: https://m3.material.io/components/app-bars/specs - App bar icon size
     */
    private fun getResizedDrawable(
        toolbar: MaterialToolbar,
        drawable: Drawable,
    ): Drawable {
        val targetHeightPx =
            TypedValue
                .applyDimension(
                    TypedValue.COMPLEX_UNIT_DIP,
                    24f,
                    toolbar.resources.displayMetrics,
                ).toInt()

        val intrinsicWidth = drawable.intrinsicWidth
        val intrinsicHeight = drawable.intrinsicHeight

        val targetWidthPx =
            if (intrinsicWidth > 0 && intrinsicHeight > 0) {
                val aspectRatio = intrinsicWidth.toFloat() / intrinsicHeight.toFloat()
                (targetHeightPx * aspectRatio).toInt()
            } else {
                targetHeightPx
            }

        return drawable
            .toBitmap(width = targetWidthPx, height = targetHeightPx)
            .toDrawable(toolbar.resources)
    }

    private fun getResolvedIconTintList(
        menuItem: MenuItem,
        options: StackHeaderToolbarMenuItemOptions,
    ): ColorStateList? {
        val currentTintList = MenuItemCompat.getIconTintList(menuItem)
        // The currently-applied normal (catch-all) color, if any. Used both as
        // the "leave unchanged" value for normal and to dedup read-back
        // overrides: when a normal entry exists every override probe also
        // matches it, so an override equal to the current normal is the
        // catch-all leaking through rather than an explicit override.
        val currentNormal = currentTintList?.resolvedColorOrNull(intArrayOf(android.R.attr.state_enabled))

        val finalNormal =
            when (val update = options.iconTintColorNormal) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null -> currentNormal
            }

        val finalDisabled =
            when (val update = options.iconTintColorDisabled) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(-android.R.attr.state_enabled))
                        ?.takeIf { it != currentNormal }
            }

        val finalPressed =
            when (val update = options.iconTintColorPressed) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(android.R.attr.state_enabled, android.R.attr.state_pressed))
                        ?.takeIf { it != currentNormal }
            }

        val finalFocused =
            when (val update = options.iconTintColorFocused) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(android.R.attr.state_enabled, android.R.attr.state_focused))
                        ?.takeIf { it != currentNormal }
            }

        val states = mutableListOf<IntArray>()
        val colors = mutableListOf<Int>()

        finalDisabled?.let {
            states.add(intArrayOf(-android.R.attr.state_enabled))
            colors.add(it)
        }

        finalPressed?.let {
            states.add(intArrayOf(android.R.attr.state_pressed))
            colors.add(it)
        }

        finalFocused?.let {
            states.add(intArrayOf(android.R.attr.state_focused))
            colors.add(it)
        }

        finalNormal?.let {
            states.add(intArrayOf())
            colors.add(it)
        }

        return if (states.isNotEmpty()) {
            ColorStateList(states.toTypedArray(), colors.toIntArray())
        } else {
            null
        }
    }

    /**
     * Resolves the color the receiver applies to [stateSet], or `null` when no
     * state spec matches it.
     *
     * `getColorForState` returns the caller-supplied fallback when nothing
     * matches, so we probe twice with two distinct sentinels: equal results
     * mean a real spec matched (the actual color), differing results mean the
     * slot is absent. This is robust for any color value and keeps the read-back
     * stateless — see [getResolvedIconTintList].
     */
    private fun ColorStateList.resolvedColorOrNull(stateSet: IntArray): Int? {
        val a = getColorForState(stateSet, SENTINEL_A)
        val b = getColorForState(stateSet, SENTINEL_B)
        return if (a == b) a else null
    }

    companion object {
        private const val TAG = "StackHeaderToolbarMenuCoordinator"

        // Two distinct sentinel fallbacks used to detect whether a ColorStateList
        // actually defines a color for a given state. Their concrete values are
        // irrelevant as long as they differ — see resolvedColorOrNull.
        private const val SENTINEL_A = 0x00000001
        private const val SENTINEL_B = 0x00000002
    }
}
