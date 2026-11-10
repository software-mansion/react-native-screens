package com.swmansion.rnscreens.utils

import androidx.annotation.UiThread

/**
 * A listener that runs inside a synchronous fragment transaction can detach a container, whose FragmentManager
 * then throws "FragmentManager is already executing transactions". The scope is global to the UI thread,
 * because a parent transaction can attach a nested container that executes its own transaction inside it.
 */
@UiThread
internal object FragmentTransactionScope {
    private var transactionDepth = 0
    private var isRunningDeferredActions = false
    private val deferredActions = ArrayDeque<() -> Unit>()

    fun <T> execute(transaction: () -> T): T {
        transactionDepth++
        var hasCompleted = false
        try {
            return transaction().also { hasCompleted = true }
        } finally {
            transactionDepth--
            if (transactionDepth == 0 && !isRunningDeferredActions) {
                if (hasCompleted) {
                    runDeferredActions()
                } else {
                    // Keep the exception of the transaction and do not send its events with a later one.
                    deferredActions.clear()
                }
            }
        }
    }

    fun runOutsideTransactions(action: () -> Unit) {
        if (transactionDepth == 0 && !isRunningDeferredActions) {
            action()
        } else {
            deferredActions.addLast(action)
        }
    }

    private fun runDeferredActions() {
        isRunningDeferredActions = true
        try {
            while (deferredActions.isNotEmpty()) {
                deferredActions.removeFirst().invoke()
            }
        } finally {
            // When an action throws, the remaining ones must not run with a later, unrelated transaction.
            deferredActions.clear()
            isRunningDeferredActions = false
        }
    }
}
