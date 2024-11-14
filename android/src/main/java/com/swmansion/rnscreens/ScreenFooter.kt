package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_COLLAPSED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HALF_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HIDDEN
import com.google.android.material.math.MathUtils
import com.swmansion.rnscreens.bottomsheet.SheetUtils
import kotlin.math.max

@SuppressLint("ViewConstructor")
class ScreenFooter(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext) {
    private var lastContainerHeight: Int = 0
    private var lastStableSheetState: Int = STATE_HIDDEN
    private var isAnimationControlledByKeyboard = false
    private var lastSlideOffset = 0.0f
    private var lastBottomInset = 0
    private var isCallbackRegistered = false

    // ScreenFooter is supposed to be direct child of Screen
    private val screenParent
        get() = parent as? Screen

    private val sheetBehavior
        get() = requireScreenParent().sheetBehavior

    private val hasReceivedInitialLayoutFromParent get() = lastContainerHeight > 0

    // Due to Android restrictions on layout flow, particularly
    // the fact that onMeasure must set `measuredHeight` & `measuredWidth` React calls `measure` on every
    // view group with accurate dimensions computed by Yoga. This is our entry point to get current view dimensions.
    private val reactHeight
        get() = measuredHeight

    private val reactWidth
        get() = measuredWidth

    // Main goal of this callback implementation is to handle keyboard appearance. We use it to make sure
    // that the footer respects keyboard during layout.
    // Note `DISPATCH_MODE_STOP` is used here to avoid propagation of insets callback to footer subtree.
    private val insetsAnimation =
        object : WindowInsetsAnimationCompat.Callback(DISPATCH_MODE_STOP) {
            override fun onStart(
                animation: WindowInsetsAnimationCompat,
                bounds: WindowInsetsAnimationCompat.BoundsCompat,
            ): WindowInsetsAnimationCompat.BoundsCompat {
                isAnimationControlledByKeyboard = true
                return super.onStart(animation, bounds)
            }

            override fun onProgress(
                insets: WindowInsetsCompat,
                runningAnimations: MutableList<WindowInsetsAnimationCompat>,
            ): WindowInsetsCompat {
                val imeBottomInset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
                val navigationBarBottomInset =
                    insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom

                // **It looks like** when keyboard is presented its inset does include navigation bar
                // bottom inset, while it is already accounted for somewhere (dunno where).
                // That is why we subtract navigation bar bottom inset here.
                //
                // Situations where keyboard is not visible and navigation bar is present are handled
                // directly in layout function by not allowing lastBottomInset to contribute value less
                // than 0. Alternative would be write logic specific to keyboard animation direction (hide / show).
                lastBottomInset = imeBottomInset - navigationBarBottomInset
                layoutFooterOnYAxis(
                    lastContainerHeight,
                    reactHeight,
                    sheetTopWhileDragging(lastSlideOffset),
                    lastBottomInset,
                )

                // Please note that we do *not* consume any insets here, so that we do not interfere with
                // any other view.
                return insets
            }

            override fun onEnd(animation: WindowInsetsAnimationCompat) {
                isAnimationControlledByKeyboard = false
            }
        }

    init {
        val rootView =
            checkNotNull(reactContext.currentActivity) {
                "[RNScreens] Context detached from activity while creating ScreenFooter"
            }.window.decorView

        // Note that we do override insets animation on given view. I can see it interfering e.g.
        // with reanimated keyboard or even other places in our code. Need to test this.
        ViewCompat.setWindowInsetsAnimationCallback(rootView, insetsAnimation)
    }

    private fun requireScreenParent(): Screen = requireNotNull(screenParent)

    private fun requireSheetBehavior(): BottomSheetBehavior<Screen> = requireNotNull(sheetBehavior)

    // React calls `layout` function to set view dimensions, thus this is our entry point for
    // fixing layout up after Yoga repositions it.
    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        super.onLayout(changed, left, top, right, bottom)
        if (!hasReceivedInitialLayoutFromParent) {
            return
        }
        layoutFooterOnYAxis(
            lastContainerHeight,
            bottom - top,
            sheetTopInStableState(requireSheetBehavior().state),
            lastBottomInset,
        )
    }

    private var footerCallback =
        object : BottomSheetCallback() {
            override fun onStateChanged(
                bottomSheet: View,
                newState: Int,
            ) {
                if (!SheetUtils.isStateStable(newState)) {
                    return
                }

                when (newState) {
                    STATE_COLLAPSED,
                    STATE_HALF_EXPANDED,
                    STATE_EXPANDED,
                    ->
                        layoutFooterOnYAxis(
                            lastContainerHeight,
                            reactHeight,
                            sheetTopInStableState(newState),
                            lastBottomInset,
                        )

                    else -> {}
                }
                lastStableSheetState = newState
            }

            override fun onSlide(
                bottomSheet: View,
                slideOffset: Float,
            ) {
                lastSlideOffset = max(slideOffset, 0.0f)
                if (!isAnimationControlledByKeyboard) {
                    layoutFooterOnYAxis(
                        lastContainerHeight,
                        reactHeight,
                        sheetTopWhileDragging(lastSlideOffset),
                        lastBottomInset,
                    )
                }
            }
        }

    // Important to keep this method idempotent! We attempt to (un)register
    // our callback in different places depending on whether the behavior is already created.
    fun registerWithSheetBehavior(behavior: BottomSheetBehavior<Screen>) {
        if (!isCallbackRegistered) {
            behavior.addBottomSheetCallback(footerCallback)
            isCallbackRegistered = true
        }
    }

    // Important to keep this method idempotent! We attempt to (un)register
    // our callback in different places depending on whether the behavior is already created.
    fun unregisterWithSheetBehavior(behavior: BottomSheetBehavior<Screen>) {
        if (isCallbackRegistered) {
            behavior.removeBottomSheetCallback(footerCallback)
            isCallbackRegistered = false
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        sheetBehavior?.let { registerWithSheetBehavior(it) }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        sheetBehavior?.let { unregisterWithSheetBehavior(it) }
    }

    /**
     * Calculate position of sheet's top while it is in stable state given concrete sheet state.
     *
     * This method should not be used for sheet in unstable state.
     *
     * @param state sheet state as defined in [BottomSheetBehavior]
     * @return position of sheet's top **relative to container**
     */
    private fun sheetTopInStableState(state: Int): Int {
        val behavior = requireSheetBehavior()
        return when (state) {
            STATE_COLLAPSED -> lastContainerHeight - behavior.peekHeight
            STATE_HALF_EXPANDED -> (lastContainerHeight * (1 - behavior.halfExpandedRatio)).toInt()
            STATE_EXPANDED -> behavior.expandedOffset
            STATE_HIDDEN -> lastContainerHeight
            else -> throw IllegalArgumentException("[RNScreens] use of stable-state method for unstable state")
        }
    }

    /**
     * Calculate position of sheet's top while it is in dragging / settling state given concrete slide offset
     * as reported by [BottomSheetCallback.onSlide].
     *
     * This method should not be used for sheet in stable state.
     *
     * Currently the implementation assumes that the Screen's (sheet's) container starts at y: 0
     * in global coordinates. Then we can use simply sheet's top. If that is for some reason
     * unavailable, then we fallback to interpolation basing on values provided by sheet behaviour.
     *
     * We don't want to primarily rely on interpolation, because due to division rounding errors the footer
     * will "flicker" (jump up / down a single pixel).
     *
     * @param slideOffset sheet offset as reported by [BottomSheetCallback.onSlide]
     * @return position of sheet's top **relative to container**
     */
    private fun sheetTopWhileDragging(slideOffset: Float): Int =
        screenParent?.top ?: MathUtils
            .lerp(
                sheetTopInStableState(STATE_COLLAPSED).toFloat(),
                sheetTopInStableState(
                    STATE_EXPANDED,
                ).toFloat(),
                slideOffset,
            ).toInt()

    /**
     * Parent Screen will call this on it's layout. We need to be notified on any update to Screen's content
     * or its container dimensions change. This is also our entrypoint to acquiring container height.
     */
    fun onParentLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
        containerHeight: Int,
    ) {
        lastContainerHeight = containerHeight
        layoutFooterOnYAxis(
            containerHeight,
            reactHeight,
            sheetTopInStableState(requireSheetBehavior().state),
        )
    }

    /**
     * Layouts this component within parent screen. It takes care only of vertical axis, leaving
     * horizontal axis solely for React to handle.
     *
     * This is a bit against Android rules, that parents should layout their children,
     * however I wanted to keep this logic away from Screen component to avoid introducing
     * complexity there and have footer logic as much separated as it is possible.
     *
     * Please note that React has no clue about updates enforced in below method.
     *
     * @param containerHeight this should be the height of the screen (sheet) container used
     * to calculate sheet properties when configuring behavior (pixels)
     * @param footerHeight summarized height of this component children (pixels)
     * @param sheetTop current bottom sheet top (Screen top) **relative to container** (pixels)
     * @param bottomInset current bottom inset, used to offset the footer by keyboard height (pixels)
     */
    fun layoutFooterOnYAxis(
        containerHeight: Int,
        footerHeight: Int,
        sheetTop: Int,
        bottomInset: Int = 0,
    ) {
        // max(bottomInset, 0) is just a hack to avoid double offset of navigation bar.
        val newTop = containerHeight - footerHeight - sheetTop - max(bottomInset, 0)
        val heightBeforeUpdate = reactHeight
        this.top = max(newTop, 0)
        this.bottom = this.top + heightBeforeUpdate
    }

    companion object {
        const val TAG = "ScreenFooter"
    }
}
