package com.swmansion.rnscreens.gamma.tabs.container

/**
 * Holds the set of [TabsNavigationStateObserver]s registered against a [TabsContainer]
 * and fans out container events to all of them.
 *
 * Observers are held with strong references; callers must explicitly call
 * [TabsContainer.removeNavigationStateObserver] before observer dealloc, or rely on the
 * host invoking [TabsContainer.tearDown] (which calls [clear]) on container teardown.
 *
 * # Reentrance
 *
 * Recursive emission is forbidden. While an `emit*` call is in flight:
 * - additional `emit*` calls fail-fast with [IllegalStateException] (recursion is a
 *   programmer error — it would deliver out-of-order events to later observers),
 * - [add] / [remove] are rejected gracefully and return `false`.
 *
 * The registry is single-threaded — use it from a single thread (typically the UI
 * thread on Android). It does not synchronize.
 */
internal class TabsNavigationStateObserverRegistry {
    private val observers: MutableList<TabsNavigationStateObserver> = mutableListOf()
    private var isEmitting: Boolean = false

    /**
     * Register an observer. Returns `false` if the observer is already registered or
     * if called during an in-flight `emit*` (modifications during emission are rejected).
     */
    fun add(observer: TabsNavigationStateObserver): Boolean {
        if (isEmitting) return false
        if (observers.contains(observer)) return false
        observers.add(observer)
        return true
    }

    /**
     * Unregister an observer. Returns `false` if the observer was not registered or
     * if called during an in-flight `emit*` (modifications during emission are rejected).
     */
    fun remove(observer: TabsNavigationStateObserver): Boolean {
        if (isEmitting) return false
        return observers.remove(observer)
    }

    /**
     * Drop all registered observers. Must not be called during an in-flight `emit*`.
     */
    fun clear() {
        check(!isEmitting) { "[RNScreens] TabsNavigationStateObserverRegistry.clear during emission" }
        observers.clear()
    }

    fun emitOnNavigationStateUpdate(
        navState: TabsNavigationState,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        actionOrigin: TabsActionOrigin,
    ) {
        emitSignal { observer -> observer.onNavigationStateUpdate(navState, isRepeated, hasTriggeredSpecialEffect, actionOrigin) }
    }

    fun emitOnNavigationStateUpdateRejected(
        currentNavState: TabsNavigationState,
        rejectedRequest: TabsNavigationStateUpdateRequest,
        reason: TabsNavigationStateRejectionReason,
    ) {
        emitSignal { observer -> observer.onNavigationStateUpdateRejected(currentNavState, rejectedRequest, reason) }
    }

    fun emitOnNavigationStateUpdatePrevented(
        currentNavState: TabsNavigationState,
        preventedScreenKey: String,
    ) {
        emitSignal { observer -> observer.onNavigationStateUpdatePrevented(currentNavState, preventedScreenKey) }
    }

    private fun emitSignal(emitBlock: (TabsNavigationStateObserver) -> Unit) {
        check(!isEmitting) { "[RNScreens] Recursive emission on TabsNavigationStateObserverRegistry" }
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
