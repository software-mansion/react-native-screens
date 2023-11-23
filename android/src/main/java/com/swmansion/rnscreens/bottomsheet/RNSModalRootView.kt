import android.annotation.SuppressLint
import android.content.Context
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.BuildConfig
import java.lang.RuntimeException

@SuppressLint("ViewConstructor")
class RNSModalRootView(val reactContext: Context?, val eventDispatcher: EventDispatcher) : ReactViewGroup(reactContext), RootView {
    private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
    private var jsPointerDispatcher: JSPointerDispatcher? = null

    init {

        if (ReactFeatureFlags.dispatchPointerEvents) {
            jsPointerDispatcher = JSPointerDispatcher(this)
        }
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        if (changed) {
            val width = r - l
            val height = b - t

//            if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//                updateScreenSizeFabric(width, height)
//            } else {
//                updateScreenSizePaper(width, height)
//            }
            updateScreenSizePaper(width, height)
            getChildAt(0).layout(l, t, r, b)
        }
    }

    private fun updateScreenSizePaper(width: Int, height: Int) {
        val reactContext = context as ReactContext
        reactContext.runOnNativeModulesQueueThread(
            object : GuardedRunnable(reactContext) {
                override fun runGuarded() {
                    reactContext
                        .getNativeModule(UIManagerModule::class.java)
                        ?.updateNodeSize(id, width, height)
                }
            })
    }

    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        return super.onInterceptTouchEvent(event)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
        super.onTouchEvent(event)
        return true;
    }

    override fun onInterceptHoverEvent(event: MotionEvent): Boolean {
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        // This is how DialogRootViewGroup implements this
        return super.onHoverEvent(event)
//        return super.onInterceptHoverEvent(event)

    }

    override fun onHoverEvent(event: MotionEvent): Boolean {
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
        return super.onHoverEvent(event)
    }


    override fun onChildStartedNativeGesture(view: View, event: MotionEvent) {
        jsTouchDispatcher.onChildStartedNativeGesture(event, eventDispatcher)
        jsPointerDispatcher?.onChildStartedNativeGesture(view, event, eventDispatcher)
    }

    @Deprecated("Deprecated by React Native")
    override fun onChildStartedNativeGesture(event: MotionEvent) {
        throw IllegalStateException("Deprecated onChildStartedNativeGesture was called")
    }

    override fun onChildEndedNativeGesture(view: View, event: MotionEvent) {
        jsTouchDispatcher.onChildEndedNativeGesture(event, eventDispatcher)
        jsPointerDispatcher?.onChildEndedNativeGesture()
    }

    override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
        // We do not pass through request of our child up the view hierarchy, as we
        // need to keep receiving events.
    }

    override fun handleException(throwable: Throwable?) {
//        reactContext?.reactApplicationContext?.handleException(RuntimeException(throwable))
    }
}