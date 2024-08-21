package com.swmansion.rnscreens.bottomsheet

import android.content.Context
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.ScreenModalFragment
import java.lang.ref.WeakReference

class BottomSheetDialogScreen(
    context: Context,
    fragment: ScreenModalFragment,
) : BottomSheetDialog(context) {
    private val fragmentRef: WeakReference<ScreenModalFragment> = WeakReference(fragment)

    // There are various code paths leading to this method, however the one I'm concerned with
    // is dismissal via swipe-down. If the sheet is dismissed we don't want the native dismiss logic
    // to run, as this will lead to inconsistencies in ScreenStack state. Instead we intercept
    // dismiss intention and run our logic.
    override fun cancel() {
        fragmentRef.get()!!.dismissFromContainer()
        this.show()
    }

    companion object {
        val TAG = BottomSheetDialogScreen::class.simpleName
    }
}
