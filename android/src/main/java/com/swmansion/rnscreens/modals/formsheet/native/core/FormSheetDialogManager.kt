package com.swmansion.rnscreens.modals.formsheet.native.core

import android.content.Context
import android.util.Log
import android.view.ContextThemeWrapper
import android.view.View
import android.widget.FrameLayout
import com.swmansion.rnscreens.modals.dimmingview.DimmingViewManager
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetAppearanceCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetBehaviorController
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetDimensionsCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetNativeDismissCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.presentation.FormSheetPresentationManager
import com.swmansion.rnscreens.modals.formsheet.shared.contracts.FormSheetContentSizeChangeDelegate
import com.swmansion.rnscreens.modals.formsheet.shared.contracts.FormSheetDialogEventEmitter
import com.swmansion.rnscreens.modals.formsheet.shared.model.FormSheetConfig
import com.swmansion.rnscreens.modals.formsheet.shared.model.FormSheetDetents
import kotlin.properties.Delegates

class FormSheetDialogManager(
    context: Context,
    private val contentView: View,
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
        bottomSheetView?.let {
            FormSheetBehaviorController(it) { index -> eventEmitter?.emitOnDetentChanged(index) }
        }

    private val dimmingManager = DimmingViewManager(context, dialog)

    private val appearanceCoordinator =
        FormSheetAppearanceCoordinator(
            bottomSheetView = bottomSheetView,
        )

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
            onNativeDismiss = { eventEmitter?.emitOnNativeDismissEvent() },
        )

    private val nativeDismissCoordinator =
        FormSheetNativeDismissCoordinator(
            dialog = dialog,
            behaviorController = behaviorController,
            dimmingManager = dimmingManager,
            onDismissAllowed = { presentationManager.handleNativeDismiss() },
            onDismissPrevented = { eventEmitter?.emitOnNativeDismissPreventedEvent() },
        )

    internal var eventEmitter: FormSheetDialogEventEmitter? by Delegates.observable(null) { _, _, newValue ->
        presentationManager.appearanceEventEmitter = newValue
    }

    internal val contentSizeChangeDelegate: FormSheetContentSizeChangeDelegate
        get() = dimensionsCoordinator

    init {
        presentationManager.setup()
        nativeDismissCoordinator.setup()
        appearanceCoordinator.setup()
        dimensionsCoordinator.setup()
        behaviorController?.setup()
    }

    internal fun applyConfig(newConfig: FormSheetConfig) {
        val oldConfig = formSheetConfig
        formSheetConfig = newConfig

        val reopened = !oldConfig.isOpen && newConfig.isOpen

        // ALWAYS refresh dimensions when reopening to ensure that BottomSheet
        // state and layout are synchronized with native behavior.
        val dimensionsChanged = oldConfig.detents != newConfig.detents
        if (dimensionsChanged || reopened) {
            dimensionsCoordinator.updateFormSheetDimensions(
                resolveDetents(newConfig.detents),
                newConfig.initialDetentIndex,
                reopened,
            )
        }

        if (oldConfig.prefersGrabberVisible != newConfig.prefersGrabberVisible) {
            container.setGrabberVisible(newConfig.prefersGrabberVisible)
        }

        if (oldConfig.preferredCornerRadius != newConfig.preferredCornerRadius) {
            appearanceCoordinator.updateCornerRadius(newConfig.preferredCornerRadius)
        }

        if (oldConfig.nativeContainerBackgroundColor != newConfig.nativeContainerBackgroundColor) {
            appearanceCoordinator.updateBackgroundColor(newConfig.nativeContainerBackgroundColor)
        }

        if (oldConfig.shouldPreventNativeDismiss != newConfig.shouldPreventNativeDismiss) {
            nativeDismissCoordinator.shouldPreventDismiss = newConfig.shouldPreventNativeDismiss
        }

        if (oldConfig.isOpen != newConfig.isOpen) {
            presentationManager.updatePresentationState(newConfig.isOpen)
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
        behaviorController?.destroy()
        nativeDismissCoordinator.destroy()
        presentationManager.destroy()
        dimensionsCoordinator.destroy()
        dialog.dismiss()
    }

    companion object {
        private const val LARGE_DETENT_FRACTION = 1.0
    }
}
