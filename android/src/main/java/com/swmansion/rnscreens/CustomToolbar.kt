package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.view.WindowManager
import androidx.appcompat.widget.Toolbar
import com.facebook.react.modules.core.ChoreographerCompat
import com.facebook.react.modules.core.ReactChoreographer
import com.facebook.react.uimanager.ThemedReactContext

// This class is used to store config closer to search bar
@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
open class CustomToolbar(
    context: Context,
    val config: ScreenStackHeaderConfig,
) : Toolbar(context) {
    private var isLayoutEnqueued = false
    private val layoutCallback: ChoreographerCompat.FrameCallback =
        object : ChoreographerCompat.FrameCallback() {
            override fun doFrame(frameTimeNanos: Long) {
                isLayoutEnqueued = false
                // The following measure specs are selected to work only with Android APIs <= 29.
                // See https://github.com/software-mansion/react-native-screens/pull/2439
                measure(
                    MeasureSpec.makeMeasureSpec(width, MeasureSpec.AT_MOST),
                    MeasureSpec.makeMeasureSpec(height, MeasureSpec.AT_MOST),
                )
                layout(left, top, right, bottom)
            }
        }

    override fun requestLayout() {
        super.requestLayout()
        val softInputMode =
            (context as ThemedReactContext)
                .currentActivity
                ?.window
                ?.attributes
                ?.softInputMode
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.Q && softInputMode == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN) {
            // Below Android API 29, layout is not being requested when subviews are being added to the layout,
            // leading to having their subviews in position 0,0 of the toolbar (as Android don't calculate
            // the position of each subview, even if Yoga has correctly set their width and height).
            // This is mostly the issue, when windowSoftInputMode is set to adjustPan in AndroidManifest.
            // Thus, we're manually calling the layout **after** the current layout.
            @Suppress("SENSELESS_COMPARISON") // mLayoutCallback can be null here since this method can be called in init
            if (!isLayoutEnqueued && layoutCallback != null) {
                isLayoutEnqueued = true
                // we use NATIVE_ANIMATED_MODULE choreographer queue because it allows us to catch the current
                // looper loop instead of enqueueing the update in the next loop causing a one frame delay.
                ReactChoreographer
                    .getInstance()
                    .postFrameCallback(
                        ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE,
                        layoutCallback,
                    )
            }
        }
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        super.onLayout(changed, l, t, r, b)

        // our children are already laid out
        val contentInsetStart = if (navigationIcon != null) contentInsetStartWithNavigation else contentInsetStart
        config.updatePaddingsFabric(contentInsetStart, contentInsetEnd)
    }
}
