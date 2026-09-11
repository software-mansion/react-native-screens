package com.swmansion.rnscreens.stack.header.config

internal interface StackHeaderConfigurationObserver {
    /**
     * Accumulates [flags] on the observer's side. The observer applies them
     * immediately unless the provider reports [StackHeaderConfigurationProviding.isUpdatePending]
     * (more updates are coming in the current batch) or it cannot apply yet.
     */
    fun onInvalidated(flags: StackHeaderInvalidationFlags)

    /** Signals the end of an update batch: apply pending invalidations now. */
    fun onFlushRequested()
}
