package com.swmansion.rnscreens.gamma.tabs.container

/**
 * Describes navigation state of a tabs container.
 *
 * @property selectedKey Screen key of the currently selected tab.
 * @property provenance Monotonically increasing number describing the history (generation) of the state.
 *   State with provenance `N + 1` is derived from state with provenance `N`.
 *   This allows detecting stale updates.
 */
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

/**
 * Reason why a navigation state update was rejected by the container.
 *
 * - [OTHER] — unspecified reason.
 * - [STALE] — the update's provenance indicates that is is based on a stale state.
 * - [REPEATED] — the requested tab is already selected.
 * - [MORE_TAB_NOT_AVAILABLE] — the iOS "More" navigation controller was requested but is not available.
 *  This should not happen on Android.
 */
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
