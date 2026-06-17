package com.swmansion.rnscreens.utils

import android.content.Context
import android.util.TypedValue
import android.view.View
import com.facebook.react.uimanager.PixelUtil

/**
 * Converts a pixel value to dp using the given display [density] — not the process-global
 * density that [PixelUtil] reads from the device's main display. Fabric mounts views with
 * the per-display density, so state pushed back to the Shadow Tree must be converted with
 * that same density; the global one mis-scales the frame on any display whose density
 * differs from the main one (Samsung DeX, freeform multi-window, external monitors). On
 * single-display devices the two are equal, so this is a no-op there. See #4159.
 *
 * [android.util.DisplayMetrics.density] (`densityDpi / DENSITY_DEFAULT(160)`) is strictly
 * positive for the resources of any attached view; it is `0` only for a default-constructed
 * [android.util.DisplayMetrics] that was never populated — which should not happen for a
 * live view. The `density > 0f` guard exists solely so a degenerate `0` cannot turn the
 * division into Infinity/NaN and corrupt the pushed state; in that case we fall back to the
 * global conversion, which is at least well-defined.
 */
internal fun pxToDp(
    px: Float,
    density: Float,
): Float = if (density > 0f) px / density else PixelUtil.toDIPFromPixel(px)

/**
 * Converts a pixel value to dp using the density of the display this [View] is attached to.
 * Reads the density fresh on every call, so it stays correct if the view moves between
 * displays of differing density. See [pxToDp].
 */
internal fun View.pxToDp(px: Float): Float = pxToDp(px, resources.displayMetrics.density)

internal fun resolveDimensionAttr(
    context: Context,
    attrId: Int,
): Int {
    val typedValue = TypedValue()
    require(context.theme.resolveAttribute(attrId, typedValue, true)) {
        "[RNScreens] Unable to resolve Material theme dimension."
    }
    return TypedValue.complexToDimensionPixelSize(
        typedValue.data,
        context.resources.displayMetrics,
    )
}
