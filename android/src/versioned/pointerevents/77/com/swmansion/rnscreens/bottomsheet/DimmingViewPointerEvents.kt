package com.swmansion.rnscreens.bottomsheet

import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView

internal class DimmingViewPointerEventsImpl(
    val dimmingView: DimmingView,
) : ReactPointerEventsView {
    override fun getPointerEvents(): PointerEvents = if (dimmingView.blockGestures) PointerEvents.AUTO else PointerEvents.NONE
}

internal class DimmingViewPointerEventsProxy(
    var pointerEventsImpl: DimmingViewPointerEventsImpl?,
) : ReactPointerEventsView {
    override fun getPointerEvents(): PointerEvents = pointerEventsImpl?.pointerEvents ?: PointerEvents.NONE
}
