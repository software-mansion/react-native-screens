package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

/**
 * A single toolbar menu element update carried by an `updateToolbarMenuElements`
 * view command, before its icon (if any) has been resolved.
 */
internal data class StackHeaderToolbarMenuElementUpdate(
    val id: String,
    val options: StackHeaderToolbarMenuElementOptions,
    val iconSource: StackHeaderToolbarMenuItemIconSource?,
)

/**
 * A single toolbar menu element update whose icon has already been resolved and merged
 * into [options], ready to be applied to the toolbar.
 */
internal data class StackHeaderToolbarMenuElementCommit(
    val id: String,
    val options: StackHeaderToolbarMenuElementOptions,
)

/**
 * Resolves the icon for a single menu element update.
 *
 * [onResolved] must be invoked exactly once — synchronously or asynchronously, always on
 * the main thread — with the icon update to merge into the element's options, or `null`
 * to keep the current icon.
 */
internal fun interface StackHeaderToolbarMenuIconResolver {
    fun resolve(
        id: String,
        iconSource: StackHeaderToolbarMenuItemIconSource,
        onResolved: (icon: StackHeaderToolbarUpdate<Drawable>?) -> Unit,
    )
}

/**
 * Receives a fully-resolved batch, to be applied to the toolbar atomically.
 */
internal fun interface StackHeaderToolbarMenuCommitSink {
    fun onBatchCommitted(commits: List<StackHeaderToolbarMenuElementCommit>)
}

/**
 * Serial, FIFO queue for `updateToolbarMenuElements` view command batches.
 *
 * Each batch is processed to completion before the next one starts. Processing a batch
 * resolves every element's icon (drawable resources resolve synchronously, images
 * asynchronously) and, only once *all* of them have resolved, hands the fully-resolved
 * batch to [sink] in a single call. This guarantees:
 *
 * - a batch is applied atomically, after its slowest image has loaded, so a mix of
 *   image-loading and plain updates yields a single coalesced application;
 * - batches never overtake one another, so a later command cannot be overridden by an
 *   earlier one whose image happened to resolve late.
 *
 * This class is React-agnostic: icon resolution and application are injected. All
 * interaction happens on the main thread, so no synchronization is required.
 */
internal class StackHeaderToolbarMenuUpdateQueue(
    private val iconResolver: StackHeaderToolbarMenuIconResolver,
    private val sink: StackHeaderToolbarMenuCommitSink,
) {
    private val pendingBatches = ArrayDeque<List<StackHeaderToolbarMenuElementUpdate>>()
    private var isProcessing = false

    internal fun enqueue(batch: List<StackHeaderToolbarMenuElementUpdate>) {
        if (batch.isEmpty()) {
            return
        }
        pendingBatches.addLast(batch)
        if (!isProcessing) {
            processNext()
        }
    }

    /**
     * Drops all pending batches and stops processing. In-flight icon resolutions that
     * complete afterwards become no-ops. Used on teardown.
     */
    internal fun clear() {
        pendingBatches.clear()
        isProcessing = false
    }

    private fun processNext() {
        val batch = pendingBatches.firstOrNull()
        if (batch == null) {
            isProcessing = false
            return
        }
        isProcessing = true

        val commits = arrayOfNulls<StackHeaderToolbarMenuElementCommit>(batch.size)
        var outstanding = batch.size

        fun onElementResolved(
            index: Int,
            options: StackHeaderToolbarMenuElementOptions,
        ) {
            // Drop stale or duplicate resolutions: `!isProcessing` means the queue was
            // cleared (teardown); a non-null slot means this element already resolved.
            if (!isProcessing || commits[index] != null) {
                return
            }
            commits[index] = StackHeaderToolbarMenuElementCommit(batch[index].id, options)
            outstanding -= 1
            if (outstanding == 0) {
                pendingBatches.removeFirst()
                sink.onBatchCommitted(commits.map { requireNotNull(it) })
                processNext()
            }
        }

        batch.forEachIndexed { index, update ->
            val iconSource = update.iconSource
            if (iconSource == null) {
                onElementResolved(index, update.options)
            } else {
                iconResolver.resolve(update.id, iconSource) { icon ->
                    val options =
                        if (icon != null) update.options.copy(icon = icon) else update.options
                    onElementResolved(index, options)
                }
            }
        }
    }
}
