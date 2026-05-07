package com.swmansion.rnscreens.gamma.tabs.container

import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateRejectionReason.REPEATED
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateRejectionReason.STALE

/**
 * Describes navigation state of a tabs container.
 *
 * @property selectedScreenKey Screen key of the currently selected tab.
 * @property provenance Monotonically increasing number describing the history (generation) of the state.
 *   State with provenance `N + 1` is derived from state with provenance `N`.
 *   This allows detecting stale updates.
 */
data class TabsNavigationState(
    val selectedScreenKey: String,
    val provenance: Int,
) {
    internal fun isEmpty(): Boolean = this === EMPTY

    internal fun isNotEmpty(): Boolean = !this.isEmpty()

    companion object {
        val EMPTY = TabsNavigationState("", Int.MIN_VALUE)
    }
}

/**
 * A request to change navigation state.
 *
 * Carries the target [selectedScreenKey], the [baseProvenance] of the state the request was derived from,
 * and the [actionOrigin] (actor) that initiated it. Mirrors the public `TabsHostNavStateRequest` TS type
 * plus an [actionOrigin] carried internally.
 *
 * @property selectedScreenKey Screen key of the requested tab.
 * @property baseProvenance Provenance of the state this request was derived from. Used for staleness detection.
 * @property actionOrigin Origin (actor) that initiated this request.
 */
data class TabsNavigationStateUpdateRequest(
    val selectedScreenKey: String,
    val baseProvenance: Int,
    val actionOrigin: TabsActionOrigin,
)

/**
 * Reason why a navigation state update was rejected by the container.
 *
 * - [STALE] — the update's provenance indicates that it is based on a stale state.
 * - [REPEATED] — the requested tab is already selected.
 */
enum class TabsNavigationStateRejectionReason {
    STALE,
    REPEATED,
    ;

    override fun toString(): String =
        when (this) {
            STALE -> "stale"
            REPEATED -> "repeated"
        }
}
