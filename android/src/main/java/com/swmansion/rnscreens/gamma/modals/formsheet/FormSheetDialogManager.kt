package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.view.ContextThemeWrapper
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
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
            setCanceledOnTouchOutside(false)

            setOnCancelListener {
                onDismissRequest()
            }
        }

    private val bottomSheetView = dialog.findViewById<FrameLayout>(com.google.android.material.R.id.design_bottom_sheet)

    private val dimmingManager = DimmingViewManager(context, dialog)

    private val animationCoordinator = FormSheetAnimationCoordinator(dimmingManager)

    init {
        bottomSheetView?.let { view ->
            setupBehaviorCallbacksForDimmingView(view)
            setupOffscreenPositionBeforeFirstDraw(view)
        }
        setupDialogShowListener()
        setupWindowInsetsListener()

        dimmingManager.setOnBackdropClickListener(onDismissRequest)
    }

    internal fun show() {
        dialog.show()
    }

    internal fun dismiss() {
        animationCoordinator.runExitAnimation(bottomSheetView) {
            dialog.dismiss()
        }
    }

    private fun setupBehaviorCallbacksForDimmingView(view: FrameLayout) {
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

    private fun setupWindowInsetsListener() {
        ViewCompat.setOnApplyWindowInsetsListener(container) { view, insets ->
            updateNativeContainerHeight(view, insets)
            insets
        }
    }

    /**
     * For Yoga we require the container height to be "stable" to avoid updating content size in flight.
     * If left as MATCH_PARENT, BottomSheetDialog dynamically applies insets as padding when sheet overflows
     * status bar or display cutout. This causes Yoga to recalculate the layout, resulting in UI flickering
     * during the drag gesture. By calculating and enforcing a static height that explicitly subtracts
     * the system insets, we completely bypass these redundant layout passes.
     */
    private fun updateNativeContainerHeight(
        view: View,
        insets: WindowInsetsCompat,
    ) {
        val topInset = getTopInset(insets)
        val bottomInset = getBottomInset(insets)
        val dialogDecorHeight = dialog.window?.decorView?.height ?: 0

        if (dialogDecorHeight > 0) {
            val availableHeight = (dialogDecorHeight - topInset - bottomInset).coerceAtLeast(0)

            val layoutParams =
                view.layoutParams
                    ?: FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, availableHeight)
            if (layoutParams.width != ViewGroup.LayoutParams.MATCH_PARENT || layoutParams.height != availableHeight) {
                layoutParams.width = ViewGroup.LayoutParams.MATCH_PARENT
                layoutParams.height = availableHeight
                view.layoutParams = layoutParams
            }
        }
    }

    private fun getTopInset(insetsCompat: WindowInsetsCompat): Int =
        insetsCompat
            .getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout(),
            ).top

    private fun getBottomInset(insetsCompat: WindowInsetsCompat): Int =
        insetsCompat
            .getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout(),
            ).bottom
}
