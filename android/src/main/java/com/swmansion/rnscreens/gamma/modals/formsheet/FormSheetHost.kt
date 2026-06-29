package com.swmansion.rnscreens.gamma.modals.formsheet

import android.view.View
import android.view.ViewGroup
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy

class FormSheetHost(
    val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    ReactPointerEventsView {
    private val dialogManager =
        FormSheetDialogManager(
            context = context,
            onUpdateState = ::updateStateIfNeeded,
            onDismissRequest = ::onNativeDismiss,
        )

    private val shadowStateProxy = ShadowStateProxy()

    internal var stateWrapper by shadowStateProxy::stateWrapper

    internal lateinit var eventEmitter: FormSheetHostEventEmitter

    internal var isOpen = false

    internal var prefersGrabberVisible = false

    internal fun onNativeDismiss() {
        this.isOpen = false
        eventEmitter.emitOnNativeDismissEvent()
    }

    internal fun mountReactSubviewAt(
        child: View,
        index: Int,
    ) {
        dialogManager.contentView.addView(child, index)
    }

    internal fun unmountReactSubview(child: View) {
        dialogManager.contentView.removeView(child)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        dialogManager.contentView.removeViewAt(index)
    }

    internal fun unmountAllReactSubviews() {
        dialogManager.contentView.removeAllViews()
    }

    internal fun getReactSubviewCount(): Int = dialogManager.contentView.childCount

    internal fun getReactSubviewAt(index: Int): View? = dialogManager.contentView.getChildAt(index)

    // The React children are teleported into the dialog window. This host occupies space in the
    // main window, but holds no content there. NONE makes the host subtree invisible to
    // hit-testing so touches reach the views behind it.
    override val pointerEvents: PointerEvents = PointerEvents.NONE

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    internal fun onViewManagerAddEventEmitters() {
        check(id != NO_ID) { "[RNScreens] FormSheetHost must have its tag set when registering event emitters" }
        eventEmitter = FormSheetHostEventEmitter(reactContext, id)
    }

    internal fun onAfterUpdateTransaction() {
        val config = FormSheetConfig(
            isOpen = this.isOpen,
            prefersGrabberVisible = this.prefersGrabberVisible,
        )
        dialogManager.applyConfig(config)
    }

    internal fun updateStateIfNeeded(
        width: Int,
        height: Int,
    ) {
        shadowStateProxy.updateStateIfNeeded(
            density = resources.displayMetrics.density,
            frameWidth = width,
            frameHeight = height,
        )
        flushPendingStateUpdates()
    }

    // We trigger a synchronous flush event to force the layout recalculation.
    // However, while the calculation is synchronous, the actual UI mounting in Android isn't.
    // The synchronous flush makes a request to the EventBeat. Because EventBeat is controlled
    // by a frame callback on the Choreographer, if we are currently inside the
    // traversal phase, the actual mounting callback will be executed on the next frame.
    // To prevent drawing a stale layout, we block drawing the frame in `FormSheetContentView`.
    private fun flushPendingStateUpdates() {
        eventEmitter.emitOnSyncFlushEvent()
    }

    internal fun destroy() {
        dialogManager.destroy()
    }
}
