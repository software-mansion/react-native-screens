package com.swmansion.rnscreens.core.modals.sheet.presentation

import android.content.Context
import android.util.Log
import android.view.ViewGroup
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.core.modals.sheet.coordinator.SheetAppearanceCoordinator
import com.swmansion.rnscreens.core.modals.sheet.coordinator.SheetBehaviorController
import com.swmansion.rnscreens.core.modals.sheet.coordinator.SheetDimensionsCoordinator
import com.swmansion.rnscreens.core.modals.sheet.coordinator.SheetKeyboardCoordinator
import com.swmansion.rnscreens.core.modals.sheet.coordinator.SheetNativeDismissCoordinator
import com.swmansion.rnscreens.core.modals.sheet.dialog.SheetContainer
import com.swmansion.rnscreens.core.modals.sheet.dialog.SheetDialog
import com.swmansion.rnscreens.core.modals.sheet.model.SheetConfig
import com.swmansion.rnscreens.core.modals.sheet.model.SheetDetents

internal class SheetPresentation(
    themedContext: Context,
    private val container: SheetContainer,
    private val callbacks: Callbacks,
) {
    internal interface Callbacks {
        fun onDetentChanged(index: Int)

        fun onNativeDismissAllowed()

        fun onNativeDismissPrevented()
    }

    internal val dialog =
        SheetDialog(themedContext).apply {
            setContentView(container)
            // Backdrop taps are handled by Material's `touch_outside` view, which calls `cancel()`,
            // intercepted by SheetDialog.cancelRequestInterceptor, that's responsible for
            // preventNativeDismiss handling.
            setCanceledOnTouchOutside(true)
        }

    internal val bottomSheetView: FrameLayout? = dialog.findViewById(com.google.android.material.R.id.design_bottom_sheet)

    internal val sheetBehavior: BottomSheetBehavior<FrameLayout>?
        get() = bottomSheetView?.let { BottomSheetBehavior.from(it) }

    private val behaviorController =
        bottomSheetView?.let {
            SheetBehaviorController(it) { index -> callbacks.onDetentChanged(index) }
        }

    private val appearanceCoordinator =
        SheetAppearanceCoordinator(
            bottomSheetView = bottomSheetView,
        )

    private val dimensionsCoordinator =
        SheetDimensionsCoordinator(
            dialog = dialog,
            container = container,
            behaviorController = behaviorController,
        )

    private val keyboardCoordinator =
        bottomSheetView?.let {
            SheetKeyboardCoordinator(bottomSheetView = it)
        }

    private val nativeDismissCoordinator =
        SheetNativeDismissCoordinator(
            dialog = dialog,
            behaviorController = behaviorController,
            onDismissAllowed = callbacks::onNativeDismissAllowed,
            onDismissPrevented = callbacks::onNativeDismissPrevented,
        )

    init {
        container.bottomSheetView = bottomSheetView
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
        config: SheetConfig,
        contentHeight: Int,
    ) {
        onContentHeightChanged(contentHeight)
        dimensionsCoordinator.updateSheetDimensions(
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
        oldConfig: SheetConfig,
        newConfig: SheetConfig,
    ) {
        if (oldConfig.detents != newConfig.detents) {
            dimensionsCoordinator.updateSheetDimensions(
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

        // The SheetContainer outlives the presentation - its lifecycle is managed by SheetDialogManager
        // which is tied with the React's Host lifecycle.
        container.bottomSheetView = null
        (container.parent as? ViewGroup)?.removeView(container)
    }

    private fun resolveDetents(rawDetents: List<Double>): SheetDetents {
        if (rawDetents.isEmpty()) {
            return SheetDetents(listOf(LARGE_DETENT_FRACTION))
        }

        return try {
            SheetDetents(rawDetents)
        } catch (e: IllegalArgumentException) {
            Log.e(
                "[RNScreens]",
                "Invalid sheet detents: $rawDetents. Falling back to large detent.",
                e,
            )
            SheetDetents(listOf(LARGE_DETENT_FRACTION))
        }
    }

    companion object {
        private const val LARGE_DETENT_FRACTION = 1.0
    }
}
