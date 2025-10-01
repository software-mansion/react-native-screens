package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.view.Choreographer
import android.view.WindowInsets
import android.view.WindowManager
import androidx.appcompat.widget.Toolbar
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.modules.core.ReactChoreographer
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.utils.InsetsCompat
import com.swmansion.rnscreens.utils.resolveInsetsOrZero
import kotlin.math.max

/**
 * Main toolbar class representing the native header.
 *
 * This class is used to store config closer to search bar.
 * It also handles inset/padding related logic in coordination with header config.
 */
@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
open class CustomToolbar(
    context: Context,
    val config: ScreenStackHeaderConfig,
) : Toolbar(context) {
    // Due to edge-to-edge enforcement starting from Android SDK 35, isTopInsetEnabled prop has been
    // removed. Previously, shouldAvoidDisplayCutout, shouldApplyTopInset would directly return the
    // value of isTopInsetEnabled. Now, the values of shouldAvoidDisplayCutout, shouldApplyTopInse
    // are hard-coded to true (which was the value used previously for isTopInsetEnabled when
    // edge-to-edge was enabled: https://github.com/software-mansion/react-native-screens/pull/2464/files#diff-bd1164595b04f44490738b8183f84a625c0e7552a4ae70bfefcdf3bca4d37fc7R34).
    private val shouldAvoidDisplayCutout = true

    private val shouldApplyTopInset = true

    private var lastInsets = InsetsCompat.NONE

    private var isForceShadowStateUpdateOnLayoutRequested = false

    private var isLayoutEnqueued = false
    private val layoutCallback: Choreographer.FrameCallback =
        object : Choreographer.FrameCallback {
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

    override fun onApplyWindowInsets(insets: WindowInsets?): WindowInsets? {
        val unhandledInsets = super.onApplyWindowInsets(insets)

        // There are few UI modes we could be running in
        //
        // 1. legacy non edge-to-edge mode,
        // 2. edge-to-edge with gesture navigation,
        // 3. edge-to-edge with translucent navigation buttons bar.
        //
        // Additionally we need to gracefully handle possible display cutouts.

        // We use rootWindowInsets in lieu of insets or unhandledInsets here,
        // because cutout sometimes (only in certain scenarios, e.g. with headerLeft view present)
        // happen to be Insets.ZERO and is not reliable.
        val rootWindowInsets = rootWindowInsets
        val cutoutInsets =
            resolveInsetsOrZero(WindowInsetsCompat.Type.displayCutout(), rootWindowInsets)
        val systemBarInsets =
            resolveInsetsOrZero(WindowInsetsCompat.Type.systemBars(), rootWindowInsets)
        val statusBarInsetsStable =
            resolveInsetsOrZero(
                WindowInsetsCompat.Type.systemBars(),
                rootWindowInsets,
                ignoreVisibility = true,
            )

        // This seems to work fine in all tested configurations, because cutout & system bars overlap
        // only in portrait mode & top inset is controlled separately, therefore we don't count
        // any insets twice.
        val horizontalInsets =
            InsetsCompat.of(
                cutoutInsets.left + systemBarInsets.left,
                0,
                cutoutInsets.right + systemBarInsets.right,
                0,
            )

        // We want to handle display cutout always, no matter the HeaderConfig prop values.
        // If there are no cutout displays, we want to apply the additional padding to
        // respect the status bar.
        val verticalInsets =
            InsetsCompat.of(
                0,
                max(cutoutInsets.top, if (shouldApplyTopInset) statusBarInsetsStable.top else 0),
                0,
                max(cutoutInsets.bottom, 0),
            )

        val newInsets = InsetsCompat.add(horizontalInsets, verticalInsets)

        if (lastInsets != newInsets) {
            lastInsets = newInsets
            applyExactPadding(
                lastInsets.left,
                lastInsets.top,
                lastInsets.right,
                lastInsets.bottom,
            )
        }

        return unhandledInsets
    }

    override fun onLayout(
        hasSizeChanged: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        super.onLayout(hasSizeChanged, l, t, r, b)

        config.onNativeToolbarLayout(
            this,
            hasSizeChanged || isForceShadowStateUpdateOnLayoutRequested,
        )
        isForceShadowStateUpdateOnLayoutRequested = false
    }

    fun updateContentInsets() {
        contentInsetStartWithNavigation = config.preferredContentInsetStartWithNavigation
        setContentInsetsRelative(config.preferredContentInsetStart, config.preferredContentInsetEnd)
    }

    private fun applyExactPadding(
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        requestForceShadowStateUpdateOnLayout()
        setPadding(left, top, right, bottom)
    }

    private fun requestForceShadowStateUpdateOnLayout() {
        isForceShadowStateUpdateOnLayoutRequested = shouldAvoidDisplayCutout
    }
}
