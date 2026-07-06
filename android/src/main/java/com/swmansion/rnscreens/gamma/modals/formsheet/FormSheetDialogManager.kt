package com.swmansion.rnscreens.gamma.modals.formsheet

import android.animation.Animator
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

    private val animationCoordinator = FormSheetAnimatorFactory(dimmingManager)

    private val dimensionsCoordinator =
        FormSheetDimensionsCoordinator(
            dialog = dialog,
            container = container,
            bottomSheetView = bottomSheetView,
            behaviorController = behaviorController,
        )

    private var currentSheetAnimator: Animator? = null

    private val presentationManager =
        FormSheetPresentationManager(
            performPresent = { onComplete ->
                dialog.setOnShowListener {
                    dialog.setOnShowListener(null)
                    dimmingManager.onDialogShow()

                    if (bottomSheetView == null) {
                        onComplete()
                        return@setOnShowListener
                    }

                    val isInterrupting = currentSheetAnimator?.isRunning == true
                    currentSheetAnimator?.cancel()

                    currentSheetAnimator = animationCoordinator.createEnterAnimator(bottomSheetView, isInterrupting).apply {
                        addListener(object : android.animation.AnimatorListenerAdapter() {
                            override fun onAnimationEnd(animation: Animator) {
                                if (currentSheetAnimator == this@apply) currentSheetAnimator = null
                                onComplete()
                            }
                        })
                        start()
                    }
                }
                dialog.show()
            },
            performDismiss = { onComplete ->
                if (bottomSheetView == null) {
                    dialog.dismiss()
                    onComplete()
                    return@FormSheetPresentationManager
                }

                val behavior = BottomSheetBehavior.from(bottomSheetView)
                if (behavior.state == BottomSheetBehavior.STATE_HIDDEN) {
                    dialog.dismiss()
                    onComplete()
                    return@FormSheetPresentationManager
                }

                val isInterrupting = currentSheetAnimator?.isRunning == true
                currentSheetAnimator?.cancel()

                currentSheetAnimator = animationCoordinator.createExitAnimator(bottomSheetView, isInterrupting).apply {
                    addListener(object : android.animation.AnimatorListenerAdapter() {
                        override fun onAnimationEnd(animation: Animator) {
                            if (currentSheetAnimator == this@apply) currentSheetAnimator = null
                            dialog.dismiss()
                            onComplete()
                        }
                    })
                    start()
                }
            },
            onNativeDismiss = onDismissRequest,
        )

    private val nativeDismissCoordinator =
        FormSheetNativeDismissCoordinator(
            dialog = dialog,
            dimmingManager = dimmingManager,
            onNativeDismiss = {
                presentationManager.handleNativeDismiss()
            },
        )

    init {
        bottomSheetView?.let { view ->
            dimmingManager.attachToBehavior(BottomSheetBehavior.from(view))
        }
        nativeDismissCoordinator.setup()
        dimensionsCoordinator.setup()
    }

    internal fun applyConfig(newConfig: FormSheetConfig) {
        if (formSheetConfig.isOpen != newConfig.isOpen) {
            presentationManager.updatePresentationState(newConfig.isOpen)
        }

        if (formSheetConfig.prefersGrabberVisible != newConfig.prefersGrabberVisible) {
            container.setGrabberVisible(newConfig.prefersGrabberVisible)
        }

        // TODO: @t0maboro
        // - invalidation flags logic should be implemented following other components convention
        val isOpening = newConfig.isOpen && !formSheetConfig.isOpen
        val detentsChanged = resolvedDetents == null || formSheetConfig.detents != newConfig.detents

        if (detentsChanged) {
            resolvedDetents = resolveDetents(newConfig.detents)
        }

        if (detentsChanged || isOpening) {
            dimensionsCoordinator.updateFormSheetDetents(
                detents = resolvedDetents,
            )
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
        dialog.setOnShowListener(null)
        nativeDismissCoordinator.destroy()
        dimensionsCoordinator.destroy()
        dialog.dismiss()
    }

    companion object {
        private const val LARGE_DETENT_FRACTION = 1.0
    }
}
