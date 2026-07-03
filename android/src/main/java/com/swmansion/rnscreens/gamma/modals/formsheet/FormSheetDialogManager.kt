package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.util.Log
import android.view.ContextThemeWrapper
import android.view.View
import android.widget.FrameLayout
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

class FormSheetDialogManager(
    context: Context,
    private val contentView: View,
    private val onDismissRequest: () -> Unit,
) {
    private var formSheetConfig = FormSheetConfig()

    internal val invalidationFlags = FormSheetInvalidationFlags()

    private val themedContext =
        ContextThemeWrapper(
            context,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    // Eagerly create the container so it's always ready for the provided content view
    private val container = FormSheetContainer(themedContext, contentView)

    // Eagerly create the dialog and attach the container
    private val dialog =
        FormSheetDialog(themedContext).apply {
            setContentView(container)
            setCanceledOnTouchOutside(false)
        }

    private val bottomSheetView = dialog.findViewById<FrameLayout>(com.google.android.material.R.id.design_bottom_sheet)

    private val behaviorController =
        bottomSheetView?.let { FormSheetBehaviorController(it) }

    private val dimmingManager = DimmingViewManager(context, dialog)

    private val dimensionsCoordinator =
        FormSheetDimensionsCoordinator(
            dialog = dialog,
            container = container,
            bottomSheetView = bottomSheetView,
            behaviorController = behaviorController,
        )

    private val presentationManager =
        FormSheetPresentationManager(
            dialog = dialog,
            bottomSheetView = bottomSheetView,
            dimmingManager = dimmingManager,
            onNativeDismiss = onDismissRequest,
        )

    init {
        presentationManager.setup()
        dimensionsCoordinator.setup()
    }

    internal fun applyConfig(newConfig: FormSheetConfig) {
        if (formSheetConfig.isOpen != newConfig.isOpen) {
            invalidationFlags.isPresentationInvalidated = true
            if (newConfig.isOpen) {
                // ALWAYS refresh the sheet configuration when reopening to ensure that BottomSheet
                // state and layout are synchronized with native behavior.
                invalidationFlags.isAppearanceInvalidated = true
                invalidationFlags.isBehaviorInvalidated = true
            }
        }

        if (formSheetConfig.prefersGrabberVisible != newConfig.prefersGrabberVisible) {
            invalidationFlags.isAppearanceInvalidated = true
        }

        if (formSheetConfig.detents != newConfig.detents) {
            invalidationFlags.isBehaviorInvalidated = true
        }

        formSheetConfig = newConfig

        flushPendingUpdates()
    }

    private fun flushPendingUpdates() {
        if (!invalidationFlags.any()) return

        if (invalidationFlags.isBehaviorInvalidated) {
            invalidationFlags.isBehaviorInvalidated = false
            updateSheetBehavior()
        }

        if (invalidationFlags.isAppearanceInvalidated) {
            invalidationFlags.isAppearanceInvalidated = false
            updateSheetAppearance()
        }

        if (invalidationFlags.isPresentationInvalidated) {
            invalidationFlags.isPresentationInvalidated = false
            updateSheetPresentation()
        }
    }

    private fun updateSheetBehavior() {
        dimensionsCoordinator.updateFormSheetDetents(resolveDetents(formSheetConfig.detents))
    }

    private fun updateSheetAppearance() {
        container.setGrabberVisible(formSheetConfig.prefersGrabberVisible)
    }

    private fun updateSheetPresentation() {
        presentationManager.updatePresentationState(formSheetConfig.isOpen)
    }

    private fun resolveDetents(rawDetents: List<Double>): FormSheetDetents {
        if (rawDetents.isEmpty()) {
            return FormSheetDetents(listOf(LARGE_DETENT_FRACTION))
        }

        return try {
            FormSheetDetents(rawDetents)
        } catch (e: IllegalArgumentException) {
            Log.e(
                "[RNScreens]",
                "Invalid FormSheet detents: $rawDetents. Falling back to large detent.",
                e,
            )
            FormSheetDetents(listOf(LARGE_DETENT_FRACTION))
        }
    }

    internal fun destroy() {
        presentationManager.destroy()
        dimensionsCoordinator.destroy()
        dialog.dismiss()
    }

    companion object {
        private const val LARGE_DETENT_FRACTION = 1.0
    }
}
