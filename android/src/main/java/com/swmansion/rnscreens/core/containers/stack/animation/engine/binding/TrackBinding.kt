package com.swmansion.rnscreens.core.containers.stack.animation.engine.binding

/**
 * A track bound to one view's pixel space, evaluated per frame as a function of the screen
 * timeline's time. Endpoints and the interpolator are resolved once per animator.
 */
internal interface TrackBinding {
    /**
     * [eased] is false while a seek controller drives the timeline, see `createTimelineAnimator`.
     */
    fun apply(
        timeMs: Float,
        eased: Boolean,
    )

    /**
     * Puts the binding's own target back to its rest value. Idempotent, and mandatory: fragment
     * views are retained across detach, so a canceled or reversed transition must not leave
     * them displaced.
     */
    fun restore()

    fun onStart() = Unit

    fun onPause() = Unit
}
