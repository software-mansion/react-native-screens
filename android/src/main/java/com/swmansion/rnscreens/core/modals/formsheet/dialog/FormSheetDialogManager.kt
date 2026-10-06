package com.swmansion.rnscreens.core.modals.formsheet.dialog

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.view.ContextThemeWrapper
import android.view.View
import com.swmansion.rnscreens.core.modals.formsheet.interfaces.FormSheetContentSizeChangeDelegate
import com.swmansion.rnscreens.core.modals.formsheet.interfaces.FormSheetDialogEventEmitter
import com.swmansion.rnscreens.core.modals.formsheet.model.FormSheetConfig
import com.swmansion.rnscreens.core.modals.formsheet.presentation.FormSheetDimmingManager
import com.swmansion.rnscreens.core.modals.formsheet.presentation.FormSheetPresentation
import com.swmansion.rnscreens.core.modals.formsheet.presentation.FormSheetPresentationManager
import kotlin.properties.Delegates

/**
 * @param activityProvider returns the activity whose decor view hosts the sheet's dimming. The default walks the
 * [ContextWrapper] chain of [context]; hosts whose context does not wrap an activity must provide their own.
 */
class FormSheetDialogManager(
    context: Context,
    private val contentView: View,
    activityProvider: () -> Activity? = { context.findActivity() },
) {
    private var formSheetConfig = FormSheetConfig()

    private val themedContext =
        ContextThemeWrapper(
            context,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    // Eagerly create the container so it's always ready for the provided content view
    private val container = FormSheetContainer(themedContext, contentView)

    // The React content only reports height changes, so a new presentation is seeded with the
    // last known value.
    private var lastContentHeight = 0

    private val presentationCallbacks =
        object : FormSheetPresentation.Callbacks {
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

    private val dimmingManager = FormSheetDimmingManager(activityProvider)

    private val presentationManager =
        FormSheetPresentationManager(
            presentationFactory = ::createPresentation,
            dimmingManager = dimmingManager,
            onNativeDismiss = { eventEmitter?.emitOnNativeDismissEvent() },
            onDismiss = { eventEmitter?.emitOnDismissEvent() },
        )

    internal var eventEmitter: FormSheetDialogEventEmitter? by Delegates.observable(null) { _, _, newValue ->
        presentationManager.appearanceEventEmitter = newValue
    }

    internal val contentSizeChangeDelegate: FormSheetContentSizeChangeDelegate =
        object : FormSheetContentSizeChangeDelegate {
            override fun onContentHeightChanged(newHeight: Int) {
                lastContentHeight = newHeight
                presentationManager.currentPresentation?.onContentHeightChanged(newHeight)
            }
        }

    private fun createPresentation(): FormSheetPresentation =
        FormSheetPresentation(themedContext, container, presentationCallbacks).also {
            it.applyInitialConfig(formSheetConfig, lastContentHeight)
        }

    internal fun applyConfig(newConfig: FormSheetConfig) {
        val oldConfig = formSheetConfig
        formSheetConfig = newConfig

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
