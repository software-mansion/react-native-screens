package com.swmansion.rnscreens.stack.header.config

internal fun interface StackHeaderConfigurationObserver {
    /**
     * Reports that the parts of the configuration described by [flags] changed.
     */
    fun onInvalidated(flags: StackHeaderInvalidationFlags)
}
