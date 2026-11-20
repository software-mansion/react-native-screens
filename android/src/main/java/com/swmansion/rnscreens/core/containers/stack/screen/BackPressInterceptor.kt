package com.swmansion.rnscreens.core.containers.stack.screen

/** Optional host-owned Back interception, independent of any application runtime. */
internal interface BackPressInterceptor {
    val isEnabled: Boolean

    fun dispatch()

    fun addListener(listener: Runnable)

    fun removeListener(listener: Runnable)
}
