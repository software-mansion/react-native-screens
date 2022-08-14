package com.swmansion.rnscreens

public inline fun <T> Iterable<T>.forEachSatisfying(predicate: (T) -> Boolean, action: (T) -> Unit) {
    for (element in this) if (predicate(element)) action(element)
}
