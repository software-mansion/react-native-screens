package com.swmansion.rnscreens.core.containers.common

import android.os.Handler
import android.os.Looper

/**
 * Decides when a container runs its update, so that any number of update requests results in
 * a single run of [updateCallback].
 *
 * - [requestUpdate] posts one run to the main thread's message queue. Further requests do nothing
 *   until that run happens.
 * - Between [beginBatch] and [endBatch] (e.g. a React transaction) requests are only recorded,
 *   and [endBatch] runs the update once if any was requested. Batches don't nest.
 * - [flush] runs the update right away, inside a batch too, and drops the posted run.
 *
 * The scheduler only decides when; [updateCallback] decides what, from the container's own
 * invalidation state, and must do nothing when nothing is invalidated: [flush] runs it whether or
 * not an update was requested. A request raised while [updateCallback] runs schedules another run.
 *
 * Main thread only.
 */
internal class ContainerUpdateScheduler(
    private val updateCallback: () -> Unit,
) {
    private val handler = Handler(Looper.getMainLooper())

    // A run posted before a batch began waits for the batch to end.
    private val postedUpdate =
        Runnable {
            if (!isInBatch) {
                flush()
            }
        }

    private var isUpdateRequested = false

    private var isInBatch = false

    fun requestUpdate() {
        if (isUpdateRequested) {
            return
        }
        isUpdateRequested = true
        if (!isInBatch) {
            handler.post(postedUpdate)
        }
    }

    fun flush() {
        cancel()
        updateCallback()
    }

    /**
     * Drops the requested update without running it.
     */
    fun cancel() {
        isUpdateRequested = false
        handler.removeCallbacks(postedUpdate)
    }

    fun beginBatch() {
        isInBatch = true
    }

    fun endBatch() {
        isInBatch = false
        if (isUpdateRequested) {
            flush()
        }
    }
}
