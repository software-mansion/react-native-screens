package com.swmansion.rnscreens.bottomsheet

import android.view.View
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
                stackFragment.configureBottomSheetBehaviour(it, keyboardState)
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
                    stackFragment.configureBottomSheetBehaviour(it, KeyboardDidHide)
                } else if (keyboardState != KeyboardNotVisible) {
                    stackFragment.configureBottomSheetBehaviour(it, KeyboardNotVisible)
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

    companion object {
        const val TAG = "SheetDelegate"
    }
}
