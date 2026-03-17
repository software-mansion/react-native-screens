package com.swmansion.rnscreens.sharedtransition

import android.content.Context
import android.util.Log
import androidx.core.view.ViewCompat
import com.facebook.react.views.view.ReactViewGroup

/**
 * A custom native view that participates in shared element transitions.
 *
 * This view sets a `transitionName` on itself so that Android's Fragment
 * shared element transition framework can match it with a corresponding
 * view in the destination screen.
 *
 * When used as a source, this view's bounds animate to fill the destination
 * screen's matching SharedTransitionView (or the screen itself).
 */
class SharedTransitionView(context: Context) : ReactViewGroup(context) {

    var sharedTransitionTag: String? = null
        set(value) {
            field = value
            if (value != null) {
                ViewCompat.setTransitionName(this, value)
                Log.d(TAG, "Set transitionName='$value' on view id=$id")
            } else {
                ViewCompat.setTransitionName(this, null)
            }
        }

    init {
        // Clip children to this view's bounds during transition so child views
        // (text, icons) don't float outside the animating shared element rectangle.
        clipChildren = true
        clipToPadding = true
    }

    companion object {
        const val TAG = "SharedTransitionView"
    }
}
