package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.view.View
import com.facebook.react.bridge.ReactContext

@SuppressLint("ViewConstructor")
class ScreenStackHeaderSubview(
    context: ReactContext?,
) : FabricEnabledHeaderSubviewViewGroup(context) {
    private var reactWidth = 0
    private var reactHeight = 0

    /**
     * Semantics: true iff we **believe** that SurfaceMountingManager has measured this view during mount item
     * execution. We recognize this case by checking measure mode in `onMeasure`. If Androidx
     * happens to use `EXACTLY` for both dimensions this property might convey invalid information.
     */
    private var isReactSizeSet = false

    var type = Type.LEFT

    /**
     * Whether this subview is currently hidden because the header's search bar action view is
     * expanded (see `SearchBarView.setToolbarElementsVisibility`). The search bar hides its
     * sibling subviews imperatively — outside of React's knowledge — so the hidden state must be
     * pinned: on Fabric, `SurfaceMountingManager.updateLayout` force-syncs `View.visibility` from
     * the ShadowTree display type on every layout update of this view, which would otherwise
     * resurrect a hidden subview (e.g. on rotation with a display cutout, where the inset change
     * relayouts the header). The toolbar then lays the resurrected END-gravity subview out in the
     * space left over by the full-width expanded search view — at the start edge of the header.
     */
    internal var isHiddenBySearchBar: Boolean = false
        private set

    internal fun setHiddenBySearchBar(hidden: Boolean) {
        isHiddenBySearchBar = hidden
        super.setVisibility(if (hidden) GONE else VISIBLE)
    }

    override fun setVisibility(visibility: Int) {
        // While hidden for an expanded search bar, ignore any attempt to make the subview visible
        // again (Fabric layout updates in particular) — `setHiddenBySearchBar(false)` is the only
        // way back to visible.
        if (isHiddenBySearchBar && visibility != GONE) {
            return
        }
        super.setVisibility(visibility)
    }

    val config: ScreenStackHeaderConfig?
        get() = (parent as? CustomToolbar)?.config

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        if (MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY &&
            MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY
        ) {
            // dimensions provided by react (with high probability)
            reactWidth = MeasureSpec.getSize(widthMeasureSpec)
            reactHeight = MeasureSpec.getSize(heightMeasureSpec)
            isReactSizeSet = true
            val parent = parent
            if (parent != null) {
                forceLayout()
                (parent as View).requestLayout()
            }
        }
        setMeasuredDimension(reactWidth, reactHeight)
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        if (changed) {
            val width = r - l
            val height = b - t

            // When setting subviews via `setOptions` from `useEffect` hook in a component, the first
            // frame received might be computed by native layout & completely invalid (zero height).
            // RN layout is the source of subview **size** (not origin) & we need to avoid sending
            // this native size to ST. Doing otherwise might lead to problems.
            // See: https://github.com/software-mansion/react-native-screens/pull/2812
            if (isReactSizeSet) {
                updateSubviewFrameState(width, height, l, t)
            }
        }
    }

    enum class Type {
        LEFT,
        CENTER,
        RIGHT,
        BACK,
        SEARCH_BAR,
    }
}
