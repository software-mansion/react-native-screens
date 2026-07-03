package com.swmansion.rnscreens.gamma.modals.formsheet

import android.util.Log

internal class FormSheetPresentationManager(
    private val performPresent: () -> Unit,
    private val performDismiss: () -> Unit,
    private val onNativeDismissComplete: () -> Unit,
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
        performPresent()
    }

    private fun dismissIfNeeded() {
        if (state != FormSheetPresentationState.PRESENTED) {
            return
        }

        state = FormSheetPresentationState.DISMISSING
        performDismiss()
    }

    internal fun handlePresentationCompleted() {
        if (state == FormSheetPresentationState.PRESENTING) {
            state = FormSheetPresentationState.PRESENTED
            // ensure state hasn't changed during presentation
            resolvePresentationState()
        }
    }

    internal fun handleDismissCompleted() {
        if (state == FormSheetPresentationState.DISMISSING) {
            state = FormSheetPresentationState.DISMISSED
            // ensure state hasn't changed during dismissal
            resolvePresentationState()
        }
    }

    internal fun handleNativeDismiss(): Boolean {
        if (state == FormSheetPresentationState.DISMISSING || state == FormSheetPresentationState.DISMISSED) {
            return false
        }

        state = FormSheetPresentationState.DISMISSED
        targetIsOpen = false
        onNativeDismissComplete()
        return true
    }
}
