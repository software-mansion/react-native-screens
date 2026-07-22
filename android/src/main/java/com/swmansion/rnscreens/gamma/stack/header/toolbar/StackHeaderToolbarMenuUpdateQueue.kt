package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

/**
 * A single toolbar menu element update carried by an `updateToolbarMenuElements`
 * view command, before its icon (if any) has been resolved.
 */
internal data class StackHeaderToolbarMenuElementRawUpdate(
    val id: String,
    val options: StackHeaderToolbarMenuElementOptions,
    val iconSource: StackHeaderToolbarMenuItemIconSource?,
)

/**
 * A single toolbar menu element update whose icon has already been resolved and merged
 * into [options], ready to be applied to the toolbar.
 */
internal data class StackHeaderToolbarMenuElementUpdate(
    val id: String,
    val options: StackHeaderToolbarMenuElementOptions,
)

/**
 * Resolves the icon for a single menu element update.
 *
 * [onResolved] must be invoked exactly once — synchronously or asynchronously, always on the
 * main thread — with the resolved icon to merge into the element's options.
 */
internal fun interface StackHeaderToolbarMenuIconResolver {
    fun resolve(
        iconSource: StackHeaderToolbarMenuItemIconSource,
        onResolved: (icon: StackHeaderToolbarFieldUpdate<Drawable>) -> Unit,
    )
}

/**
 * Receives a fully-resolved batch of menu element updates, to be applied to the toolbar
 * atomically.
 */
internal fun interface StackHeaderToolbarMenuUpdateQueueDelegate {
    fun onUpdatesResolved(updates: List<StackHeaderToolbarMenuElementUpdate>)
}

/**
 * Serial, FIFO queue for `updateToolbarMenuElements` view command batches.
 *
 * Each batch is processed to completion before the next one starts. Processing a batch
 * resolves every element's icon (drawable resources resolve synchronously, images
 * asynchronously) and, only once *all* of them have resolved, hands the fully-resolved
 * batch to [delegate] in a single call. This guarantees:
 *
 * - a batch is applied atomically, after its slowest image has loaded, so a mix of
 *   image-loading and plain updates yields a single coalesced application;
 * - batches never overtake one another, so a later command cannot be overridden by an
 *   earlier one whose image happened to resolve late.
 *
 * All interaction happens on the main thread, so no synchronization is required.
 * The queue is single-use — teardown is terminal, and it is never enqueued to again afterward.
 */
internal class StackHeaderToolbarMenuUpdateQueue(
    private val iconResolver: StackHeaderToolbarMenuIconResolver,
    private val delegate: StackHeaderToolbarMenuUpdateQueueDelegate,
) {
    private val pendingBatches = ArrayDeque<List<StackHeaderToolbarMenuElementRawUpdate>>()
    private var isProcessing = false
    private var isTornDown = false

    internal fun enqueue(batch: List<StackHeaderToolbarMenuElementRawUpdate>) {
        if (batch.isEmpty()) {
            return
        }
        pendingBatches.addLast(batch)
        if (!isProcessing) {
            processNext()
        }
    }

    internal fun tearDown() {
        pendingBatches.clear()
        isTornDown = true
        isProcessing = false
    }

    private fun processNext() {
        while (true) {
            val batch = pendingBatches.firstOrNull()
            if (batch == null) {
                isProcessing = false
                return
            }
            isProcessing = true

            val updates = arrayOfNulls<StackHeaderToolbarMenuElementUpdate>(batch.size)
            var outstanding = batch.size

            var isProcessingBatch = true

            fun dispatchResolvedBatch() {
                pendingBatches.removeFirst()
                delegate.onUpdatesResolved(updates.map { requireNotNull(it) })
            }

            fun onElementResolved(
                index: Int,
                options: StackHeaderToolbarMenuElementOptions,
            ) {
                check(updates[index] == null) {
                    "[RNScreens] Unexpected duplicated element resolution."
                }

                if (isTornDown) {
                    return
                }

                updates[index] = StackHeaderToolbarMenuElementUpdate(batch[index].id, options)
                outstanding -= 1

                // A synchronous completion is applied by the loop below; only an asynchronous one
                // advances the queue processing from here.
                if (outstanding == 0 && !isProcessingBatch) {
                    dispatchResolvedBatch()
                    processNext()
                }
            }

            batch.forEachIndexed { index, update ->
                val iconSource = update.iconSource
                if (iconSource == null) {
                    onElementResolved(index, update.options)
                } else {
                    iconResolver.resolve(iconSource) { icon ->
                        onElementResolved(index, update.options.copy(icon = icon))
                    }
                }
            }
            isProcessingBatch = false

            if (outstanding > 0) {
                // An icon is still loading asynchronously; its callback will apply the batch
                // and resume.
                return
            }

            // Every icon resolved synchronously; apply the batch now and continue with the next one.
            dispatchResolvedBatch()
        }
    }
}
