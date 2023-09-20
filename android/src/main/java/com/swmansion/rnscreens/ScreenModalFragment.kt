package com.swmansion.rnscreens

import android.app.Activity
import android.app.Dialog
import android.content.DialogInterface
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.facebook.react.bridge.ReactContext
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class ScreenModalFragment : BottomSheetDialogFragment, ScreenStackFragmentWrapper {
    override lateinit var screen: Screen

    private val bottomSheetDismissCallback = object : BottomSheetBehavior.BottomSheetCallback() {
        override fun onStateChanged(bottomSheet: View, newState: Int) {
            TODO("Not yet implemented")
        }

        override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
    }

    private val container
        get() = screen.container

    private val behavior
        get() = (dialog as? BottomSheetDialog)?.behavior

    override val fragment: Fragment
        get() = this

    constructor() {
        throw IllegalStateException("TODO: Better error message")
    }

    constructor(screen: Screen) : super() {
        this.screen = screen
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showsDialog = screen.stackPresentation == Screen.StackPresentation.MODAL
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val bottomSheetDialog = super.onCreateDialog(savedInstanceState) as BottomSheetDialog
        bottomSheetDialog.setContentView(screen)
        bottomSheetDialog.dismissWithAnimation = true
        bottomSheetDialog.behavior.apply {
            isHideable = true
            isDraggable = true
            state = BottomSheetBehavior.STATE_EXPANDED
//            addBottomSheetCallback()
        }
        return bottomSheetDialog
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        requireDialog().setContentView(view)

        val callback = object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onStateChanged(bottomSheet: View, newState: Int) = Unit

            //            override fun onStateChanged(bottomSheet: View, newState: Int) {
//                if (newState == BottomSheetBehavior.STATE_HIDDEN) {
//                    val container = container
//                    check(container is ScreenStack) { "ScreenModalFragment added to a non-stack container" }
//                    container.dismiss(this@ScreenModalFragment)
//                }
//                println("STATE CHANGED TO $newState")
//            }
            override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
        }

//        val screen = (view as ViewGroup).children.first() as Screen
//        screen.layoutParams = CoordinatorLayout.LayoutParams(
//            FrameLayout.LayoutParams.MATCH_PARENT,
//            FrameLayout.LayoutParams.MATCH_PARENT
//        ).apply {
//            behavior = BottomSheetBehavior<Screen>().apply {
//                isHideable = true
//                peekHeight = BottomSheetBehavior.PEEK_HEIGHT_AUTO
// //                addBottomSheetCallback(callback)
//            }
//        }
//
//        val behavior: BottomSheetBehavior<Screen> = BottomSheetBehavior.from(screen)
//        println("maxHeight ${behavior.maxHeight} peekHeight ${behavior.peekHeight} state ${behavior.state}")

        if (view.parent != null) {
            Log.e("ScreenModalFragment", "SCREEN HAS A NON NULL PARENT")
        } else {
            Log.e("ScreenModalFragment", "SCREEN DOES NOT HAVE A PARENT")
        }
        dialog?.setContentView(view)
    }

    // TODO: Consider two approaches:
    // 1. Override whole native dismiss logic and rely on the one in ScreenStack
    // 2. Stay with native dismiss logic and notify ScreenStack that particular fragment has been already dismissed.
    override fun dismiss() {
        // Approach 1
        super.dismiss()
        check(container is ScreenStack)
        val container = container as ScreenStack
        container.dismiss(this)
    }

    override fun onCancel(dialog: DialogInterface) {
        super.onCancel(dialog)
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

    override fun addChildScreenContainer(container: ScreenContainer) {
        TODO("Not yet implemented")
    }

    override fun removeChildScreenContainer(container: ScreenContainer) {
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
