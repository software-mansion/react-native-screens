package com.swmansion.rnscreens.core.containers.stack.header.config

fun interface StackHeaderConfigurationObserver {
    /**
     * Reports that the parts of the configuration described by [flags] changed.
     */
    fun onInvalidated(flags: StackHeaderInvalidationFlags)
}
