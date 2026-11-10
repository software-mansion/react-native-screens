package com.swmansion.rnscreens.react.common.event

import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.swmansion.rnscreens.core.utils.FragmentTransactionScope

/**
 * Event dispatcher listeners run synchronously and can mount views, so on the UI thread events wait
 * until no fragment transaction executes, see [FragmentTransactionScope].
 */
internal class TransactionSafeEventDispatcher(
    private val eventDispatcher: EventDispatcher,
) : EventDispatcher by eventDispatcher {
    override fun dispatchEvent(event: Event<*>) {
        if (UiThreadUtil.isOnUiThread()) {
            FragmentTransactionScope.runOutsideTransactions { eventDispatcher.dispatchEvent(event) }
        } else {
            eventDispatcher.dispatchEvent(event)
        }
    }

    companion object {
        fun forReactTag(
            reactContext: ReactContext,
            reactTag: Int,
        ): EventDispatcher? =
            UIManagerHelper
                .getEventDispatcherForReactTag(reactContext, reactTag)
                ?.let(::TransactionSafeEventDispatcher)
    }
}
