package com.swmansion.rnscreens.gamma.tabs.image

import android.content.Context
import com.swmansion.rnscreens.gamma.helpers.loadImage
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen

internal fun loadTabImage(
    context: Context,
    uri: String,
    view: TabsScreen,
    isSelected: Boolean,
) {
    loadImage(context, uri) { drawable ->
        if (isSelected) {
            view.selectedIcon = drawable
        } else {
            view.icon = drawable
        }
    }
}
