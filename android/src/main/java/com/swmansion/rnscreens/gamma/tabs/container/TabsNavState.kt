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

enum class TabsNavStateUpdateRejectionReason {
    OTHER,
    STALE,
    REPEATED,
    MORE_TAB_NOT_AVAILABLE;

    override fun toString(): String {
        return when (this) {
            OTHER -> "other"
            STALE -> "stale"
            REPEATED -> "repeated"
            MORE_TAB_NOT_AVAILABLE -> "more-tab-not-available"
        }
    }
}
