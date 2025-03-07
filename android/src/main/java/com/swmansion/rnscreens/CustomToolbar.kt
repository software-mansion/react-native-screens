package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.util.Log
import android.view.WindowInsets
import android.view.WindowManager
import androidx.appcompat.widget.Toolbar
import com.facebook.react.modules.core.ChoreographerCompat
import com.facebook.react.modules.core.ReactChoreographer
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.utils.InsetsCompat
import com.swmansion.rnscreens.utils.resolveDisplayCutoutInsets
import com.swmansion.rnscreens.utils.resolveSystemBarInsets
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
    // Switch this flag to enable/disable display cutout avoidance.
    // Currently this is controlled by isTopInsetEnabled prop.
    private val shouldAvoidDisplayCutout
        get() = config.isTopInsetEnabled

    private val shouldApplyTopInset
        get() = config.isTopInsetEnabled

    private var lastHorizontalInsets = InsetsCompat.NONE
    private var isForceShadowStateUpdateOnLayoutRequested = false

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
        val cutoutInsets = resolveDisplayCutoutInsets(rootWindowInsets)
        val systemBarInsets = resolveSystemBarInsets(rootWindowInsets)

        // This seems to work fine in all tested configurations, because cutout & system bars overlap
        // only in portrait mode & top inset is controlled separately, therefore we don't count
        // any insets twice.
        val horizontalInsets =
            with(InsetsCompat.add(cutoutInsets, systemBarInsets)) {
                InsetsCompat.of(this.left, 0, this.right, 0)
            }

        if (lastHorizontalInsets != horizontalInsets) {
            lastHorizontalInsets = horizontalInsets
            applyExactPadding(lastHorizontalInsets.left, paddingTop, lastHorizontalInsets.right, paddingBottom)
        }

        Log.i("CustomToolbar", "onApplyWindowInsets: horizontal: $horizontalInsets, cutout: $cutoutInsets, systemBar: $systemBarInsets")
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

        config.onNativeToolbarLayout(this, hasSizeChanged || isForceShadowStateUpdateOnLayoutRequested)
        isForceShadowStateUpdateOnLayoutRequested = false
    }

    fun updateContentInsets(
        topInset: Int,
        startInset: Int,
        endInset: Int,
        startInsetWithNavigation: Int,
    ) {
        if (shouldApplyTopInset) {
            applyMinimumTopInset(topInset)
        } else if (paddingTop > 0) {
            applyExactTopInset(0)
        }

        contentInsetStartWithNavigation = startInsetWithNavigation
        setContentInsetsRelative(startInset, endInset)
    }

    private fun applyMinimumTopInset(inset: Int) {
        applyMinimumPadding(0, inset, 0, 0)
    }

    private fun applyExactTopInset(inset: Int) {
        applyExactPadding(paddingLeft, inset, paddingRight, paddingBottom)
    }

    private fun applyMinimumPadding(
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        requestForceShadowStateUpdateOnLayout()
        setPadding(
            max(paddingLeft, left),
            max(paddingTop, top),
            max(paddingRight, right),
            max(paddingBottom, bottom),
        )
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
