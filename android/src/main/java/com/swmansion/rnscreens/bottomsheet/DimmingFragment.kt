package com.swmansion.rnscreens.bottomsheet

import android.animation.ValueAnimator
import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import androidx.annotation.RequiresApi
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import androidx.fragment.app.commit
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.swmansion.rnscreens.R
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenContainer
import com.swmansion.rnscreens.ScreenFragment
import com.swmansion.rnscreens.ScreenFragmentWrapper
import com.swmansion.rnscreens.ScreenStack
import com.swmansion.rnscreens.ScreenStackFragmentWrapper
import com.swmansion.rnscreens.events.ScreenDismissedEvent

class DimmingFragment(val nestedFragment: ScreenFragmentWrapper) :
    Fragment(),
    LifecycleEventObserver,
    ScreenStackFragmentWrapper,
    Animation.AnimationListener {
    private lateinit var dimmingView: DimmingView
    private lateinit var containerView: GestureTransparentFrameLayout

    private val maxAlpha: Float = 0.6F

    private var dimmingViewCallback: BottomSheetCallback? = null

    private val container: ScreenStack?
        get() = screen.container as? ScreenStack

    init {
        // We register for our child lifecycle as we want to know when it's dismissed via native gesture
        nestedFragment.fragment.lifecycle.addObserver(this)
    }

    private class AnimateDimmingViewCallback(val screen: Screen, val viewToAnimate: View, val maxAlpha: Float) : BottomSheetCallback() {
        private var largestUndimmedOffset: Float = computeOffsetFromDetentIndex(screen.sheetLargestUndimmedDetentIndex)
        private var firstDimmedOffset: Float = computeOffsetFromDetentIndex((screen.sheetLargestUndimmedDetentIndex + 1).coerceIn(0, screen.sheetDetents.count() - 1))
        private var intervalLength = firstDimmedOffset - largestUndimmedOffset
        private var animator = ValueAnimator.ofFloat(0F, maxAlpha).apply {
            duration = 1
            addUpdateListener {
                viewToAnimate.alpha = it.animatedValue as Float
            }
        }

        override fun onStateChanged(bottomSheet: View, newState: Int) {
            if (newState == BottomSheetBehavior.STATE_DRAGGING || newState == BottomSheetBehavior.STATE_SETTLING) {
                largestUndimmedOffset = computeOffsetFromDetentIndex(screen.sheetLargestUndimmedDetentIndex)
                firstDimmedOffset = computeOffsetFromDetentIndex((screen.sheetLargestUndimmedDetentIndex + 1).coerceIn(0, screen.sheetDetents.count() - 1))
                assert(firstDimmedOffset >= largestUndimmedOffset) { "fdo: $firstDimmedOffset, luo: $largestUndimmedOffset" }
                intervalLength = firstDimmedOffset - largestUndimmedOffset
            } else if (newState != BottomSheetBehavior.STATE_HIDDEN) {
            }
        }

        @RequiresApi(Build.VERSION_CODES.LOLLIPOP_MR1)
        override fun onSlide(bottomSheet: View, slideOffset: Float) {

            if (largestUndimmedOffset < slideOffset && slideOffset < firstDimmedOffset) {
                val fraction = (slideOffset - largestUndimmedOffset) / intervalLength
                animator!!.setCurrentFraction(fraction)
            }
        }

        private fun computeOffsetFromDetentIndex(index: Int): Float {
            return when (screen.sheetDetents.size) {
                1 -> when (index) {
                    -1 -> -1F
                    0 -> 1F
                    else -> -1F
                }
                2 -> when (index) {
                    -1 -> -1F
                    0 -> 0F
                    1 -> 1F
                    else -> -1F
                }
                3 -> when (index) {
                    -1 -> -1F
                    0 -> 0F
                    1 -> screen.sheetBehavior!!.halfExpandedRatio
                    2 -> 1F
                    else -> -1F
                }
                else -> -1F
            }
        }
    }

    override fun onCreateAnimation(transit: Int, enter: Boolean, nextAnim: Int): Animation? {
        return AnimationUtils.loadAnimation(context, if (enter) R.anim.rns_fade_in else R.anim.rns_fade_out)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        initViewHierarchy()
        return containerView
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        if (screen.sheetInitialDetentIndex <= screen.sheetLargestUndimmedDetentIndex) {
            dimmingView.alpha = 0.0F
        } else {
            dimmingView.alpha = maxAlpha
        }
    }

    override fun onStart() {
        // This is the earliest we can access child fragment manager & present another fragment
        super.onStart()
        childFragmentManager.commit(allowStateLoss = true) {
            setReorderingAllowed(true)
//            setCustomAnimations(R.anim.rns_slide_in_from_bottom, R.anim.rns_slide_out_to_bottom)
            add(requireView().id, nestedFragment.fragment, null)
        }
    }

    override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
        when (event) {
            Lifecycle.Event.ON_START -> {
                nestedFragment.screen.sheetBehavior?.let {
                    dimmingViewCallback = AnimateDimmingViewCallback(nestedFragment.screen, dimmingView, maxAlpha)
                    it.addBottomSheetCallback(dimmingViewCallback!!)
                }
            }
            Lifecycle.Event.ON_STOP -> {
                source.lifecycle.removeObserver(this@DimmingFragment)
                dimmingViewCallback?.let {
                    nestedFragment.screen.sheetBehavior?.removeBottomSheetCallback(it)
                }
                selfDismiss(emitDismissedEvent = true)
            }
            else -> {}
        }
    }

    private fun selfDismiss(emitDismissedEvent: Boolean = false) {
        if (!this.isRemoving) {
            if (emitDismissedEvent) {
                val reactContext = nestedFragment.screen.reactContext
                val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                UIManagerHelper
                    .getEventDispatcherForReactTag(reactContext, screen.id)
                    ?.dispatchEvent(ScreenDismissedEvent(surfaceId, screen.id))
            }
            dismissFromContainer()
        }
    }

    private fun initViewHierarchy() {
        initContainerView()
        initDimmingView()
        containerView.addView(dimmingView)
    }

    private fun initContainerView() {
        containerView = GestureTransparentFrameLayout(requireContext()).apply {
            // These do not guarantee fullscreen width & height, TODO: find a way to guarantee that
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
            setBackgroundColor(Color.TRANSPARENT)
            id = View.generateViewId()
        }
    }

    private fun initDimmingView() {
        dimmingView = DimmingView(requireContext(), maxAlpha).apply {
            // These do not guarantee fullscreen width & height, TODO: find a way to guarantee that
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setOnClickListener {
                if (screen.sheetClosesWhenTouchOutside) {
                    selfDismiss(true)
                }
            }
        }
    }

    // TODO: Move these methods related to toolbar to separate interface
    override fun removeToolbar() = Unit

    override fun setToolbar(toolbar: Toolbar) = Unit

    override fun setToolbarShadowHidden(hidden: Boolean) = Unit

    override fun setToolbarTranslucent(translucent: Boolean) = Unit

    // Dimming view should never be bottom-most fragment
    override fun canNavigateBack(): Boolean = true

    override fun dismissFromContainer() {
        container?.dismiss(this)
    }

    override var screen: Screen
        get() = nestedFragment.screen
        set(value) {
            nestedFragment.screen = value
        }

    override val childScreenContainers: List<ScreenContainer> = nestedFragment.childScreenContainers

    override fun addChildScreenContainer(container: ScreenContainer) {
        nestedFragment.addChildScreenContainer(container)
    }

    override fun removeChildScreenContainer(container: ScreenContainer) {
        nestedFragment.removeChildScreenContainer(container)
    }

    override fun onContainerUpdate() {
        nestedFragment.onContainerUpdate()
    }

    override fun onViewAnimationStart() {
        nestedFragment.onViewAnimationStart()
    }

    override fun onViewAnimationEnd() {
        nestedFragment.onViewAnimationEnd()
    }

    override fun tryGetActivity(): Activity? {
        return activity
//        TODO("Not yet implemented")
    }

    override fun tryGetContext(): ReactContext? {
        return context as? ReactContext?
//        TODO("Not yet implemented")
    }

    override val fragment: Fragment
        get() = this

    override fun canDispatchLifecycleEvent(event: ScreenFragment.ScreenLifecycleEvent): Boolean {
        TODO("Not yet implemented")
    }

    override fun updateLastEventDispatched(event: ScreenFragment.ScreenLifecycleEvent) {
        TODO("Not yet implemented")
    }

    override fun dispatchLifecycleEvent(
        event: ScreenFragment.ScreenLifecycleEvent,
        fragmentWrapper: ScreenFragmentWrapper
    ) {
        TODO("Not yet implemented")
    }

    override fun dispatchLifecycleEventInChildContainers(event: ScreenFragment.ScreenLifecycleEvent) {
        TODO("Not yet implemented")
    }

    override fun dispatchHeaderBackButtonClickedEvent() {
        TODO("Not yet implemented")
    }

    override fun dispatchTransitionProgressEvent(alpha: Float, closing: Boolean) {
        TODO("Not yet implemented")
    }

    override fun onAnimationStart(animation: Animation?) = Unit

    override fun onAnimationEnd(animation: Animation?) {
        dismissFromContainer()
    }

    override fun onAnimationRepeat(animation: Animation?) = Unit

    companion object {
        const val TAG = "DimmingFragment"

        fun isStateLessEqualThan(state: Int, otherState: Int): Boolean {
            if (state == otherState) {
                return true
            }
            if (state != BottomSheetBehavior.STATE_HALF_EXPANDED && otherState != BottomSheetBehavior.STATE_HALF_EXPANDED) {
                return state > otherState
            }
            if (state == BottomSheetBehavior.STATE_HALF_EXPANDED) {
                return otherState == BottomSheetBehavior.STATE_EXPANDED
            }
            if (state == BottomSheetBehavior.STATE_COLLAPSED) {
                return otherState != BottomSheetBehavior.STATE_HIDDEN
            }
            return false
        }
    }
}
