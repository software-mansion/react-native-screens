package com.swmansion.rnscreens.react.containers.stack.animation

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.model.MotionConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetName
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetOption
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetOptions
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.TransitionConfig
import com.swmansion.rnscreens.react.utils.requireNotNullString
import kotlin.math.roundToLong

private const val KEY_TYPE = "type"
private const val KEY_NAME = "name"
private const val KEY_PUSH = "push"
private const val KEY_POP = "pop"
private const val KEY_ENTER = "enter"
private const val KEY_EXIT = "exit"
private const val TYPE_PRESET = "preset"
private const val TYPE_CUSTOM = "custom"
private const val PERCENT_SUFFIX = "%"

/**
 * Converts the `animation` prop into [StackAnimationConfig]. The shape is checked here and the
 * level validity of a preset by the config it is wrapped in; every rejected value is an
 * [IllegalArgumentException] the view manager turns into a warning and the default animation.
 */
internal fun parseStackAnimationConfig(value: Dynamic): StackAnimationConfig =
    when (val shape = shapeOf(value)) {
        is Shape.Preset -> StackAnimationConfig.Preset(shape.preset)
        is Shape.Custom ->
            StackAnimationConfig.Custom(
                push = parseTransition(shape.map, KEY_PUSH),
                pop = parseTransition(shape.map, KEY_POP),
            )
    }

private fun parseTransition(
    map: ReadableMap,
    key: String,
): TransitionConfig =
    if (map.isAbsent(key)) {
        TransitionConfig.Preset(PresetConfig(PresetName.NONE))
    } else {
        when (val shape = shapeOf(map.getDynamic(key))) {
            is Shape.Preset -> TransitionConfig.Preset(shape.preset)
            is Shape.Custom ->
                TransitionConfig.Custom(
                    enter = parseMotion(shape.map, KEY_ENTER),
                    exit = parseMotion(shape.map, KEY_EXIT),
                )
        }
    }

private fun parseMotion(
    map: ReadableMap,
    key: String,
): MotionConfig =
    if (map.isAbsent(key)) {
        MotionConfig.Preset(PresetConfig(PresetName.NONE))
    } else {
        when (val shape = shapeOf(map.getDynamic(key))) {
            is Shape.Preset -> MotionConfig.Preset(shape.preset)
            is Shape.Custom -> throw IllegalArgumentException("[RNScreens] Custom screen motions are not supported yet.")
        }
    }

/**
 * Every level is written the same way: a preset name, `{ type: 'preset', name, …options }` or
 * `{ type: 'custom', …the next level }`. What a custom object holds depends on the level, so
 * only its map is read here.
 */
private sealed interface Shape {
    data class Preset(
        val preset: PresetConfig,
    ) : Shape

    data class Custom(
        val map: ReadableMap,
    ) : Shape
}

private fun shapeOf(value: Dynamic): Shape =
    when (value.type) {
        ReadableType.String -> Shape.Preset(PresetConfig(PresetName.fromString(checkNotNull(value.asString()))))
        ReadableType.Map -> {
            val map = checkNotNull(value.asMap())
            when (val type = map.requireNotNullString(KEY_TYPE)) {
                TYPE_PRESET -> Shape.Preset(parsePresetConfig(map))
                TYPE_CUSTOM -> Shape.Custom(map)
                else -> throw IllegalArgumentException("[RNScreens] Unknown animation type: $type.")
            }
        }
        else -> throw IllegalArgumentException("[RNScreens] An animation must be a preset name or an object.")
    }

// `isNull` alone throws for a missing key.
private fun ReadableMap.isAbsent(key: String): Boolean = !hasKey(key) || isNull(key)

private fun parsePresetConfig(map: ReadableMap): PresetConfig {
    val name = PresetName.fromString(map.requireNotNullString(KEY_NAME))

    var durationMs: Long? = null
    var easing: Easing? = null
    var distance: Length? = null
    val keys = map.keySetIterator()
    while (keys.hasNextKey()) {
        val key = keys.nextKey()
        if (key == KEY_TYPE || key == KEY_NAME || map.isNull(key)) continue
        val option =
            requireNotNull(PresetOption.entries.firstOrNull { it.key == key }) {
                "[RNScreens] Unknown animation preset option: $key."
            }
        when (option) {
            PresetOption.DURATION -> durationMs = parseDuration(map.getDynamic(key))
            PresetOption.EASING -> easing = parseEasing(map.getDynamic(key))
            PresetOption.DISTANCE -> distance = parseDistance(map.getDynamic(key))
        }
    }
    return PresetConfig(name, PresetOptions(durationMs, easing, distance))
}

private fun parseDuration(value: Dynamic): Long {
    val ms = if (value.type == ReadableType.Number) value.asDouble() else Double.NaN
    require(ms.isFinite() && ms > 0.0) { "[RNScreens] duration must be a positive number of milliseconds." }
    return ms.roundToLong().coerceAtLeast(1L)
}

private fun parseEasing(value: Dynamic): Easing =
    when (value.type) {
        ReadableType.String -> Easing.Named(EasingName.fromString(checkNotNull(value.asString())))
        ReadableType.Array -> parseBezier(checkNotNull(value.asArray()))
        else -> throw IllegalArgumentException("[RNScreens] easing must be a curve name or a bezier array.")
    }

private fun parseBezier(array: ReadableArray): Easing.Bezier {
    require(array.size() == 4 && (0 until 4).all { array.getType(it) == ReadableType.Number }) {
        "[RNScreens] A bezier easing must be an array of four numbers."
    }
    return Easing.Bezier(
        array.getDouble(0).toFloat(),
        array.getDouble(1).toFloat(),
        array.getDouble(2).toFloat(),
        array.getDouble(3).toFloat(),
    )
}

private fun parseDistance(value: Dynamic): Length {
    val length =
        when (value.type) {
            ReadableType.Number -> value.asDouble().takeIf { it.isFinite() && it > 0.0 }?.let { Length.Dp(it.toFloat()) }
            ReadableType.String -> {
                val text = checkNotNull(value.asString())
                text
                    .takeIf { it.endsWith(PERCENT_SUFFIX) }
                    ?.removeSuffix(PERCENT_SUFFIX)
                    ?.toDoubleOrNull()
                    ?.takeIf { it.isFinite() && it > 0.0 }
                    ?.let { Length.Percent((it / 100.0).toFloat()) }
            }
            else -> null
        }
    return requireNotNull(length) {
        "[RNScreens] distance must be a positive number of dp or a positive percentage string like '30%'."
    }
}
