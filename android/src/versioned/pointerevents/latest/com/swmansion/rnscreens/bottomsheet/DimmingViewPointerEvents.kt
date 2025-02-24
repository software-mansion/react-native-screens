package com.swmansion.rnscreens.bottomsheet

import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView


internal class DimmingViewPointerEventsImpl(val dimmingView: DimmingView) : ReactPointerEventsView {
    override val pointerEvents: PointerEvents
        get() = if (dimmingView.blockGestures == false) PointerEvents.AUTO else PointerEvents.NONE
}

internal class DimmingViewPointerEventsProxy(var pointerEventsImpl: DimmingViewPointerEventsImpl?) :
    ReactPointerEventsView {
    override val pointerEvents: PointerEvents
        get() = pointerEventsImpl?.pointerEvents ?: PointerEvents.NONE
}
