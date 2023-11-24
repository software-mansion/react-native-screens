package com.swmansion.rnscreens

import RNSModalRootView
import android.app.Activity
import android.app.Dialog
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

    private val container: ScreenStack?
        get() = screen.container as? ScreenStack

    /**
     * Dialog instance. Note that we are responsible for creating the dialog.
     * This member is valid after `onCreateDialog` method runs.
     */
    private lateinit var sheetDialog: BottomSheetDialog

    /**
     * Behaviour attached to bottom sheet dialog.
     * This member is valid after `onCreateDialog` method runs.
     */
    private val behavior
        get() = sheetDialog.behavior

    override val fragment: Fragment
        get() = this

    constructor() {
        throw IllegalStateException(
            "Screen fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity."
        )
    }

    constructor(screen: Screen) : super() {
        this.screen = screen
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Right now whole purpose of this Fragment is to be displayed as a dialog.
        // I've experimented with setting false here, but could not get it to work.
        showsDialog = true
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        configureDialogAndBehaviour()

        val rootView = RNSModalRootView(screen.reactContext, screen.reactEventDispatcher!!)
        rootView.addView(screen.recycle())

        sheetDialog.setContentView(rootView)
        rootView.parentAsView()?.clipToOutline = true

        return sheetDialog
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = null

    override fun dismissFromContainer() {
        check(container is ScreenStack)
        val container = container as ScreenStack
        container.dismiss(this)
    }

    // Modal can never be first on the stack
    // TODO: What is exact semantic of this method?
    override fun canNavigateBack(): Boolean = true

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

    private fun configureDialogAndBehaviour(): BottomSheetDialog {
        sheetDialog = RNSBottomSheetDialog(requireContext(), this)
        sheetDialog.dismissWithAnimation = true

        configureBehaviour()

        return sheetDialog
    }

    private fun configureBehaviour() {
        val detent = screen.sheetDetent
        behavior.apply {
            isHideable = true
            isDraggable = true
            if (detent != null) {
                when (detent) {
                    Screen.SheetDetent.LARGE -> {
                        skipCollapsed = true
                        state = BottomSheetBehavior.STATE_EXPANDED
                    }
                    Screen.SheetDetent.MEDIUM -> {
                        skipCollapsed = true
                        // Temporary solution
                        state = BottomSheetBehavior.STATE_HALF_EXPANDED
                    }
                    Screen.SheetDetent.ALL -> {
                        skipCollapsed = false
                        state = BottomSheetBehavior.STATE_COLLAPSED
                    }
                }
            }
        }
    }

    companion object {
        val TAG = ScreenModalFragment::class.simpleName
    }
}
