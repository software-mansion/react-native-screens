package com.swmansion.rnscreens.bottomsheet

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import android.content.Context
import android.os.Build
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.view.inputmethod.InputMethodManager
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.graphics.Insets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.InsetsObserverProxy
import com.swmansion.rnscreens.KeyboardDidHide
import com.swmansion.rnscreens.KeyboardNotVisible
import com.swmansion.rnscreens.KeyboardState
import com.swmansion.rnscreens.KeyboardVisible
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenStackFragment
import com.swmansion.rnscreens.events.ScreenAnimationDelegate
import com.swmansion.rnscreens.events.ScreenEventEmitter
import com.swmansion.rnscreens.transition.ExternalBoundaryValuesEvaluator
import com.swmansion.rnscreens.utils.isSoftKeyboardVisibleOrNull

class SheetDelegate(
    val screen: Screen,
) : LifecycleEventObserver,
    OnApplyWindowInsetsListener {
    private var isKeyboardVisible: Boolean = false
    private var keyboardState: KeyboardState = KeyboardNotVisible

    private var isSheetAnimationInProgress: Boolean = false

    private var lastTopInset: Int = 0
    private var lastKeyboardBottomOffset: Int = 0

    var lastStableDetentIndex: Int = screen.sheetInitialDetentIndex
        private set

    @BottomSheetBehavior.State
    var lastStableState: Int =
        screen.sheetDetents.sheetStateFromIndex(
            screen.sheetInitialDetentIndex,
        )
        private set

    private val sheetStateObserver = SheetStateObserver()
    private val keyboardHandlerCallback = KeyboardHandler()

    private val sheetBehavior: BottomSheetBehavior<Screen>?
        get() = screen.sheetBehavior

    private val stackFragment: ScreenStackFragment
        get() = screen.fragment as ScreenStackFragment

    private fun requireDecorView(): View =
        checkNotNull(screen.reactContext.currentActivity) { "[RNScreens] Attempt to access activity on detached context" }
            .window.decorView

    private var viewToRestoreFocus: View? = null

    private val inputMethodManager: InputMethodManager?
        get() = screen.reactContext.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager

    init {
        assert(screen.fragment is ScreenStackFragment) { "[RNScreens] Sheets are supported only in native stack" }
        screen.fragment!!.lifecycle.addObserver(this)

        checkNotNull(sheetBehavior) { "[RNScreens] Sheet delegate accepts screen with initialized sheet behaviour only." }
            .addBottomSheetCallback(sheetStateObserver)
    }

    // LifecycleEventObserver
    override fun onStateChanged(
        source: LifecycleOwner,
        event: Lifecycle.Event,
    ) {
        when (event) {
            Lifecycle.Event.ON_CREATE -> handleHostFragmentOnCreate()
            Lifecycle.Event.ON_START -> handleHostFragmentOnStart()
            Lifecycle.Event.ON_RESUME -> handleHostFragmentOnResume()
            Lifecycle.Event.ON_PAUSE -> handleHostFragmentOnPause()
            Lifecycle.Event.ON_DESTROY -> handleHostFragmentOnDestroy()
            else -> Unit
        }
    }

    private fun handleHostFragmentOnCreate() {
        preserveBackgroundFocus()
    }

    private fun handleHostFragmentOnStart() {
        InsetsObserverProxy.registerOnView(requireDecorView())
    }

    private fun handleHostFragmentOnResume() {
        InsetsObserverProxy.addOnApplyWindowInsetsListener(this)
    }

    private fun handleHostFragmentOnPause() {
        InsetsObserverProxy.removeOnApplyWindowInsetsListener(this)
    }

    private fun handleHostFragmentOnDestroy() {
        restoreBackgroundFocus()
    }

    private fun onSheetStateChanged(newState: Int) {
        val isStable = SheetUtils.isStateStable(newState)

        if (isStable) {
            lastStableState = newState
            lastStableDetentIndex =
                screen.sheetDetents.indexFromSheetState(
                    newState,
                )
        }

        screen.onSheetDetentChanged(lastStableDetentIndex, isStable)

        if (shouldDismissSheetInState(newState)) {
            stackFragment.dismissSelf()
        }
    }

    private fun preserveBackgroundFocus() {
        val activity = screen.reactContext.currentActivity ?: return

        activity.currentFocus?.let { focusedView ->
            activity.window?.decorView?.let { decorView ->
                if (isSoftKeyboardVisibleOrNull(decorView) == true) {
                    viewToRestoreFocus = focusedView
                }
            }

            // Note: There's no good reason that Screen should be direct target for focus, we're rather
            // prefer its children to gain it.
            screen.descendantFocusability = ViewGroup.FOCUS_AFTER_DESCENDANTS
            screen.requestFocus()
            inputMethodManager?.hideSoftInputFromWindow(focusedView.windowToken, 0)
        }
    }

    private fun restoreBackgroundFocus() {
        viewToRestoreFocus?.let { view ->
            view.requestFocus()
            inputMethodManager?.showSoftInput(view, 0)
        }
        viewToRestoreFocus = null
    }

    internal fun updateBottomSheetMetrics(behavior: BottomSheetBehavior<Screen>) {
        val containerHeight = tryResolveMaxFormSheetHeight()
        check(containerHeight != null) {
            "[RNScreens] Failed to find window height during bottom sheet behaviour configuration"
        }

        val maxAllowedHeight =
            when (screen.isSheetFitToContents()) {
                true ->
                    screen.contentWrapper?.let { contentWrapper ->
                        contentWrapper.height.takeIf {
                            // subtree might not be laid out, e.g. after fragment reattachment
                            // and view recreation, however since it is retained by
                            // react-native it has its height cached. We want to use it.
                            // Otherwise we would have to trigger RN layout manually.
                            contentWrapper.isLaidOutOrHasCachedLayout()
                        }
                    }
                false -> (screen.sheetDetents.highest() * containerHeight).toInt()
            }

        // For 3 detents, we need to add the top inset back here because we are calculating the offset
        // from the absolute top of the view, but our calculated max height (containerHeight)
        // has been reduced by this inset.
        val expandedOffsetFromTop =
            when (screen.sheetDetents.count) {
                3 -> screen.sheetDetents.expandedOffsetFromTop(containerHeight, lastTopInset)
                else -> null
            }

        behavior.updateMetrics(maxAllowedHeight, expandedOffsetFromTop)
    }

    internal fun configureBottomSheetBehaviour(
        behavior: BottomSheetBehavior<Screen>,
        keyboardState: KeyboardState = KeyboardNotVisible,
        selectedDetentIndex: Int = lastStableDetentIndex,
    ): BottomSheetBehavior<Screen> {
        val containerHeight = tryResolveMaxFormSheetHeight()
        check(containerHeight != null) {
            "[RNScreens] Failed to find window height during bottom sheet behaviour configuration"
        }

        behavior.apply {
            isHideable = true
            isDraggable = true
        }

        // There is a guard internally that does not allow the callback to be duplicated.
        behavior.addBottomSheetCallback(sheetStateObserver)

        screen.footer?.registerWithSheetBehavior(behavior)

        return when (keyboardState) {
            is KeyboardNotVisible -> {
                when (screen.sheetDetents.count) {
                    1 ->
                        behavior.apply {
                            val height =
                                if (screen.isSheetFitToContents()) {
                                    screen.sheetDetents.maxAllowedHeightForFitToContents(screen)
                                } else {
                                    screen.sheetDetents.maxAllowedHeight(containerHeight)
                                }
                            useSingleDetent(maxAllowedHeight = height)
                        }

                    2 ->
                        behavior.useTwoDetents(
                            state =
                                screen.sheetDetents.sheetStateFromIndex(
                                    selectedDetentIndex,
                                ),
                            firstHeight = screen.sheetDetents.firstHeight(containerHeight),
                            maxAllowedHeight = screen.sheetDetents.maxAllowedHeight(containerHeight),
                        )

                    3 ->
                        behavior.useThreeDetents(
                            state =
                                screen.sheetDetents.sheetStateFromIndex(
                                    selectedDetentIndex,
                                ),
                            firstHeight = screen.sheetDetents.firstHeight(containerHeight),
                            halfExpandedRatio = screen.sheetDetents.halfExpandedRatio(),
                            maxAllowedHeight = screen.sheetDetents.maxAllowedHeight(containerHeight),
                            expandedOffsetFromTop = screen.sheetDetents.expandedOffsetFromTop(containerHeight, lastTopInset),
                        )

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count}. Expected at most 3.",
                    )
                }
            }

            is KeyboardVisible -> {
                val isOnScreenKeyboardVisible = keyboardState.height != 0

                when (screen.sheetDetents.count) {
                    1 ->
                        behavior.apply {
                            addBottomSheetCallback(keyboardHandlerCallback)
                        }

                    2 ->
                        behavior.apply {
                            if (isOnScreenKeyboardVisible) {
                                useTwoDetents(
                                    state = BottomSheetBehavior.STATE_EXPANDED,
                                )
                            } else {
                                useTwoDetents()
                            }
                            addBottomSheetCallback(keyboardHandlerCallback)
                        }

                    3 ->
                        behavior.apply {
                            if (isOnScreenKeyboardVisible) {
                                useThreeDetents(
                                    state = BottomSheetBehavior.STATE_EXPANDED,
                                )
                            } else {
                                useThreeDetents()
                            }
                            addBottomSheetCallback(keyboardHandlerCallback)
                        }

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count}. Expected at most 3.",
                    )
                }
            }

            is KeyboardDidHide -> {
                // Here we assume that the keyboard was either closed explicitly by user,
                // or the user dragged the sheet down. In any case the state should
                // stay unchanged.

                behavior.removeBottomSheetCallback(keyboardHandlerCallback)
                when (screen.sheetDetents.count) {
                    1 ->
                        behavior.apply {
                            val height =
                                if (screen.isSheetFitToContents()) {
                                    screen.sheetDetents.maxAllowedHeightForFitToContents(screen)
                                } else {
                                    screen.sheetDetents.maxAllowedHeight(containerHeight)
                                }
                            useSingleDetent(maxAllowedHeight = height, forceExpandedState = false)
                        }

                    2 ->
                        behavior.useTwoDetents(
                            firstHeight = screen.sheetDetents.firstHeight(containerHeight),
                            maxAllowedHeight = screen.sheetDetents.maxAllowedHeight(containerHeight),
                        )

                    3 ->
                        behavior.useThreeDetents(
                            firstHeight = screen.sheetDetents.firstHeight(containerHeight),
                            halfExpandedRatio = screen.sheetDetents.halfExpandedRatio(),
                            maxAllowedHeight = screen.sheetDetents.maxAllowedHeight(containerHeight),
                            expandedOffsetFromTop = screen.sheetDetents.expandedOffsetFromTop(containerHeight, lastTopInset),
                        )

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count}. Expected at most 3.",
                    )
                }
            }
        }
    }

    // This function calculates the Y offset to which the FormSheet should animate
    // when appearing (entering) or disappearing (exiting) with the on-screen keyboard (IME) present.
    // Its purpose is to ensure the FormSheet does not exceed the top edge of the screen.
    // It tries to display the FormSheet fully above the keyboard when there's enough space.
    // Otherwise, it shifts the sheet as high as possible, even if it means part of its content
    // will remain hidden behind the keyboard.
    internal fun computeSheetOffsetYWithIMEPresent(keyboardHeight: Int): Int {
        val containerHeight = tryResolveMaxFormSheetHeight()
        check(containerHeight != null) {
            "[RNScreens] Failed to find window height during bottom sheet behaviour configuration"
        }

        if (screen.isSheetFitToContents()) {
            val contentHeight = screen.contentWrapper?.height ?: 0
            val offsetFromTop = maxOf(containerHeight - contentHeight, 0)
            // If the content is higher than the Screen, offsetFromTop becomes negative.
            // In such cases, we return 0 because a negative translation would shift the Screen
            // to the bottom, which is not intended.
            return minOf(offsetFromTop, keyboardHeight)
        }

        val detents = screen.sheetDetents

        val detentValue = detents.highest().coerceIn(0.0, 1.0)
        val sheetHeight = (detentValue * containerHeight).toInt()
        val offsetFromTop = containerHeight - sheetHeight

        return minOf(offsetFromTop, keyboardHeight)
    }

    // This is listener function, not the view's.
    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        val isImeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
        val imeInset = insets.getInsets(WindowInsetsCompat.Type.ime())
        val systemBarsInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars())
        val displayCutoutInsets = insets.getInsets(WindowInsetsCompat.Type.displayCutout())

        // We save the top inset (status bar height or display cutout) to later
        // subtract it from the window height during sheet size calculations.
        // This ensures the sheet respects the safe area.
        lastTopInset = maxOf(systemBarsInsets.top, displayCutoutInsets.top)

        if (isImeVisible) {
            isKeyboardVisible = true
            keyboardState = KeyboardVisible(imeInset.bottom)
            sheetBehavior?.let {
                this.configureBottomSheetBehaviour(it, keyboardState)
            }
        } else {
            sheetBehavior?.let {
                if (isKeyboardVisible) {
                    this.configureBottomSheetBehaviour(it, KeyboardDidHide)
                } else if (keyboardState != KeyboardNotVisible) {
                    this.configureBottomSheetBehaviour(it, KeyboardNotVisible)
                }
            }

            keyboardState = KeyboardNotVisible
            isKeyboardVisible = false
        }

        val newBottomInset = if (!isImeVisible) systemBarsInsets.bottom else 0

        // Note: We do not manipulate the top inset manually. Therefore, if SafeAreaView has top insets enabled,
        // we must retain the top inset even if the formSheet does not currently overflow into the status bar.
        // This is important because in some specific edge cases - for example, when the keyboard slides in -
        // the formSheet might overlap the status bar. If we ignored the top inset and it suddenly became necessary,
        // it would result in a noticeable visual content jump. To ensure consistency and avoid layout shifts,
        // we always include the top inset upfront, which can be disabled from the application perspective.
        return WindowInsetsCompat
            .Builder(insets)
            .setInsets(
                WindowInsetsCompat.Type.systemBars(),
                Insets.of(systemBarsInsets.left, systemBarsInsets.top, systemBarsInsets.right, newBottomInset),
            ).build()
    }

    private fun shouldDismissSheetInState(
        @BottomSheetBehavior.State state: Int,
    ) = state == BottomSheetBehavior.STATE_HIDDEN

    internal fun tryResolveMaxFormSheetHeight(): Int? =
        if (screen.sheetShouldOverflowTopInset) {
            tryResolveContainerHeight()
        } else {
            tryResolveSafeAreaSpaceForSheet()
        }

    /**
     * This method tries to resolve the maximum height available for the sheet content,
     * accounting for the system top inset.
     */
    private fun tryResolveSafeAreaSpaceForSheet(): Int? = tryResolveContainerHeight()?.let { it - lastTopInset }

    /**
     * This method might return slightly different values depending on code path,
     * but during testing I've found this effect negligible. For practical purposes
     * this is acceptable.
     */
    private fun tryResolveContainerHeight(): Int? {
        screen.container?.let { return it.height }

        val context = screen.reactContext

        context
            .resources
            ?.displayMetrics
            ?.heightPixels
            ?.let { return it }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            (context.getSystemService(Context.WINDOW_SERVICE) as? WindowManager)
                ?.currentWindowMetrics
                ?.bounds
                ?.height()
                ?.let { return it }
        }
        return null
    }

    // Sheet entering/exiting animations

    internal fun createSheetEnterAnimator(sheetAnimationContext: SheetAnimationContext): Animator {
        val animatorSet = AnimatorSet()

        val dimmingDelegate = sheetAnimationContext.dimmingDelegate
        val screenStackFragment = sheetAnimationContext.fragment

        val alphaAnimator = createDimmingViewAlphaAnimator(0f, dimmingDelegate.maxAlpha, dimmingDelegate)
        val slideAnimator = createSheetSlideInAnimator()

        animatorSet
            .play(slideAnimator)
            .takeIf {
                dimmingDelegate.willDimForDetentIndex(screen, screen.sheetInitialDetentIndex)
            }?.with(alphaAnimator)

        attachCommonListeners(animatorSet, isEnter = true, screenStackFragment)

        return animatorSet
    }

    internal fun createSheetExitAnimator(sheetAnimationContext: SheetAnimationContext): Animator {
        val animatorSet = AnimatorSet()

        val coordinatorLayout = sheetAnimationContext.coordinatorLayout
        val dimmingDelegate = sheetAnimationContext.dimmingDelegate
        val screenStackFragment = sheetAnimationContext.fragment

        val alphaAnimator =
            createDimmingViewAlphaAnimator(dimmingDelegate.dimmingView.alpha, 0f, dimmingDelegate)
        val slideAnimator = createSheetSlideOutAnimator(coordinatorLayout)

        animatorSet.play(alphaAnimator).with(slideAnimator)

        attachCommonListeners(animatorSet, isEnter = false, screenStackFragment)

        return animatorSet
    }

    private fun createDimmingViewAlphaAnimator(
        from: Float,
        to: Float,
        dimmingDelegate: DimmingViewManager,
    ): ValueAnimator =
        ValueAnimator.ofFloat(from, to).apply {
            addUpdateListener { animator ->
                (animator.animatedValue as? Float)?.let {
                    dimmingDelegate.dimmingView.alpha = it
                }
            }
        }

    private fun createSheetSlideInAnimator(): ValueAnimator {
        val startValueCallback = { _: Number? -> screen.height.toFloat() }
        val evaluator = ExternalBoundaryValuesEvaluator(startValueCallback, { 0f })

        return ValueAnimator.ofObject(evaluator, screen.height.toFloat(), 0f).apply {
            addUpdateListener { updateSheetTranslationY(it.animatedValue as Float) }
        }
    }

    private fun createSheetSlideOutAnimator(coordinatorLayout: CoordinatorLayout): ValueAnimator {
        val endValue = (coordinatorLayout.bottom - screen.top - screen.translationY)

        return ValueAnimator.ofFloat(0f, endValue).apply {
            addUpdateListener {
                updateSheetTranslationY(it.animatedValue as Float)
            }
        }
    }

    private fun updateSheetTranslationY(baseTranslationY: Float) {
        val keyboardCorrection = lastKeyboardBottomOffset
        val bottomOffset = computeSheetOffsetYWithIMEPresent(keyboardCorrection).toFloat()

        screen.translationY = baseTranslationY - bottomOffset
    }

    internal fun handleKeyboardInsetsProgress(insets: WindowInsetsCompat) {
        lastKeyboardBottomOffset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
        // Prioritize enter/exit animations over direct keyboard inset reactions.
        // We store the latest keyboard offset in `lastKeyboardBottomOffset`
        // so that it can always be respected when applying translations in `updateSheetTranslationY`.
        //
        // This approach allows screen translation to be triggered from two sources, but without messing them together:
        // - During enter/exit animations, while accounting for the keyboard height.
        // - While interacting with a TextInput inside the bottom sheet, to handle keyboard show/hide events.
        if (!isSheetAnimationInProgress) {
            updateSheetTranslationY(0f)
        }
    }

    private fun attachCommonListeners(
        animatorSet: AnimatorSet,
        isEnter: Boolean,
        screenStackFragment: ScreenStackFragment,
    ) {
        animatorSet.addListener(
            ScreenAnimationDelegate(
                screenStackFragment,
                ScreenEventEmitter(screen),
                if (isEnter) {
                    ScreenAnimationDelegate.AnimationType.ENTER
                } else {
                    ScreenAnimationDelegate.AnimationType.EXIT
                },
            ),
        )

        animatorSet.addListener(
            object : AnimatorListenerAdapter() {
                override fun onAnimationStart(animation: Animator) {
                    isSheetAnimationInProgress = true
                }

                override fun onAnimationEnd(animation: Animator) {
                    isSheetAnimationInProgress = false

                    screen.onSheetYTranslationChanged()
                }
            },
        )
    }

    private inner class KeyboardHandler : BottomSheetBehavior.BottomSheetCallback() {
        override fun onStateChanged(
            bottomSheet: View,
            newState: Int,
        ) {
            if (newState == BottomSheetBehavior.STATE_COLLAPSED) {
                val isImeVisible =
                    WindowInsetsCompat
                        .toWindowInsetsCompat(bottomSheet.rootWindowInsets)
                        .isVisible(WindowInsetsCompat.Type.ime())
                if (isImeVisible) {
                    // Does it not interfere with React Native focus mechanism? In any case I'm not aware
                    // of different way of hiding the keyboard.
                    // https://stackoverflow.com/questions/1109022/how-can-i-close-hide-the-android-soft-keyboard-programmatically
                    // https://developer.android.com/develop/ui/views/touch-and-input/keyboard-input/visibility

                    // I want to be polite here and request focus before dismissing the keyboard,
                    // however even if it fails I want to try to hide the keyboard. This sometimes works...
                    bottomSheet.requestFocus()
                    inputMethodManager?.hideSoftInputFromWindow(bottomSheet.windowToken, 0)
                }
            }
        }

        override fun onSlide(
            bottomSheet: View,
            slideOffset: Float,
        ) = Unit
    }

    private inner class SheetStateObserver : BottomSheetBehavior.BottomSheetCallback() {
        override fun onStateChanged(
            bottomSheet: View,
            newState: Int,
        ) {
            this@SheetDelegate.onSheetStateChanged(newState)
        }

        override fun onSlide(
            bottomSheet: View,
            slideOffset: Float,
        ) = Unit
    }

    internal data class SheetAnimationContext(
        val fragment: ScreenStackFragment,
        val screen: Screen,
        val coordinatorLayout: CoordinatorLayout,
        val dimmingDelegate: DimmingViewManager,
    )

    companion object {
        const val TAG = "SheetDelegate"
    }
}
