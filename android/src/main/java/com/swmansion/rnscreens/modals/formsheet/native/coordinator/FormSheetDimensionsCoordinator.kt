package com.swmansion.rnscreens.modals.formsheet.native.coordinator

import android.os.Build
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.doOnLayout
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetContainer
import com.swmansion.rnscreens.modals.formsheet.native.interfaces.FormSheetContentSizeChangeDelegate
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetDetents

internal class FormSheetDimensionsCoordinator(
    private val dialog: BottomSheetDialog,
    private val container: FormSheetContainer,
    private val bottomSheetView: FrameLayout?,
    private val behaviorController: FormSheetBehaviorController?,
) : FormSheetContentSizeChangeDelegate {
    private var lastTopInset = 0
    private var lastBottomInset = 0
    private var currentDetents: FormSheetDetents? = null
    private var currentInitialDetentIndex: Int = 0
    private var shouldApplyInitialDetent: Boolean = false

    private var currentContentHeight: Int = 0

    internal fun setup() {
        setupWindowInsetsListener()

        bottomSheetView?.let { view ->
            disableMaterialInsetsAnimationCallback(view)
        }
    }

    private fun setupWindowInsetsListener() {
        ViewCompat.setOnApplyWindowInsetsListener(container) { _, insets ->
            lastTopInset = getTopInset(insets)
            lastBottomInset = getBottomInset(insets)
            updateNativeContainerHeight()
            consumeVerticalSystemInsets(insets)
        }
    }

    /**
     * The container is sized to fit within the vertical safe area (see [updateNativeContainerHeight]),
     * so the content never overlaps the system bars nor the display cutout vertically. The insets
     * are consumed before reaching the content, otherwise it would pad for them once again.
     *
     * TODO: @t0maboro - revisit while adding horizontal sheet support
     */
    private fun consumeVerticalSystemInsets(insets: WindowInsetsCompat): WindowInsetsCompat {
        val builder = WindowInsetsCompat.Builder(insets)

        val types =
            listOf(
                WindowInsetsCompat.Type.statusBars(),
                WindowInsetsCompat.Type.navigationBars(),
                WindowInsetsCompat.Type.captionBar(),
                WindowInsetsCompat.Type.systemOverlays(),
                WindowInsetsCompat.Type.displayCutout(),
            )

        for (type in types) {
            builder.setInsets(type, insets.getInsets(type).withoutVertical())
            // Deprecated `getSystemWindowInsetTop`, used by Material may read from the insets
            // ignoring visibility, which `setInsets` does not affect.
            builder.setInsetsIgnoringVisibility(type, insets.getInsetsIgnoringVisibility(type).withoutVertical())
        }

        // On Android versions prior to API level 30, setInsetsIgnoringVisibility(...) is not
        // implemented, hence the stable insets are cleared through the previous API.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            builder.setStableInsets(insets.stableInsets.withoutVertical())
        }

        val consumedInsets = builder.build()
        val displayCutout = insets.getInsets(WindowInsetsCompat.Type.displayCutout())

        // On Android versions prior to R, setInsets(WindowInsetsCompat.Type.displayCutout(), ...)
        // does not work. We need to use previous API.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R && displayCutout.left == 0 && displayCutout.right == 0) {
            return consumedInsets.consumeDisplayCutout()
        }

        return consumedInsets
    }

    private fun Insets.withoutVertical(): Insets = Insets.of(left, 0, right, 0)

    /**
     * BottomSheetBehavior registers an internal `WindowInsetsAnimationCallback` on the
     * sheet view during its first `onLayoutChild`. That callback drives `translationY` to follow
     * animated inset changes, what interferes with our slide-in custom animation.
     *
     * We manage insets ourselves by setting a fixed height for FormSheetContainer, so we can
     * clear the Material's callback to remove the conflict entirely.
     *
     * This method must run after the first layout pass.
     */
    private fun disableMaterialInsetsAnimationCallback(view: FrameLayout) {
        view.doOnLayout {
            ViewCompat.setWindowInsetsAnimationCallback(it, null)
        }
    }

    override fun onContentHeightChanged(newHeight: Int) {
        if (currentContentHeight != newHeight) {
            currentContentHeight = newHeight
            updateNativeContainerHeight()
        }
    }

    internal fun updateFormSheetDimensions(
        detents: FormSheetDetents?,
        initialDetentIndex: Int = 0,
        applyInitialDetent: Boolean = false,
    ) {
        currentDetents = detents
        currentInitialDetentIndex = initialDetentIndex
        shouldApplyInitialDetent = applyInitialDetent
        updateNativeContainerHeight()
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

        if (dialogDecorHeight <= 0) {
            return
        }

        currentDetents?.let { detents ->
            behaviorController?.updateSheetBehavior(
                detents = detents,
                sheetAvailableSpace = dialogDecorHeight,
                contentHeightForFitToContents = currentContentHeight,
                nativeContainerPaddingBottom = lastBottomInset,
                initialDetentIndex = currentInitialDetentIndex,
                applyInitialDetent = shouldApplyInitialDetent,
            )
            shouldApplyInitialDetent = false
        }

        val sheetContainerHeight =
            currentDetents?.sheetContainerHeight(dialogDecorHeight, lastTopInset, lastBottomInset, currentContentHeight)
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
        ViewCompat.setOnApplyWindowInsetsListener(container, null)
    }
}
