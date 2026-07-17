package com.swmansion.rnscreens.gamma.stack.header

import com.swmansion.rnscreens.gamma.stack.header.appbar.StackHeaderAppBarLayout
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderDelegate
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding

internal object StackHeaderFrameSynchronizer {
    internal fun sync(
        appBar: StackHeaderAppBarLayout,
        provider: StackHeaderConfigurationProviding,
        delegate: StackHeaderDelegate,
    ) {
        // When config is transparent, the StackScreen is static so we need to offset the header
        // config by the offset of the AppBarLayout (which is 0 or is negative). When config is
        // opaque, the Screen always moves with the config, that's why we need to offset the
        // header config by the negative value of AppBarLayout's height.
        val configOffset = if (provider.transparent) appBar.top else appBar.top - appBar.bottom

        delegate.onHeaderFrameChanged(
            appBar.width,
            appBar.height,
            configOffset,
        )

        updateSubviewOffsets(appBar, provider, delegate)
    }

    private fun updateSubviewOffsets(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
        delegate: StackHeaderDelegate,
    ) {
        config.leadingSubview?.let { updateSubviewOffset(it, appBar, delegate) }
        config.centerSubview?.let { updateSubviewOffset(it, appBar, delegate) }
        config.trailingSubview?.let { updateSubviewOffset(it, appBar, delegate) }
        config.backgroundSubview?.let { updateSubviewOffset(it, appBar, delegate) }
    }

    private fun updateSubviewOffset(
        subview: StackHeaderSubviewProviding,
        appBar: StackHeaderAppBarLayout,
        delegate: StackHeaderDelegate,
    ) {
        val view = subview.view
        if (view.width == 0 && view.height == 0) return

        val appBarPos = IntArray(2)
        val subviewPos = IntArray(2)
        appBar.getLocationInWindow(appBarPos)
        view.getLocationInWindow(subviewPos)

        delegate.onSubviewOriginChanged(
            subview.type,
            x = subviewPos[0] - appBarPos[0],
            y = subviewPos[1] - appBarPos[1],
        )
    }
}
