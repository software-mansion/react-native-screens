package com.swmansion.rnscreens.gamma.tabs.host

import com.facebook.react.modules.core.ReactChoreographer

class TabsHostLayoutCoordinator(
    private val hostView: TabsHost,
) {
    private var hasPostLayoutPending = false
    private var hasChoreographerLayoutPending = false

    /**
     * Defers the layout to the NEXT frame via `Handler.post`. Because it runs after the current frame's
     * `dispatchOnPreDraw`, the forced layout is NOT captured into the BottomNavigationView's transition,
     * so the animator does not produce a ChangeBounds "jump".
     * See [TabsHost.refreshLayout].
     */
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

    /**
     * Runs the layout in the CURRENT frame via `ReactChoreographer`'s `NATIVE_ANIMATED_MODULE` queue, avoiding
     * the one-frame delay of [postLayout]. Should be used only when the insets were already applied.
     * See [TabsHost.refreshLayout].
     */
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
