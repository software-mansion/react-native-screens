package com.swmansion.rnscreens.core.containers.stack.animation.engine.binding

import android.view.View
import android.view.ViewGroup
import android.view.animation.Interpolator
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Timing

/**
 * A scrim over one screen, hosted in that screen's own overlay so it draws above the screen's
 * content and below its siblings. It is added and removed exactly when the animator starts,
 * pauses, resumes, ends or is canceled, which mirrors androidx `Visibility.OverlayListener`.
 */
internal class ScrimBinding(
    private val host: ViewGroup,
    color: Int,
    private val from: Float,
    private val to: Float,
    private val timing: Timing,
    private val interpolator: Interpolator,
) : TrackBinding {
    private val scrim =
        View(host.context).apply {
            setBackgroundColor(color)
            alpha = from
        }

    override fun apply(
        timeMs: Float,
        eased: Boolean,
    ) {
        val progress = timing.progressAt(timeMs)
        scrim.alpha = from + (to - from) * if (eased) interpolator.getInterpolation(progress) else progress
    }

    override fun onStart() {
        scrim.layout(0, 0, host.width, host.height)
        host.overlay.add(scrim)
    }

    override fun onPause() = restore()

    override fun restore() {
        host.overlay.remove(scrim)
    }
}
