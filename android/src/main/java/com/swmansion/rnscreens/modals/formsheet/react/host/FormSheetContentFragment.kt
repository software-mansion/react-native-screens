package com.swmansion.rnscreens.modals.formsheet.react.host

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import java.lang.ref.WeakReference

internal class FormSheetContentFragment(
    private val contentView: FormSheetContentView,
) : Fragment() {
    internal var primaryNavigationFragmentToRestore: WeakReference<Fragment>? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = contentView
}
