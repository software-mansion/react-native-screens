package com.swmansion.rnscreens.fragment.restoration

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

/**
* This class serves as a workaround to https://github.com/software-mansion/react-native-screens/issues/17.
*
* This fragment, when attached to the fragment manager & its state is progressed
* to `ON_CREATED`, attempts to detach itself from the parent fragment manager
* as soon as possible.
*
* Instances of this type should be created in place of regular screen fragments
* when Android restores fragments after activity / application restart.
* If done so, it's behaviour can prevent duplicated fragment instances,
* as React will render new ones on activity restart.
*/
class AutoRemovingFragment : Fragment() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // This is the first moment where we have access to non-null parent fragment manager,
        // so that we can remove the fragment from the hierarchy.
        parentFragmentManager
            .beginTransaction()
            .remove(this)
            .commitAllowingStateLoss()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View? = null
}
