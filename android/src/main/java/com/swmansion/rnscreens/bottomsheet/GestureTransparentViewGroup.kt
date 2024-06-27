package com.swmansion.rnscreens.bottomsheet

import android.content.Context
import android.widget.FrameLayout
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView

class GestureTransparentViewGroup(
    context: Context,
) : FrameLayout(context),
    ReactPointerEventsView {

    override fun getPointerEvents(): PointerEvents = PointerEvents.BOX_NONE

    companion object {
        const val TAG = "GestureTransparentFrameLayout"
    }
}
