package com.swmansion.rnscreens

import android.graphics.Color
import android.view.View
import android.view.View.MeasureSpec
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModuleList
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.ViewManager
import com.google.android.material.appbar.AppBarLayout
import java.lang.ref.WeakReference

@ReactModuleList(
    nativeModules = [
        ScreensModule::class
    ]
)
class RNScreensPackage : TurboReactPackage() {
    private lateinit var coordinatorLayout: CoordinatorLayout
    private lateinit var appBarLayout: AppBarLayout
    private lateinit var dummyContentView: View
    private lateinit var toolbar: Toolbar
    private var reactContext: WeakReference<ReactApplicationContext> = WeakReference(null)

    init {
        System.loadLibrary("react_codegen_rnscreens")
        nativeSetHeaderHeight(56)
        println("Hey, I've loaded codegened shared lib")
    }

    private external fun nativeSetHeaderHeight(int: Int)

    private fun initDummyLayoutContent(reactContext: ReactApplicationContext) {
        val targetContext = reactContext.currentActivity!!
        // This is earliest we can get to context I think
        coordinatorLayout = CoordinatorLayout(targetContext)

        appBarLayout = AppBarLayout(targetContext).apply {
//            setBackgroundColor(Color.TRANSPARENT)
            layoutParams = CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.WRAP_CONTENT,
            )
        }

//        val actionBar = targetContext.actionBar!!
//        actionBar.title = "Actionbar"

        toolbar = Toolbar(targetContext).apply {
            title = "FontSize"
            layoutParams = AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT).apply { scrollFlags = 0 }
        }

        (targetContext as AppCompatActivity).setSupportActionBar(toolbar)
        appBarLayout.addView(toolbar)

        dummyContentView = View(targetContext).apply {
            layoutParams = CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.MATCH_PARENT
            )
        }

        coordinatorLayout.apply {
            addView(appBarLayout)
            addView(dummyContentView)
        }

        VIEWS = coordinatorLayout
    }

    /**
     * @return height of the header
     */
    private fun computeDummyLayout(fontSize: Int): Float {
        // We need to access window dimensions
        val topLevelDecorView = reactContext.get()!!.currentActivity!!.window.decorView

        val decorViewWidth = topLevelDecorView.width
        val decorViewHeight = topLevelDecorView.height

        val widthMeasureSpec = MeasureSpec.makeMeasureSpec(decorViewWidth, MeasureSpec.EXACTLY)
        val heightMeasureSpec = MeasureSpec.makeMeasureSpec(decorViewHeight, MeasureSpec.EXACTLY)

        val textView = findTextViewInToolbar(toolbar)

        textView?.takeIf { fontSize != -1 }?.let { it.textSize = fontSize.toFloat() }

        coordinatorLayout.measure(widthMeasureSpec, heightMeasureSpec)
        coordinatorLayout.layout(0, 0, decorViewWidth, decorViewHeight)

        // Now we should have our app bar layouted!

        val height = PixelUtil.toDIPFromPixel(appBarLayout.height.toFloat())
        return height
    }

    private fun findTextViewInToolbar(toolbar: Toolbar): TextView? {
        for (i in 0 until toolbar.childCount) {
            val view = toolbar.getChildAt(i)
            if (view is TextView) {
                if (view.text == toolbar.title) {
                    return view
                }
            }
        }
        return null
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        WEAK_THIS = WeakReference(this)

        this.reactContext = WeakReference(reactContext)
        initDummyLayoutContent(reactContext)
//        computeDummyLayout(24)

        return listOf<ViewManager<*, *>>(
            ScreenContainerViewManager(),
            ScreenViewManager(reactContext),
            ModalScreenViewManager(reactContext),
            ScreenStackViewManager(),
            ScreenStackHeaderConfigViewManager(),
            ScreenStackHeaderSubviewManager(),
            SearchBarManager()
        )
    }

    override fun getModule(
        s: String,
        reactApplicationContext: ReactApplicationContext
    ): NativeModule? {
        when (s) {
            ScreensModule.NAME -> return ScreensModule(reactApplicationContext)
        }
        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
            val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            moduleInfos[ScreensModule.NAME] = ReactModuleInfo(
                ScreensModule.NAME,
                ScreensModule.NAME,
                false, // canOverrideExistingModule
                false, // needsEagerInit
                true, // hasConstants
                false, // isCxxModule
                isTurboModule
            )
            moduleInfos
        }
    }

    companion object {
        var WEAK_THIS = WeakReference<RNScreensPackage>(null)
        var VIEWS: CoordinatorLayout? = null

        fun computeDummyLayoutStatic(): Int {
            if (VIEWS == null) {
                return 0
            }

            return 0
        }

        @JvmStatic
        fun getInstance(): RNScreensPackage {
            return WEAK_THIS.get()!!
        }
    }

}
