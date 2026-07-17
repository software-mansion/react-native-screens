package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

/**
 * Resolves the icon for a single menu element update.
 *
 * [onResolved] must be invoked exactly once — synchronously or asynchronously, always on the
 * main thread — with the resolved icon to merge into the element's options.
 */
internal fun interface StackHeaderToolbarMenuIconResolver {
    fun resolve(
        iconSource: StackHeaderToolbarMenuItemIconSource,
        onResolved: (icon: StackHeaderToolbarFieldUpdate<Drawable>) -> Unit,
    )
}
