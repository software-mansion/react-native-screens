package com.swmansion.rnscreens

import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackManagerInterface
import com.swmansion.rnscreens.events.StackFinishTransitioningEvent
import com.swmansion.common.SharedElementAnimatorDelegate
import com.swmansion.rnscreens.sharedElementTransition.SharedElementAnimatorClass

@ReactModule(name = ScreenStackViewManager.REACT_CLASS)
class ScreenStackViewManager : ViewGroupManager<ScreenStack>(), RNSScreenStackManagerInterface<ScreenStack> {
    private val mDelegate: ViewManagerDelegate<ScreenStack>
    private var sharedElementAnimatorDelegate: SharedElementAnimatorDelegate? = null

    init {
        mDelegate = RNSScreenStackManagerDelegate(this)
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = ScreenStack(reactContext)

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

    private fun shouldStartViewTransition(view: View): Boolean {
        if (sharedElementAnimatorDelegate == null) {
            sharedElementAnimatorDelegate = SharedElementAnimatorClass.getDelegate()
        }
        return sharedElementAnimatorDelegate?.isTagUnderTransition(view.id)?.not()
            ?: run { true }
    }

    private fun startTransitionRecursive(parent: ViewGroup?) {
        parent?.let {
            for (i in 0 until it.childCount) {
                val child = it.getChildAt(i)
                child?.let { view ->
                    if (shouldStartViewTransition(view)) {
                        it.startViewTransition(view)
                    } else {
                        sharedElementAnimatorDelegate?.makeSnapshot(view)
                    }
                }
                if (child is ScreenStackHeaderConfig) {
                    // we want to start transition on children of the toolbar too,
                    // which is not a child of ScreenStackHeaderConfig
                    startTransitionRecursive(child.toolbar)
                }
                if (child is ViewGroup) {
                    startTransitionRecursive(child)
                }
            }
        }
    }

    override fun getChildCount(parent: ScreenStack) = parent.screenCount

    override fun getChildAt(parent: ScreenStack, index: Int): View = parent.getScreenAt(index)

    override fun createShadowNodeInstance(context: ReactApplicationContext): LayoutShadowNode = ScreensShadowNode(context)

    override fun needsCustomLayoutForChildren() = true

    protected override fun getDelegate(): ViewManagerDelegate<ScreenStack> = mDelegate

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> = mutableMapOf(
        StackFinishTransitioningEvent.EVENT_NAME to mutableMapOf("registrationName" to "onFinishTransitioning")
    )

    companion object {
        const val REACT_CLASS = "RNSScreenStack"
    }
}
