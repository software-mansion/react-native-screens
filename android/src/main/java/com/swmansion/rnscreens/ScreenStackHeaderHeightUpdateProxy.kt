package com.swmansion.rnscreens

import android.util.Log

class ScreenStackHeaderHeightUpdateProxy {
    var previousHeaderHeightInPx: Int? = null

    fun updateHeaderHeightIfNeeded(
        config: ScreenStackHeaderConfig,
        screen: Screen?,
    ) {
        val currentHeaderHeightInPx = if (config.isHeaderHidden) 0 else config.toolbar.height

        Log.d("SCREENS", "ScreenStackHeaderHeightUpdateProxy // updateHeaderHeightIfNeeded %d".format(currentHeaderHeightInPx))

        if (currentHeaderHeightInPx != previousHeaderHeightInPx) {
            previousHeaderHeightInPx = currentHeaderHeightInPx
            screen?.notifyHeaderHeightChange(currentHeaderHeightInPx)
        }
    }
}
