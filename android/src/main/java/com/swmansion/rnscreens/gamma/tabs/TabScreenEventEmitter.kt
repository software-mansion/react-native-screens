package com.swmansion.rnscreens.gamma.tabs

import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.TabScreenEventEmitter.Companion.TAG
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillDisappearEvent

internal class TabScreenEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnWillAppear() {
        logEventDispatch(viewTag, TabScreenWillAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabScreenWillAppearEvent(surfaceId, viewTag))
    }

    fun emitOnDidAppear() {
        logEventDispatch(viewTag, TabScreenDidAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabScreenDidAppearEvent(surfaceId, viewTag))
    }

    fun emitOnWillDisappear() {
        logEventDispatch(viewTag, TabScreenWillDisappearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabScreenWillDisappearEvent(surfaceId, viewTag))
    }

    fun emitOnDidDisappear() {
        logEventDispatch(viewTag, TabScreenDidDisappearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabScreenDidDisappearEvent(surfaceId, viewTag))
    }

    companion object {
        const val TAG = "TabScreenEventEmitter"
    }
}

private fun logEventDispatch(
    viewTag: Int,
    eventName: String,
) {
    Log.d(TAG, "TabScreen [$viewTag] emits event: $eventName")
}
