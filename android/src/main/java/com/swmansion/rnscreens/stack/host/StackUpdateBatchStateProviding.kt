package com.swmansion.rnscreens.stack.host

/**
 * Tells whether the owner has begun an update batch that has not ended yet.
 * Consumers hold their pending updates while it is `true`; the owner applies
 * them all in one pass when the batch ends.
 */
internal interface StackUpdateBatchStateProviding {
    val isUpdatePending: Boolean
}
