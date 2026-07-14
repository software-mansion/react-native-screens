package com.swmansion.rnscreens.gamma.modals.formsheet

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.gamma.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetPresentationManager(
    private val dialog: FormSheetDialog,
    private val bottomSheetView: View?,
    private val dimmingManager: DimmingViewManager,
    private val onNativeDismiss: () -> Unit,
) {
    internal var appearanceEventEmitter: ViewAppearanceEventEmitter? = null

    private var state = FormSheetPresentationState.DISMISSED
    private var targetIsOpen = false

    private val animatorFactory = FormSheetAnimatorFactory(dimmingManager)
    private var currentSheetAnimator: Animator? = null

    private val nativeDismissCoordinator =
        FormSheetNativeDismissCoordinator(
            dialog = dialog,
            dimmingManager = dimmingManager,
            onNativeDismiss = { handleNativeDismiss() },
        )

    internal fun setup() {
        bottomSheetView?.let { view ->
            dimmingManager.attachToBehavior(BottomSheetBehavior.from(view))
        }
        nativeDismissCoordinator.setup()
    }

    internal fun updatePresentationState(isOpen: Boolean) {
        targetIsOpen = isOpen
        resolvePresentationState()
    }

    private fun resolvePresentationState() {
        if (targetIsOpen) {
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
        appearanceEventEmitter?.emitOnWillDisappear()

        val isSheetHidden =
            bottomSheetView?.let {
                BottomSheetBehavior.from(it).state == BottomSheetBehavior.STATE_HIDDEN
            } ?: true

        if (isSheetHidden) {
            performDismiss()
            return
        }

        startExitAnimation()
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
            // ensure state hasn't updated during dismissal
            resolvePresentationState()
        }
    }

    private fun handleNativeDismiss() {
        if (state == FormSheetPresentationState.DISMISSING || state == FormSheetPresentationState.DISMISSED) {
            return
        }

        onNativeDismiss()
        updatePresentationState(isOpen = false)
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
        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        dialog.setOnShowListener(null)

        state = FormSheetPresentationState.DISMISSED

        nativeDismissCoordinator.destroy()
    }
}
