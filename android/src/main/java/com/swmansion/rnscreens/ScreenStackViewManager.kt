package com.swmansion.rnscreens

import android.view.View
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackManagerInterface
import com.swmansion.rnscreens.events.StackFinishTransitioningEvent

@ReactModule(name = ScreenStackViewManager.REACT_CLASS)
class ScreenStackViewManager :
    ViewGroupManager<ScreenStack>(),
    RNSScreenStackManagerInterface<ScreenStack> {
    private val delegate: ViewManagerDelegate<ScreenStack>

    init {
        delegate = RNSScreenStackManagerDelegate<ScreenStack, ScreenStackViewManager>(this)
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = ScreenStack(reactContext)

    override fun addView(
        parent: ScreenStack,
        child: View,
        index: Int,
    ) {
        require(child is Screen) { "Attempt attach child that is not of type Screen" }
        NativeProxy.addScreenToMap(child.id, child)
        parent.addScreen(child, index)
    }

    override fun removeViewAt(
        parent: ScreenStack,
        index: Int,
    ) {
        val screen = parent.getScreenAt(index)
        prepareOutTransition(screen)
        parent.removeScreenAt(index)
        NativeProxy.removeScreenFromMap(screen.id)
    }

    private fun prepareOutTransition(screen: Screen?) {
        screen?.startRemovalTransition()
    }

    override fun invalidate() {
        super.invalidate()
        NativeProxy.clearMapOnInvalidate()
    }

    override fun getChildCount(parent: ScreenStack) = parent.screenCount

    override fun getChildAt(
        parent: ScreenStack,
        index: Int,
    ): View = parent.getScreenAt(index)

    override fun needsCustomLayoutForChildren() = true

    protected override fun getDelegate(): ViewManagerDelegate<ScreenStack> = delegate

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            StackFinishTransitioningEvent.EVENT_NAME to mutableMapOf("registrationName" to "onFinishTransitioning"),
        )

    // iosPreventReattachmentOfDismissedScreens is not available on Android,
    // however we must override the setter
    override fun setIosPreventReattachmentOfDismissedScreens(
        view: ScreenStack?,
        value: Boolean,
    ) = Unit

    // iosPreventReattachmentOfDismissedModals is not available on Android,
    // however we must override the setter
    override fun setIosPreventReattachmentOfDismissedModals(
        view: ScreenStack?,
        value: Boolean,
    ) = Unit

    // nativeContainerBackgroundColor is iOS-only because the native view hierarchy
    // differs between platforms. On Android, ScreenStack is used directly as the
    // container, so `style.backgroundColor` achieves the same effect.
    override fun setNativeContainerBackgroundColor(
        view: ScreenStack,
        value: Int?,
    ) = Unit

    companion object {
        const val REACT_CLASS = "RNSScreenStack"
    }
}
