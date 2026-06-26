package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.view.ContextThemeWrapper
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

class FormSheetDialogManager(
    context: Context,
    private val onUpdateState: (width: Int, height: Int) -> Unit,
    private val onDismissRequest: () -> Unit,
) {
    private val themedContext =
        ContextThemeWrapper(
            context,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    // Eagerly create the container so it's always ready for React's children
    private val container =
        FormSheetContainer(context) { width, height ->
            onUpdateState(width, height)
        }

    internal val contentView get() = container.contentView

    // Eagerly create the dialog and attach the container
    private val dialog =
        FormSheetDialog(themedContext).apply {
            setContentView(container)

            setOnCancelListener {
                onDismissRequest()
            }
        }

    private val bottomSheetView = dialog.findViewById<FrameLayout>(com.google.android.material.R.id.design_bottom_sheet)

    private val dimmingManager = DimmingViewManager(context, dialog)

    private val animationCoordinator = FormSheetAnimationCoordinator(dimmingManager)

    init {
        bottomSheetView?.let { view ->
            setupDimmingViewBehavior(view)
            setupOffscreenPositionBeforeFirstDraw(view)
        }
        setupDialogShowListener()

        dimmingManager.setOnBackdropClickListener(host::onNativeDismiss)
    }

    internal fun show() {
        dialog.show()
    }

    internal fun dismiss() {
        animationCoordinator.runExitAnimation(bottomSheetView) {
            dialog.dismiss()
        }
    }

    private fun setupDimmingViewBehavior(view: FrameLayout) {
        // TODO: @t0maboro - BottomSheetBehavior override might be needed at some point
        val behavior = BottomSheetBehavior.from(view)
        dimmingManager.attachToBehavior(behavior)
    }

    private fun setupOffscreenPositionBeforeFirstDraw(view: FrameLayout) {
        view.viewTreeObserver.addOnPreDrawListener(
            object : android.view.ViewTreeObserver.OnPreDrawListener {
                override fun onPreDraw(): Boolean {
                    view.viewTreeObserver.removeOnPreDrawListener(this)
                    view.translationY = view.height.toFloat()
                    return true
                }
            },
        )
    }

    private fun setupDialogShowListener() {
        dialog.setOnShowListener {
            dimmingManager.onDialogShown()

            bottomSheetView?.let { view ->
                animationCoordinator.runEnterAnimation(view)
            }
        }
    }
}
