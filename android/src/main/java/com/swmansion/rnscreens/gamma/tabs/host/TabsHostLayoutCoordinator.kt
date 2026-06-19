package com.swmansion.rnscreens.gamma.tabs.host

import com.facebook.react.modules.core.ReactChoreographer

class TabsHostLayoutCoordinator(
    private val hostView: TabsHost,
    private val layoutCallback: () -> Unit,
) {
    private var hasPostLayoutPending = false
    private var hasChoreographerLayoutPending = false

    /**
     * Schedules the layout via `Handler.post`, executing it through the standard message queue. If a layout
     * traversal is already scheduled or ongoing, this runs after it. Because it runs after the current
     * traversal's `dispatchOnPreDraw`, the forced layout stays out of the TransitionManager's `endValues`,
     * suppressing the `ChangeBounds` animator and the content jump during initial inset application. Used
     * until insets are propagated.
     * See [TabsHost.refreshLayout] and https://github.com/software-mansion/react-native-screens/pull/4161.
     */
    internal fun postLayoutToMessageQueue() {
        if (hasPostLayoutPending) {
            return
        }
        hasPostLayoutPending = true
        hostView.post {
            hasPostLayoutPending = false
            layoutCallback()
        }
    }

    /**
     * Schedules the layout via `ReactChoreographer`'s `NATIVE_ANIMATED_MODULE` queue, which synchronizes with
     * vsync and guarantees execution JUST BEFORE the upcoming traversal. The forced layout therefore mutates
     * the view bounds BEFORE `TransitionManager` captures its `endValues` in `onPreDraw`, so `ChangeBounds`
     * animators are created for tab switches. Used after insets are propagated.
     * See [TabsHost.refreshLayout] and https://github.com/software-mansion/react-native-screens/pull/4161.
     */
    internal fun postLayoutToReactChoreographer() {
        if (hasChoreographerLayoutPending) {
            return
        }
        hasChoreographerLayoutPending = true
        ReactChoreographer.getInstance().postFrameCallback(ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE) {
            hasChoreographerLayoutPending = false
            layoutCallback()
        }
    }
}
