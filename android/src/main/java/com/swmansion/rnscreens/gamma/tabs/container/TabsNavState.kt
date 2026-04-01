package com.swmansion.rnscreens.gamma.tabs.container

// Must be public - TabsHost uses it in public methods.
data class TabsNavState(
    val selectedKey: String,
    val provenance: Int,
) {
    internal fun isEmpty(): Boolean = this === EMPTY

    internal fun isNotEmpty(): Boolean = !this.isEmpty()

    companion object {
        val EMPTY = TabsNavState("", Int.MIN_VALUE)
    }
}
