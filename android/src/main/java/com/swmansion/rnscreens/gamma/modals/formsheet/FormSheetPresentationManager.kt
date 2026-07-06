package com.swmansion.rnscreens.gamma.modals.formsheet

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetPresentationManager(
    private val dialog: FormSheetDialog,
    private val bottomSheetView: View?,
    private val dimmingManager: DimmingViewManager,
    private val onNativeDismiss: () -> Unit,
) {
    private var state = FormSheetPresentationState.DISMISSED
    private var targetIsOpen = false

    private val animatorFactory = FormSheetAnimatorFactory(dimmingManager)
    private var currentSheetAnimator: Animator? = null

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
        dialog.setOnShowListener {
            dialog.setOnShowListener(null)
            dimmingManager.onDialogShow()

            if (bottomSheetView == null) {
                onPresentationComplete()
                return@setOnShowListener
            }

            val isInterrupting = currentSheetAnimator?.isRunning == true
            currentSheetAnimator?.cancel()

            currentSheetAnimator = animatorFactory.createEnterAnimator(bottomSheetView, isInterrupting).apply {
                addListener(object : AnimatorListenerAdapter() {
                    override fun onAnimationEnd(animation: Animator) {
                        if (currentSheetAnimator == this@apply) currentSheetAnimator = null
                        onPresentationComplete()
                    }
                })
                start()
            }
        }
        dialog.show()
    }

    private fun dismissIfNeeded() {
        if (state != FormSheetPresentationState.PRESENTED) {
            return
        }

        state = FormSheetPresentationState.DISMISSING

        if (bottomSheetView == null) {
            dialog.dismiss()
            onDismissComplete()
            return
        }

        val behavior = BottomSheetBehavior.from(bottomSheetView)
        if (behavior.state == BottomSheetBehavior.STATE_HIDDEN) {
            dialog.dismiss()
            onDismissComplete()
            return
        }

        val isInterrupting = currentSheetAnimator?.isRunning == true
        currentSheetAnimator?.cancel()

        currentSheetAnimator = animatorFactory.createExitAnimator(bottomSheetView, isInterrupting).apply {
            addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    if (currentSheetAnimator == this@apply) currentSheetAnimator = null
                    dialog.dismiss()
                    onDismissComplete()
                }
            })
            start()
        }
    }

    private fun onPresentationComplete() {
        if (state == FormSheetPresentationState.PRESENTING) {
            state = FormSheetPresentationState.PRESENTED
            // ensure state hasn't updated during presentation
            resolvePresentationState()
        }
    }

    private fun onDismissComplete() {
        if (state == FormSheetPresentationState.DISMISSING) {
            state = FormSheetPresentationState.DISMISSED
            // ensure state hasn't updated during dismissal
            resolvePresentationState()
        }
    }

    internal fun handleNativeDismiss() {
        if (state == FormSheetPresentationState.DISMISSING || state == FormSheetPresentationState.DISMISSED) {
            return
        }

        onNativeDismiss()
        updatePresentationState(isOpen = false)
    }

    internal fun destroy() {
        currentSheetAnimator?.cancel()
        currentSheetAnimator = null

        dialog.setOnShowListener(null)

        state = FormSheetPresentationState.DISMISSED
    }
}
