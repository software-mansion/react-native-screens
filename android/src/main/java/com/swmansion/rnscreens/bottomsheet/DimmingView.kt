package com.swmansion.rnscreens.bottomsheet

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactCompoundViewGroup
import com.facebook.react.uimanager.ReactPointerEventsView
import com.swmansion.rnscreens.ext.equalWithRespectToEps

/**
 * Serves as dimming view that can be used as background for some view that not fully fills
 * the viewport.
 *
 * This dimming view has one more additional feature: it blocks gestures if its alpha > 0.
 */
@SuppressLint("ViewConstructor") // Only we instantiate this view
class DimmingView(
    context: Context,
    initialAlpha: Float = 0.6F,
) : ViewGroup(context),
    ReactCompoundViewGroup,
    ReactPointerEventsView {
    private val blockGestures
        get() = !alpha.equalWithRespectToEps(0F)

    init {
        setBackgroundColor(Color.BLACK)
        alpha = initialAlpha
    }

    // This view group is not supposed to have any children, however we need it to be a view group
    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        if (blockGestures) {
            callOnClick()
        }
        return blockGestures
    }

    override fun reactTagForTouch(
        x: Float,
        y: Float,
    ): Int = throw IllegalStateException("[RNScreens] $TAG should never be asked for the view tag!")

    override fun interceptsTouchEvent(
        x: Float,
        y: Float,
    ) = blockGestures

    override fun getPointerEvents(): PointerEvents =
        if (blockGestures) PointerEvents.AUTO else PointerEvents.NONE

    companion object {
        const val TAG = "DimmingView"
    }
}
