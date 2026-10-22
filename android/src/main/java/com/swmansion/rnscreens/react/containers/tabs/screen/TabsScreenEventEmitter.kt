package com.swmansion.rnscreens.react.containers.tabs.screen

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.core.utils.RNSLog
import com.swmansion.rnscreens.react.common.event.BaseEventEmitter
import com.swmansion.rnscreens.react.containers.tabs.screen.TabsScreenEventEmitter.Companion.TAG
import com.swmansion.rnscreens.react.containers.tabs.screen.event.TabsScreenDidAppearEvent
import com.swmansion.rnscreens.react.containers.tabs.screen.event.TabsScreenDidDisappearEvent
import com.swmansion.rnscreens.react.containers.tabs.screen.event.TabsScreenWillAppearEvent
import com.swmansion.rnscreens.react.containers.tabs.screen.event.TabsScreenWillDisappearEvent

internal class TabsScreenEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag),
    ViewAppearanceEventEmitter {
    override fun emitOnWillAppear() {
        logEventDispatch(viewTag, TabsScreenWillAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabsScreenWillAppearEvent(surfaceId, viewTag))
    }

    override fun emitOnDidAppear() {
        logEventDispatch(viewTag, TabsScreenDidAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabsScreenDidAppearEvent(surfaceId, viewTag))
    }

    override fun emitOnWillDisappear() {
        logEventDispatch(viewTag, TabsScreenWillDisappearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher.dispatchEvent(TabsScreenWillDisappearEvent(surfaceId, viewTag))
    }

    override fun emitOnDidDisappear() {
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
