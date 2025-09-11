package com.swmansion.rnscreens.gamma.stack

import android.view.ViewGroup
import androidx.fragment.app.FragmentManager
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.utils.RNSLog

class StackHost(
    private val reactContext: ThemedReactContext,
) : ViewGroup(reactContext) {
    private var fragmentManager: FragmentManager? = null
    private val stackScreenFragments: MutableList<StackScreenFragment> = arrayListOf()

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackHost [$id] attached to window")
        super.onAttachedToWindow()

        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }
    }

    internal fun mountReactSubviewAt(
        stackScreen: StackScreen,
        index: Int,
    ) {
        val associatedFragment = StackScreenFragment(stackScreen)
        stackScreenFragments.add(index, associatedFragment)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        stackScreenFragments.removeAt(index)
    }

    internal fun unmountReactSubview(reactSubview: StackScreen) {
        stackScreenFragments.removeIf { it.stackScreen === reactSubview }
    }

    internal fun unmountAllReactSubviews() {
        stackScreenFragments.clear()
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    companion object {
        const val TAG = "StackHost"
    }
}
