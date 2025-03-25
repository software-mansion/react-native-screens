package com.swmansion.rnscreens.bottomsheet

import android.content.Context
import android.os.Build
import android.view.View
import android.view.WindowManager
import android.view.inputmethod.InputMethodManager
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

class SheetDelegate(
    val screen: Screen,
) : LifecycleEventObserver,
    OnApplyWindowInsetsListener {
    private var isKeyboardVisible: Boolean = false
    private var keyboardState: KeyboardState = KeyboardNotVisible

    var lastStableDetentIndex: Int = screen.sheetInitialDetentIndex
        private set

    @BottomSheetBehavior.State
    var lastStableState: Int =
        SheetUtils.sheetStateFromDetentIndex(
            screen.sheetInitialDetentIndex,
            screen.sheetDetents.count(),
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
            Lifecycle.Event.ON_START -> handleHostFragmentOnStart()
            Lifecycle.Event.ON_RESUME -> handleHostFragmentOnResume()
            Lifecycle.Event.ON_PAUSE -> handleHostFragmentOnPause()
            else -> Unit
        }
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

    private fun onSheetStateChanged(newState: Int) {
        val isStable = SheetUtils.isStateStable(newState)

        if (isStable) {
            lastStableState = newState
            lastStableDetentIndex =
                SheetUtils.detentIndexFromSheetState(
                    newState,
                    screen.sheetDetents.count(),
                )
        }

        screen.onSheetDetentChanged(lastStableDetentIndex, isStable)

        if (shouldDismissSheetInState(newState)) {
            stackFragment.dismissSelf()
        }
    }

    internal fun configureBottomSheetBehaviour(
        behavior: BottomSheetBehavior<Screen>,
        keyboardState: KeyboardState = KeyboardNotVisible,
        selectedDetentIndex: Int = lastStableDetentIndex,
    ): BottomSheetBehavior<Screen> {
        val containerHeight = tryResolveContainerHeight()
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
                when (screen.sheetDetents.count()) {
                    1 ->
                        behavior.apply {
                            val height =
                                if (screen.isSheetFitToContents()) {
                                    screen.contentWrapper.get()?.let { contentWrapper ->
                                        contentWrapper.height.takeIf {
                                            // subtree might not be laid out, e.g. after fragment reattachment
                                            // and view recreation, however since it is retained by
                                            // react-native it has its height cached. We want to use it.
                                            // Otherwise we would have to trigger RN layout manually.
                                            contentWrapper.isLaidOut || contentWrapper.height > 0
                                        }
                                    }
                                } else {
                                    (screen.sheetDetents.first() * containerHeight).toInt()
                                }
                            useSingleDetent(height = height)
                        }

                    2 ->
                        behavior.useTwoDetents(
                            state =
                                SheetUtils.sheetStateFromDetentIndex(
                                    selectedDetentIndex,
                                    screen.sheetDetents.count(),
                                ),
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            secondHeight = (screen.sheetDetents[1] * containerHeight).toInt(),
                        )

                    3 ->
                        behavior.useThreeDetents(
                            state =
                                SheetUtils.sheetStateFromDetentIndex(
                                    selectedDetentIndex,
                                    screen.sheetDetents.count(),
                                ),
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            halfExpandedRatio = (screen.sheetDetents[1] / screen.sheetDetents[2]).toFloat(),
                            expandedOffsetFromTop = ((1 - screen.sheetDetents[2]) * containerHeight).toInt(),
                        )

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count()}. Expected at most 3.",
                    )
                }
            }

            is KeyboardVisible -> {
                val newMaxHeight =
                    if (behavior.maxHeight - keyboardState.height > 1) {
                        behavior.maxHeight - keyboardState.height
                    } else {
                        behavior.maxHeight
                    }
                when (screen.sheetDetents.count()) {
                    1 ->
                        behavior.apply {
                            useSingleDetent(height = newMaxHeight)
                            addBottomSheetCallback(keyboardHandlerCallback)
                        }

                    2 ->
                        behavior.apply {
                            useTwoDetents(
                                state = BottomSheetBehavior.STATE_EXPANDED,
                                secondHeight = newMaxHeight,
                            )
                            addBottomSheetCallback(keyboardHandlerCallback)
                        }

                    3 ->
                        behavior.apply {
                            useThreeDetents(
                                state = BottomSheetBehavior.STATE_EXPANDED,
                            )
                            maxHeight = newMaxHeight
                            addBottomSheetCallback(keyboardHandlerCallback)
                        }

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count()}. Expected at most 3.",
                    )
                }
            }

            is KeyboardDidHide -> {
                // Here we assume that the keyboard was either closed explicitly by user,
                // or the user dragged the sheet down. In any case the state should
                // stay unchanged.

                behavior.removeBottomSheetCallback(keyboardHandlerCallback)
                when (screen.sheetDetents.count()) {
                    1 ->
                        behavior.useSingleDetent(
                            height = (screen.sheetDetents.first() * containerHeight).toInt(),
                            forceExpandedState = false,
                        )

                    2 ->
                        behavior.useTwoDetents(
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            secondHeight = (screen.sheetDetents[1] * containerHeight).toInt(),
                        )

                    3 ->
                        behavior.useThreeDetents(
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            halfExpandedRatio = (screen.sheetDetents[1] / screen.sheetDetents[2]).toFloat(),
                            expandedOffsetFromTop = ((1 - screen.sheetDetents[2]) * containerHeight).toInt(),
                        )

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count()}. Expected at most 3.",
                    )
                }
            }
        }
    }

    // This is listener function, not the view's.
    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        val isImeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
        val imeInset = insets.getInsets(WindowInsetsCompat.Type.ime())

        if (isImeVisible) {
            isKeyboardVisible = true
            keyboardState = KeyboardVisible(imeInset.bottom)
            sheetBehavior?.let {
                this.configureBottomSheetBehaviour(it, keyboardState)
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
            sheetBehavior?.let {
                if (isKeyboardVisible) {
                    this.configureBottomSheetBehaviour(it, KeyboardDidHide)
                } else if (keyboardState != KeyboardNotVisible) {
                    this.configureBottomSheetBehaviour(it, KeyboardNotVisible)
                } else {
                }
            }

            keyboardState = KeyboardNotVisible
            isKeyboardVisible = false
        }

        val prevInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
        return WindowInsetsCompat
            .Builder(insets)
            .setInsets(
                WindowInsetsCompat.Type.navigationBars(),
                Insets.of(prevInsets.left, prevInsets.top, prevInsets.right, 0),
            ).build()
    }

    private fun shouldDismissSheetInState(
        @BottomSheetBehavior.State state: Int,
    ) = state == BottomSheetBehavior.STATE_HIDDEN

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
                    val imm =
                        screen.reactContext.getSystemService(InputMethodManager::class.java)
                    imm.hideSoftInputFromWindow(bottomSheet.windowToken, 0)
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

    companion object {
        const val TAG = "SheetDelegate"
    }
}
