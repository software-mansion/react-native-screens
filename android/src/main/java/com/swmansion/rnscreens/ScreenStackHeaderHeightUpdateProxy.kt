package com.swmansion.rnscreens

class ScreenStackHeaderHeightUpdateProxy {
    var previousHeaderHeightInPx: Int? = null

    fun updateHeaderHeightIfNeeded(
        config: ScreenStackHeaderConfig,
        screen: Screen?,
    ) {
        val currentHeaderHeightInPx = if (config.isHeaderHidden) 0 else config.toolbar.height

        if (currentHeaderHeightInPx != previousHeaderHeightInPx) {
            previousHeaderHeightInPx = currentHeaderHeightInPx
            screen?.notifyHeaderHeightChange(currentHeaderHeightInPx)
        }
    }
}
