package com.swmansion.rnscreens.modals.formsheet.native.coordinator

import androidx.activity.BackEventCompat
import androidx.activity.OnBackPressedCallback
import androidx.activity.OnBackPressedDispatcher
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.Lifecycle
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetDialog

/**
 * Routes back events from the dialog window to fragments nested in the sheet content.
 *
 * FragmentManagers handle back events through the activity's dispatcher, which doesn't receive them
 * while the dialog is focused. Whenever a nested FragmentManager would handle the event, the forwarding
 * callback hands it over there. Otherwise, it stays disabled and the event falls through to the sheet's own handling.
 */
internal class FormSheetNestedBackCoordinator(
    private val dialog: FormSheetDialog,
) {
    private var contentFragment: Fragment? = null
    private var fragmentHostDispatcher: OnBackPressedDispatcher? = null
    private val observedFragmentManagers = mutableSetOf<FragmentManager>()

    private val backStackChangedListener = FragmentManager.OnBackStackChangedListener { invalidate() }

    private val forwardingCallback =
        object : OnBackPressedCallback(false) {
            override fun handleOnBackStarted(backEvent: BackEventCompat) {
                if (nestedContentHandlesBack()) {
                    fragmentHostDispatcher?.dispatchOnBackStarted(backEvent)
                }
            }

            override fun handleOnBackProgressed(backEvent: BackEventCompat) {
                if (nestedContentHandlesBack()) {
                    fragmentHostDispatcher?.dispatchOnBackProgressed(backEvent)
                }
            }

            override fun handleOnBackPressed() {
                if (nestedContentHandlesBack()) {
                    fragmentHostDispatcher?.onBackPressed()
                } else {
                    dialog.cancel()
                }
                invalidate()
            }

            override fun handleOnBackCancelled() {
                if (nestedContentHandlesBack()) {
                    fragmentHostDispatcher?.dispatchOnBackCancelled()
                }
                invalidate()
            }
        }

    internal fun setup() {
        dialog.onBackPressedDispatcher.addCallback(forwardingCallback)
    }

    internal fun attachNestedContent(fragment: Fragment) {
        contentFragment = fragment
        fragmentHostDispatcher = fragment.requireActivity().onBackPressedDispatcher
        invalidate()
    }

    internal fun detachNestedContent() {
        contentFragment = null
        fragmentHostDispatcher = null
        invalidate()
    }

    internal fun invalidate() {
        observeBackStacks(eligibleFragments().map { it.childFragmentManager })
        forwardingCallback.isEnabled = nestedContentHandlesBack()
    }

    internal fun destroy() {
        detachNestedContent()
        forwardingCallback.remove()
    }

    private fun nestedContentHandlesBack(): Boolean =
        eligibleFragments().any {
            it.childFragmentManager.backStackEntryCount > 0 &&
                it.lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED)
        }

    private fun eligibleFragments(): List<Fragment> =
        contentFragment
            ?.takeIf { it.isAdded && it.isInPrimaryNavigationChain() }
            ?.let { primaryNavigationChain(it) }
            ?: emptyList()

    private fun observeBackStacks(fragmentManagers: List<FragmentManager>) {
        observedFragmentManagers
            .filter { it !in fragmentManagers }
            .forEach {
                it.removeOnBackStackChangedListener(backStackChangedListener)
                observedFragmentManagers.remove(it)
            }

        fragmentManagers
            .filter { it !in observedFragmentManagers }
            .forEach {
                it.addOnBackStackChangedListener(backStackChangedListener)
                observedFragmentManagers.add(it)
            }
    }

    private fun primaryNavigationChain(fragment: Fragment): List<Fragment> =
        generateSequence(fragment) { it.childFragmentManager.primaryNavigationFragment?.takeIf { next -> next.isAdded } }
            .toList()

    private fun Fragment.isInPrimaryNavigationChain(): Boolean =
        parentFragmentManager.primaryNavigationFragment === this &&
            (parentFragment?.isInPrimaryNavigationChain() ?: true)
}
