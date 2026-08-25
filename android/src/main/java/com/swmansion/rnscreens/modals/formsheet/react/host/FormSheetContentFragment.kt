package com.swmansion.rnscreens.modals.formsheet.react.host

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

internal class FormSheetContentFragment(
    private val contentView: FormSheetContentView,
) : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = contentView
}
