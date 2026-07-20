package com.swmansion.rnscreens.gamma.stack.header.toolbar

internal sealed interface StackHeaderToolbarFieldUpdate<out T> {
    object Reset : StackHeaderToolbarFieldUpdate<Nothing>

    data class Set<T>(
        val value: T,
    ) : StackHeaderToolbarFieldUpdate<T>

    companion object {
        fun <T : Any> from(value: T?): StackHeaderToolbarFieldUpdate<T> =
            if (value != null) {
                Set(value)
            } else {
                Reset
            }
    }
}

internal fun <T> StackHeaderToolbarFieldUpdate<T>.valueOrNull(): T? =
    when (this) {
        StackHeaderToolbarFieldUpdate.Reset -> null
        is StackHeaderToolbarFieldUpdate.Set -> value
    }
