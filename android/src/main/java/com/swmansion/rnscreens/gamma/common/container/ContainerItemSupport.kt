package com.swmansion.rnscreens.gamma.common.container

import android.view.ViewGroup
import com.swmansion.rnscreens.ext.refersToCompat
import com.swmansion.rnscreens.gamma.helpers.ViewFinder
import java.lang.ref.WeakReference

/**
 * Shared state & logic backing a [ContainerItem]. Holds the (optional) nested
 * [Container] and the cached content scroll view, and resolves the content scroll
 * view on behalf of the owning item.
 *
 * A [ContainerItem] supports at most a single nested [Container]; see
 * [ContainerItem.registerNestedContainer].
 */
internal class ContainerItemSupport {
    private var nestedContainer: WeakReference<Container> = WeakReference(null)
    private var contentScrollView: WeakReference<ViewGroup> = WeakReference(null)

    fun registerScrollView(scrollView: ViewGroup) {
        contentScrollView = WeakReference(scrollView)
    }

    fun registerNestedContainer(container: Container) {
        nestedContainer = WeakReference(container)
    }

    fun unregisterNestedContainer(container: Container) {
        if (nestedContainer.refersToCompat(container)) {
            nestedContainer.clear()
        }
    }

    fun resolveNestedContainer(): Container? = nestedContainer.get()

    /**
     * Resolves the content scroll view for the owning item: the cached one if
     * present, otherwise the one provided by the nested container, otherwise a
     * heuristic search through [owner]'s first descendant chain.
     */
    fun findContentScrollView(owner: ViewGroup): ViewGroup? {
        // Cached one
        contentScrollView.get()?.let { return it }

        // Provided by nested container
        resolveNestedContainer()?.resolveCurrentContentScrollView()?.let { scrollView ->
            return scrollView
        }

        // Heuristic
        ViewFinder.findScrollViewInFirstDescendantChain(owner)?.let { return it }
        return null
    }
}
