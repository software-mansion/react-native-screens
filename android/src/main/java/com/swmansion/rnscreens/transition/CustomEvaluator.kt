package com.swmansion.rnscreens.transition

import android.animation.FloatEvaluator

class CustomEvaluator(val startValueCallback: () -> Number?, val endValueCallback: () -> Number?) : FloatEvaluator() {
    override fun evaluate(fraction: Float, startValue: Number?, endValue: Number?): Float? {
        val realStartValue = startValueCallback()
        val realEndValue = endValueCallback()
        if (realStartValue == null || realEndValue == null) {
            return null
        }
        return super.evaluate(fraction, realStartValue, realEndValue)
    }
}