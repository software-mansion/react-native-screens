package com.swmansion.rnscreens.gamma.stack.header.toolbar

internal sealed interface StackHeaderToolbarUpdate<out T> {
    object Reset : StackHeaderToolbarUpdate<Nothing>

    data class Set<T>(
        val value: T,
    ) : StackHeaderToolbarUpdate<T>

    companion object {
        fun <T : Any> from(value: T?): StackHeaderToolbarUpdate<T> =
            if (value != null) {
                Set(value)
            } else {
                Reset
            }
    }
}

internal fun <T> StackHeaderToolbarUpdate<T>.valueOrNull(): T? =
    when (this) {
        StackHeaderToolbarUpdate.Reset -> null
        is StackHeaderToolbarUpdate.Set -> value
    }
