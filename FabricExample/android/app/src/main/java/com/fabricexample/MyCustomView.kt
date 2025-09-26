package com.fabricexample

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import androidx.core.view.doOnDetach
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

@ReactModule(name = ReactViewManager.REACT_CLASS, canOverrideExistingModule = true)
class FixedReactViewManager : ReactViewManager() {

    override fun removeViewAt(parent: ReactViewGroup, index: Int) {
        val child = parent.getChildAt(index)
        if (child is MyCustomView) {
            Log.d("HannoDebug", """
                FixedReactViewManager: removeViewAt: ${child}
                  → parent: $parent
            """.trimIndent())
        }
        super.removeViewAt(parent, index)
    }

    override fun addView(parent: ReactViewGroup, child: View, index: Int) {
        if (child.parent == null) {
            super.addView(parent, child, index)
            return
        }

        Log.d("HannoDebug", """)
            FixedReactViewManager: addView: child has parent, waiting for detach: $child, id: ${child.id}
              → current parent: ${child.parent}
              → new parent: $parent
        """.trimIndent())
        // When the child-parent relation is removed, onDetachedFromWindow will be called:
        child.doOnDetach {
            // Looking at how endViewTransition is implemented, dispatchDetachedFromWindow
            // gets called _before_ the parent relation is removed, so we need to post this to the end of the frame:
            child.post {
                Log.d("HannoDebug", """
                    FixedReactViewManager: addView: child doOnDetach called: $child, id: ${child.id}
                      → parent: ${child.parent} (should be null)
                      → new parent: $parent
                """.trimIndent())
                super.addView(parent, child, index)
            }
        }
    }
}

@SuppressLint("ViewConstructor")
class MyCustomView(context: ThemedReactContext) : View(context) {
    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        Log.d("HannoDebug", "MyCustomView: onAttachedToWindow called for view: $this, id: ${this.id}, to: ${this.parent}")
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        Log.d("HannoDebug", "MyCustomView: onDetachedFromWindow called for view: $this, id: ${this.id}, from: ${this.parent}")
        // print callstack:
        Exception().printStackTrace()
    }
}

@ReactModule(name = "CustomView")
class CustomViewManager : SimpleViewManager<MyCustomView>() {
    override fun getName() = "CustomView"

//    companion object {
//        @SuppressLint("StaticFieldLeak")
//        var viewInstance: MyCustomView? = null
//    }

    init {
        mRecyclableViews = HashMap()
    }

    override fun createViewInstance(reactContext: ThemedReactContext): MyCustomView {
        Log.d("HannoDebug", "CustomViewManager: createViewInstance called")
//        if (viewInstance == null) {
            val viewInstance = MyCustomView(reactContext)
            viewInstance.setBackgroundColor(0xFFFF0000.toInt()) // Red background for visibility
//        }
        return viewInstance
    }

    override fun onDropViewInstance(view: MyCustomView) {
        super.onDropViewInstance(view)
        prepareToRecycleView(view.context as ThemedReactContext, view)
        Log.d("HannoDebug", "CustomViewManager: onDropViewInstance called ${view}")
    }
}

class CustomViewPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<in Nothing, in Nothing>> {
        return listOf(CustomViewManager(), FixedReactViewManager())
    }

}