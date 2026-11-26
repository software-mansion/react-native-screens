package com.swmansion.rnscreens.core.containers.stack.host

/**
 * Origin (actor) of a stack transition. Mirrors the public `actionOrigin` event field.
 *
 * - [USER] — a native UI action: the header back button, system back or a committed predictive back gesture.
 * - [PROGRAMMATIC_JS] — a JS-side change: a request delivered via the `navStateRequest` prop, or unmounting a
 *   child that is in the stack.
 * - [PROGRAMMATIC_NATIVE] — a change requested by native code, e.g. by a downstream library integrating directly
 *   against [StackContainer].
 *
 * The `implicit` origin defined on the public TS API is not produced on Android.
 */
enum class StackActionOrigin {
    USER,
    PROGRAMMATIC_JS,
    PROGRAMMATIC_NATIVE,
    ;

    override fun toString(): String =
        when (this) {
            USER -> "user"
            PROGRAMMATIC_JS -> "programmaticJs"
            PROGRAMMATIC_NATIVE -> "programmaticNative"
        }
}
