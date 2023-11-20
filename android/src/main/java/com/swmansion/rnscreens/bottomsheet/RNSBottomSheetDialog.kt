package com.swmansion.rnscreens.bottomsheet

import android.content.Context
import android.util.Log
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.ScreenModalFragment
import java.lang.ref.WeakReference

class RNSBottomSheetDialog(context: Context, fragment: ScreenModalFragment) : BottomSheetDialog(context) {
    private val fragmentRef: WeakReference<ScreenModalFragment> = WeakReference(fragment)

    override fun cancel() {
        Log.d(TAG, "cancel")
        fragmentRef.get()?.dismissFromContainer()

    }

    companion object {
        val TAG = RNSBottomSheetDialog::class.simpleName
    }
}