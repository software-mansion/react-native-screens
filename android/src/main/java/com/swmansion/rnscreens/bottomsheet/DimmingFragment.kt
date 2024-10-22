package com.swmansion.rnscreens.bottomsheet

import android.animation.ValueAnimator
import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import androidx.appcompat.widget.Toolbar
import androidx.core.graphics.Insets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.commit
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.swmansion.rnscreens.InsetsObserverProxy
import com.swmansion.rnscreens.KeyboardDidHide
import com.swmansion.rnscreens.KeyboardNotVisible
import com.swmansion.rnscreens.KeyboardState
import com.swmansion.rnscreens.KeyboardVisible
import com.swmansion.rnscreens.NativeDismissalObserver
import com.swmansion.rnscreens.R
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenContainer
import com.swmansion.rnscreens.ScreenFragment
import com.swmansion.rnscreens.ScreenFragmentWrapper
import com.swmansion.rnscreens.ScreenStack
import com.swmansion.rnscreens.ScreenStackFragment
import com.swmansion.rnscreens.ScreenStackFragmentWrapper
import com.swmansion.rnscreens.events.ScreenDismissedEvent

/**
 * This fragment aims to provide dimming view functionality behind the nested fragment.
 * Useful when nested fragment is transparent / uses some kind of non-fullscreen presentation,
 * such as `formSheet`.
 */
class DimmingFragment(
    val nestedFragment: ScreenFragmentWrapper,
) : Fragment(),
    LifecycleEventObserver,
    ScreenStackFragmentWrapper,
    Animation.AnimationListener,
    OnApplyWindowInsetsListener,
    NativeDismissalObserver {
    private lateinit var dimmingView: DimmingView
    private lateinit var containerView: GestureTransparentViewGroup

    private val maxAlpha: Float = 0.15F

    private var isKeyboardVisible: Boolean = false
    private var keyboardState: KeyboardState = KeyboardNotVisible

    private var dimmingViewCallback: BottomSheetCallback? = null

    private val container: ScreenStack?
        get() = screen.container as? ScreenStack

    private val insetsProxy = InsetsObserverProxy

    init {
        assert(
            nestedFragment.fragment is ScreenStackFragment,
        ) { "[RNScreens] Dimming fragment is intended for use only with ScreenStackFragment" }
        val fragment = nestedFragment.fragment as ScreenStackFragment

        // We register for our child lifecycle as we want to know when it starts, because bottom sheet
        // behavior is attached only then & we want to attach our own callbacks to it.
        fragment.lifecycle.addObserver(this)
        fragment.nativeDismissalObserver = this
    }

    /**
     * This bottom sheet callback is responsible for animating alpha of the dimming view.
     */
    private class AnimateDimmingViewCallback(
        val screen: Screen,
        val viewToAnimate: View,
        val maxAlpha: Float,
    ) : BottomSheetCallback() {
        // largest *slide offset* that is yet undimmed
        private var largestUndimmedOffset: Float =
            computeOffsetFromDetentIndex(screen.sheetLargestUndimmedDetentIndex)

        // first *slide offset* that should be fully dimmed
        private var firstDimmedOffset: Float =
            computeOffsetFromDetentIndex(
                (screen.sheetLargestUndimmedDetentIndex + 1).coerceIn(
                    0,
                    screen.sheetDetents.count() - 1,
                ),
            )

        // interval that we interpolate the alpha value over
        private var intervalLength = firstDimmedOffset - largestUndimmedOffset
        private val animator =
            ValueAnimator.ofFloat(0F, maxAlpha).apply {
                duration = 1 // Driven manually
                addUpdateListener {
                    viewToAnimate.alpha = it.animatedValue as Float
                }
            }

        override fun onStateChanged(
            bottomSheet: View,
            newState: Int,
        ) {
            if (newState == BottomSheetBehavior.STATE_DRAGGING || newState == BottomSheetBehavior.STATE_SETTLING) {
                largestUndimmedOffset =
                    computeOffsetFromDetentIndex(screen.sheetLargestUndimmedDetentIndex)
                firstDimmedOffset =
                    computeOffsetFromDetentIndex(
                        (screen.sheetLargestUndimmedDetentIndex + 1).coerceIn(
                            0,
                            screen.sheetDetents.count() - 1,
                        ),
                    )
                assert(firstDimmedOffset >= largestUndimmedOffset) {
                    "[RNScreens] Invariant violation: firstDimmedOffset ($firstDimmedOffset) < largestDimmedOffset ($largestUndimmedOffset)"
                }
                intervalLength = firstDimmedOffset - largestUndimmedOffset
            }
        }

        override fun onSlide(
            bottomSheet: View,
            slideOffset: Float,
        ) {
            if (largestUndimmedOffset < slideOffset && slideOffset < firstDimmedOffset) {
                val fraction = (slideOffset - largestUndimmedOffset) / intervalLength
                animator.setCurrentFraction(fraction)
            }
        }

        /**
         * This method does compute slide offset (see [BottomSheetCallback.onSlide] docs) for detent
         * at given index in the detents array.
         */
        private fun computeOffsetFromDetentIndex(index: Int): Float =
            when (screen.sheetDetents.size) {
                1 -> // Only 1 detent present in detents array
                    when (index) {
                        -1 -> -1F // hidden
                        0 -> 1F // fully expanded
                        else -> -1F // unexpected, default
                    }

                2 ->
                    when (index) {
                        -1 -> -1F // hidden
                        0 -> 0F // collapsed
                        1 -> 1F // expanded
                        else -> -1F
                    }

                3 ->
                    when (index) {
                        -1 -> -1F // hidden
                        0 -> 0F // collapsed
                        1 -> screen.sheetBehavior!!.halfExpandedRatio // half
                        2 -> 1F // expanded
                        else -> -1F
                    }

                else -> -1F
            }
    }

    override fun onCreateAnimation(
        transit: Int,
        enter: Boolean,
        nextAnim: Int,
    ): Animation? =
        // We want dimming view to have always fade animation in current usages.
        AnimationUtils.loadAnimation(
            context,
            if (enter) R.anim.rns_fade_in else R.anim.rns_fade_out,
        )

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        initViewHierarchy()
        return containerView
    }

    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?,
    ) {
        if (screen.sheetInitialDetentIndex <= screen.sheetLargestUndimmedDetentIndex) {
            dimmingView.alpha = 0.0F
        } else {
            dimmingView.alpha = maxAlpha
        }
    }

    override fun onStart() {
        // This is the earliest we can access child fragment manager & present another fragment
        super.onStart()
        insetsProxy.registerOnView(requireRootView())
        presentNestedFragment()
    }

    override fun onResume() {
        insetsProxy.addOnApplyWindowInsetsListener(this)
        super.onResume()
    }

    override fun onPause() {
        super.onPause()
        insetsProxy.removeOnApplyWindowInsetsListener(this)
    }

    override fun onStateChanged(
        source: LifecycleOwner,
        event: Lifecycle.Event,
    ) {
        when (event) {
            Lifecycle.Event.ON_START -> {
                nestedFragment.screen.sheetBehavior?.let {
                    dimmingViewCallback =
                        AnimateDimmingViewCallback(nestedFragment.screen, dimmingView, maxAlpha)
                    it.addBottomSheetCallback(dimmingViewCallback!!)
                }
            }

            else -> {}
        }
    }

    private fun presentNestedFragment() {
        childFragmentManager.commit(allowStateLoss = true) {
            setReorderingAllowed(true)
            add(requireView().id, nestedFragment.fragment, null)
        }
    }

    private fun cleanRegisteredCallbacks() {
        dimmingViewCallback?.let {
            nestedFragment.screen.sheetBehavior?.removeBottomSheetCallback(it)
        }
        dimmingView.setOnClickListener(null)
        nestedFragment.fragment.lifecycle.removeObserver(this)
        insetsProxy.removeOnApplyWindowInsetsListener(this)
    }

    private fun dismissSelf(emitDismissedEvent: Boolean = false) {
        if (!this.isRemoving) {
            if (emitDismissedEvent) {
                val reactContext = nestedFragment.screen.reactContext
                val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                UIManagerHelper
                    .getEventDispatcherForReactTag(reactContext, screen.id)
                    ?.dispatchEvent(ScreenDismissedEvent(surfaceId, screen.id))
            }
            cleanRegisteredCallbacks()
            dismissFromContainer()
        }
    }

    private fun initViewHierarchy() {
        initContainerView()
        initDimmingView()
        containerView.addView(dimmingView)
    }

    private fun initContainerView() {
        containerView =
            GestureTransparentViewGroup(requireContext()).apply {
                // These do not guarantee fullscreen width & height, TODO: find a way to guarantee that
                layoutParams =
                    ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT,
                    )
                setBackgroundColor(Color.TRANSPARENT)
                // This is purely native view, React does not know of it, thus there should be no conflict with ids.
                id = View.generateViewId()
            }
    }

    private fun initDimmingView() {
        dimmingView =
            DimmingView(requireContext(), maxAlpha).apply {
                // These do not guarantee fullscreen width & height, TODO: find a way to guarantee that
                layoutParams =
                    ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT,
                    )
                setOnClickListener {
                    if (screen.sheetClosesOnTouchOutside) {
                        dismissSelf(true)
                    }
                }
            }
    }

    private fun requireRootView(): View =
        checkNotNull(screen.reactContext.currentActivity) { "[RNScreens] Attempt to access activity on detached context" }
            .window.decorView

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

    override fun tryGetActivity(): Activity? = activity

    override fun tryGetContext(): ReactContext? = context as? ReactContext?

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
        fragmentWrapper: ScreenFragmentWrapper,
    ) {
        TODO("Not yet implemented")
    }

    override fun dispatchLifecycleEventInChildContainers(event: ScreenFragment.ScreenLifecycleEvent) {
        TODO("Not yet implemented")
    }

    override fun dispatchHeaderBackButtonClickedEvent() {
        TODO("Not yet implemented")
    }

    override fun dispatchTransitionProgressEvent(
        alpha: Float,
        closing: Boolean,
    ) {
        TODO("Not yet implemented")
    }

    override fun onAnimationStart(animation: Animation?) = Unit

    override fun onAnimationEnd(animation: Animation?) {
        dismissFromContainer()
    }

    override fun onAnimationRepeat(animation: Animation?) = Unit

    companion object {
        const val TAG = "DimmingFragment"
    }

    // This is View.OnApplyWindowInsetsListener method, not view's own!
    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        val isImeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
        val imeInset = insets.getInsets(WindowInsetsCompat.Type.ime())

        if (isImeVisible) {
            isKeyboardVisible = true
            keyboardState = KeyboardVisible(imeInset.bottom)
            screen.sheetBehavior?.let {
                (nestedFragment as ScreenStackFragment).configureBottomSheetBehaviour(
                    it,
                    KeyboardVisible(imeInset.bottom),
                )
            }

            if (this.isRemoving) {
                return insets
            }

            val prevInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
            return WindowInsetsCompat
                .Builder(insets)
                .setInsets(
                    WindowInsetsCompat.Type.navigationBars(),
                    Insets.of(
                        prevInsets.left,
                        prevInsets.top,
                        prevInsets.right,
                        0,
                    ),
                ).build()
        } else {
            if (this.isRemoving) {
                val prevInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
                return WindowInsetsCompat
                    .Builder(insets)
                    .setInsets(
                        WindowInsetsCompat.Type.navigationBars(),
                        Insets.of(
                            prevInsets.left,
                            prevInsets.top,
                            prevInsets.right,
                            0,
                        ),
                    ).build()
            }

            screen.sheetBehavior?.let {
                if (isKeyboardVisible) {
                    (nestedFragment as ScreenStackFragment).configureBottomSheetBehaviour(
                        it,
                        KeyboardDidHide,
                    )
                } else if (keyboardState != KeyboardNotVisible) {
                    (nestedFragment as ScreenStackFragment).configureBottomSheetBehaviour(
                        it,
                        KeyboardNotVisible,
                    )
                } else {
                }
            }

            keyboardState = KeyboardNotVisible
            isKeyboardVisible = false

            val prevInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
            return WindowInsetsCompat
                .Builder(insets)
                .setInsets(
                    WindowInsetsCompat.Type.navigationBars(),
                    Insets.of(
                        prevInsets.left,
                        prevInsets.top,
                        prevInsets.right,
                        0,
                    ),
                ).build()
        }
    }

    override fun onNativeDismiss(dismissed: ScreenStackFragmentWrapper) {
        dismissSelf(emitDismissedEvent = true)
    }
}
