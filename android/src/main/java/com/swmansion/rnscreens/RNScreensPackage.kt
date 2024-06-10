package com.swmansion.rnscreens

import android.app.Activity
import android.util.Log
import android.view.View
import android.view.View.MeasureSpec
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

class HeaderHeightCacheEntry(val cacheKey: Int, val headerHeight: Float) {
    fun hasKey(key: Int) = cacheKey == key

    companion object {
        val EMPTY = HeaderHeightCacheEntry(Int.MIN_VALUE, 0f)
    }
}

@ReactModuleList(
    nativeModules = [
        ScreensModule::class
    ]
)
class RNScreensPackage : TurboReactPackage() {
    // The state required to compute header dimensions. We want this on instance rather than on class
    // for context access & being tied to instance lifetime.
    private lateinit var coordinatorLayout: CoordinatorLayout
    private lateinit var appBarLayout: AppBarLayout
    private lateinit var dummyContentView: View
    private lateinit var toolbar: Toolbar
    private var defaultFontSize: Float = 0f

    // LRU with size 1
    private var cache: HeaderHeightCacheEntry = HeaderHeightCacheEntry.EMPTY

    // We do not want to be responsible for the context lifecycle. If it's null, we're fine.
    // This same context is being passed down to our view components so it is destroyed
    // only if our views also are.
    private var reactContextRef: WeakReference<ReactApplicationContext> = WeakReference(null)

    init {
        // We load the library so that we are able to communicate with our C++ code (descriptor & shadow nodes).
        // Basically we leak this object to C++, as its lifecycle should span throughout whole application
        // lifecycle anyway.
        try {
            System.loadLibrary(LIBRARY_NAME)
        } catch (e: UnsatisfiedLinkError) {
            Log.w(TAG, "Failed to load $LIBRARY_NAME")
        }
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // This is the earliest we lay our hands on react context.
        // Moreover this is called before FabricUIManger has finished initializing, not to mention
        // installing its C++ bindings - so we are safe in terms of creating this hierarchy
        // before RN starts creating shadow nodes.
        WEAK_THIS = WeakReference(this)
        this.reactContextRef = WeakReference(reactContext)
        ensureDummyLayoutWithHeader(reactContext)

        return listOf<ViewManager<*, *>>(
            ScreenContainerViewManager(),
            ScreenViewManager(),
            ModalScreenViewManager(),
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

    /**
     * Initializes dummy view hierarchy with CoordinatorLayout, AppBarLayout and dummy View.
     * We utilize this to compute header height (app bar layout height) from C++ layer when its needed.
     */
    private fun ensureDummyLayoutWithHeader(reactContext: ReactApplicationContext) {
        if (::coordinatorLayout.isInitialized) {
            return
        }

        // We need to use activity here, as react context does not have theme attributes required by
        // AppBarLayout attached leading to crash.
        val contextWithTheme =
            requireNotNull(reactContext.currentActivity) { "[RNScreens] Attempt to use context detached from activity" }

        coordinatorLayout = CoordinatorLayout(contextWithTheme)

        appBarLayout = AppBarLayout(contextWithTheme).apply {
            layoutParams = CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.WRAP_CONTENT,
            )
        }

        toolbar = Toolbar(contextWithTheme).apply {
            title = "FontSize123!#$"
            layoutParams = AppBarLayout.LayoutParams(
                AppBarLayout.LayoutParams.MATCH_PARENT,
                AppBarLayout.LayoutParams.WRAP_CONTENT
            ).apply { scrollFlags = 0 }
        }

        // We know the title text view will be there, cause we've just set title.
        defaultFontSize = ScreenStackHeaderConfig.findTitleTextViewInToolbar(toolbar)!!.textSize

        appBarLayout.addView(toolbar)

        dummyContentView = View(contextWithTheme).apply {
            layoutParams = CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.MATCH_PARENT
            )
        }

        coordinatorLayout.apply {
            addView(appBarLayout)
            addView(dummyContentView)
        }
    }

    /**
     * Triggers layout pass on dummy view hierarchy, taking into consideration selected
     * ScreenStackHeaderConfig props that might have impact on final header height.
     *
     * @param fontSize font size value as passed from JS
     * @return header height in dp as consumed by Yoga
     */
    private fun computeDummyLayout(fontSize: Int): Float {
        if (!::coordinatorLayout.isInitialized) {
            Log.e(TAG, "[RNScreens] Attempt to access dummy view hierarchy before it is initialized")
            return 0.0f
        }

        if (cache.hasKey(fontSize)) {
            return cache.headerHeight
        }

        val topLevelDecorView = requireActivity().window.decorView

        // These dimensions are not accurate, as they do include status bar & navigation bar, however
        // it is ok for our purposes.
        val decorViewWidth = topLevelDecorView.width
        val decorViewHeight = topLevelDecorView.height

        val widthMeasureSpec = MeasureSpec.makeMeasureSpec(decorViewWidth, MeasureSpec.EXACTLY)
        val heightMeasureSpec = MeasureSpec.makeMeasureSpec(decorViewHeight, MeasureSpec.EXACTLY)

        val textView = ScreenStackHeaderConfig.findTitleTextViewInToolbar(toolbar)
        textView?.textSize = if (fontSize != FONT_SIZE_UNSET) fontSize.toFloat() else defaultFontSize

        coordinatorLayout.measure(widthMeasureSpec, heightMeasureSpec)

        // It seems that measure pass would be enough, however I'm not certain whether there are no
        // scenarios when layout violates measured dimensions.
        coordinatorLayout.layout(0, 0, decorViewWidth, decorViewHeight)

        val headerHeight = PixelUtil.toDIPFromPixel(appBarLayout.height.toFloat())
        cache = HeaderHeightCacheEntry(fontSize, headerHeight)
        return headerHeight
    }

    private fun requireReactContext(): ReactApplicationContext {
        return requireNotNull(reactContextRef.get()) { "[RNScreens] Attempt to require missing react context" }
    }

    private fun requireActivity(): Activity {
        return requireNotNull(requireReactContext().currentActivity) { "[RNScreens] Attempt to use context detached from activity" }
    }

    companion object {
        const val TAG = "RNScreensPackage"
        const val LIBRARY_NAME = "react_codegen_rnscreens"

        const val FONT_SIZE_UNSET = -1

        // We access this field from C++ layer, through `getInstance` method.
        // We don't care what instance we get access to as long as it has initialized
        // dummy view hierarchy.
        private var WEAK_THIS = WeakReference<RNScreensPackage>(null)

        @JvmStatic
        fun getInstance(): RNScreensPackage? {
            return WEAK_THIS.get()
        }
    }

}
