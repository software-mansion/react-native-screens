package com.swmansion.rnscreens.react.utils

import android.view.View
import androidx.annotation.UiThread
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.BuildConfig
import com.swmansion.rnscreens.core.utils.ViewIdProviding

/**
 * This class generates view id that should not collide with ids (tags) assigned by renderer to React
 * components.
 *
 * This class relies on internal renderer behaviours, that happened to change over the time, therefore
 * it must be revisited & kept up to date with current RN behaviour until better solution is found.
 * [assertReactTagSchemeInDebug] fails in debug builds when these assumptions stop holding.
 *
 * Until RN 0.81 ReactSurfaceView had tag `11`. In later versions it was changed to `1` (new arch only change).
 *
 * Up to the time of writing this (RN 0.81.0-rc.5) every version incremented tag version by 2,
 * starting from `(ReactSurfaceView.tag + 1)`, therefore all tags were even. We start generating all
 * odd numbers from 3, except valid root view tags, which are 1, 11, 21, etc. This should work no matter
 * exact RN version.
 *
 * Reference:
 *
 * * https://github.com/facebook/react-native/blob/739dfd2141015a8126448bda64a559f5bf22672e/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/ReactRootView.java#L136
 * * https://github.com/facebook/react-native/commit/8bcf13407183285bf54b336593357889764de230
 * * https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/uimanager/ReactRootViewTagGenerator.kt
 * * https://github.com/facebook/react-native/blob/main/packages/react-native/ReactCommon/react/renderer/core/ReactRootViewTagGenerator.cpp
 */
@UiThread
private class NewArchAwareViewIdGenerator : ViewIdProviding {
    private var nextId: Int = 3

    override fun generateViewId(): Int = nextId.also { progressViewId() }

    private fun progressViewId() {
        nextId += 2
        if (isValidReactRootTag(nextId)) {
            nextId += 2
        }
    }
}

private fun isValidReactRootTag(tag: Int): Boolean = tag % 10 == 1

@UiThread
object ViewIdGenerator : ViewIdProviding {
    /**
     * Set this field to customize view ids utilized by the library.
     *
     * Ids must be unique process-wide and must not collide with tags assigned by React Native.
     * It may be set at any time, but it affects only ids issued after it is set: ids already
     * issued are kept by their views. Set it in `Application.onCreate`, before any React surface
     * renders, unless the new generator never returns ids issued before.
     */
    var externalGenerator: ViewIdProviding? = null
    private val defaultGenerator: ViewIdProviding = NewArchAwareViewIdGenerator()

    override fun generateViewId(): Int {
        externalGenerator?.let { return it.generateViewId() }
        return defaultGenerator.generateViewId()
    }
}

/**
 * Checks, in debug builds, the React Native tag scheme that [ViewIdGenerator]'s default relies on:
 * the tag of a view rendered by React is even, and the tag of its surface is a valid root view tag.
 * Skipped when [ViewIdGenerator.externalGenerator] is set, since the default is not used then.
 */
internal fun assertReactTagSchemeInDebug(reactView: View) {
    if (!BuildConfig.DEBUG || ViewIdGenerator.externalGenerator != null) {
        return
    }
    check(reactView.id % 2 == 0) {
        "[RNScreens] React tag ${reactView.id} is odd; ViewIdGenerator may collide with React tags"
    }
    val surfaceId = UIManagerHelper.getSurfaceId(reactView)
    check(isValidReactRootTag(surfaceId)) {
        "[RNScreens] Surface tag $surfaceId is not 1 (mod 10); ViewIdGenerator may collide with root view tags"
    }
}
