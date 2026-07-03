package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.util.Log
import android.view.ContextThemeWrapper
import android.view.View
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

class FormSheetDialogManager(
    context: Context,
    private val contentView: View,
    private val onDismissRequest: () -> Unit,
) {
    private var formSheetConfig = FormSheetConfig()

    private var resolvedDetents: FormSheetDetents? = null

    private var shouldReconfigureDetents = false

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

    private val animationCoordinator = FormSheetAnimationCoordinator(dimmingManager)

    private val dimensionsCoordinator =
        FormSheetDimensionsCoordinator(
            dialog = dialog,
            container = container,
            bottomSheetView = bottomSheetView,
            behaviorController = behaviorController,
        )

    private val lifecycleCoordinator =
        FormSheetLifecycleCoordinator(
            dialog = dialog,
            dimmingManager = dimmingManager,
            onShow = {
                dimmingManager.onDialogShown()
                bottomSheetView?.let { view ->
                    animationCoordinator.runEnterAnimation(view)
                }
            },
            onDismiss = onDismissRequest,
        )

    init {
        bottomSheetView?.let { view ->
            dimmingManager.attachToBehavior(BottomSheetBehavior.from(view))
            animationCoordinator.prepareViewForAnimation(view)
        }
        lifecycleCoordinator.setup()
        dimensionsCoordinator.setup()
    }

    internal fun applyConfig(newConfig: FormSheetConfig) {
        val isOpening = newConfig.isOpen && !formSheetConfig.isOpen
        val isClosing = !newConfig.isOpen && formSheetConfig.isOpen
        if (isOpening) {
            dialog.show()
        } else if (isClosing) {
            animationCoordinator.runExitAnimation(bottomSheetView) {
                dialog.dismiss()
            }
        }

        if (formSheetConfig.prefersGrabberVisible != newConfig.prefersGrabberVisible) {
            container.setGrabberVisible(newConfig.prefersGrabberVisible)
        }

        if (resolvedDetents == null || formSheetConfig.detents != newConfig.detents) {
            resolvedDetents = resolveDetents(newConfig.detents)
            shouldReconfigureDetents = true
        }

        // TODO: @t0maboro
        // - a dedicated presentation manager should be introduced as on iOS,
        // - invalidation flags logic should be implemented following other components convention
        if (isOpening) {
            shouldReconfigureDetents = true
        }

        if (shouldReconfigureDetents) {
            dimensionsCoordinator.updateFormSheetDetents(resolvedDetents, shouldReconfigureDetents)
            shouldReconfigureDetents = false
        }

        formSheetConfig = newConfig
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
        lifecycleCoordinator.destroy()
        dimensionsCoordinator.destroy()
        dialog.dismiss()
    }

    companion object {
        private const val LARGE_DETENT_FRACTION = 1.0
    }
}
