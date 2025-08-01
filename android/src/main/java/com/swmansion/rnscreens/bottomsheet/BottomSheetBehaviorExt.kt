package com.swmansion.rnscreens.bottomsheet

import android.view.View
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ext.parentAsViewGroup
import kotlin.math.max

internal fun <T : View> BottomSheetBehavior<T>.useSingleDetent(
    height: Int? = null,
    forceExpandedState: Boolean = true,
    screen: Screen? = null
): BottomSheetBehavior<T> {
    this.skipCollapsed = false
    this.isFitToContents = true
    if (forceExpandedState) {
        this.state = BottomSheetBehavior.STATE_COLLAPSED
    }
    isDraggable = false
    println("useSingleDetent $height $maxHeight $peekHeight")
    height?.let {
        this.state = BottomSheetBehavior.STATE_COLLAPSED
        if (height > maxHeight) {
            maxHeight = height
        } else if (height < maxHeight) {
            println("height <= maxHeight, adding callback")
            addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
                override fun onStateChanged(bottomSheet: View, newState: Int) {
                    println(newState)
                    if (newState == BottomSheetBehavior.STATE_COLLAPSED) {
                        removeBottomSheetCallback(this)
                        maxHeight = height
                        screen?.apply {
                            val parent = parentAsViewGroup()
                            if (parent != null && !parent.isInLayout) {
                                // There are reported cases (irreproducible) when Screen is not laid out after
                                // maxHeight is set on behaviour.
                                println("request inner")
                                parent.requestLayout()
                            }
                        }
                    }
                }

                override fun onSlide(bottomSheet: View, slideOffset: Float) {
                }

            })
            setPeekHeight(height, true)
        }
    }
    return this
}

internal fun <T : View> BottomSheetBehavior<T>.useTwoDetents(
    @BottomSheetBehavior.StableState state: Int? = null,
    firstHeight: Int? = null,
    secondHeight: Int? = null,
): BottomSheetBehavior<T> {
    skipCollapsed = false
    isFitToContents = true
    state?.let { this.state = state }
    firstHeight?.let { peekHeight = firstHeight }
    secondHeight?.let { maxHeight = secondHeight }
    return this
}

internal fun <T : View> BottomSheetBehavior<T>.useThreeDetents(
    @BottomSheetBehavior.StableState state: Int? = null,
    firstHeight: Int? = null,
    halfExpandedRatio: Float? = null,
    expandedOffsetFromTop: Int? = null,
): BottomSheetBehavior<T> {
    skipCollapsed = false
    isFitToContents = false
    state?.let { this.state = state }
    firstHeight?.let { this.peekHeight = firstHeight }
    halfExpandedRatio?.let { this.halfExpandedRatio = halfExpandedRatio }
    expandedOffsetFromTop?.let { this.expandedOffset = expandedOffsetFromTop }
    return this
}
