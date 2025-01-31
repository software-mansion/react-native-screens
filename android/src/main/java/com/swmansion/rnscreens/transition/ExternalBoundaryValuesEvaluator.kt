package com.swmansion.rnscreens.transition

import android.animation.FloatEvaluator

typealias BoundaryValueProviderFn = (Number?) -> Float?

/**
 * Float type evaluator that uses boundary values provided by callbacks passed as arguments and does
 * not use boundary values used during value animator construction. This allows to defer computation
 * of animator boundary values to the moment when animation starts.
 */
class ExternalBoundaryValuesEvaluator(val startValueProvider: BoundaryValueProviderFn, val endValueProvider: BoundaryValueProviderFn) : FloatEvaluator() {
    var startValueCache: Number? = null
    var endValueCache: Number? = null

    private fun getStartValue(startValue: Number?): Number? {
        if (startValueCache == null) {
            startValueCache = startValueProvider(startValue)
        }
        return startValueCache
    }

    private fun getEndValue(endValue: Number?): Number? {
        if (endValueCache == null) {
            endValueCache = endValueProvider(endValue)
        }
        return endValueCache
    }

    override fun evaluate(fraction: Float, startValue: Number?, endValue: Number?): Float? {
        val realStartValue = getStartValue(startValue)
        val realEndValue = getEndValue(endValue)
        if (realStartValue == null || realEndValue == null) {
            return null
        }
        return super.evaluate(fraction, realStartValue, realEndValue)
    }
}
