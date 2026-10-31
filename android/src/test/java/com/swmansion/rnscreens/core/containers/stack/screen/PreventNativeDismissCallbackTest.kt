package com.swmansion.rnscreens.core.containers.stack.screen

import androidx.activity.BackEventCompat
import androidx.activity.OnBackPressedCallback
import androidx.activity.OnBackPressedDispatcher
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(manifest = Config.NONE, sdk = [34])
class PreventNativeDismissCallbackTest {
    private class Owner : LifecycleOwner {
        val registry = LifecycleRegistry(this)
        override val lifecycle: Lifecycle get() = registry
    }

    private class Interceptor : BackPressInterceptor {
        var enabled = false
        var onDispatch: () -> Unit = {}
        val listeners = mutableSetOf<Runnable>()
        override val isEnabled: Boolean get() = enabled

        override fun dispatch() = onDispatch()

        override fun addListener(listener: Runnable) {
            listeners.add(listener)
        }

        override fun removeListener(listener: Runnable) {
            listeners.remove(listener)
        }

        fun update(value: Boolean) {
            enabled = value
            listeners.toList().forEach { it.run() }
        }
    }

    private class Harness {
        val owner = Owner()
        val interceptor = Interceptor()
        val item = mock(StackContainerItem::class.java)
        val dispatcher = OnBackPressedDispatcher()
        var nativePops = 0
        var jsBacks = 0
        val guard: PreventNativeDismissCallback

        init {
            // FragmentManager installs its callback before the screen's guard.
            dispatcher.addCallback(
                object : OnBackPressedCallback(true) {
                    override fun handleOnBackPressed() {
                        nativePops++
                    }
                },
            )
            guard = PreventNativeDismissCallback(owner, item, canBeEnabled = true, interceptor = interceptor)
            dispatcher.addCallback(guard)
            interceptor.onDispatch = { jsBacks++ }
            owner.registry.currentState = Lifecycle.State.STARTED
        }
    }

    @Test fun laterScreenGuardGivesJavaScriptOwnerPriorityOverNativePop() {
        val test = Harness()
        test.interceptor.update(true)
        test.dispatcher.onBackPressed()
        assertEquals(1, test.jsBacks)
        assertEquals(0, test.nativePops)
        verify(test.item, never()).onNativeDismissPrevented()
    }

    @Test fun androidXKeepsTheGestureStartOwnerAndUsesNewJavaScriptOwnerForTheNextBack() {
        val test = Harness()
        test.dispatcher.dispatchOnBackStarted(BackEventCompat(0f, 0f, 0f, BackEventCompat.EDGE_LEFT))
        test.interceptor.update(true)
        test.dispatcher.onBackPressed()
        // AndroidX captures the target at start; changing priority is not a
        // supported way to retarget an already-progressing native transition.
        assertEquals(0, test.jsBacks)
        assertEquals(1, test.nativePops)
        test.dispatcher.onBackPressed()
        assertEquals(1, test.jsBacks)
        assertEquals(1, test.nativePops)
    }

    @Test fun unhandledJavaScriptCanRedispatchOnceDuringNativeFallback() {
        val test = Harness()
        test.interceptor.update(true)
        test.interceptor.onDispatch = {
            test.jsBacks++
            test.interceptor.update(false)
            try {
                test.dispatcher.onBackPressed()
            } finally {
                test.interceptor.update(true)
            }
        }
        test.dispatcher.onBackPressed()
        assertEquals(1, test.jsBacks)
        assertEquals(1, test.nativePops)
        assertTrue(test.guard.isEnabled)
    }

    @Test fun nativePreventionStillOwnsBackWithoutAJavaScriptInterceptor() {
        val test = Harness()
        `when`(test.item.isPreventNativeDismissEnabled).thenReturn(true)
        test.guard.preventNativeDismissChanged(true)
        test.dispatcher.onBackPressed()
        verify(test.item).onNativeDismissPrevented()
        assertEquals(0, test.nativePops)
    }

    @Test fun coveredStoppedAndDestroyedScreensCannotReenableTheirCallback() {
        val test = Harness()
        test.interceptor.update(true)
        test.guard.canBeEnabled = false
        assertFalse(test.guard.isEnabled)
        test.guard.canBeEnabled = true
        test.owner.registry.currentState = Lifecycle.State.CREATED
        test.interceptor.update(true)
        assertFalse(test.guard.isEnabled)
        test.owner.registry.currentState = Lifecycle.State.DESTROYED
        assertTrue(test.interceptor.listeners.isEmpty())
        test.interceptor.update(true)
        assertFalse(test.guard.isEnabled)
    }

    @Test fun javascriptOwnerPrecedesTheRealFragmentManagerAndNativeFallbackPopsExactlyOnce() {
        val controller = Robolectric.buildActivity(FragmentActivity::class.java).setup()
        val activity = controller.get()
        val fragments = activity.supportFragmentManager
        fragments.beginTransaction().add(Fragment(), "root").commitNow()
        fragments
            .beginTransaction()
            .add(Fragment(), "pushed")
            .addToBackStack("pushed")
            .commit()
        fragments.executePendingTransactions()
        assertEquals(1, fragments.backStackEntryCount)
        // Exercise cancellation on the real FragmentManager callback before
        // registering the later screen guard. No back-stack mutation may remain.
        activity.onBackPressedDispatcher.dispatchOnBackStarted(
            BackEventCompat(0f, 0f, 0f, BackEventCompat.EDGE_LEFT),
        )
        activity.onBackPressedDispatcher.dispatchOnBackProgressed(
            BackEventCompat(40f, 0f, 0.4f, BackEventCompat.EDGE_LEFT),
        )
        activity.onBackPressedDispatcher.dispatchOnBackCancelled()
        fragments.executePendingTransactions()
        assertEquals(1, fragments.backStackEntryCount)
        val item = mock(StackContainerItem::class.java)
        val interceptor = Interceptor()
        val guard = PreventNativeDismissCallback(activity, item, canBeEnabled = true, interceptor = interceptor)
        activity.onBackPressedDispatcher.addCallback(guard)
        var calls = 0
        interceptor.onDispatch = { calls++ }
        interceptor.update(true)
        activity.onBackPressedDispatcher.onBackPressed()
        fragments.executePendingTransactions()
        assertEquals(1, calls)
        assertEquals(1, fragments.backStackEntryCount)
        interceptor.onDispatch = {
            calls++
            interceptor.update(false)
            try {
                activity.onBackPressedDispatcher.onBackPressed()
            } finally {
                interceptor.update(true)
            }
        }
        activity.onBackPressedDispatcher.onBackPressed()
        fragments.executePendingTransactions()
        assertEquals(2, calls)
        assertEquals(0, fragments.backStackEntryCount)
        guard.remove()
        controller.pause().stop().destroy()
        assertTrue(interceptor.listeners.isEmpty())
    }
}
