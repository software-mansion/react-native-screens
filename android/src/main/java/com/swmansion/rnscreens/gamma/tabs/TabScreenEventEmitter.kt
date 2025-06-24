package com.swmansion.rnscreens.gamma.tabs

import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher
import com.swmansion.rnscreens.gamma.tabs.TabScreenEventEmitter.Companion.TAG
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabScreenWillDisappearEvent

class TabScreenEventEmitter(val reactContext: ReactContext) {
    var viewTag: Int = View.NO_ID

    private val reactEventDispatcher: EventDispatcher?
        get() {
            // Lets assert for now to make sure we won't miss event delivery
            checkValidViewTag()
            return UIManagerHelper.getEventDispatcherForReactTag(reactContext, viewTag)
        }

    private val surfaceId: Int
        get() = UIManagerHelper.getSurfaceId(reactContext)

    fun emitOnWillAppear() {
        checkValidViewTag()
        logEventDispatch(viewTag, TabScreenWillAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher?.dispatchEvent(TabScreenWillAppearEvent(surfaceId, viewTag))
    }

    fun emitOnDidAppear() {
        checkValidViewTag()
        logEventDispatch(viewTag, TabScreenDidAppearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher?.dispatchEvent(TabScreenDidAppearEvent(surfaceId, viewTag))
    }

    fun emitOnWillDisappear() {
        checkValidViewTag()
        logEventDispatch(viewTag, TabScreenWillDisappearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher?.dispatchEvent(TabScreenWillDisappearEvent(surfaceId, viewTag))
    }

    fun emitOnDidDisappear() {
        checkValidViewTag()
        logEventDispatch(viewTag, TabScreenDidDisappearEvent.EVENT_REGISTRATION_NAME)
        reactEventDispatcher?.dispatchEvent(TabScreenDidDisappearEvent(surfaceId, viewTag))
    }

    private fun checkValidViewTag() {
        check(viewTag != View.NO_ID) { "[RNScreens] Attempt to use viewTag before the value was provided"}
    }

    companion object {
        const val TAG = "TabScreenEventEmitter"
    }
}

private fun logEventDispatch(viewTag: Int, eventName: String) {
    Log.d(TAG, "TabScreen [$viewTag] emits event: $eventName")
}
