package com.swmansion.rnscreens

import android.app.Activity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.ReactContext
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class ScreenModalFragment(override var screen: Screen) : BottomSheetDialogFragment(), IScreenFragment {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
//        return super.onCreateView(inflater, container, savedInstanceState)
        return screen
    }

    override val childScreenContainers: List<ScreenContainer<*>>
        get() = TODO("Not yet implemented")

    override fun onContainerUpdate() {
        TODO("Not yet implemented")
    }

    override fun tryGetActivity(): Activity? {
        TODO("Not yet implemented")
    }

    override fun tryGetContext(): ReactContext? {
        TODO("Not yet implemented")
    }

    override fun dispatchHeaderBackButtonClickedEvent() {
        TODO("Not yet implemented")
    }

    override fun dispatchTransitionProgress(alpha: Float, isClosing: Boolean) {
        TODO("Not yet implemented")
    }

    override fun registerChildScreenContainer(container: ScreenContainer<*>) {
        TODO("Not yet implemented")
    }

    override fun unregisterChildScreenContainer(container: ScreenContainer<*>) {
        TODO("Not yet implemented")
    }

    override fun onViewAnimationStart() {
        TODO("Not yet implemented")
    }

    override fun onViewAnimationEnd() {
        TODO("Not yet implemented")
    }
}