package com.swmansion.rnscreens.gamma.modals.formsheet

import android.os.Build
import android.widget.FrameLayout
import androidx.core.view.doOnNextLayout
import com.google.android.material.shape.CornerFamily
import com.google.android.material.shape.MaterialShapeDrawable
import com.google.android.material.shape.ShapeAppearanceModel
import com.swmansion.rnscreens.utils.dpToPx

internal class FormSheetAppearanceCoordinator(
    private val bottomSheetView: FrameLayout?,
) {
    private var currentCornerRadius = FormSheetConfig.SYSTEM_DEFAULT_CORNER_RADIUS

    private var isCornerRadiusApplyPending = false

    // Needs to be caught to restore when the app switches back to `systemDefault`.
    private var defaultShapeAppearanceModel: ShapeAppearanceModel? = null

    // Rounded-corner clipping of the sheet's content is only reliable on Android API 33+. Prior to API 33,
    // `Outline.canClip()` returns `false` for asymmetrical outlines, causing clipToOutline to be ignored
    // by children. This results in opaque content painting with square corners over the rounded background.
    // We therefore skip applying `preferredCornerRadius` on older versions.
    private val isCornerRadiusSupported = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU

    internal fun setup() {
        if (!isCornerRadiusSupported) return
        bottomSheetView?.clipToOutline = true
    }

    internal fun updateCornerRadius(preferredCornerRadius: Float) {
        if (!isCornerRadiusSupported) return

        currentCornerRadius = preferredCornerRadius

        val view = bottomSheetView ?: return

        val background = view.background as? MaterialShapeDrawable
        if (background != null) {
            applyCornerRadius(background)
            return
        }

        // BottomSheetBehavior creates the MaterialShapeDrawable in its constructor but only attaches it
        // to the sheet view during its first onLayoutChild, which runs once the dialog is shown. There
        // is no public API to reach that drawable earlier, so the first layout pass is the only
        // deterministic point at which the background exists. Apply once then, reading the latest
        // radius so intermediate JS updates before the first open are not lost.
        if (isCornerRadiusApplyPending) return
        isCornerRadiusApplyPending = true
        view.doOnNextLayout {
            isCornerRadiusApplyPending = false
            (it.background as? MaterialShapeDrawable)?.let(::applyCornerRadius)
        }
    }

    private fun applyCornerRadius(background: MaterialShapeDrawable) {
        val view = bottomSheetView ?: return

        // Snapshot the original shape once, before the first override, to be able to restore it later.
        if (defaultShapeAppearanceModel == null) {
            defaultShapeAppearanceModel = background.shapeAppearanceModel
        }

        if (currentCornerRadius == FormSheetConfig.SYSTEM_DEFAULT_CORNER_RADIUS) {
            defaultShapeAppearanceModel?.let { background.shapeAppearanceModel = it }
            return
        }

        val radiusInPx = view.dpToPx(currentCornerRadius)

        val baseModel = defaultShapeAppearanceModel ?: background.shapeAppearanceModel
        background.shapeAppearanceModel =
            baseModel
                .toBuilder()
                .setTopLeftCorner(CornerFamily.ROUNDED, radiusInPx)
                .setTopRightCorner(CornerFamily.ROUNDED, radiusInPx)
                .build()
    }
}
