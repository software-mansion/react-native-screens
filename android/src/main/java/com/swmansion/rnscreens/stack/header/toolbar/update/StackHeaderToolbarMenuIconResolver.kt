package com.swmansion.rnscreens.stack.header.toolbar.update

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemIconSource

/**
 * Loads the icon a menu element's source points at.
 *
 * [onResolved] must be invoked exactly once — synchronously or asynchronously, always on the
 * main thread — with the loaded drawable, or `null` when the source resolves to no icon or
 * fails to load.
 */
internal fun interface StackHeaderToolbarMenuIconResolver {
    fun resolve(
        iconSource: StackHeaderToolbarMenuItemIconSource,
        onResolved: (icon: Drawable?) -> Unit,
    )
}
