package com.swmansion.rnscreens.gamma.tabs.host

import com.facebook.react.modules.core.ReactChoreographer

class TabsHostLayoutCoordinator(private val hostView: TabsHost) {
    private var hasPostLayoutPending = false
    private var hasChoreographerLayoutPending = false

    internal fun postLayout() {
        if (hasPostLayoutPending) {
            return
        }
        hasPostLayoutPending = true
        hostView.post {
            hasPostLayoutPending = false
            hostView.forceSubtreeMeasureAndLayoutPass()
        }
    }

    internal fun choreographerLayout() {
        if (hasChoreographerLayoutPending) {
            return
        }
        hasChoreographerLayoutPending = true
        ReactChoreographer.getInstance().postFrameCallback(ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE) {
            hasChoreographerLayoutPending = false
            hostView.forceSubtreeMeasureAndLayoutPass()
        }
    }
}
