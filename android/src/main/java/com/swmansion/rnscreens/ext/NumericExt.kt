package com.swmansion.rnscreens.ext

import kotlin.math.abs

internal fun Float.equalWithRespectToEps(other: Float, eps: Float = 1e-4F) = abs(this - other) <= eps
