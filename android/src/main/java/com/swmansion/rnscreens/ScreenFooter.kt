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
        val rootView = reactContext.currentActivity!!.window.decorView

        // Note that we do override insets animation on given view. I can see it interfering e.g.
        // with reanimated keyboard or even other places in our code. Need to test this.
        ViewCompat.setWindowInsetsAnimationCallback(rootView, insetsAnimation)
    }

    private fun requireScreenParent(): Screen = requireNotNull(screenParent)

    private fun requireSheetBehaviour(): BottomSheetBehavior<Screen> = requireNotNull(sheetBehavior)

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
        layoutFooterOnYAxis(
            lastContainerHeight,
            bottom - top,
            sheetTopInStableState(requireSheetBehaviour().state),
            lastBottomInset,
        )
    }

    // Overriding it here just to make a comment. Due to Android restrictions on layout flow, particularly
    // the fact that onMeasure must set `measuredHeight` & `measuredWidth` React calls `measure` on every
    // view group with accurate dimensions computed by Yoga. This is our entry point to get current view dimensions.
    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

    private var footerCallback =
        object : BottomSheetCallback() {
            override fun onStateChanged(
                bottomSheet: View,
                newState: Int,
            ) {
                if (!Screen.isStateStable(newState)) {
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
//            Log.i(TAG, "onSlide $slideOffset")
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
    // our callback in different places depending on whether the behaviour is already created.
    fun registerWithSheetBehaviour(behaviour: BottomSheetBehavior<Screen>) {
        if (!isCallbackRegistered) {
            behaviour.addBottomSheetCallback(footerCallback)
            isCallbackRegistered = true
        }
    }

    // Important to keep this method idempotent! We attempt to (un)register
    // our callback in different places depending on whether the behaviour is already created.
    fun unregisterWithSheetBehaviour(behaviour: BottomSheetBehavior<Screen>) {
        if (isCallbackRegistered) {
            behaviour.removeBottomSheetCallback(footerCallback)
            isCallbackRegistered = false
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        sheetBehavior?.let { registerWithSheetBehaviour(it) }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        sheetBehavior?.let { unregisterWithSheetBehaviour(it) }
    }

    private fun sheetTopInStableState(state: Int): Int {
        val behaviour = requireSheetBehaviour()
        return when (state) {
            STATE_COLLAPSED -> lastContainerHeight - behaviour.peekHeight
            STATE_HALF_EXPANDED -> (lastContainerHeight * (1 - behaviour.halfExpandedRatio)).toInt()
            STATE_EXPANDED -> behaviour.expandedOffset
            STATE_HIDDEN -> lastContainerHeight
            else -> throw IllegalArgumentException("[RNSScreen] use of stable-state method for unstable state")
        }
    }

    private fun sheetTopWhileDragging(slideOffset: Float): Int =
        MathUtils
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
            sheetTopInStableState(requireSheetBehaviour().state),
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
     * to calculate sheet properties when configuring behaviour (pixels)
     * @param footerHeight summarized height of this component children (pixels)
     * @param sheetTop current bottom sheet top (Screen top) **relative to container**
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
