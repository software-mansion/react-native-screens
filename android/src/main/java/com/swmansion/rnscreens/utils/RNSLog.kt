package com.swmansion.rnscreens.utils

import android.util.Log
import com.swmansion.rnscreens.BuildConfig

object RNSLog {
    fun d(
        tag: String,
        message: String,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            Log.d(tag, message)
        }
    }

    fun d(
        tag: String,
        message: String,
        vararg args: Any,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            Log.d(tag, message.format(*args))
        }
    }

    fun w(
        tag: String,
        message: String,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            Log.w(tag, message)
        }
    }

    fun w(
        tag: String,
        message: String,
        vararg args: Any,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            Log.w(tag, message.format(*args))
        }
    }

    fun e(
        tag: String,
        message: String,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            Log.e(tag, message)
        }
    }

    fun e(
        tag: String,
        message: String,
        vararg args: Any,
    ) {
        if (BuildConfig.RNS_DEBUG_LOGGING) {
            Log.e(tag, message.format(*args))
        }
    }
}
