package com.swmansion.rnscreens.core.modals.sheet.dialog

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.view.ContextThemeWrapper
import android.view.View
import com.swmansion.rnscreens.core.modals.sheet.interfaces.SheetContentSizeChangeDelegate
import com.swmansion.rnscreens.core.modals.sheet.interfaces.SheetDialogEventEmitter
import com.swmansion.rnscreens.core.modals.sheet.model.SheetConfig
import com.swmansion.rnscreens.core.modals.sheet.presentation.SheetDimmingManager
import com.swmansion.rnscreens.core.modals.sheet.presentation.SheetPresentation
import com.swmansion.rnscreens.core.modals.sheet.presentation.SheetPresentationManager
import kotlin.properties.Delegates

/**
 * @param activityProvider returns the activity whose decor view hosts the sheet's dimming. The default walks the
 * [ContextWrapper] chain of [context]; hosts whose context does not wrap an activity must provide their own.
 */
class SheetDialogManager(
    context: Context,
    private val contentView: View,
    activityProvider: () -> Activity? = { context.findActivity() },
) {
    private var sheetConfig = SheetConfig()

    private val themedContext =
        ContextThemeWrapper(
            context,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    // Eagerly create the container so it's always ready for the provided content view
    private val container = SheetContainer(themedContext, contentView)

    // The React content only reports height changes, so a new presentation is seeded with the
    // last known value.
    private var lastContentHeight = 0

    private val presentationCallbacks =
        object : SheetPresentation.Callbacks {
            override fun onDetentChanged(index: Int) {
                eventEmitter?.emitOnDetentChanged(index)
            }

            override fun onNativeDismissAllowed() {
                presentationManager.handleNativeDismiss()
            }

            override fun onNativeDismissPrevented() {
                eventEmitter?.emitOnNativeDismissPreventedEvent()
            }
        }

    private val dimmingManager = SheetDimmingManager(activityProvider)

    private val presentationManager =
        SheetPresentationManager(
            presentationFactory = ::createPresentation,
            dimmingManager = dimmingManager,
            onNativeDismiss = { eventEmitter?.emitOnNativeDismissEvent() },
            onDismiss = { eventEmitter?.emitOnDismissEvent() },
        )

    internal var eventEmitter: SheetDialogEventEmitter? by Delegates.observable(null) { _, _, newValue ->
        presentationManager.appearanceEventEmitter = newValue
    }

    internal val contentSizeChangeDelegate: SheetContentSizeChangeDelegate =
        object : SheetContentSizeChangeDelegate {
            override fun onContentHeightChanged(newHeight: Int) {
                lastContentHeight = newHeight
                presentationManager.currentPresentation?.onContentHeightChanged(newHeight)
            }
        }

    private fun createPresentation(): SheetPresentation =
        SheetPresentation(themedContext, container, presentationCallbacks).also {
            it.applyInitialConfig(sheetConfig, lastContentHeight)
        }

    internal fun applyConfig(newConfig: SheetConfig) {
        val oldConfig = sheetConfig
        sheetConfig = newConfig

        presentationManager.currentPresentation?.applyConfigUpdate(oldConfig, newConfig)

        if (oldConfig.isOpen != newConfig.isOpen) {
            presentationManager.requestProgrammaticStateUpdate(newConfig.isOpen)
        }
    }

    internal fun destroy() {
        presentationManager.destroy()
    }
}

private fun Context.findActivity(): Activity? {
    var current: Context? = this
    while (current is ContextWrapper) {
        if (current is Activity) {
            return current
        }
        current = current.baseContext
    }
    return null
}
