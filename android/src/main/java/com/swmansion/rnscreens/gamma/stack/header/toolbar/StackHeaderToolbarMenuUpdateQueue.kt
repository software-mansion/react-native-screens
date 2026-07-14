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
 * [onResolved] must be invoked exactly once — synchronously or asynchronously, always on
 * the main thread — with the icon update to merge into the element's options, or `null`
 * to keep the current icon.
 */
internal fun interface StackHeaderToolbarMenuIconResolver {
    fun resolve(
        id: String,
        iconSource: StackHeaderToolbarMenuItemIconSource,
        onResolved: (icon: StackHeaderToolbarFieldUpdate<Drawable>?) -> Unit,
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
 */
internal class StackHeaderToolbarMenuUpdateQueue(
    private val iconResolver: StackHeaderToolbarMenuIconResolver,
    private val delegate: StackHeaderToolbarMenuUpdateQueueDelegate,
) {
    private val pendingBatches = ArrayDeque<List<StackHeaderToolbarMenuElementRawUpdate>>()
    private var isProcessing = false

    internal fun enqueue(batch: List<StackHeaderToolbarMenuElementRawUpdate>) {
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
     * complete afterward become no-ops. Used on teardown.
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

        val updates = arrayOfNulls<StackHeaderToolbarMenuElementUpdate>(batch.size)
        var outstanding = batch.size

        fun onElementResolved(
            index: Int,
            options: StackHeaderToolbarMenuElementOptions,
        ) {
            // Drop stale or duplicate resolutions: `!isProcessing` means the queue was
            // cleared (teardown); a non-null slot means this element already resolved.
            if (!isProcessing || updates[index] != null) {
                return
            }
            updates[index] = StackHeaderToolbarMenuElementUpdate(batch[index].id, options)
            outstanding -= 1
            if (outstanding == 0) {
                pendingBatches.removeFirst()
                delegate.onUpdatesResolved(updates.map { requireNotNull(it) })
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
