package com.swmansion.rnscreens.modals.formsheet.native.presentation

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.FrameLayout
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetAppearanceCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetBehaviorController
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetDimensionsCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetNativeDismissCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetContainer
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetDialog
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetConfig
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetDetents

internal class FormSheetPresentation(
    themedContext: Context,
    private val container: FormSheetContainer,
    private val dimmingManager: FormSheetDimmingManager,
    private val callbacks: Callbacks,
) {
    internal interface Callbacks {
        fun onDetentChanged(index: Int)

        fun onNativeDismissAllowed()

        fun onNativeDismissPrevented()

        fun resolveWindowBelow(): Window?
    }

    internal val dialog =
        FormSheetDialog(themedContext).apply {
            setContentView(container)
            // Backdrop taps are handled by Material's `touch_outside` view, which calls `cancel()`,
            // intercepted by FormSheetDialog.cancelRequestInterceptor, that's responsible for
            // preventNativeDismiss handling.
            setCanceledOnTouchOutside(true)
        }

    internal val bottomSheetView: FrameLayout? = dialog.findViewById(com.google.android.material.R.id.design_bottom_sheet)

    private val behaviorController =
        bottomSheetView?.let {
            FormSheetBehaviorController(it) { index -> callbacks.onDetentChanged(index) }
        }

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

    private val nativeDismissCoordinator =
        FormSheetNativeDismissCoordinator(
            dialog = dialog,
            behaviorController = behaviorController,
            onDismissAllowed = callbacks::onNativeDismissAllowed,
            onDismissPrevented = callbacks::onNativeDismissPrevented,
        )

    // On an undimmed sheet, the backdrop tap should be forwarded to the window
    // below.
    private val backdropTouchForwarder =
        dialog.findViewById<View>(com.google.android.material.R.id.touch_outside)?.let { backdropView ->
            FormSheetBackdropTouchForwarder(
                backdropView = backdropView,
                isBackdropDimmed = { dimmingManager.isDimmed },
                resolveWindowBelow = callbacks::resolveWindowBelow,
            )
        }

    init {
        backdropTouchForwarder?.setup()
        nativeDismissCoordinator.setup()
        appearanceCoordinator.setup()
        dimensionsCoordinator.setup()
        behaviorController?.setup()
    }

    internal fun onContentHeightChanged(height: Int) {
        dimensionsCoordinator.onContentHeightChanged(height)
    }

    internal fun applyInitialConfig(
        config: FormSheetConfig,
        contentHeight: Int,
    ) {
        onContentHeightChanged(contentHeight)
        val detents = resolveDetents(config.detents)
        dimensionsCoordinator.updateFormSheetDimensions(
            detents,
            config.initialDetentIndex,
            applyInitialDetent = true,
        )
        dimmingManager.updateDimmingProfile(
            detents = detents,
            largestUndimmedDetentIndex = config.largestUndimmedDetentIndex,
            initialDetentIndex = config.initialDetentIndex,
        )
        container.setGrabberVisible(config.prefersGrabberVisible)
        appearanceCoordinator.updateCornerRadius(config.preferredCornerRadius)
        appearanceCoordinator.updateBackgroundColor(config.nativeContainerBackgroundColor)
        nativeDismissCoordinator.shouldPreventDismiss = config.shouldPreventNativeDismiss
    }

    internal fun applyConfigUpdate(
        oldConfig: FormSheetConfig,
        newConfig: FormSheetConfig,
    ) {
        val dimensionsChanged = oldConfig.detents != newConfig.detents
        val largestUndimmedDetentIndexChanged =
            oldConfig.largestUndimmedDetentIndex !=
                newConfig.largestUndimmedDetentIndex

        if (dimensionsChanged || largestUndimmedDetentIndexChanged) {
            val detents = resolveDetents(newConfig.detents)

            if (dimensionsChanged) {
                dimensionsCoordinator.updateFormSheetDimensions(
                    detents,
                    newConfig.initialDetentIndex,
                )
            }

            // The dimming profile depends on the detents geometry, so it's refreshed after the
            // dimensions update.
            dimmingManager.updateDimmingProfile(
                detents = detents,
                largestUndimmedDetentIndex = newConfig.largestUndimmedDetentIndex,
                initialDetentIndex = newConfig.initialDetentIndex,
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
    }

    internal fun destroy() {
        behaviorController?.destroy()
        backdropTouchForwarder?.destroy()
        nativeDismissCoordinator.destroy()
        dimensionsCoordinator.destroy()

        dialog.setOnShowListener(null)
        dialog.dismiss()

        // The FormSheetContainer outlives the presentation - its lifecycle is managed by FormSheetDialogManager
        // which is tied with the React's Host lifecycle.
        (container.parent as? ViewGroup)?.removeView(container)
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

    companion object {
        private const val LARGE_DETENT_FRACTION = 1.0
    }
}
