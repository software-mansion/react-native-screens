package com.swmansion.rnscreens.modals.formsheet.native.coordinator

import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.doOnLayout
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetContainer
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetCoordinatorHost
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetDialog
import com.swmansion.rnscreens.modals.formsheet.native.interfaces.FormSheetContentSizeChangeDelegate
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetDetents

internal class FormSheetDimensionsCoordinator(
    private val dialog: FormSheetDialog,
    private val container: FormSheetContainer,
    private val bottomSheetView: FrameLayout?,
    private val behaviorController: FormSheetBehaviorController?,
) : FormSheetContentSizeChangeDelegate,
    FormSheetCoordinatorHost.OnAvailableHeightMeasuredListener {
    private var lastTopInset = 0
    private var lastBottomInset = 0
    private var currentDetents: FormSheetDetents? = null
    private var currentInitialDetentIndex: Int = 0
    private var shouldApplyInitialDetent: Boolean = false

    private var currentContentHeight: Int = 0

    // Height the metrics were last resolved against. Any other value reported by the measure pass
    // means the window has been resized and metrics have to be recomputed.
    private var resolvedAvailableSpace: Int = 0
    private var isGeometryDirty: Boolean = false

    internal fun setup() {
        dialog.coordinatorHost.availableHeightListener = this
        setupWindowInsetsListener()

        bottomSheetView?.let { view ->
            disableMaterialInsetsAnimationCallback(view)
        }
    }

    private fun setupWindowInsetsListener() {
        ViewCompat.setOnApplyWindowInsetsListener(container) { _, insets ->
            val topInset = getTopInset(insets)
            val bottomInset = getBottomInset(insets)
            if (topInset != lastTopInset || bottomInset != lastBottomInset) {
                lastTopInset = topInset
                lastBottomInset = bottomInset
                invalidateGeometry()
            }
            insets
        }
    }

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
            invalidateGeometry()
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
        invalidateGeometry()
    }

    // Schedules a measure pass; the metrics are resolved from there. No-op while the dialog
    // is not shown - the first traversal after `show()` measures everything anyway.
    private fun invalidateGeometry() {
        isGeometryDirty = true
        container.requestLayout()
    }

    override fun onAvailableHeightMeasured(height: Int) {
        if (!isGeometryDirty && height == resolvedAvailableSpace) {
            return
        }
        isGeometryDirty = false
        resolvedAvailableSpace = height
        resolveGeometry(height)
    }

    /**
     * For Yoga we require the container height to be "stable" to avoid updating content size in flight.
     * If left as MATCH_PARENT, BottomSheetDialog dynamically applies insets as padding when sheet overflows
     * status bar or display cutout. This causes Yoga to recalculate the layout, resulting in UI flickering
     * during the drag gesture. By calculating and enforcing a static height that explicitly subtracts
     * the system insets, we completely bypass these redundant layout passes.
     *
     * Runs inside the measure pass of the coordinator's host, i.e. before the sheet and the container
     * are measured, so the values applied here are picked up by the very same traversal.
     */
    private fun resolveGeometry(sheetAvailableSpace: Int) {
        currentDetents?.let { detents ->
            behaviorController?.updateSheetBehavior(
                detents = detents,
                sheetAvailableSpace = sheetAvailableSpace,
                contentHeightForFitToContents = currentContentHeight,
                nativeContainerPaddingBottom = lastBottomInset,
                initialDetentIndex = currentInitialDetentIndex,
                applyInitialDetent = shouldApplyInitialDetent,
            )
            shouldApplyInitialDetent = false
        }

        val sheetContainerHeight =
            currentDetents?.sheetContainerHeight(sheetAvailableSpace, lastTopInset, lastBottomInset, currentContentHeight)
                ?: (sheetAvailableSpace - lastTopInset - lastBottomInset).coerceAtLeast(0)

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
        dialog.coordinatorHost.availableHeightListener = null
        ViewCompat.setOnApplyWindowInsetsListener(container, null)
    }
}
