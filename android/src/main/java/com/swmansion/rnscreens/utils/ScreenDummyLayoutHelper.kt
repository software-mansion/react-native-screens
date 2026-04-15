package com.swmansion.rnscreens.utils

import android.app.Activity
import android.app.Application
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.jni.annotations.DoNotStrip
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.appbar.AppBarLayout
import com.swmansion.rnscreens.ScreenStackHeaderConfig
import java.lang.ref.WeakReference

/**
 * This class provides methods to create dummy layout (that mimics Screen setup), and to compute
 * expected header height. It is meant to be accessed from C++ layer via JNI.
 * See https://github.com/software-mansion/react-native-screens/pull/2169
 * for more detailed description of the issue this code solves.
 */
@DoNotStrip
internal class ScreenDummyLayoutHelper(
    reactContext: ReactApplicationContext,
) : LifecycleEventListener {
    // The state required to compute header dimensions. We want this on instance rather than on class
    // for context access & being tied to instance lifetime.
    private var coordinatorLayout: CoordinatorLayout? = null
    private var appBarLayout: AppBarLayout? = null
    private var dummyContentView: View? = null
    private var toolbar: Toolbar? = null
    private var defaultFontSize: Float = 0f
    private var defaultContentInsetStartWithNavigation: Int = 0

    // LRU with size 1
    private var cache: CacheEntry = CacheEntry.EMPTY

    // We do not want to be responsible for the context lifecycle. If it's null, we're fine.
    // This same context is being passed down to our view components so it is destroyed
    // only if our views also are.
    private var reactContextRef: WeakReference<ReactApplicationContext> =
        WeakReference(reactContext)

    // We're relying on the native notification for performing cleanup, rather than relying on ReactNative `onHostDestroy`
    private var activityLifecycleCallbacks: Application.ActivityLifecycleCallbacks? = null

    init {
        // We load the library so that we are able to communicate with our C++ code (descriptor & shadow nodes).
        // Basically we leak this object to C++, as its lifecycle should span throughout whole application
        // lifecycle anyway.
        try {
            System.loadLibrary(LIBRARY_NAME)
        } catch (e: UnsatisfiedLinkError) {
            Log.w(TAG, "[RNScreens] Failed to load $LIBRARY_NAME library.")
        }

        weakInstance = WeakReference(this)
        maybeInitDummyLayoutWithHeader(reactContext)
        // We register as lifecycleEventListener to retry initialization in onHostResume if the
        // activity wasn't yet available. Once initialization succeeds, onHostResume removes this listener
        // from that point on cleanup is handled exclusively by ActivityLifecycleCallbacks registered on the
        // Application. onHostDestroy here acts only as a defensive fallback to unregister in the rare case
        // where init never succeeded and the lifecycleEventListener was therefore never removed.
        reactContext.addLifecycleEventListener(this)
    }

    /**
     * Tries to initialize dummy view hierarchy with CoordinatorLayout, AppBarLayout and dummy View.
     * We utilize this to compute header height (app bar layout height) from C++ layer when its needed.
     *
     * This method might fail in case there is activity attached to the react context.
     *
     * This method is called from various threads!
     *
     * @return boolean whether the layout was initialised or not
     */
    private fun maybeInitDummyLayoutWithHeader(reactContext: ReactApplicationContext): Boolean {
        if (isLayoutInitialized) {
            return true
        }

        // Possible data race here - activity is injected into context on UI thread.
        if (!reactContext.hasCurrentActivity()) {
            return false
        }

        // We need to use activity here, as react context does not have theme attributes required by
        // AppBarLayout attached leading to crash.
        val activity =
            requireNotNull(reactContext.currentActivity) {
                "[RNScreens] Attempt to use context detached from activity. This could happen only due to race-condition."
            }

        synchronized(this) {
            // The layout could have been initialised when this thread waited for access to critical section.
            if (isLayoutInitialized) {
                return true
            }
            initDummyLayoutWithHeader(activity)

            registerActivityLifecycleListener(activity)
        }
        return true
    }

    /**
     * Initialises the dummy layout. This method is **not** thread-safe.
     *
     * @param contextWithTheme this function expects the context to have theme attributes required
     * to initialize the AppBarLayout.
     */
    private fun initDummyLayoutWithHeader(contextWithTheme: Context) {
        val newCoordinatorLayout = CoordinatorLayout(contextWithTheme)

        val newAppBarLayout =
            AppBarLayout(contextWithTheme).apply {
                layoutParams =
                    CoordinatorLayout.LayoutParams(
                        CoordinatorLayout.LayoutParams.MATCH_PARENT,
                        CoordinatorLayout.LayoutParams.WRAP_CONTENT,
                    )
            }

        val newToolbar =
            Toolbar(contextWithTheme).apply {
                title = DEFAULT_HEADER_TITLE
                layoutParams =
                    AppBarLayout
                        .LayoutParams(
                            AppBarLayout.LayoutParams.MATCH_PARENT,
                            AppBarLayout.LayoutParams.WRAP_CONTENT,
                        ).apply { scrollFlags = 0 }
            }

        // We know the title text view will be there, cause we've just set title.
        val titleTextView =
            checkNotNull(ScreenStackHeaderConfig.findTitleTextViewInToolbar(newToolbar)) {
                "[RNScreens] Failed to find TextView in children of Toolbar"
            }
        defaultFontSize = titleTextView.textSize
        defaultContentInsetStartWithNavigation = newToolbar.contentInsetStartWithNavigation

        newAppBarLayout.addView(newToolbar)

        val newDummyContentView =
            View(contextWithTheme).apply {
                layoutParams =
                    CoordinatorLayout.LayoutParams(
                        CoordinatorLayout.LayoutParams.MATCH_PARENT,
                        CoordinatorLayout.LayoutParams.MATCH_PARENT,
                    )
            }

        newCoordinatorLayout.apply {
            addView(newAppBarLayout)
            addView(newDummyContentView)
        }

        coordinatorLayout = newCoordinatorLayout
        appBarLayout = newAppBarLayout
        toolbar = newToolbar
        dummyContentView = newDummyContentView

        isLayoutInitialized = true
    }

    /**
     * Triggers layout pass on dummy view hierarchy, taking into consideration selected
     * ScreenStackHeaderConfig props that might have impact on final header height.
     *
     * It's called from C++ via JNI on a background thread; @Synchronized guards against concurrent `cleanUpViews`
     * running on the main thread (activity lifecycle), which would flip `isLayoutInitialized` and clear
     * the cache while a measurement is in progress.
     *
     * @param fontSize font size value as passed from JS
     * @return header height in dp as consumed by Yoga
     */
    @DoNotStrip
    @Synchronized
    private fun computeDummyLayout(
        fontSize: Int,
        isTitleEmpty: Boolean,
    ): Float {
        if (!isLayoutInitialized) {
            val reactContext =
                requireReactContext { "[RNScreens] Context was null-ed before dummy layout was initialized" }
            if (!maybeInitDummyLayoutWithHeader(reactContext)) {
                // This theoretically might happen at Fabric + "bridgefull" combination, due to race condition where `reactContext.currentActivity`
                // is still null at this execution point. We don't wanna crash in such case, thus returning zeroed height.
                Log.e(
                    TAG,
                    "[RNScreens] Failed to late-init layout while computing header height. This is most likely a race-condition-bug in react-native-screens, please file an issue at https://github.com/software-mansion/react-native-screens/issues",
                )
                return 0.0f
            }
        }

        if (cache.hasKey(CacheKey(fontSize, isTitleEmpty))) {
            return cache.headerHeight
        }

        // components below are always initialized and cleared together.
        val currentCoordinatorLayout = coordinatorLayout
        val currentAppBarLayout = appBarLayout
        val currentToolbar = toolbar
        val currentActivity = reactContextRef.get()?.currentActivity
        if (currentCoordinatorLayout == null || currentAppBarLayout == null || currentToolbar == null || currentActivity == null) {
            return 0.0f
        }

        val topLevelDecorView = currentActivity.window.decorView
        val topInset = getDecorViewTopInset(topLevelDecorView)

        // These dimensions are not accurate, as they do include navigation bar, however
        // it is ok for our purposes.
        val decorViewWidth = topLevelDecorView.width
        val decorViewHeight = topLevelDecorView.height

        val widthMeasureSpec =
            View.MeasureSpec.makeMeasureSpec(decorViewWidth, View.MeasureSpec.EXACTLY)
        val heightMeasureSpec =
            View.MeasureSpec.makeMeasureSpec(decorViewHeight, View.MeasureSpec.EXACTLY)

        if (isTitleEmpty) {
            currentToolbar.title = ""
            currentToolbar.contentInsetStartWithNavigation = 0
        } else {
            currentToolbar.title = DEFAULT_HEADER_TITLE
            currentToolbar.contentInsetStartWithNavigation = defaultContentInsetStartWithNavigation
        }

        val textView = ScreenStackHeaderConfig.findTitleTextViewInToolbar(currentToolbar)
        textView?.textSize =
            if (fontSize != FONT_SIZE_UNSET) fontSize.toFloat() else defaultFontSize

        currentCoordinatorLayout.measure(widthMeasureSpec, heightMeasureSpec)

        // It seems that measure pass would be enough, however I'm not certain whether there are no
        // scenarios when layout violates measured dimensions.
        currentCoordinatorLayout.layout(0, 0, decorViewWidth, decorViewHeight)

        // Include the top inset to account for the extra padding manually applied to the CustomToolbar.
        val totalAppBarLayoutHeight = currentAppBarLayout.height.toFloat() + topInset

        val headerHeight = PixelUtil.toDIPFromPixel(totalAppBarLayoutHeight)
        cache = CacheEntry(CacheKey(fontSize, isTitleEmpty), headerHeight)
        return headerHeight
    }

    // We use Application.ActivityLifecycleCallbacks instead of ReactNative's LifecycleEventListener
    // for cleanup because it is registered on the Application object directly. We're relying on the native
    // lifecycle, rather than React's lifecycle.
    private fun registerActivityLifecycleListener(activity: Activity) {
        if (activityLifecycleCallbacks != null) return

        activityLifecycleCallbacks =
            object : Application.ActivityLifecycleCallbacks {
                override fun onActivityDestroyed(destroyedActivity: Activity) {
                    if (destroyedActivity === activity) {
                        cleanUpViews(destroyedActivity.application)
                    }
                }

                override fun onActivityCreated(
                    activity: Activity,
                    savedInstanceState: Bundle?,
                ) = Unit

                override fun onActivityStarted(activity: Activity) = Unit

                override fun onActivityResumed(activity: Activity) = Unit

                override fun onActivityPaused(activity: Activity) = Unit

                override fun onActivityStopped(activity: Activity) = Unit

                override fun onActivitySaveInstanceState(
                    activity: Activity,
                    outState: Bundle,
                ) = Unit
            }

        activity.application.registerActivityLifecycleCallbacks(activityLifecycleCallbacks)
    }

    private fun requireReactContext(lazyMessage: (() -> Any)? = null): ReactApplicationContext =
        requireNotNull(
            reactContextRef.get(),
            lazyMessage ?: { "[RNScreens] Attempt to require missing react context" },
        )

    companion object {
        const val TAG = "ScreenDummyLayoutHelper"

        const val LIBRARY_NAME = "react_codegen_rnscreens"

        const val FONT_SIZE_UNSET = -1

        private const val DEFAULT_HEADER_TITLE: String = "FontSize123!#$"

        // We access this field from C++ layer, through `getInstance` method.
        // We don't care what instance we get access to as long as it has initialized
        // dummy view hierarchy.
        private var weakInstance = WeakReference<ScreenDummyLayoutHelper>(null)

        @DoNotStrip
        @JvmStatic
        fun getInstance(): ScreenDummyLayoutHelper? = weakInstance.get()
    }

    // This value is fetched / stored from UI and background thread. Volatile here ensures
    // that updates are visible to the other thread.
    @Volatile
    private var isLayoutInitialized = false

    override fun onHostResume() {
        // This is the earliest we have guarantee that the context has a reference to an activity.
        val reactContext = requireReactContext { "[RNScreens] ReactContext missing in onHostResume! This should not happen." }

        // There are some exotic edge cases where activity might not be present in context
        // at this point, e.g. when reloading RN in development after an error was reported with redbox.
        if (maybeInitDummyLayoutWithHeader(reactContext)) {
            reactContext.removeLifecycleEventListener(this)
        } else {
            Log.w(TAG, "[RNScreens] Failed to initialise dummy layout in onHostResume.")
        }
    }

    override fun onHostPause() = Unit

    override fun onHostDestroy() {
        reactContextRef.get()?.removeLifecycleEventListener(this)
    }

    // Called from `onActivityDestroyed` on the main thread; @Synchronized guards against concurrent
    // `computeDummyLayout` running on a JNI background thread, which could write a stale cache entry after cleanup.
    @Synchronized
    private fun cleanUpViews(application: Application) {
        coordinatorLayout = null
        appBarLayout = null
        dummyContentView = null
        toolbar = null

        cache = CacheEntry.EMPTY

        isLayoutInitialized = false

        val callbacks = activityLifecycleCallbacks
        if (callbacks != null) {
            application.unregisterActivityLifecycleCallbacks(callbacks)
            activityLifecycleCallbacks = null
        }
    }
}

private data class CacheKey(
    val fontSize: Int,
    val isTitleEmpty: Boolean,
)

private class CacheEntry(
    val cacheKey: CacheKey,
    val headerHeight: Float,
) {
    fun hasKey(key: CacheKey) = cacheKey.fontSize != Int.MIN_VALUE && cacheKey == key

    companion object {
        val EMPTY = CacheEntry(CacheKey(Int.MIN_VALUE, false), 0f)
    }
}
