package com.swmansion.rnscreens.core.containers.tabs.screen

internal fun interface TabsItemConfigurationObserver {
    /**
     * Reports that the parts of the tab's configuration described by [flags] changed.
     */
    fun onInvalidated(flags: TabsItemInvalidationFlags)
}
