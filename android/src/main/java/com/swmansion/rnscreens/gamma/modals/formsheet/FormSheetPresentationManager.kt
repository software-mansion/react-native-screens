package com.swmansion.rnscreens.gamma.modals.formsheet

internal class FormSheetPresentationManager(
    private val performPresent: (onComplete: () -> Unit) -> Unit,
    private val performDismiss: (onComplete: () -> Unit) -> Unit,
    private val onNativeDismiss: () -> Unit,
) {
    private var state = FormSheetPresentationState.DISMISSED
    private var targetIsOpen = false

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
        performPresent {
            if (state == FormSheetPresentationState.PRESENTING) {
                state = FormSheetPresentationState.PRESENTED
                // ensure state hasn't updated during presentation
                resolvePresentationState()
            }
        }
    }

    private fun dismissIfNeeded() {
        if (state != FormSheetPresentationState.PRESENTED) {
            return
        }

        state = FormSheetPresentationState.DISMISSING
        performDismiss {
            if (state == FormSheetPresentationState.DISMISSING) {
                state = FormSheetPresentationState.DISMISSED
                // ensure state hasn't updated during dismissal
                resolvePresentationState()
            }
        }
    }

    internal fun handleNativeDismiss() {
        if (state == FormSheetPresentationState.DISMISSING || state == FormSheetPresentationState.DISMISSED) {
            return
        }

        onNativeDismiss()
        updatePresentationState(isOpen = false)
    }
}
