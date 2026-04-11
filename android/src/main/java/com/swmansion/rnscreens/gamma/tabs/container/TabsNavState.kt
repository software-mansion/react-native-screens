package com.swmansion.rnscreens.gamma.tabs.container

import com.swmansion.rnscreens.gamma.tabs.container.TabsNavStateUpdateRejectionReason.REPEATED
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavStateUpdateRejectionReason.STALE

/**
 * Describes navigation state of a tabs container.
 *
 * @property selectedKey Screen key of the currently selected tab.
 * @property provenance Monotonically increasing number describing the history (generation) of the state.
 *   State with provenance `N + 1` is derived from state with provenance `N`.
 *   This allows detecting stale updates.
 */
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
 * - [STALE] — the update's provenance indicates that it is based on a stale state.
 * - [REPEATED] — the requested tab is already selected.
 */
enum class TabsNavStateUpdateRejectionReason {
    STALE,
    REPEATED,
    ;

    override fun toString(): String =
        when (this) {
            STALE -> "stale"
            REPEATED -> "repeated"
        }
}
