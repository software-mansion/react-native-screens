package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.view.ViewGroup

/**
 * A scene root whose permanent first child, [underlay], draws before every fragment view
 * FragmentManager appends after it. A disappearing screen hosted in the underlay's overlay is
 * therefore drawn under the entering one (`ZOrder.UNDER`).
 */
internal interface StackUnderlayProviding {
    val underlay: ViewGroup
}
