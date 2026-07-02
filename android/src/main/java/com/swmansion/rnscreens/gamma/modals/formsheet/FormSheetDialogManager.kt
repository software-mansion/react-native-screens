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
    private val contentView: View,
    private val onDismissRequest: () -> Unit,
) {
    private var formSheetConfig = FormSheetConfig()

    private var resolvedDetents: FormSheetDetents? = null

    private var shouldReconfigureDetents = false

    private var lastTopInset = 0
    private var lastBottomInset = 0

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

    init {
        bottomSheetView?.let { view ->
            setupBehaviorCallbacksForDimmingView(view)
            setupOffscreenPositionBeforeFirstDraw(view)
        }
        setupDialogShowListener()
        setupDialogCancelListener()
        setupWindowInsetsListener()

        dimmingManager.setOnBackdropClickListener(onDismissRequest)
    }

    internal fun applyConfig(newConfig: FormSheetConfig) {
        if (formSheetConfig.isOpen != newConfig.isOpen) {
            if (newConfig.isOpen) {
                dialog.show()
            } else {
                animationCoordinator.runExitAnimation(bottomSheetView) {
                    dialog.dismiss()
                }
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
        val isOpening = newConfig.isOpen && !formSheetConfig.isOpen
        if (isOpening) {
            shouldReconfigureDetents = true
        }

        if (shouldReconfigureDetents) {
            updateNativeContainerHeight()
        }

        formSheetConfig = newConfig
    }

    private fun resolveDetents(rawDetents: List<Double>): FormSheetDetents {
        if (rawDetents.isEmpty()) {
            return FormSheetDetents(listOf(LARGE_DETENT))
        }
        return FormSheetDetents(rawDetents)
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
                    disableMaterialInsetsAnimationCallback(view)
                    return true
                }
            },
        )
    }

    /**
     * BottomSheetBehavior registers an internal `WindowInsetsAnimationCallback` on the
     * sheet view during its first `onLayoutChild`. That callback drives `translationY` to follow
     * animated inset changes, what interferes with our slide-in custom animation.
     *
     * We manage insets ourselves by seeing a fixed height for FormSheetContainer, so we can
     * clear the Material's callback to remove the conflict entirely.
     *
     * This method must run after the first layout pass.
     */
    private fun disableMaterialInsetsAnimationCallback(view: FrameLayout) {
        ViewCompat.setWindowInsetsAnimationCallback(view, null)
    }

    private fun setupDialogShowListener() {
        dialog.setOnShowListener {
            dimmingManager.onDialogShown()

            bottomSheetView?.let { view ->
                animationCoordinator.runEnterAnimation(view)
            }
        }
    }

    private fun setupDialogCancelListener() {
        dialog.setOnCancelListener {
            onDismissRequest()
        }
    }

    private fun setupWindowInsetsListener() {
        ViewCompat.setOnApplyWindowInsetsListener(container) { _, insets ->
            lastTopInset = getTopInset(insets)
            lastBottomInset = getBottomInset(insets)
            updateNativeContainerHeight()
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
    private fun updateNativeContainerHeight() {
        val dialogDecorHeight = dialog.window?.decorView?.height ?: 0

        if (dialogDecorHeight > 0) {
            resolvedDetents?.let { detents ->
                behaviorController?.updateSheetBehavior(
                    detents = detents,
                    sheetAvailableSpace = dialogDecorHeight,
                    applyInitialState = shouldReconfigureDetents,
                )
                shouldReconfigureDetents = false
            }

            val sheetContainerHeight =
                resolvedDetents?.sheetContainerHeight(dialogDecorHeight, lastTopInset, lastBottomInset)
                    ?: (dialogDecorHeight - lastTopInset - lastBottomInset).coerceAtLeast(0)

            val layoutParams =
                container.layoutParams
                    ?: FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, sheetContainerHeight)
            if (layoutParams.width != ViewGroup.LayoutParams.MATCH_PARENT || layoutParams.height != sheetContainerHeight) {
                layoutParams.width = ViewGroup.LayoutParams.MATCH_PARENT
                layoutParams.height = sheetContainerHeight
                container.layoutParams = layoutParams
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

    internal fun destroy() {
        dimmingManager.setOnBackdropClickListener {}

        ViewCompat.setOnApplyWindowInsetsListener(container, null)

        dialog.setOnShowListener(null)
        dialog.setOnCancelListener(null)
        dialog.dismiss()
    }

    companion object {
        private const val LARGE_DETENT = 1.0
    }
}
