package com.swmansion.rnscreens

import android.app.Activity
import android.app.Dialog
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import android.view.WindowManager
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.swmansion.rnscreens.bottomsheet.BottomSheetDialogRootView
import com.swmansion.rnscreens.bottomsheet.BottomSheetDialogScreen
import com.swmansion.rnscreens.bottomsheet.SheetUtils
import com.swmansion.rnscreens.events.ScreenDismissedEvent
import com.swmansion.rnscreens.ext.parentAsView
import com.swmansion.rnscreens.ext.recycle

class ScreenModalFragment :
    BottomSheetDialogFragment,
    ScreenStackFragmentWrapper {
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
            "Screen fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity.",
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

    // We override this method to provide our custom dialog type instead of the default Dialog.
    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        configureDialogAndBehaviour()

        val reactEventDispatcher =
            checkNotNull(
                screen.reactEventDispatcher,
            ) { "[RNScreens] No ReactEventDispatcher attached to screen while creating modal fragment" }
        val rootView = BottomSheetDialogRootView(screen.reactContext, reactEventDispatcher)

        rootView.addView(screen.recycle())
        sheetDialog.setContentView(rootView)

        rootView.parentAsView()?.clipToOutline = true

        return sheetDialog
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View? = null

    override fun dismissFromContainer() {
        check(container is ScreenStack)
        val container = container as ScreenStack
        container.dismiss(this)
    }

    // Modal can never be first on the stack
    override fun canNavigateBack(): Boolean = true

    override fun addChildScreenContainer(container: ScreenContainer) {
        childScreenContainers.add(container)
    }

    override fun removeChildScreenContainer(container: ScreenContainer) {
        childScreenContainers.remove(container)
    }

    override fun onContainerUpdate() {
    }

    override fun onViewAnimationStart() {
    }

    override fun onViewAnimationEnd() {
    }

    override fun tryGetActivity(): Activity? = requireActivity()

    override fun tryGetContext(): ReactContext? {
        if (context is ReactContext) {
            return context as ReactContext
        }
        if (screen.context is ReactContext) {
            return screen.context as ReactContext
        }

        var parent: ViewParent? = screen.container
        while (parent != null) {
            if (parent is Screen && parent.context is ReactContext) {
                return parent.context as ReactContext
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
        fragmentWrapper: ScreenFragmentWrapper,
    ) {
        TODO("Not yet implemented")
    }

    override fun dispatchLifecycleEventInChildContainers(event: ScreenFragment.ScreenLifecycleEvent) {
        TODO("Not yet implemented")
    }

    override fun dispatchHeaderBackButtonClickedEvent() {
        TODO("Not yet implemented")
    }

    override fun dispatchTransitionProgressEvent(
        alpha: Float,
        closing: Boolean,
    ) {
        TODO("Not yet implemented")
    }

    override fun onDestroy() {
        super.onDestroy()
        val container = container
        if (container == null || !container.hasScreen(this)) {
            val screenContext = screen.context
            if (screenContext is ReactContext) {
                val surfaceId = UIManagerHelper.getSurfaceId(screenContext)
                UIManagerHelper
                    .getEventDispatcherForReactTag(screenContext, screen.id)
                    ?.dispatchEvent(ScreenDismissedEvent(surfaceId, screen.id))
            }
        }
        childScreenContainers.clear()
    }

    override fun removeToolbar(): Unit = throw IllegalStateException("[RNScreens] Modal screens on Android do not support header right now")

    override fun setToolbar(toolbar: Toolbar): Unit =
        throw IllegalStateException("[RNScreens] Modal screens on Android do not support header right now")

    override fun setToolbarShadowHidden(hidden: Boolean): Unit =
        throw IllegalStateException("[RNScreens] Modal screens on Android do not support header right now")

    override fun setToolbarTranslucent(translucent: Boolean): Unit =
        throw IllegalStateException("[RNScreens] Modal screens on Android do not support header right now")

    private fun configureDialogAndBehaviour(): BottomSheetDialog {
        sheetDialog = BottomSheetDialogScreen(requireContext(), this)
        sheetDialog.dismissWithAnimation = true
        sheetDialog.setCanceledOnTouchOutside(screen.sheetClosesOnTouchOutside)

        configureBehaviour()

        return sheetDialog
    }

    /**
     * This method might return slightly different values depending on code path,
     * but during testing I've found this effect negligible. For practical purposes
     * this is acceptable.
     */
    private fun tryResolveContainerHeight(): Int? {
        screen.container?.height?.let { return it }
        context
            ?.resources
            ?.displayMetrics
            ?.heightPixels
            ?.let { return it }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            (context?.getSystemService(Context.WINDOW_SERVICE) as? WindowManager)
                ?.currentWindowMetrics
                ?.bounds
                ?.height()
                ?.let { return it }
        }
        return null
    }

    private fun configureBehaviour() {
        val containerHeight = tryResolveContainerHeight()
        check(containerHeight != null) { "[RNScreens] Failed to find window height during bottom sheet behaviour configuration" }

        behavior.apply {
            isHideable = true
            isDraggable = true
        }

        when (screen.sheetDetents.count()) {
            1 ->
                behavior.apply {
                    state = BottomSheetBehavior.STATE_EXPANDED
                    skipCollapsed = true
                    isFitToContents = true
                    maxHeight = (screen.sheetDetents.first() * containerHeight).toInt()
                }

            2 ->
                behavior.apply {
                    state =
                        SheetUtils.sheetStateFromDetentIndex(
                            screen.sheetInitialDetentIndex,
                            screen.sheetDetents.count(),
                        )
                    skipCollapsed = false
                    isFitToContents = true
                    peekHeight = (screen.sheetDetents[0] * containerHeight).toInt()
                    maxHeight = (screen.sheetDetents[1] * containerHeight).toInt()
                }

            3 ->
                behavior.apply {
                    state =
                        SheetUtils.sheetStateFromDetentIndex(
                            screen.sheetInitialDetentIndex,
                            screen.sheetDetents.count(),
                        )
                    skipCollapsed = false
                    isFitToContents = false
                    peekHeight = (screen.sheetDetents[0] * containerHeight).toInt()
                    expandedOffset = ((1 - screen.sheetDetents[2]) * containerHeight).toInt()
                    halfExpandedRatio =
                        (screen.sheetDetents[1] / screen.sheetDetents[2]).toFloat()
                }

            else -> throw IllegalStateException("[RNScreens] Invalid detent count ${screen.sheetDetents.count()}. Expected at most 3.")
        }
    }

    companion object {
        const val TAG = "ScreenModalFragment"
    }
}
