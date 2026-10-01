package com.swmansion.rnscreens.utils

import android.util.Log
import com.swmansion.rnscreens.BuildConfig

/**
 * `d`, `i` and `v` are emitted only when `RNS_DEBUG_LOGGING` is enabled;
 * `w`, `e` and `wtf` are always emitted.
 */
object RNSLog {
    private inline fun logIfEnabled(
        tag: String,
        msg: String,
        logger: (String, String) -> Int,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            logger(tag, msg)
        }
    }

    private inline fun logIfEnabled(
        tag: String,
        msg: String,
        tr: Throwable,
        logger: (String, String, Throwable) -> Int,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            logger(tag, msg, tr)
        }
    }

    fun d(
        tag: String,
        msg: String,
    ) = logIfEnabled(tag, msg, Log::d)

    fun d(
        tag: String,
        msg: String,
        tr: Throwable,
    ) = logIfEnabled(tag, msg, tr, Log::d)

    fun e(
        tag: String,
        msg: String,
    ) {
        Log.e(tag, msg)
    }

    fun e(
        tag: String,
        msg: String,
        tr: Throwable,
    ) {
        Log.e(tag, msg, tr)
    }

    fun i(
        tag: String,
        msg: String,
    ) = logIfEnabled(tag, msg, Log::i)

    fun i(
        tag: String,
        msg: String,
        tr: Throwable,
    ) = logIfEnabled(tag, msg, tr, Log::i)

    fun v(
        tag: String,
        msg: String,
    ) = logIfEnabled(tag, msg, Log::v)

    fun v(
        tag: String,
        msg: String,
        tr: Throwable,
    ) = logIfEnabled(tag, msg, tr, Log::v)

    fun w(
        tag: String,
        msg: String,
    ) {
        Log.w(tag, msg)
    }

    fun w(
        tag: String,
        msg: String,
        tr: Throwable,
    ) {
        Log.w(tag, msg, tr)
    }

    fun wtf(
        tag: String,
        msg: String,
    ) {
        Log.wtf(tag, msg)
    }

    fun wtf(
        tag: String,
        msg: String,
        tr: Throwable,
    ) {
        Log.wtf(tag, msg, tr)
    }
}
