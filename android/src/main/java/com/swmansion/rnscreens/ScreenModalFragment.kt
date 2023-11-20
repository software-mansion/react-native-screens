package com.swmansion.rnscreens

import android.app.Activity
import android.app.Dialog
import android.content.DialogInterface
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.swmansion.rnscreens.bottomsheet.RNSBottomSheetDialog
import com.swmansion.rnscreens.events.ScreenDismissedEvent
import com.swmansion.rnscreens.ext.parentAsView
import com.swmansion.rnscreens.ext.recycle

class ScreenModalFragment : BottomSheetDialogFragment, ScreenStackFragmentWrapper {
    override lateinit var screen: Screen

    // Nested containers
    override val childScreenContainers = ArrayList<ScreenContainer>()

    private val bottomSheetDismissCallback = object : BottomSheetBehavior.BottomSheetCallback() {
        override fun onStateChanged(bottomSheet: View, newState: Int) {
            if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                container!!.onScreenDismissed(this@ScreenModalFragment)
            }
        }

        override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
    }

    private val container: ScreenStack?
        get() = screen.container as? ScreenStack

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
        val dialog = RNSBottomSheetDialog(requireContext(), this)

        val bottomSheetDialog = dialog as BottomSheetDialog

        bottomSheetDialog.dismissWithAnimation = true
        bottomSheetDialog.behavior.apply {
            isHideable = true
            isDraggable = true
//            addBottomSheetCallback(bottomSheetDismissCallback)
        }
        bottomSheetDialog.setContentView(screen.recycle())
        screen.parentAsView()?.clipToOutline = true

        return bottomSheetDialog
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        Log.i(TAG, "onCreateView")
        return null
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        Log.i(TAG, "onViewCreated")
        super.onViewCreated(view, savedInstanceState)
    }

    // TODO: Consider two approaches:
    // 1. Override whole native dismiss logic and rely on the one in ScreenStack
    // 2. Stay with native dismiss logic and notify ScreenStack that particular fragment has been already dismissed.
    override fun dismissFromContainer() {
        // Approach 1
        super.dismiss()
        check(container is ScreenStack)
        val container = container as ScreenStack
        container.dismiss(this)
    }

    override fun onCancel(dialog: DialogInterface) {
        super.onCancel(dialog)
    }

    override fun canNavigateBack(): Boolean {
        TODO("Not yet implemented")
    }

    override fun addChildScreenContainer(container: ScreenContainer) {
        childScreenContainers.add(container)
    }

    override fun removeChildScreenContainer(container: ScreenContainer) {
        childScreenContainers.remove(container)
    }

    override fun onContainerUpdate() {
        Log.d(TAG, "onContainerUpdate")
    }

    override fun onViewAnimationStart() {
        TODO("Not yet implemented")
    }

    override fun onViewAnimationEnd() {
        TODO("Not yet implemented")
    }

    override fun tryGetActivity(): Activity? {
        return requireActivity()
    }

    override fun tryGetContext(): ReactContext? {
        if (context is ReactContext) {
            return context as ReactContext
        }
        if (screen.context is ReactContext) {
            return screen.context as ReactContext
        }
        var parent: ViewParent? = screen.container
        while (parent != null) {
            if (parent is Screen) {
                if (parent.context is ReactContext) {
                    return parent.context as ReactContext
                }
            }
            parent = parent.parent
        }
        return null
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

    override fun onStop() {
        Log.d(TAG, "onStop")
//        container!!.onExternalFragmentRemoval(this)
        super.onStop()
    }

    override fun onDestroy() {
        Log.d(TAG, "onDestroy")
        super.onDestroy()
        val container = container
        if (container == null || !container.hasScreen(this)) {
            val screenContext = screen.context
            if (screenContext is ReactContext) {
                Log.d(TAG, "onDestroy / sending ScreenDismissedEvent")
                val surfaceId = UIManagerHelper.getSurfaceId(screenContext)
                UIManagerHelper.getEventDispatcherForReactTag(screenContext, screen.id)
                    ?.dispatchEvent(ScreenDismissedEvent(surfaceId, screen.id))
            }
        }
        childScreenContainers.clear()
    }

    override fun removeToolbar() {
        throw IllegalStateException("Modal screens on Android do not support header right now")
    }

    override fun setToolbar(toolbar: Toolbar) {
        throw IllegalStateException("Modal screens on Android do not support header right now")
    }

    override fun setToolbarShadowHidden(hidden: Boolean) {
        throw IllegalStateException("Modal screens on Android do not support header right now")
    }

    override fun setToolbarTranslucent(translucent: Boolean) {
        throw IllegalStateException("Modal screens on Android do not support header right now")
    }

    companion object {
        val TAG = ScreenModalFragment::class.simpleName
    }
}
