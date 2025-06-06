package com.swmansion.rnscreens

import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView

internal class PointerEventsBoxNoneImpl() : ReactPointerEventsView {
    // We set pointer events to BOX_NONE, because we don't want the ScreensCoordinatorLayout
    // to be target of react gestures and effectively prevent interaction with screens
    // underneath the current screen (useful in `modal` & `formSheet` presentation).
    override val pointerEvents: PointerEvents = PointerEvents.BOX_NONE
}
