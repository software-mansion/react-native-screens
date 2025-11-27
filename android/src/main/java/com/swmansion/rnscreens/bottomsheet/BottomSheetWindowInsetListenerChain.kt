package com.swmansion.rnscreens.bottomsheet

import android.view.View
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.WindowInsetsCompat

/**
 * Aggregates and sequentially invokes many instances of OnApplyWindowInsetsListener
 *
 * In Android, only a single ViewCompat.setOnApplyWindowInsetsListener can be set on a view,
 * which leads to listeners overwriting each other. This class solves the listener conflict
 * by allowing different components to a common chain. As we do not consume or modify insets, the
 * order is not important and the chain may work.
 *
 * In our case it's crucial, because we need to react on insets for both:
 * - avoiding bottom/top insets by BottomSheet
 * - keyboard handling
 */
class BottomSheetWindowInsetListenerChain : OnApplyWindowInsetsListener {
    private val listeners = mutableListOf<OnApplyWindowInsetsListener>()

    fun addListener(listener: OnApplyWindowInsetsListener) {
        listeners.add(listener)
    }

    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        for (listener in listeners) {
            listener.onApplyWindowInsets(v, insets)
        }

        return insets
    }
}
