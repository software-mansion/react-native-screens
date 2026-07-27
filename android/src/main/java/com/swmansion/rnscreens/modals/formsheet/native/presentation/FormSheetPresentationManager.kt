package com.swmansion.rnscreens.modals.formsheet.native.presentation

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.util.Log
import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.modals.dimmingview.DimmingViewManager
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetDialog

internal class FormSheetPresentationManager(
    private val dialog: FormSheetDialog,
    private val bottomSheetView: View?,
    private val dimmingManager: DimmingViewManager,
    private val onNativeDismiss: () -> Unit,
    private val onDismiss: () -> Unit,
) {
    internal var appearanceEventEmitter: ViewAppearanceEventEmitter? = null

    private var state = FormSheetPresentationState.DISMISSED
    private var shouldBeOpen = false
    private var shouldSkipExitAnimation = false

    private var dismissalOrigin = FormSheetDismissalOrigin.UNSPECIFIED

    private val animatorFactory = FormSheetAnimatorFactory(dimmingManager)
    private var currentSheetAnimator: Animator? = null

    internal fun setup() {
        bottomSheetView?.let { view ->
            dimmingManager.attachToBehavior(BottomSheetBehavior.from(view))
        }
    }

    internal fun requestProgrammaticStateUpdate(shouldBeOpen: Boolean) {
        if (shouldBeOpen) {
            handlePresent()
        } else {
            handleProgrammaticDismiss()
        }
    }

    private fun handlePresent() {
        updatePresentationState(shouldBeOpen = true, origin = FormSheetDismissalOrigin.UNSPECIFIED)
    }

    private fun handleProgrammaticDismiss() {
        updatePresentationState(shouldBeOpen = false, origin = FormSheetDismissalOrigin.PROGRAMMATIC_JS)
    }

    internal fun handleNativeDismiss() {
        if (state == FormSheetPresentationState.DISMISSING || state == FormSheetPresentationState.DISMISSED) {
            return
        }

        updatePresentationState(shouldBeOpen = false, origin = FormSheetDismissalOrigin.USER)
    }

    private fun updatePresentationState(
        shouldBeOpen: Boolean,
        origin: FormSheetDismissalOrigin,
    ) {
        // The origin belongs to the request that transitioned the target to closed -
        // a repeated close request must not override it. Once a dismissal is in flight,
        // it keeps the origin that started it until the completion events are emitted.
        val isRepeatCloseRequest = !shouldBeOpen && !this.shouldBeOpen
        if (state != FormSheetPresentationState.DISMISSING && !isRepeatCloseRequest) {
            dismissalOrigin = origin
        }
        this.shouldBeOpen = shouldBeOpen
        resolvePresentationState()
    }

    private fun resolvePresentationState() {
        if (shouldBeOpen) {
            presentIfNeeded()
        } else {
            dismissIfNeeded()
        }
    }

    private fun presentIfNeeded() {
        if (state != FormSheetPresentationState.DISMISSED) {
            return
        }

        state = FormSheetPresentationState.PRESENTING
        FormSheetStackRegistry.register(this)
        appearanceEventEmitter?.emitOnWillAppear()
        dialog.setOnShowListener {
            dialog.setOnShowListener(null)
            dimmingManager.onDialogShow()
            startEnterAnimation()
        }
        dialog.show()
    }

    private fun dismissIfNeeded() {
        if (state != FormSheetPresentationState.PRESENTED) {
            return
        }

        state = FormSheetPresentationState.DISMISSING
        dismissSheetsAbove()
        FormSheetStackRegistry.unregister(this)
        appearanceEventEmitter?.emitOnWillDisappear()

        val isSheetHidden =
            bottomSheetView?.let {
                BottomSheetBehavior.from(it).state == BottomSheetBehavior.STATE_HIDDEN
            } ?: true

        if (isSheetHidden) {
            performDismiss()
            return
        }

        if (shouldSkipExitAnimation) {
            performInstantDismiss()
            return
        }

        startExitAnimation()
    }

    // Dismissing a sheet from the middle of the stack should dismiss all sheets above it,
    // mirroring the iOS presentation chain teardown. Sheets are dismissed top-down.
    private fun dismissSheetsAbove() {
        FormSheetStackRegistry.sheetsAbove(this).asReversed().forEach {
            it.handleDismissFromCascade()
        }
    }

    private fun handleDismissFromCascade() {
        if (state == FormSheetPresentationState.DISMISSING || state == FormSheetPresentationState.DISMISSED) {
            return
        }

        shouldSkipExitAnimation = true
        onNativeDismiss()
        updatePresentationState(isOpen = false)
    }

    private fun performInstantDismiss() {
        currentSheetAnimator?.removeAllListeners()
        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        bottomSheetView?.let { syncBehaviorStateAfterExitAnimationComplete(it) }
        performDismiss()
    }

    private fun startEnterAnimation() {
        if (bottomSheetView == null) {
            onPresentationComplete()
            return
        }

        val isInterrupting = currentSheetAnimator?.isRunning == true
        currentSheetAnimator?.removeAllListeners()
        currentSheetAnimator?.cancel()

        dimmingManager.isTransitionAnimationRunning = true

        currentSheetAnimator =
            animatorFactory.createEnterAnimator(bottomSheetView, isInterrupting).apply {
                addListener(
                    object : AnimatorListenerAdapter() {
                        override fun onAnimationEnd(animation: Animator) {
                            dimmingManager.isTransitionAnimationRunning = false

                            if (currentSheetAnimator == this@apply) currentSheetAnimator = null
                            onPresentationComplete()
                        }
                    },
                )
                start()
            }
    }

    private fun startExitAnimation() {
        if (bottomSheetView == null) {
            performDismiss()
            return
        }

        val isInterrupting = currentSheetAnimator?.isRunning == true
        currentSheetAnimator?.removeAllListeners()
        currentSheetAnimator?.cancel()

        dimmingManager.isTransitionAnimationRunning = true

        currentSheetAnimator =
            animatorFactory.createExitAnimator(bottomSheetView, isInterrupting).apply {
                addListener(
                    object : AnimatorListenerAdapter() {
                        override fun onAnimationEnd(animation: Animator) {
                            dimmingManager.isTransitionAnimationRunning = false

                            if (currentSheetAnimator == this@apply) currentSheetAnimator = null
                            syncBehaviorStateAfterExitAnimationComplete(bottomSheetView)
                            performDismiss()
                        }
                    },
                )
                start()
            }
    }

    private fun performDismiss() {
        shouldSkipExitAnimation = false
        dialog.dismiss()
        onDismissComplete()
    }

    private fun onPresentationComplete() {
        if (state == FormSheetPresentationState.PRESENTING) {
            state = FormSheetPresentationState.PRESENTED
            appearanceEventEmitter?.emitOnDidAppear()
            // ensure state hasn't updated during presentation
            resolvePresentationState()
        }
    }

    private fun onDismissComplete() {
        if (state == FormSheetPresentationState.DISMISSING) {
            state = FormSheetPresentationState.DISMISSED
            appearanceEventEmitter?.emitOnDidDisappear()

            when (dismissalOrigin) {
                FormSheetDismissalOrigin.USER -> onNativeDismiss()
                FormSheetDismissalOrigin.PROGRAMMATIC_JS -> onDismiss()
                FormSheetDismissalOrigin.UNSPECIFIED ->
                    Log.e(
                        "[RNScreens]",
                        "FormSheet dismissal completed without a recorded origin; no dismissal event emitted",
                    )
            }
            dismissalOrigin = FormSheetDismissalOrigin.UNSPECIFIED

            // ensure state hasn't updated during dismissal
            resolvePresentationState()
        }
    }

    /**
     * Synchronizes the BottomSheetBehavior state with our custom exit animation.
     *
     * Since our custom ExitAnimator uses `translationY` for visual movement, the physical
     * `top` of the view remains at the top of the screen. If we just call `state = STATE_HIDDEN`,
     * Material will attempt to align the layout and enter `STATE_SETTLING`, leaving the state
     * machine corrupted for the next open.
     *
     * To fix this, we manually push the physical `top` to the bottom of the screen.
     * This makes the behavior skip the animation and synchronously switch to `STATE_HIDDEN`,
     * properly cleaning up its internal state on dismissal.
     */
    private fun syncBehaviorStateAfterExitAnimationComplete(view: View) {
        val behavior = BottomSheetBehavior.from(view)
        val parent = view.parent as? View
        val targetTop = parent?.height ?: view.height

        view.offsetTopAndBottom(targetTop - view.top)
        behavior.state = BottomSheetBehavior.STATE_HIDDEN
    }

    internal fun destroy() {
        FormSheetStackRegistry.unregister(this)

        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        dialog.setOnShowListener(null)

        state = FormSheetPresentationState.DISMISSED
    }
}
