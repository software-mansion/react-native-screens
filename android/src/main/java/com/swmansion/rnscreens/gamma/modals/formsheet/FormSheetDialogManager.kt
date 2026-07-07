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
        val oldConfig = formSheetConfig
        formSheetConfig = newConfig

        // ALWAYS refresh behavior & appearance when reopening to ensure that BottomSheet
        // state and layout are synchronized with native behavior.
        val reopened = !oldConfig.isOpen && newConfig.isOpen

        configSteps.forEach { step ->
            val changed = step.dependsOn(oldConfig) != step.dependsOn(newConfig)
            if (changed || (step.forceOnReopen && reopened)) {
                step.apply(newConfig)
            }
        }
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

    private class ConfigStep(
        val dependsOn: (FormSheetConfig) -> Any?,
        val forceOnReopen: Boolean = true,
        val apply: (FormSheetConfig) -> Unit,
    )

    private val configSteps =
        listOf(
            ConfigStep(
                dependsOn = { listOf(it.detents, it.contentHeight) },
                apply = { dimensionsCoordinator.updateFormSheetDetents(resolveDetents(it.detents), it.contentHeight) },
            ),
            ConfigStep(
                dependsOn = { it.prefersGrabberVisible },
                apply = { container.setGrabberVisible(it.prefersGrabberVisible) },
            ),
            // Presentation reconciles open/close via its own field, so it must not be forced on reopen.
            ConfigStep(
                dependsOn = { it.isOpen },
                forceOnReopen = false,
                apply = { presentationManager.updatePresentationState(it.isOpen) },
            ),
        )

    companion object {
        private const val LARGE_DETENT_FRACTION = 1.0
    }
}
