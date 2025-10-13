package com.swmansion.rnscreens.gamma.helpers

import android.content.ContextWrapper
import android.view.ViewGroup
import android.view.ViewParent
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentManager
import com.facebook.react.ReactRootView
import com.swmansion.rnscreens.gamma.common.FragmentProviding

object FragmentManagerHelper {
    fun findFragmentManagerForView(view: ViewGroup): FragmentManager? {
        var parent: ViewParent = view

        // We traverse view hierarchy up until we find fragment providing parent or a root view
        while (!(parent is ReactRootView || parent is FragmentProviding) &&
            parent.parent != null
        ) {
            parent = parent.parent
        }

        // If parent adheres to FragmentProviding interface it means we are inside a nested fragment structure.
        // Otherwise we expect to connect directly with root view and get root fragment manager
        if (parent is FragmentProviding) {
            return checkNotNull(parent.getAssociatedFragment()) {
                "[RNScreens] Parent fragment providing view $parent returned nullish fragment"
            }.childFragmentManager
        } else {
            // we expect top level view to be of type ReactRootView, this isn't really necessary but in
            // order to find root view we test if parent is null. This could potentially happen also when
            // the view is detached from the hierarchy and that test would not correctly indicate the root
            // view. So in order to make sure we indeed reached the root we test if it is of a correct type.
            // This allows us to provide a more descriptive error message for the aforementioned case.
            check(
                parent is ReactRootView,
            ) { "[RNScreens] Expected parent to be a ReactRootView, instead found: ${parent::class.java.name}" }
            return resolveFragmentManagerForReactRootView(parent)
        }
    }

    private fun resolveFragmentManagerForReactRootView(rootView: ReactRootView): FragmentManager? {
        var context = rootView.context

        // ReactRootView is expected to be initialized with the main React Activity as a context but
        // in case of Expo the activity is wrapped in ContextWrapper and we need to unwrap it
        while (context !is FragmentActivity && context is ContextWrapper) {
            context = context.baseContext
        }

        check(context is FragmentActivity) {
            "[RNScreens] In order to use react-native-screens components your app's activity need to extend ReactActivity"
        }

        // In case React Native is loaded on a Fragment (not directly in activity) we need to find
        // fragment manager whose fragment's view is ReactRootView. As of now, we detect such case by
        // checking whether any fragments are attached to activity which hosts ReactRootView.
        // See: https://github.com/software-mansion/react-native-screens/issues/1506 on why the cases
        // must be treated separately.
        return if (context.supportFragmentManager.fragments.isEmpty()) {
            // We are in standard React Native application w/o custom native navigation based on fragments.
            context.supportFragmentManager
        } else {
            // We are in some custom setup & we want to use the closest fragment manager in hierarchy.
            // `findFragment` method throws IllegalStateException when it fails to resolve appropriate
            // fragment. It might happen when e.g. React Native is loaded directly in Activity
            // but some custom fragments are still used. Such use case seems highly unlikely
            // so, as for now we fallback to activity's FragmentManager in hope for the best.
            try {
                FragmentManager.findFragment<Fragment>(rootView).childFragmentManager
            } catch (ex: IllegalStateException) {
                context.supportFragmentManager
            }
        }
    }
}
