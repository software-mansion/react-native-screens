package com.swmansion.rnscreens

import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackManagerInterface
import com.swmansion.rnscreens.events.StackFinishTransitioningEvent

@ReactModule(name = ScreenStackViewManager.REACT_CLASS)
class ScreenStackViewManager : ViewGroupManager<ScreenStack>(), RNSScreenStackManagerInterface<ScreenStack> {
    private val mDelegate: ViewManagerDelegate<ScreenStack>

    init {
        mDelegate = RNSScreenStackManagerDelegate<ScreenStack, ScreenStackViewManager>(this)
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): ScreenStack {
        return ScreenStack(reactContext)
    }

    override fun addView(parent: ScreenStack, child: View, index: Int) {
        require(child is Screen) { "Attempt attach child that is not of type RNScreen" }
        parent.addScreen(child, index)
    }

    override fun removeViewAt(parent: ScreenStack, index: Int) {
        prepareOutTransition(parent.getScreenAt(index))
        parent.removeScreenAt(index)
    }

    private fun prepareOutTransition(screen: Screen?) {
        startTransitionRecursive(screen)
    }

    private fun startTransitionRecursive(parent: ViewGroup?) {
        var i = 0
        parent?.let {
            val size = it.childCount
            while (i < size) {
                val child = it.getChildAt(i)
                child?.let { view -> it.startViewTransition(view) }
                if (child is ScreenStackHeaderConfig) {
                    // we want to start transition on children of the toolbar too,
                    // which is not a child of ScreenStackHeaderConfig
                    startTransitionRecursive(child.toolbar)
                }
                if (child is ViewGroup) {
                    startTransitionRecursive(child)
                }
                i++
            }
        }
    }

    override fun getChildCount(parent: ScreenStack): Int {
        return parent.screenCount
    }

    override fun getChildAt(parent: ScreenStack, index: Int): View {
        return parent.getScreenAt(index)
    }

    override fun createShadowNodeInstance(context: ReactApplicationContext): LayoutShadowNode {
        return ScreensShadowNode(context)
    }

    override fun needsCustomLayoutForChildren(): Boolean {
        return true
    }

    protected override fun getDelegate(): ViewManagerDelegate<ScreenStack> {
        return mDelegate
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return MapBuilder.of(
            StackFinishTransitioningEvent.EVENT_NAME,
            MapBuilder.of("registrationName", "onFinishTransitioning"),
        )
    }

    companion object {
        const val REACT_CLASS = "RNSScreenStack"
    }
}
