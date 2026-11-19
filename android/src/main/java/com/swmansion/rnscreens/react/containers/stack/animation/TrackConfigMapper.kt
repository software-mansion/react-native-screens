package com.swmansion.rnscreens.react.containers.stack.animation

import android.content.Context
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.swmansion.rnscreens.core.containers.stack.animation.model.MotionConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.TrackConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.TrackTimingConfig
import com.swmansion.rnscreens.react.utils.isAbsent
import com.swmansion.rnscreens.react.utils.readOptionalColor
import kotlin.math.roundToLong

private const val KEY_TRANSLATE_X = "translateX"
private const val KEY_TRANSLATE_Y = "translateY"
private const val KEY_OPACITY = "opacity"
private const val KEY_SCALE = "scale"
private const val KEY_SCALE_X = "scaleX"
private const val KEY_SCALE_Y = "scaleY"
private const val KEY_ROTATE = "rotate"
private const val KEY_DIM = "dim"
private const val KEY_FROM = "from"
private const val KEY_TO = "to"
private const val KEY_DURATION = "duration"
private const val KEY_DELAY = "delay"
private const val KEY_EASING = "easing"
private const val KEY_COLOR = "color"

/**
 * Converts a `{ type: 'custom', …tracks }` motion. Each track is an object under its property's
 * key; an omitted key leaves the property at rest.
 */
internal fun parseCustomMotion(
    map: ReadableMap,
    context: Context,
): MotionConfig.Custom {
    map.requireOnlyKeys(KEY_TYPE, KEY_TRANSLATE_X, KEY_TRANSLATE_Y, KEY_OPACITY, KEY_SCALE, KEY_SCALE_X, KEY_SCALE_Y, KEY_ROTATE, KEY_DIM)
    return MotionConfig.Custom(
        translateX = map.trackMap(KEY_TRANSLATE_X)?.let(::parseTranslateTrack),
        translateY = map.trackMap(KEY_TRANSLATE_Y)?.let(::parseTranslateTrack),
        opacity = map.trackMap(KEY_OPACITY)?.let { parseScalarTrack(it, TrackConfig::Fraction) },
        scale = map.trackMap(KEY_SCALE)?.let { parseScalarTrack(it, TrackConfig::Scalar) },
        scaleX = map.trackMap(KEY_SCALE_X)?.let { parseScalarTrack(it, TrackConfig::Scalar) },
        scaleY = map.trackMap(KEY_SCALE_Y)?.let { parseScalarTrack(it, TrackConfig::Scalar) },
        rotate = map.trackMap(KEY_ROTATE)?.let { parseScalarTrack(it, TrackConfig::Scalar) },
        dim = map.trackMap(KEY_DIM)?.let { parseDimTrack(it, context) },
    )
}

private fun ReadableMap.trackMap(key: String): ReadableMap? {
    if (isAbsent(key)) return null
    require(getType(key) == ReadableType.Map) { "[RNScreens] $key must be a track object." }
    return checkNotNull(getMap(key))
}

private fun <T : TrackConfig> parseScalarTrack(
    map: ReadableMap,
    build: (from: Float?, to: Float?, timing: TrackTimingConfig) -> T,
): T {
    map.requireOnlyKeys(KEY_FROM, KEY_TO, KEY_DURATION, KEY_DELAY, KEY_EASING)
    return build(map.optional(KEY_FROM, ::parseScalar), map.optional(KEY_TO, ::parseScalar), parseTiming(map))
}

private fun parseTranslateTrack(map: ReadableMap): TrackConfig.Translate {
    map.requireOnlyKeys(KEY_FROM, KEY_TO, KEY_DURATION, KEY_DELAY, KEY_EASING)
    return TrackConfig.Translate(
        from = map.optional(KEY_FROM, ::parseLength),
        to = map.optional(KEY_TO, ::parseLength),
        timing = parseTiming(map),
    )
}

private fun parseDimTrack(
    map: ReadableMap,
    context: Context,
): TrackConfig.Dim {
    map.requireOnlyKeys(KEY_FROM, KEY_TO, KEY_DURATION, KEY_DELAY, KEY_EASING, KEY_COLOR)
    return TrackConfig.Dim(
        color = map.readOptionalColor(context, KEY_COLOR),
        from = map.optional(KEY_FROM, ::parseScalar),
        to = map.optional(KEY_TO, ::parseScalar),
        timing = parseTiming(map),
    )
}

private fun parseTiming(map: ReadableMap): TrackTimingConfig {
    require(!map.isAbsent(KEY_DURATION)) { "[RNScreens] A track needs a duration." }
    return TrackTimingConfig(
        durationMs = parseDuration(map.getDynamic(KEY_DURATION)),
        delayMs = map.optional(KEY_DELAY, ::parseDelay) ?: 0L,
        easing = map.optional(KEY_EASING, ::parseEasing),
    )
}

private fun <T> ReadableMap.optional(
    key: String,
    parse: (Dynamic) -> T,
): T? = if (isAbsent(key)) null else parse(getDynamic(key))

private fun parseScalar(value: Dynamic): Float {
    require(value.type == ReadableType.Number) { "[RNScreens] A track endpoint must be a number." }
    return value.asDouble().toFloat()
}

private fun parseDelay(value: Dynamic): Long {
    val ms = if (value.type == ReadableType.Number) value.asDouble() else Double.NaN
    require(ms.isFinite()) { "[RNScreens] delay must be a finite number of milliseconds." }
    return ms.roundToLong()
}
