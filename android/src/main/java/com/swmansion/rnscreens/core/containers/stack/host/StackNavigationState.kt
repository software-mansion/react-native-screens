package com.swmansion.rnscreens.core.containers.stack.host

import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRejectionReason.INVALID
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRejectionReason.REPEATED
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRejectionReason.STALE

/**
 * Navigation state of a stack container.
 *
 * @property stack Screen keys of the screens in the stack, from the bottom (the root) to the top.
 * @property provenance Monotonically increasing number describing the history (generation) of the state.
 *   The state with provenance `N + 1` is derived from the state with provenance `N`. This allows detecting
 *   stale requests. The value is opaque to JS.
 */
data class StackNavigationState(
    val stack: List<String>,
    val provenance: Int,
) {
    internal fun isEmpty(): Boolean = this === EMPTY

    internal fun isNotEmpty(): Boolean = !this.isEmpty()

    companion object {
        /**
         * The state of a container that has not been given its first state yet. Never reported to observers.
         */
        val EMPTY = StackNavigationState(emptyList(), Int.MIN_VALUE)
    }
}

/**
 * A request to change the navigation state of a stack container.
 *
 * Mirrors the public `StackNavStateRequest` TS type plus an [actionOrigin] carried internally.
 *
 * @property requestId Identifies the request. Only a request with a new id is handled; it plays no role in the
 *   state model.
 * @property stack Requested screen keys, from the bottom (the root) to the top.
 * @property baseProvenance Provenance of the state the request was derived from. Used for staleness detection.
 * @property actionOrigin Origin (actor) that issued the request.
 */
data class StackNavigationStateRequest(
    val requestId: Int,
    val stack: List<String>,
    val baseProvenance: Int,
    val actionOrigin: StackActionOrigin,
)

/**
 * Reason why a stack container rejected a navigation state request.
 *
 * - [STALE] — the request is based on a state that was invalidated by a transition of another origin.
 * - [REPEATED] — the requested stack is equivalent to the current one.
 * - [INVALID] — the requested stack is not a valid target, or its base provenance is unknown to the container.
 */
enum class StackNavigationStateRejectionReason {
    STALE,
    REPEATED,
    INVALID,
    ;

    override fun toString(): String =
        when (this) {
            STALE -> "stale"
            REPEATED -> "repeated"
            INVALID -> "invalid"
        }
}
