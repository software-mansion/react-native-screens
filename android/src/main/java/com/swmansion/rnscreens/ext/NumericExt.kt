package com.swmansion.rnscreens.ext

import kotlin.math.abs

/**
 * 1e-4 should be a reasonable default value for graphic-related use cases.
 * You should always make sure that it is feasible in your particular use case.
 */
internal fun Float.equalWithRespectToEps(
    other: Float,
    eps: Float = 1e-4F,
) = abs(this - other) <= eps
