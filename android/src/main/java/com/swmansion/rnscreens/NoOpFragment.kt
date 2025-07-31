package com.swmansion.rnscreens.gamma.helpers

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

class NoOpFragment: Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Immediately remove the fragment when it's created, to prevent Android system from trying to
        // restore it later, which can cause crashes on configuration changes.
        // Fixes: https://github.com/software-mansion/react-native-screens/issues/17
        parentFragmentManager.beginTransaction()
            .remove(this)
            .commitAllowingStateLoss()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = null
}
