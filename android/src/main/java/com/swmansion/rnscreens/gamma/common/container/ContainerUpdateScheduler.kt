package com.swmansion.rnscreens.gamma.common.container

import com.facebook.react.bridge.UiThreadUtil

internal interface ContainerInterface<Signals> {
    fun update()
}

interface ContainerUpdateCoordinator<in InvalidationFlags> {
    fun update(invalidationFlags: InvalidationFlags)
}

internal class ContainerUpdateScheduler<ConcreteContainer : ContainerInterface<*>> {
    private var isUpdatePending: Boolean = false

    fun postContainerUpdateIfNeeded(container: ConcreteContainer) {
        if (isUpdatePending) {
            return
        }
        postContainerUpdate(container)
    }

    fun postContainerUpdate(container: ConcreteContainer) {
        isUpdatePending = true
        UiThreadUtil.runOnUiThread {
            runContainerUpdateIfNeeded(container)
        }
    }

    fun runContainerUpdateIfNeeded(container: ConcreteContainer) {
        if (isUpdatePending) {
            runContainerUpdate(container)
        }
    }

    fun runContainerUpdate(container: ConcreteContainer) {
        isUpdatePending = false
        container.update()
    }
}

internal class ContainerUpdateManager<ConcreteContainer : ContainerInterface<ContainerSignals>, ContainerSignals>(
    internal val scheduler: ContainerUpdateScheduler<ConcreteContainer>,
    internal val signals: ContainerSignals,
)
