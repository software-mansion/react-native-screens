package com.fabricexample

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManager

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

    companion object {
        @SuppressLint("StaticFieldLeak")
        var viewInstance: MyCustomView? = null
    }

//    init {
//        mRecyclableViews = HashMap()
//    }

    override fun createViewInstance(reactContext: ThemedReactContext): MyCustomView {
        Log.d("HannoDebug", "CustomViewManager: createViewInstance called")
        if (viewInstance == null) {
            viewInstance = MyCustomView(reactContext)
            viewInstance!!.setBackgroundColor(0xFFFF0000.toInt()) // Red background for visibility
        }
        return viewInstance!!
    }

    override fun onDropViewInstance(view: MyCustomView) {
        super.onDropViewInstance(view)
        prepareToRecycleView(view.context as ThemedReactContext, view)
        Log.d("HannoDebug", "CustomViewManager: onDropViewInstance called")
    }
}

class CustomViewPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<in Nothing, in Nothing>> {
        return listOf(CustomViewManager())
    }

}