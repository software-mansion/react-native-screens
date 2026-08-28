package com.swmansion.rnscreens.modals.formsheet.native.presentation

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.util.Log
import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.common.event.ViewAppearanceEventEmitter

internal class FormSheetPresentationManager(
    private val presentationFactory: () -> FormSheetPresentation,
    private val dimmingManager: FormSheetDimmingManager,
    private val onNativeDismiss: () -> Unit,
    private val onDismiss: () -> Unit,
) {
    internal var appearanceEventEmitter: ViewAppearanceEventEmitter? = null

    internal var presentation: FormSheetPresentation? = null
        private set

    private val bottomSheetView: View?
        get() = presentation?.bottomSheetView

    private var state = FormSheetPresentationState.DISMISSED
    private var shouldBeOpen = false
    private var shouldSkipExitAnimation = false

    private var dismissalOrigin = FormSheetDismissalOrigin.UNSPECIFIED

    private val animatorFactory = FormSheetAnimatorFactory(dimmingManager)
    private var currentSheetAnimator: Animator? = null

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
        val presentation = presentationFactory().also { presentation = it }
        presentation.sheetBehavior?.let(dimmingManager::attachToBehavior)

        FormSheetStackRegistry.register(this)
        appearanceEventEmitter?.emitOnWillAppear()
        presentation.dialog.setOnShowListener {
            presentation.dialog.setOnShowListener(null)

            // Every sheet dims the surface inside the window below, attaching an overlay to the sheet
            // directly below in the stack, or to the DecorView when this sheet is the
            // bottom-most one.
            dimmingManager.attachDimming(FormSheetStackRegistry.sheetBelow(this)?.bottomSheetView)

            startEnterAnimation()
        }
        presentation.dialog.show()
    }

    private fun dismissIfNeeded() {
        if (state != FormSheetPresentationState.PRESENTED) {
            return
        }

        state = FormSheetPresentationState.DISMISSING
        dismissSheetsAbove()
        // Leaving the stack immediately is deliberate, if another sheet is presented during this exit animation,
        // it must stack on a "stable" sheet - the one we don't intend to dismiss. This window is about to be
        // torn down.
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
        updatePresentationState(false, FormSheetDismissalOrigin.USER)
    }

    private fun performInstantDismiss() {
        currentSheetAnimator?.removeAllListeners()
        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        performDismiss()
    }

    private fun startEnterAnimation() {
        val bottomSheetView = bottomSheetView
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
        val bottomSheetView = bottomSheetView
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
                            performDismiss()
                        }
                    },
                )
                start()
            }
    }

    private fun performDismiss() {
        shouldSkipExitAnimation = false
        dimmingManager.detachDimming()
        presentation?.destroy()
        presentation = null
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

    internal fun destroy() {
        FormSheetStackRegistry.unregister(this)
        dimmingManager.detachDimming()

        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        presentation?.destroy()
        presentation = null

        state = FormSheetPresentationState.DISMISSED
    }
}
