package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.view.Choreographer
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import androidx.appcompat.widget.Toolbar
import androidx.core.graphics.Insets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.modules.core.ReactChoreographer
import com.facebook.react.uimanager.ThemedReactContext
import com.swmansion.rnscreens.utils.InsetUtils
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
) : Toolbar(context),
    OnApplyWindowInsetsListener,
    View.OnApplyWindowInsetsListener {
    private var lastInsets = Insets.NONE

    // As CustomToolbar is responsible for handling insets in Stack, we store what insets should
    // be passed to Screen in this property. It's used by ScreensCoordinatorLayout in overridden
    // dispatchApplyWindowInsets.
    internal var screenInsets = WindowInsetsCompat.CONSUMED

    private var shouldApplyLayoutCorrectionForTopInset = false

    private var isForceShadowStateUpdateOnLayoutRequested = false

    private var isLayoutEnqueued = false

    init {
        // Ensure ActionMenuView is initialized as soon as the Toolbar is created.
        //
        // Android measures Toolbar height based on the tallest child view.
        // During the first measurement:
        // 1. The Toolbar is created but not yet added to the action bar via `activity.setSupportActionBar(toolbar)`
        //    (typically called in `onUpdate` method from `ScreenStackHeaderConfig`).
        // 2. At this moment, the title view may exist, but ActionMenuView (which may be taller) hasn't been added yet.
        // 3. This causes the initial height calculation to be based on the title view, potentially too small.
        // 4. When ActionMenuView is eventually attached, the Toolbar might need to re-layout due to the size change.
        //
        // By referencing the menu here, we trigger `ensureMenu`, which creates and attaches ActionMenuView early.
        // This guarantees that all size-dependent children are present during the first layout pass,
        // resulting in correct height determination from the beginning.
        // More details: https://github.com/software-mansion/react-native-screens-labs/issues/564.
        menu

        // In order to consume display cutout insets on API 27-29, we can't use root window insets
        // aware WindowInsetsCompat because they always return display cutout insets from root view.
        // That's why we manually convert platform WindowInsets to WindowInsetsCompat (without
        // supplying information about the view that is used by WindowInsetsCompat to find the root
        // view) in View's OnApplyWindowInsetsListener, use ViewCompat listener and return insets
        // converted back to platform WindowInsets.
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            setOnApplyWindowInsetsListener(this)
        } else {
            ViewCompat.setOnApplyWindowInsetsListener(this, this)
        }
    }

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

        val maybeAppBarLayout = parent as? CustomAppBarLayout
        maybeAppBarLayout?.let {
            if (shouldApplyLayoutCorrectionForTopInset && !it.isInLayout) {
                // In `applyToolbarLayoutCorrection`, we call and immediate layout on AppBarLayout
                // to update it right away and avoid showing a potentially wrong UI state.
                it.applyToolbarLayoutCorrection(paddingTop)
                shouldApplyLayoutCorrectionForTopInset = false
            }
        }

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

    // Wrapper used on API < 30 to correctly handle consuming display cutout insets.
    // More details in the comment above setting the listener.
    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsets,
    ): WindowInsets {
        val rootViewUnawareInsets = WindowInsetsCompat.toWindowInsetsCompat(insets)
        return this
            .onApplyWindowInsets(this, rootViewUnawareInsets)
            .toWindowInsets() ?: InsetUtils.CONSUMED_PLATFORM_WINDOW_INSETS
    }

    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        val unhandledInsets =
            WindowInsetsCompat.toWindowInsetsCompat(super.onApplyWindowInsets(insets.toWindowInsets()))

        // There are few UI modes we could be running in
        //
        // 1. legacy non edge-to-edge mode,
        // 2. edge-to-edge with gesture navigation,
        // 3. edge-to-edge with translucent navigation buttons bar.
        //
        // Additionally we need to gracefully handle possible display cutouts.
        val cutoutInsets = unhandledInsets.getInsets(WindowInsetsCompat.Type.displayCutout())
        val systemBarInsets = unhandledInsets.getInsets(WindowInsetsCompat.Type.systemBars())

        // This seems to work fine in all tested configurations, because cutout & system bars overlap
        // only in portrait mode & top inset is controlled separately, therefore we don't count
        // any insets twice.
        val horizontalInsets =
            Insets.of(
                cutoutInsets.left + systemBarInsets.left,
                0,
                cutoutInsets.right + systemBarInsets.right,
                0,
            )

        // We want to handle display cutout always, no matter the HeaderConfig prop values.
        // If there are no cutout displays, we want to apply the additional padding to
        // respect the status bar.
        val verticalInsets =
            Insets.of(
                0,
                max(cutoutInsets.top, systemBarInsets.top),
                0,
                max(cutoutInsets.bottom, 0),
            )

        val newInsets = Insets.add(horizontalInsets, verticalInsets)

        if (lastInsets != newInsets) {
            lastInsets = newInsets
            applyExactPadding(
                lastInsets.left,
                lastInsets.top,
                lastInsets.right,
                lastInsets.bottom,
            )

            // Insets for Screen component.
            screenInsets =
                WindowInsetsCompat
                    .Builder(unhandledInsets)
                    .setInsets(
                        WindowInsetsCompat.Type.displayCutout(),
                        Insets.of(
                            cutoutInsets.left,
                            0,
                            cutoutInsets.right,
                            cutoutInsets.bottom,
                        ),
                    ).setInsets(
                        WindowInsetsCompat.Type.systemBars(),
                        Insets.of(
                            systemBarInsets.left,
                            0,
                            systemBarInsets.right,
                            systemBarInsets.bottom,
                        ),
                    ).build()

            // On Android versions prior to R, setInsets(WindowInsetsCompat.Type.displayCutout(), ...)
            // does not work. We need to use previous API.
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
                screenInsets = screenInsets.consumeDisplayCutout()
            }
        }

        var consumedInsets =
            WindowInsetsCompat
                .Builder(unhandledInsets)
                .setInsets(
                    WindowInsetsCompat.Type.displayCutout(),
                    Insets.NONE,
                ).setInsets(
                    WindowInsetsCompat.Type.systemBars(),
                    Insets.of(
                        0,
                        0,
                        0,
                        systemBarInsets.bottom,
                    ),
                ).build()

        // On Android versions prior to R, setInsets(WindowInsetsCompat.Type.displayCutout(), ...)
        // does not work. We need to use previous API.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            consumedInsets = consumedInsets.consumeDisplayCutout()
        }

        // Technically, we don't need those returned insets anywhere but for consistency's sake
        // I decided to return the correct value.
        return consumedInsets
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
        shouldApplyLayoutCorrectionForTopInset = true
        requestForceShadowStateUpdateOnLayout()
        setPadding(left, top, right, bottom)
    }

    private fun requestForceShadowStateUpdateOnLayout() {
        isForceShadowStateUpdateOnLayoutRequested = true
    }
}
