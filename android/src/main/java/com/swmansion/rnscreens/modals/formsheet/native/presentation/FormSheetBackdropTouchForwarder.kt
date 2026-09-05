package com.swmansion.rnscreens.modals.formsheet.native.presentation

import android.annotation.SuppressLint
import android.view.MotionEvent
import android.view.View
import android.view.Window

/**
 * Routes touches landing on the sheet's backdrop (Material's `touch_outside` view) to the window
 * below while the backdrop is undimmed. A dimmed backdrop keeps Material's default handling, i.e.
 * a tap cancels the Dialog.
 *
 * The routing is decided on ACTION_DOWN and kept for the whole gesture, so the window that
 * received the DOWN also receives the matching MOVE / UP / CANCEL events.
 */
internal class FormSheetBackdropTouchForwarder(
    private val backdropView: View,
    private val isBackdropDimmed: () -> Boolean,
    private val resolveWindowBelow: () -> Window?,
) : View.OnTouchListener,
    View.OnAttachStateChangeListener {
    private var forwardingWindow: Window? = null
    private var lastForwardedEvent: MotionEvent? = null

    internal fun setup() {
        backdropView.setOnTouchListener(this)
        backdropView.addOnAttachStateChangeListener(this)
    }

    internal fun destroy() {
        backdropView.setOnTouchListener(null)
        backdropView.removeOnAttachStateChangeListener(this)
        cancelForwardedGesture()
    }

    // Forwarded gestures intentionally bypass the backdrop's click handling.
    @SuppressLint("ClickableViewAccessibility")
    override fun onTouch(
        view: View,
        event: MotionEvent,
    ): Boolean {
        if (event.actionMasked == MotionEvent.ACTION_DOWN) {
            forwardingWindow = if (isBackdropDimmed()) null else resolveWindowBelow()
        }
        val window = forwardingWindow ?: return false

        forwardTouch(event, window)

        if (event.actionMasked == MotionEvent.ACTION_UP || event.actionMasked == MotionEvent.ACTION_CANCEL) {
            endForwardedGesture()
        }
        return true
    }

    override fun onViewAttachedToWindow(view: View) = Unit

    // The dialog window is being torn down mid-gesture (e.g. the sheet got dismissed from JS);
    // the target would otherwise never receive the end of the gesture.
    override fun onViewDetachedFromWindow(view: View) = cancelForwardedGesture()

    private fun forwardTouch(
        event: MotionEvent,
        window: Window,
    ) {
        val forwarded = MotionEvent.obtain(event)
        // Both windows live in screen space; re-express the event relative to the target's decor.
        val backdropOrigin = IntArray(2).also { backdropView.getLocationOnScreen(it) }
        val targetOrigin = IntArray(2).also { window.decorView.getLocationOnScreen(it) }
        forwarded.offsetLocation(
            (backdropOrigin[0] - targetOrigin[0]).toFloat(),
            (backdropOrigin[1] - targetOrigin[1]).toFloat(),
        )
        dispatch(forwarded, window)

        lastForwardedEvent?.recycle()
        lastForwardedEvent = forwarded
    }

    private fun cancelForwardedGesture() {
        val window = forwardingWindow ?: return
        lastForwardedEvent?.let { lastEvent ->
            val cancelEvent = MotionEvent.obtain(lastEvent).apply { action = MotionEvent.ACTION_CANCEL }
            dispatch(cancelEvent, window)
            cancelEvent.recycle()
        }
        endForwardedGesture()
    }

    private fun endForwardedGesture() {
        forwardingWindow = null
        lastForwardedEvent?.recycle()
        lastForwardedEvent = null
    }

    // Dispatching through the window callback (the Activity / Dialog) keeps their own hooks, e.g.
    // Activity.onUserInteraction, in the loop. Falls back to the decor for callback-less windows.
    private fun dispatch(
        event: MotionEvent,
        window: Window,
    ) {
        window.callback?.dispatchTouchEvent(event) ?: window.decorView.dispatchTouchEvent(event)
    }
}
