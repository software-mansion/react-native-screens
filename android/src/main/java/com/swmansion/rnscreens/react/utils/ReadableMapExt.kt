package com.swmansion.rnscreens.react.utils

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.ColorPropConverter
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType

private const val TAG = "ReadableMapExt"

// `isNull` alone throws for a missing key.
internal fun ReadableMap.isAbsent(key: String): Boolean = !hasKey(key) || isNull(key)

// region Nullable variants

internal fun ReadableMap.readOptionalString(key: String): String? {
    if (isAbsent(key)) return null
    return if (getType(key) == ReadableType.String) getString(key) else null
}

internal fun ReadableMap.readOptionalBoolean(key: String): Boolean? {
    if (isAbsent(key)) return null
    return if (getType(key) == ReadableType.Boolean) getBoolean(key) else null
}

internal fun ReadableMap.readOptionalFloat(key: String): Float? {
    if (isAbsent(key)) return null
    return if (getType(key) == ReadableType.Number) getDouble(key).toFloat() else null
}

internal fun ReadableMap.readOptionalColor(
    context: Context,
    key: String,
): Int? {
    if (isAbsent(key)) return null
    return parseColor(context, key)
}

// endregion

// region Default-value variants

internal fun ReadableMap.readString(
    key: String,
    default: String,
): String = readOptionalString(key) ?: default

internal fun ReadableMap.readBoolean(
    key: String,
    default: Boolean,
): Boolean = readOptionalBoolean(key) ?: default

internal fun ReadableMap.readColor(
    context: Context,
    key: String,
    default: Int?,
): Int? = if (isAbsent(key)) default else parseColor(context, key)

internal fun ReadableMap.readImageUri(
    key: String,
    default: String?,
): String? {
    if (!hasKey(key) || getType(key) != ReadableType.Map) {
        return default
    }

    val imageMap = getMap(key)
    return imageMap?.getString("uri") ?: default
}

// endregion

// region Validation

internal fun ReadableMap.requireNotNullString(key: String): String =
    requireNotNull(readOptionalString(key)) {
        "[RNScreens] $key property must be a non-null string."
    }

// endregion

// region Parsing color

internal fun ReadableMap.parseColor(
    context: Context,
    key: String,
): Int? =
    try {
        when (getType(key)) {
            ReadableType.Map -> ColorPropConverter.getColor(getMap(key), context)
            ReadableType.Number -> getInt(key)
            else -> null
        }
    } catch (e: Exception) {
        Log.w(TAG, "[RNScreens] Could not parse color for key '$key': ${e.message}")
        null
    }

// endregion
