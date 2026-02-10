package com.swmansion.rnscreens.gamma.helpers

import androidx.annotation.UiThread

interface ViewIdProviding {
    fun generateViewId(): Int
}

/**
 * This class generates view id that should not collide with ids (tags) assigned by renderer to React
 * components.
 *
 * This class relies on internal renderer behaviours, that happened to change over the time, therefore
 * it must be revisited & kept up to date with current RN behaviour until better solution is found.
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

    private fun isValidReactRootTag(tag: Int): Boolean = tag % 10 == 1
}

@UiThread
object ViewIdGenerator : ViewIdProviding {
    /**
     * Set this field to customize view ids utilized by the library.
     */
    var externalGenerator: ViewIdProviding? = null
    private val defaultGenerator: ViewIdProviding = NewArchAwareViewIdGenerator()

    override fun generateViewId(): Int {
        externalGenerator?.let { return it.generateViewId() }
        return defaultGenerator.generateViewId()
    }
}
