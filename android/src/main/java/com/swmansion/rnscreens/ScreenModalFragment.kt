package com.swmansion.rnscreens

import android.app.Activity
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.children
import androidx.fragment.app.Fragment
import com.facebook.react.bridge.ReactContext
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class ScreenModalFragment : BottomSheetDialogFragment, ScreenStackFragmentWrapper {
    override lateinit var screen: Screen

    override val fragment: Fragment
        get() = this

    constructor() {
        throw IllegalStateException("TODO: Better error message")
    }

    constructor(screen: Screen) : super() {
        this.screen = screen
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val mockCoordinatorLayout = CoordinatorLayout(requireContext())
        mockCoordinatorLayout.layoutParams = CoordinatorLayout.LayoutParams(
            CoordinatorLayout.LayoutParams.WRAP_CONTENT,
            CoordinatorLayout.LayoutParams.WRAP_CONTENT
        )
        mockCoordinatorLayout.addView(screen)
        return mockCoordinatorLayout
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val callback = object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onStateChanged(bottomSheet: View, newState: Int) {
                if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                    dismiss()
                }
                println("STATE CHANGED TO $newState")
            }
            override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
        }

        val screen = (view as ViewGroup).children.first() as Screen
        screen.layoutParams = CoordinatorLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ).apply {
            behavior = BottomSheetBehavior<Screen>().apply {
                isHideable = true
                peekHeight = BottomSheetBehavior.PEEK_HEIGHT_AUTO
                addBottomSheetCallback(callback)
            }
        }

        val behavior: BottomSheetBehavior<Screen> = BottomSheetBehavior.from(screen)
        println("maxHeight ${behavior.maxHeight} peekHeight ${behavior.peekHeight} state ${behavior.state}")
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
//        TODO("Not yet implemented")
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
