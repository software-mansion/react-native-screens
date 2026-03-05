package com.swmansion.rnscreens.utils

import android.util.Log
import com.swmansion.rnscreens.BuildConfig

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
    ) = logIfEnabled(tag, msg, Log::e)

    fun e(
        tag: String,
        msg: String,
        tr: Throwable,
    ) = logIfEnabled(tag, msg, tr, Log::e)

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
    ) = logIfEnabled(tag, msg, Log::w)

    fun w(
        tag: String,
        msg: String,
        tr: Throwable,
    ) = logIfEnabled(tag, msg, tr, Log::w)

    fun wtf(
        tag: String,
        msg: String,
    ) = logIfEnabled(tag, msg, Log::wtf)

    fun wtf(
        tag: String,
        msg: String,
        tr: Throwable,
    ) = logIfEnabled(tag, msg, tr, Log::wtf)
}
