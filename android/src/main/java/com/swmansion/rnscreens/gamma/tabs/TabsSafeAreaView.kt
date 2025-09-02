package com.swmansion.rnscreens.gamma.tabs

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import com.facebook.react.uimanager.PixelUtil.pxToDp
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.ext.parentAsView
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor") // Should never be recreated
class TabsSafeAreaView(
    private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext), View.OnLayoutChangeListener {
    internal lateinit var eventEmitter: TabsSafeAreaViewEventEmitter

    private var bottomNavigationViewRef = WeakReference<BottomNavigationView>(null)

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        val tabsHost = findAncestorTabsHost()
        if (tabsHost == null) {
            RNSLog.w(TAG, "Failed to find TabsHost after attaching to window. This might happen with old architecture")
            return
        }

        tabsHost.bottomNavigationView.addOnLayoutChangeListener(this)
        bottomNavigationViewRef = WeakReference(tabsHost.bottomNavigationView)

//        emitBottomNavigationViewHeight(tabsHost.bottomNavigationView.height.pxToDp().toInt())
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        bottomNavigationViewRef.get()?.removeOnLayoutChangeListener(this)
    }

    internal fun onViewManagerAddEventEmitters() {
        // When this is called from View Manager the view tag is already set
        check(id != NO_ID) { "[RNScreens] ${TabsSafeAreaView::class.simpleName} must have its tag set when registering event emitters" }
        eventEmitter = TabsSafeAreaViewEventEmitter(reactContext, id)
    }


    override fun onLayoutChange(
        view: View?,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
        oldLeft: Int,
        oldTop: Int,
        oldRight: Int,
        oldBottom: Int
    ) {
        require(view is BottomNavigationView)
        RNSLog.d(
            "[RNScreens]",
            "SAFEAREA BottomNavigationView layout changed {$left, $top} {${right - left}, ${bottom - top}}",
        )

        val height = (bottom - top).pxToDp().toInt()
        emitBottomNavigationViewHeight(height)
    }

    private fun findAncestorTabsHost(): TabsHost? {
        var hostCandidate = this.parent

        while (hostCandidate != null) {
            if (hostCandidate is TabsHost)  {
                break
            }
            hostCandidate = hostCandidate.parent
        }

        return hostCandidate as? TabsHost
    }

    private fun emitBottomNavigationViewHeight(height: Int) {
        eventEmitter.emitOnNativeLayout(height, deduplicate = true)
    }

    companion object {
        const val TAG = "TabsSafeAreaView"
    }
}
