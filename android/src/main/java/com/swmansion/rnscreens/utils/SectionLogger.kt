package com.swmansion.rnscreens.utils

import android.util.Log

typealias LogMethod = (String, String) -> Int

class SectionLogger(
    val logMethod: LogMethod = Log::i,
    val prefix: String = "SectionLogger",
) {
    val baseIndentString = " "
    var indentLevel = 0

    fun increaseIndentLevel() {
        indentLevel += 1
    }

    fun decreaseIndentLevel() {
        indentLevel -= 1
    }

    fun log(
        message: String,
        localLogMethod: LogMethod? = null,
    ) {
        val method = if (localLogMethod != null) localLogMethod else logMethod
        method(prefix, message.prependIndent(baseIndentString.repeat(indentLevel)))
    }

    fun logBeginSection(
        message: String,
        increaseIndent: Boolean = true,
    ) {
        if (increaseIndent) {
            increaseIndentLevel()
        }
        log(message.prependIndent("BEGIN "))
        increaseIndentLevel()
    }

    fun logEndSection(
        message: String,
        decreaseIndent: Boolean = true,
    ) {
        decreaseIndentLevel()
        log(message.prependIndent("END "))
        if (decreaseIndent) {
            decreaseIndentLevel()
        }
    }
}
