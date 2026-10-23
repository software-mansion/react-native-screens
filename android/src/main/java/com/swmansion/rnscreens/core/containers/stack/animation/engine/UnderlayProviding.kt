package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.view.ViewGroup

/**
 * A scene root that keeps a permanent first child whose overlay draws under every later child.
 * A disappearing screen hosted there is drawn under the entering one.
 */
internal interface UnderlayProviding {
    val underlay: ViewGroup
}
