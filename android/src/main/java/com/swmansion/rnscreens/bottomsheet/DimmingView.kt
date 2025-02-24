package com.swmansion.rnscreens.bottomsheet

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.uimanager.ReactCompoundViewGroup
import com.facebook.react.uimanager.ReactPointerEventsView
import com.swmansion.rnscreens.ext.equalWithRespectToEps

/**
 * Serves as dimming view that can be used as background for some view that does not fully fill
 * the viewport.
 *
 * This dimming view has one more additional feature: it blocks gestures if its alpha > 0.
 */
@SuppressLint("ViewConstructor") // Only we instantiate this view
internal class DimmingView(
    context: Context,
    initialAlpha: Float = 0.6F,
    private val pointerEventsProxy: DimmingViewPointerEventsProxy
) : ViewGroup(context),
    ReactCompoundViewGroup,
    ReactPointerEventsView by pointerEventsProxy {

    constructor(context: Context, initialAlpha: Float = 0.6F) : this(
        context, initialAlpha,
        DimmingViewPointerEventsProxy(null)
    )

    init {
        pointerEventsProxy.pointerEventsImpl = DimmingViewPointerEventsImpl(this)
    }

    internal val blockGestures
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

    // We do not want to have any action defined here. We just want listeners notified that the click happened.
    @SuppressLint("ClickableViewAccessibility")
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

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()

        // Break reference cycle, since the pointerEventsImpl strongly retains this.
        pointerEventsProxy.pointerEventsImpl = null
    }

    companion object {
        const val TAG = "DimmingView"
    }
}
