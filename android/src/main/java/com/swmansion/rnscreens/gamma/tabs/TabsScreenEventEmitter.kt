package com.swmansion.rnscreens.gamma.tabs

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.TabsScreenEventEmitter.Companion.TAG
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabsScreenWillDisappearEvent
import com.swmansion.rnscreens.utils.RNSLog

internal class TabsScreenEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnWillAppear() {
        logEventDispatch(viewTag, TabsScreenWillAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabsScreenWillAppearEvent(surfaceId, viewTag))
    }

    fun emitOnDidAppear() {
        logEventDispatch(viewTag, TabsScreenDidAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabsScreenDidAppearEvent(surfaceId, viewTag))
    }

    fun emitOnWillDisappear() {
        logEventDispatch(viewTag, TabsScreenWillDisappearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabsScreenWillDisappearEvent(surfaceId, viewTag))
    }

    fun emitOnDidDisappear() {
        logEventDispatch(viewTag, TabsScreenDidDisappearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabsScreenDidDisappearEvent(surfaceId, viewTag))
    }

    companion object {
        const val TAG = "TabsScreenEventEmitter"
    }
}

private fun logEventDispatch(
    viewTag: Int,
    eventName: String,
) {
    RNSLog.d(TAG, "TabsScreen [$viewTag] emits event: $eventName")
}
