package com.swmansion.rnscreens.gamma.tabs.host

import com.facebook.react.modules.core.ReactChoreographer

class TabsHostLayoutCoordinator(
    private val hostView: TabsHost,
) {
    private var hasPostLayoutPending = false
    private var hasChoreographerLayoutPending = false

    /**
     * Defers the layout to the NEXT frame via `Handler.post`. Because this puts the action at the end
     * of the message queue, it runs after the current frame's `dispatchOnPreDraw`. Consequently, the
     * forced layout mutations are NOT captured into the BottomNavigationView's `endValues` by the
     * TransitionManager. This prevents the animator from producing a `ChangeBounds` and the content jump
     * during the initial inset application.
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
     * Runs the layout in the CURRENT frame via `ReactChoreographer`'s `NATIVE_ANIMATED_MODULE` queue.
     * Callbacks in this queue execute early in the Choreographer frame loop (before the Android view
     * system's TRAVERSAL phase). This guarantees that [forceSubtreeMeasureAndLayoutPass]
     * mutates the view bounds BEFORE `TransitionManager` captures its `endValues` in `onPreDraw`.
     * This ensures `ChangeBounds` animators are correctly created for tab switches.
     * Should be used only after the initial window insets are successfully applied.
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
