package com.swmansion.rnscreens

import android.app.Activity
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.facebook.react.bridge.ReactContext
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class ScreenModalFragment : BottomSheetDialogFragment, ScreenStackFragmentWrapper {
    override lateinit var screen: Screen

    constructor() {
        throw IllegalStateException("TODO: Better error message")
    }

    constructor(screen: Screen) : super() {
        this.screen = screen
    }

    override fun removeToolbar() {
        TODO("Not yet implemented")
    }

    override fun setToolbar(toolbar: Toolbar) {
        TODO("Not yet implemented")
    }

    override fun setToolbarShadowHidden(hidden: Boolean) {
        TODO("Not yet implemented")
    }

    override fun setToolbarTranslucent(translucent: Boolean) {
        TODO("Not yet implemented")
    }

    override fun canNavigateBack(): Boolean {
        TODO("Not yet implemented")
    }

    override val childScreenContainers: List<ScreenContainer>
        get() = TODO("Not yet implemented")

    override fun addChildContainer(container: ScreenContainer) {
        TODO("Not yet implemented")
    }

    override fun removeChildContainer(container: ScreenContainer) {
        TODO("Not yet implemented")
    }

    override fun onContainerUpdate() {
        TODO("Not yet implemented")
    }

    override fun onViewAnimationStart() {
        TODO("Not yet implemented")
    }

    override fun onViewAnimationEnd() {
        TODO("Not yet implemented")
    }

    override fun tryGetActivity(): Activity? {
        TODO("Not yet implemented")
    }

    override fun tryGetContext(): ReactContext? {
        TODO("Not yet implemented")
    }

    override val fragment: Fragment
        get() = TODO("Not yet implemented")

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
}
