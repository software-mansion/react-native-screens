package com.swmansion.rnscreens.modals.formsheet.native.presentation

import android.content.Context
import android.util.Log
import android.view.ViewGroup
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetAppearanceCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetBehaviorController
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetDimensionsCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetKeyboardCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.coordinator.FormSheetNativeDismissCoordinator
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetContainer
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetDialog
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetConfig
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetDetents

internal class FormSheetPresentation(
    themedContext: Context,
    private val container: FormSheetContainer,
    private val callbacks: Callbacks,
) {
    internal interface Callbacks {
        fun onDetentChanged(index: Int)

        fun onNativeDismissAllowed()

        fun onNativeDismissPrevented()
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

    internal val sheetBehavior: BottomSheetBehavior<FrameLayout>?
        get() = bottomSheetView?.let { BottomSheetBehavior.from(it) }

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
            behaviorController = behaviorController,
        )

    private val keyboardCoordinator =
        bottomSheetView?.let {
            FormSheetKeyboardCoordinator(bottomSheetView = it)
        }

    private val nativeDismissCoordinator =
        FormSheetNativeDismissCoordinator(
            dialog = dialog,
            behaviorController = behaviorController,
            onDismissAllowed = callbacks::onNativeDismissAllowed,
            onDismissPrevented = callbacks::onNativeDismissPrevented,
        )

    init {
        nativeDismissCoordinator.setup()
        appearanceCoordinator.setup()
        dimensionsCoordinator.setup()
        keyboardCoordinator?.setup()
        behaviorController?.setup()
    }

    /**
     * Enables tracking the keyboard animation. Expected to be on only while the sheet rests in the
     * PRESENTED state - the enter / exit animators own `translationY` otherwise.
     */
    internal fun setKeyboardTrackingEnabled(enabled: Boolean) {
        keyboardCoordinator?.isTrackingEnabled = enabled
    }

    internal fun onContentHeightChanged(height: Int) {
        dimensionsCoordinator.onContentHeightChanged(height)
    }

    internal fun applyInitialConfig(
        config: FormSheetConfig,
        contentHeight: Int,
    ) {
        onContentHeightChanged(contentHeight)
        dimensionsCoordinator.updateFormSheetDimensions(
            resolveDetents(config.detents),
            config.initialDetentIndex,
            applyInitialDetent = true,
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
        if (oldConfig.detents != newConfig.detents) {
            dimensionsCoordinator.updateFormSheetDimensions(
                resolveDetents(newConfig.detents),
                newConfig.initialDetentIndex,
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
        nativeDismissCoordinator.destroy()
        dimensionsCoordinator.destroy()
        keyboardCoordinator?.destroy()

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
