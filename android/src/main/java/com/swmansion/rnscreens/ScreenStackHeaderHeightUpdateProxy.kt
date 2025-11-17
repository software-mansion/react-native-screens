package com.swmansion.rnscreens

class ScreenStackHeaderHeightUpdateProxy(
    val config: ScreenStackHeaderConfig,
) {
    var previousHeaderHeightInPx: Int? = null

    fun updateHeaderHeightIfNeeded() {
        val currentHeaderHeightInPx = if (config.isHeaderHidden) 0 else config.toolbar.height

        if (currentHeaderHeightInPx != previousHeaderHeightInPx) {
            previousHeaderHeightInPx = currentHeaderHeightInPx
            config.screen?.notifyHeaderHeightChange(currentHeaderHeightInPx)
        }
    }
}
