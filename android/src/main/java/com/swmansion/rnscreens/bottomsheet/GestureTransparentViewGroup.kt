package com.swmansion.rnscreens.bottomsheet

import android.content.Context
import android.widget.FrameLayout
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView

/**
 * View group that will be ignored by RN event system, and won't be target of touches.
 *
 * Currently used as container for the form sheet, so that user can interact with the view
 * under the sheet (otherwise RN captures the gestures).
 */
class GestureTransparentViewGroup(
    context: Context,
) : FrameLayout(context),
    ReactPointerEventsView {
    override fun getPointerEvents(): PointerEvents = PointerEvents.BOX_NONE

    companion object {
        const val TAG = "GestureTransparentFrameLayout"
    }
}
