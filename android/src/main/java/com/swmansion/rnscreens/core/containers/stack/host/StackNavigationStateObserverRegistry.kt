package com.swmansion.rnscreens.core.containers.stack.host

/**
 * Holds the set of [StackNavigationStateObserver]s registered against a [StackContainer]
 * and fans out container events to all of them.
 *
 * Observers are held with strong references; callers must explicitly call
 * [StackContainer.removeNavigationStateObserver] before the observer goes away.
 *
 * # Reentrance
 *
 * Recursive emission is forbidden. While an `emit*` call is in flight:
 * - additional `emit*` calls fail-fast with [IllegalStateException] (recursion is a
 *   programmer error — it would deliver out-of-order events to later observers),
 * - [add] / [remove] are rejected gracefully and return `false`.
 *
 * The registry is single-threaded — use it from a single thread (the UI thread on Android).
 * It does not synchronize.
 */
internal class StackNavigationStateObserverRegistry {
    private val observers: MutableList<StackNavigationStateObserver> = mutableListOf()
    private var isEmitting: Boolean = false

    /**
     * Register an observer. Returns `false` if the observer is already registered or
     * if called during an in-flight `emit*` (modifications during emission are rejected).
     */
    fun add(observer: StackNavigationStateObserver): Boolean {
        if (isEmitting) return false
        if (observers.contains(observer)) return false
        observers.add(observer)
        return true
    }

    /**
     * Unregister an observer. Returns `false` if the observer was not registered or
     * if called during an in-flight `emit*` (modifications during emission are rejected).
     */
    fun remove(observer: StackNavigationStateObserver): Boolean {
        if (isEmitting) return false
        return observers.remove(observer)
    }

    fun emitOnNavigationStateUpdate(
        navState: StackNavigationState,
        actionOrigin: StackActionOrigin,
    ) {
        emitSignal { observer -> observer.onNavigationStateUpdate(navState, actionOrigin) }
    }

    fun emitOnNavigationStateUpdateRejected(
        currentNavState: StackNavigationState,
        rejectedRequest: StackNavigationStateRequest,
        reason: StackNavigationStateRejectionReason,
    ) {
        emitSignal { observer -> observer.onNavigationStateUpdateRejected(currentNavState, rejectedRequest, reason) }
    }

    fun emitOnScreensReleased(screenKeys: List<String>) {
        emitSignal { observer -> observer.onScreensReleased(screenKeys) }
    }

    fun emitOnNativeDismissPrevented(
        currentNavState: StackNavigationState,
        preventedScreenKeys: List<String>,
    ) {
        emitSignal { observer -> observer.onNativeDismissPrevented(currentNavState, preventedScreenKeys) }
    }

    private fun emitSignal(emitBlock: (StackNavigationStateObserver) -> Unit) {
        check(!isEmitting) { "[RNScreens] Recursive emission on StackNavigationStateObserverRegistry" }
        isEmitting = true
        try {
            observers.forEach {
                emitBlock(it)
            }
        } finally {
            isEmitting = false
        }
    }
}
