package com.swmansion.rnscreens.modals.formsheet.react.host

import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.common.ShadowStateProxy
import com.swmansion.rnscreens.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.helpers.createTransactionWithReordering
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetDialogManager
import com.swmansion.rnscreens.modals.formsheet.native.interfaces.FormSheetPresentationObserver
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetConfig
import java.lang.ref.WeakReference

class FormSheetHost(
    val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    ReactPointerEventsView {
    private val shadowStateProxy = ShadowStateProxy()

    internal var stateWrapper by shadowStateProxy::stateWrapper

    internal lateinit var eventEmitter: FormSheetHostEventEmitter

    internal var isOpen = false

    internal var prefersGrabberVisible = false

    internal var preferredCornerRadius = FormSheetConfig.SYSTEM_DEFAULT_CORNER_RADIUS

    internal var preventNativeDismiss = false

    internal var nativeContainerBackgroundColor: Int? = null

    internal var detents: List<Double> = emptyList()

    internal var initialDetentIndex: Int = 0

    private val sheetContentView =
        FormSheetContentView(context) { width, height ->
            updateStateIfNeeded(width, height)
        }

    private val dialogManager =
        FormSheetDialogManager(
            context = context,
            contentView = sheetContentView,
        )

    private val contentFragment = FormSheetContentFragment(sheetContentView)

    private var isPresented = false

    private var primaryNavigationFragmentToRestore: WeakReference<Fragment>? = null

    private val presentationObserver =
        object : FormSheetPresentationObserver {
            override fun onPresentationStarted() {
                isPresented = true
                takePrimaryNavigationIfNeeded()
            }

            override fun onDismissalCompleted() {
                isPresented = false
                restorePrimaryNavigationIfNeeded()
            }
        }

    init {
        sheetContentView.contentSizeChangeDelegate = dialogManager.contentSizeChangeDelegate
        sheetContentView.contentFragment = contentFragment
        dialogManager.presentationObserver = presentationObserver
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        attachContentFragmentIfNeeded()
    }

    private fun attachContentFragmentIfNeeded() {
        if (contentFragment.isAdded) {
            return
        }

        val fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't attach FormSheet content fragment"
            }

        fragmentManager
            .createTransactionWithReordering()
            .add(contentFragment, null)
            .commitNowAllowingStateLoss()

        if (isPresented) {
            takePrimaryNavigationIfNeeded()
        }

        dialogManager.nestedBackCoordinator.attachNestedContent(contentFragment)
    }

    // FragmentManager enables back stack handling of a nested FragmentManager only when the parent
    // fragment is the primary navigation fragment, so the content fragment takes that role for as
    // long as the sheet is considered as presented (PRESENTING -> PRESENTED -> DISMISSING -> DISMISSED).
    private fun takePrimaryNavigationIfNeeded() {
        if (!contentFragment.isAdded) {
            return
        }

        val fragmentManager = contentFragment.parentFragmentManager
        if (fragmentManager.primaryNavigationFragment === contentFragment) {
            return
        }

        primaryNavigationFragmentToRestore = fragmentManager.primaryNavigationFragment?.let { WeakReference(it) }
        fragmentManager
            .createTransactionWithReordering()
            .setPrimaryNavigationFragment(contentFragment)
            .commitNowAllowingStateLoss()
        dialogManager.nestedBackCoordinator.invalidate()
    }

    private fun restorePrimaryNavigationIfNeeded() {
        val fragmentToRestore = primaryNavigationFragmentToRestore?.get()?.takeIf { it.isAdded }
        primaryNavigationFragmentToRestore = null

        if (!contentFragment.isAdded) {
            return
        }

        val fragmentManager = contentFragment.parentFragmentManager
        if (fragmentManager.isDestroyed || fragmentManager.primaryNavigationFragment !== contentFragment) {
            return
        }

        fragmentManager
            .createTransactionWithReordering()
            .setPrimaryNavigationFragment(fragmentToRestore)
            .commitNowAllowingStateLoss()
        dialogManager.nestedBackCoordinator.invalidate()
    }

    private fun detachContentFragmentIfNeeded() {
        if (!contentFragment.isAdded) {
            return
        }

        val fragmentManager = contentFragment.parentFragmentManager
        if (fragmentManager.isDestroyed) {
            return
        }

        dialogManager.nestedBackCoordinator.detachNestedContent()
        restorePrimaryNavigationIfNeeded()
        fragmentManager
            .createTransactionWithReordering()
            .remove(contentFragment)
            .commitNowAllowingStateLoss()
    }

    internal fun mountReactSubviewAt(
        child: View,
        index: Int,
    ) {
        sheetContentView.addView(child, index)
    }

    internal fun unmountReactSubview(child: View) {
        sheetContentView.removeView(child)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        sheetContentView.removeViewAt(index)
    }

    internal fun unmountAllReactSubviews() {
        sheetContentView.removeAllViews()
    }

    internal fun getReactSubviewCount(): Int = sheetContentView.childCount

    internal fun getReactSubviewAt(index: Int): View? = sheetContentView.getChildAt(index)

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
        dialogManager.eventEmitter = eventEmitter
    }

    internal fun onAfterUpdateTransaction() {
        val config =
            FormSheetConfig(
                isOpen = this.isOpen,
                detents = this.detents,
                prefersGrabberVisible = this.prefersGrabberVisible,
                initialDetentIndex = this.initialDetentIndex,
                preferredCornerRadius = this.preferredCornerRadius,
                preventNativeDismiss = this.preventNativeDismiss,
                nativeContainerBackgroundColor = this.nativeContainerBackgroundColor,
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
        detachContentFragmentIfNeeded()
        dialogManager.destroy()
    }
}
