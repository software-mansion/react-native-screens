package com.swmansion.rnscreens.core.containers.stack.animation

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetName
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetOption
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetOptions
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.react.utils.requireNotNullString
import kotlin.math.roundToLong

/**
 * Converts the React `animation` prop into the package's config. The only file of the package
 * that sees a React Native type; everything below it is framework-neutral.
 *
 * Scalar props are converted inline in the view managers; a discriminated object graph like
 * this one gets a mapper next to its model, as the header toolbar menu does. Native is the
 * single validator: every rejected value is an [IllegalArgumentException] the view manager
 * turns into a warning and the default animation.
 */
internal object StackAnimationMapper {
    private const val KEY_TYPE = "type"
    private const val KEY_NAME = "name"
    private const val PERCENT_SUFFIX = "%"

    internal fun parse(value: Dynamic): StackAnimationConfig =
        when (value.type) {
            ReadableType.String -> StackAnimationConfig.Preset(PresetName.fromString(checkNotNull(value.asString())))
            ReadableType.Map -> parseMap(checkNotNull(value.asMap()))
            else -> throw IllegalArgumentException("[RNScreens] animation must be a preset name or an object.")
        }

    private fun parseMap(map: ReadableMap): StackAnimationConfig {
        when (val type = map.requireNotNullString(KEY_TYPE)) {
            "preset" -> Unit
            "custom" -> throw IllegalArgumentException("[RNScreens] Custom animations are not supported yet.")
            else -> throw IllegalArgumentException("[RNScreens] Unknown animation type: $type.")
        }
        val name = PresetName.fromString(map.requireNotNullString(KEY_NAME))

        var durationMs: Long? = null
        var easing: Easing? = null
        var distance: Length? = null
        val keys = map.keySetIterator()
        while (keys.hasNextKey()) {
            val key = keys.nextKey()
            if (key == KEY_TYPE || key == KEY_NAME) continue
            val option = PresetOption.entries.firstOrNull { it.key == key }
            require(option != null && option in name.options) {
                "[RNScreens] Option '$key' is not supported by animation preset '${name.stringName}'."
            }
            if (map.isNull(key)) continue
            when (option) {
                PresetOption.DURATION -> durationMs = parseDuration(map.getDynamic(key))
                PresetOption.EASING -> easing = parseEasing(map.getDynamic(key))
                PresetOption.DISTANCE -> distance = parseDistance(map.getDynamic(key))
            }
        }
        return StackAnimationConfig.Preset(name, PresetOptions(durationMs, easing, distance))
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
}
