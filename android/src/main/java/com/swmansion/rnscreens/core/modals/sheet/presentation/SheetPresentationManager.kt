package com.swmansion.rnscreens.core.modals.sheet.presentation

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.util.Log
import android.view.View
import androidx.core.view.doOnPreDraw
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter

internal class SheetPresentationManager(
    private val presentationFactory: () -> SheetPresentation,
    private val dimmingManager: SheetDimmingManager,
    private val onNativeDismiss: () -> Unit,
    private val onDismiss: () -> Unit,
) {
    internal var appearanceEventEmitter: ViewAppearanceEventEmitter? = null

    internal var currentPresentation: SheetPresentation? = null
        private set

    private val bottomSheetView: View?
        get() = currentPresentation?.bottomSheetView

    private var state = SheetPresentationState.DISMISSED
    private var shouldBeOpen = false
    private var shouldSkipExitAnimation = false

    private var dismissalOrigin = SheetDismissalOrigin.UNSPECIFIED

    private val animatorFactory = SheetAnimatorFactory(dimmingManager)
    private var currentSheetAnimator: Animator? = null

    internal fun requestProgrammaticStateUpdate(shouldBeOpen: Boolean) {
        if (shouldBeOpen) {
            handlePresent()
        } else {
            handleProgrammaticDismiss()
        }
    }

    private fun handlePresent() {
        updatePresentationState(shouldBeOpen = true, origin = SheetDismissalOrigin.UNSPECIFIED)
    }

    private fun handleProgrammaticDismiss() {
        updatePresentationState(shouldBeOpen = false, origin = SheetDismissalOrigin.PROGRAMMATIC_JS)
    }

    internal fun handleNativeDismiss() {
        if (state == SheetPresentationState.DISMISSING || state == SheetPresentationState.DISMISSED) {
            return
        }

        updatePresentationState(shouldBeOpen = false, origin = SheetDismissalOrigin.USER)
    }

    private fun updatePresentationState(
        shouldBeOpen: Boolean,
        origin: SheetDismissalOrigin,
    ) {
        // The origin belongs to the request that transitioned the target to closed -
        // a repeated close request must not override it. Once a dismissal is in flight,
        // it keeps the origin that started it until the completion events are emitted.
        val isRepeatCloseRequest = !shouldBeOpen && !this.shouldBeOpen
        if (state != SheetPresentationState.DISMISSING && !isRepeatCloseRequest) {
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
        if (state != SheetPresentationState.DISMISSED) {
            return
        }

        state = SheetPresentationState.PRESENTING
        val presentation = presentationFactory().also { currentPresentation = it }
        presentation.sheetBehavior?.let(dimmingManager::attachToBehavior)

        SheetStackRegistry.register(this)
        appearanceEventEmitter?.emitOnWillAppear()
        presentation.bottomSheetView?.let(::keepOffscreenUntilEnterAnimation)
        presentation.dialog.setOnShowListener {
            presentation.dialog.setOnShowListener(null)

            // Every sheet dims the surface inside the window below, attaching an overlay to the sheet
            // directly below in the stack, or to the DecorView when this sheet is the
            // bottom-most one.
            dimmingManager.attachDimming(SheetStackRegistry.sheetBelow(this)?.bottomSheetView)

            startEnterAnimation()
        }
        presentation.dialog.show()
    }

    private fun dismissIfNeeded() {
        if (state != SheetPresentationState.PRESENTED) {
            return
        }

        state = SheetPresentationState.DISMISSING
        currentPresentation?.setKeyboardTrackingEnabled(false)
        dismissSheetsAbove()
        // Leaving the stack immediately is deliberate, if another sheet is presented during this exit animation,
        // it must stack on a "stable" sheet - the one we don't intend to dismiss. This window is about to be
        // torn down.
        SheetStackRegistry.unregister(this)
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
        SheetStackRegistry.sheetsAbove(this).asReversed().forEach {
            it.handleDismissFromCascade()
        }
    }

    private fun handleDismissFromCascade() {
        if (state == SheetPresentationState.DISMISSING || state == SheetPresentationState.DISMISSED) {
            return
        }

        shouldSkipExitAnimation = true
        updatePresentationState(false, SheetDismissalOrigin.USER)
    }

    private fun performInstantDismiss() {
        currentSheetAnimator?.removeAllListeners()
        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        performDismiss()
    }

    /**
     * `Dialog.show()` **posts** the show message behind the sync barrier of the traversal scheduled while
     * adding the decor to the window, so the Dialog always draws its first frame before `OnShowListener`
     * (with our custom enter animation) runs. A freshly created sheet rests at `translationY = 0`, so that
     * frame would show it at its final position and the enter animator would then snap it back
     * off-screen.
     *
     * Applying the translation on the first pre-draw - after the layout, when the sheet height is
     * already known, but before anything is drawn - keeps the sheet off-screen from the very first frame.
     */
    private fun keepOffscreenUntilEnterAnimation(view: View) {
        view.doOnPreDraw {
            if (currentSheetAnimator == null) {
                view.translationY = view.height.toFloat()
            }
        }
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
        currentPresentation?.destroy()
        currentPresentation = null
        onDismissComplete()
    }

    private fun onPresentationComplete() {
        if (state == SheetPresentationState.PRESENTING) {
            state = SheetPresentationState.PRESENTED
            currentPresentation?.setKeyboardTrackingEnabled(true)
            appearanceEventEmitter?.emitOnDidAppear()
            // ensure state hasn't updated during presentation
            resolvePresentationState()
        }
    }

    private fun onDismissComplete() {
        if (state == SheetPresentationState.DISMISSING) {
            state = SheetPresentationState.DISMISSED
            appearanceEventEmitter?.emitOnDidDisappear()

            when (dismissalOrigin) {
                SheetDismissalOrigin.USER -> onNativeDismiss()
                SheetDismissalOrigin.PROGRAMMATIC_JS -> onDismiss()
                SheetDismissalOrigin.UNSPECIFIED ->
                    Log.e(
                        "[RNScreens]",
                        "Sheet dismissal completed without a recorded origin; no dismissal event emitted",
                    )
            }
            dismissalOrigin = SheetDismissalOrigin.UNSPECIFIED

            // ensure state hasn't updated during dismissal
            resolvePresentationState()
        }
    }

    internal fun destroy() {
        SheetStackRegistry.unregister(this)
        dimmingManager.detachDimming()

        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        currentPresentation?.destroy()
        currentPresentation = null

        state = SheetPresentationState.DISMISSED
    }
}
